import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { BackgroundTask, type CallbackID } from '@capawesome/capacitor-background-task';
import { MediaSession } from '@capgo/capacitor-media-session';

/**
 * Background Audio Service — 2026 update
 * Estratégia em camadas para manter a música tocando com a tela bloqueada:
 * 1. Capacitor Media Session (nativo iOS/Android) — controles do lockscreen
 * 2. Web Audio API silent oscillator — impede que o Safari/Chrome pausem a aba
 * 3. navigator.mediaSession (Web) — controles de mídia no navegador
 * 4. Screen Wake Lock — evita que o dispositivo entre em deep sleep
 * 5. Watchdog: reenvia playVideo enquanto a aba está oculta
 */

interface AudioState {
  isPlaying: boolean;
  currentVideoId: string | null;
  volume: number;
  title?: string;
  artist?: string;
  artwork?: string;
}

interface AudioMetadata {
  title?: string;
  artist?: string;
  artwork?: string;
}

interface AudioControlHandlers {
  play?: () => void;
  pause?: () => void;
  stop?: () => void;
}

class BackgroundAudioService {
  private static instance: BackgroundAudioService;
  private audioState: AudioState = {
    isPlaying: false,
    currentVideoId: null,
    volume: 70,
  };
  private wakeLock: WakeLockSentinel | null = null;
  private keepAliveTimer: number | null = null;
  private nativeBackgroundTaskId: CallbackID | null = null;
  private controlHandlers: AudioControlHandlers = {};

  // Web Audio silent context (mais confiável que <audio> data-URI no iOS 17+)
  private audioCtx: AudioContext | null = null;
  private silentGain: GainNode | null = null;
  private silentOsc: OscillatorNode | null = null;

  private constructor() {
    this.setupVisibilityHandler();
    this.setupPageLifecycleHandlers();
    this.setupNativeAppStateHandler();
    this.setupWebMediaSession();
  }

  public static getInstance(): BackgroundAudioService {
    if (!BackgroundAudioService.instance) {
      BackgroundAudioService.instance = new BackgroundAudioService();
    }
    return BackgroundAudioService.instance;
  }

  // ============ SILENT WEB AUDIO (keep-tab-alive) ============
  private ensureSilentAudio(): void {
    if (typeof window === 'undefined') return;
    if (this.audioCtx) return;
    try {
      const Ctor = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      if (!Ctor) return;
      this.audioCtx = new Ctor();
      this.silentGain = this.audioCtx.createGain();
      this.silentGain.gain.value = 0.0001; // inaudível mas > 0 (iOS exige)
      this.silentOsc = this.audioCtx.createOscillator();
      this.silentOsc.frequency.value = 1;
      this.silentOsc.connect(this.silentGain);
      this.silentGain.connect(this.audioCtx.destination);
      this.silentOsc.start();
    } catch (e) {
      if (import.meta.env.DEV) console.warn('silent audio ctx failed', e);
    }
  }

  private async resumeSilentAudio(): Promise<void> {
    this.ensureSilentAudio();
    try {
      if (this.audioCtx && this.audioCtx.state !== 'running') {
        await this.audioCtx.resume();
      }
    } catch {
      /* gesture required */
    }
  }

  private async suspendSilentAudio(): Promise<void> {
    try {
      if (this.audioCtx && this.audioCtx.state === 'running') {
        await this.audioCtx.suspend();
      }
    } catch {
      /* noop */
    }
  }

  // ============ VISIBILITY ============
  private setupVisibilityHandler(): void {
    if (typeof document === 'undefined') return;
    document.addEventListener('visibilitychange', () => {
      if (this.audioState.isPlaying) {
        if (document.visibilityState === 'hidden') {
          this.keepAliveNow();
          this.startNativeBackgroundTask();
        } else {
          // volta ao foreground — mantém tudo ativo
          this.keepAliveNow();
          this.finishNativeBackgroundTask();
        }
      }
    });
  }

  private setupPageLifecycleHandlers(): void {
    if (typeof window === 'undefined') return;

    const keepAlive = () => {
      if (this.audioState.isPlaying) {
        this.keepAliveNow();
        this.startNativeBackgroundTask();
      }
    };

    window.addEventListener('pagehide', keepAlive);
    window.addEventListener('blur', keepAlive);
    window.addEventListener('freeze', keepAlive as EventListener);
    window.addEventListener('pageshow', () => {
      if (this.audioState.isPlaying) this.keepAliveNow();
      this.finishNativeBackgroundTask();
    });
    window.addEventListener('focus', () => {
      if (this.audioState.isPlaying) this.keepAliveNow();
      this.finishNativeBackgroundTask();
    });
  }

  private setupNativeAppStateHandler(): void {
    if (!Capacitor.isNativePlatform()) return;
    App.addListener('appStateChange', ({ isActive }) => {
      if (!this.audioState.isPlaying) return;

      if (isActive) {
        this.keepAliveNow();
        this.finishNativeBackgroundTask();
        return;
      }

      this.keepAliveNow();
      this.startNativeBackgroundTask();
    }).catch(() => {
      /* plugin ausente */
    });
  }

  // ============ WEB MEDIA SESSION ============
  private setupWebMediaSession(): void {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.setActionHandler('play', () => {
        this.controlHandlers.play?.();
        this.resumeAudio();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.controlHandlers.pause?.();
        this.pauseAudio();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        this.controlHandlers.stop?.();
        this.stopAudio();
      });
    } catch {
      /* handler não suportado */
    }
  }

  private updateWebMediaSessionMetadata(metadata?: AudioMetadata): void {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: metadata?.title || 'Mamãe Zen Music',
        artist: metadata?.artist || 'Mamãe Zen',
        album: 'Mamãe Zen',
        artwork: metadata?.artwork
          ? [
              { src: metadata.artwork, sizes: '96x96', type: 'image/png' },
              { src: metadata.artwork, sizes: '512x512', type: 'image/png' },
            ]
          : [],
      });
      navigator.mediaSession.playbackState = 'playing';
    } catch {
      /* metadata não suportada */
    }
  }

  // ============ WAKE LOCK ============
  private async requestWakeLock(): Promise<void> {
    if (this.wakeLock) return; // evita vazamento de sentinels repetidos
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
    if ('wakeLock' in navigator) {
      try {
        const sentinel = await (navigator as any).wakeLock.request('screen');
        this.wakeLock = sentinel;
        sentinel.addEventListener?.('release', () => {
          if (this.wakeLock === sentinel) this.wakeLock = null;
        });
      } catch {
        this.wakeLock = null;
      }
    }
  }

  private async releaseWakeLock(): Promise<void> {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
      } catch {
        /* noop */
      }
      this.wakeLock = null;
    }
  }

  private keepAliveNow(): void {
    this.requestWakeLock();
    this.resumeSilentAudio();
    this.setMediaPlaybackState('playing');
    // Só reenvia "play" quando o navegador realmente derrubou o áudio.
    // Chamar playVideo a cada ciclo fazia o player do YouTube reiniciar/gaguejar.
    const now = Date.now();
    if (now - this.lastPlayNudge > 12000) {
      this.lastPlayNudge = now;
      this.controlHandlers.play?.();
    }
  }


  // ============ CAPACITOR NATIVE MEDIA SESSION ============
  private async setMediaPlaybackState(playbackState: 'none' | 'paused' | 'playing'): Promise<void> {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = playbackState;
      } catch {
        /* noop */
      }
    }
    if (!Capacitor.isNativePlatform()) return;
    try {
      await MediaSession.setPlaybackState({ playbackState });
    } catch {
      /* plugin ausente */
    }
  }

  private async updateNativeMediaSession(metadata?: AudioMetadata): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await MediaSession.setMetadata({
        title: metadata?.title || 'Mamãe Zen Music',
        artist: metadata?.artist || 'Mamãe Zen',
        album: 'Mamãe Zen',
        artwork: metadata?.artwork
          ? [{ src: metadata.artwork, sizes: '512x512', type: 'image/png' }]
          : undefined,
      });
      await MediaSession.setActionHandler({ action: 'play' }, () => {
        this.controlHandlers.play?.();
        this.resumeAudio();
      });
      await MediaSession.setActionHandler({ action: 'pause' }, () => {
        this.controlHandlers.pause?.();
        this.pauseAudio();
      });
      await MediaSession.setActionHandler({ action: 'stop' }, () => {
        this.controlHandlers.stop?.();
        this.stopAudio();
      });
      await this.setMediaPlaybackState('playing');
    } catch {
      /* plugin ausente */
    }
  }

  // ============ KEEP-ALIVE WATCHDOG ============
  private startKeepAlive(): void {
    if (this.keepAliveTimer || typeof window === 'undefined') return;
    this.keepAliveTimer = window.setInterval(() => {
      if (this.audioState.isPlaying) this.keepAliveNow();
    }, 4000);
  }

  private stopKeepAlive(): void {
    if (this.keepAliveTimer) {
      window.clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  private async startNativeBackgroundTask(): Promise<void> {
    if (!Capacitor.isNativePlatform() || this.nativeBackgroundTaskId) return;

    try {
      let taskId: CallbackID = '';
      taskId = await BackgroundTask.beforeExit(() => {
        if (!this.audioState.isPlaying) {
          BackgroundTask.finish({ taskId });
          this.nativeBackgroundTaskId = null;
          return;
        }

        this.keepAliveNow();

        window.setTimeout(() => {
          try {
            BackgroundTask.finish({ taskId });
          } finally {
            this.nativeBackgroundTaskId = null;
          }
        }, 25000);
      });
      this.nativeBackgroundTaskId = taskId;
    } catch {
      this.nativeBackgroundTaskId = null;
    }
  }

  private finishNativeBackgroundTask(): void {
    if (!this.nativeBackgroundTaskId) return;

    try {
      BackgroundTask.finish({ taskId: this.nativeBackgroundTaskId });
    } catch {
      /* noop */
    } finally {
      this.nativeBackgroundTaskId = null;
    }
  }

  // ============ PUBLIC API ============
  public isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  public getPlatform(): string {
    return Capacitor.getPlatform();
  }

  public startAudio(videoId: string, metadata?: AudioMetadata): void {
    this.audioState = {
      ...this.audioState,
      isPlaying: true,
      currentVideoId: videoId,
      title: metadata?.title,
      artist: metadata?.artist,
      artwork: metadata?.artwork,
    };
    this.requestWakeLock();
    this.resumeSilentAudio();
    this.updateWebMediaSessionMetadata(metadata);
    this.updateNativeMediaSession(metadata);
    this.startKeepAlive();
  }

  public stopAudio(): void {
    this.audioState = {
      ...this.audioState,
      isPlaying: false,
      currentVideoId: null,
    };
    this.releaseWakeLock();
    this.stopKeepAlive();
    this.finishNativeBackgroundTask();
    this.suspendSilentAudio();
    this.setMediaPlaybackState('none');
  }

  public pauseAudio(): void {
    this.audioState = { ...this.audioState, isPlaying: false };
    this.releaseWakeLock();
    this.stopKeepAlive();
    this.finishNativeBackgroundTask();
    this.setMediaPlaybackState('paused');
  }

  public resumeAudio(): void {
    if (!this.audioState.currentVideoId) return;

    this.audioState = { ...this.audioState, isPlaying: true };
    this.keepAliveNow();
    this.startKeepAlive();
  }

  public setControlHandlers(handlers: AudioControlHandlers): void {
    this.controlHandlers = handlers;
  }

  public setVolume(volume: number): void {
    this.audioState.volume = Math.max(0, Math.min(100, volume));
  }

  public getState(): AudioState {
    return { ...this.audioState };
  }

  public isPlaying(): boolean {
    return this.audioState.isPlaying;
  }
}

export const backgroundAudioService = BackgroundAudioService.getInstance();
export default BackgroundAudioService;
