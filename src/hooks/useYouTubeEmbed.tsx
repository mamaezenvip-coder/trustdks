import { useState, useRef, useCallback, useEffect } from 'react';
import { backgroundAudioService } from '@/services/BackgroundAudioService';

interface YouTubeMetadata {
  title?: string;
  artist?: string;
  artwork?: string;
}

interface YouTubeState {
  isPlaying: boolean;
  currentVideoId: string | null;
  volume: number;
  isLoading: boolean;
}

const HOST_ID = 'mamae-zen-persistent-audio-host';
const MOUNT_ID = 'mamae-zen-youtube-player';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** Player único e persistente — nunca é recriado nem re-parenteado. */
let ytPlayer: any = null;
let ytApiPromise: Promise<any> | null = null;

const getHost = (): HTMLDivElement | null => {
  if (typeof document === 'undefined') return null;
  let host = document.getElementById(HOST_ID) as HTMLDivElement | null;
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText =
      'position:fixed;left:-320px;bottom:0;width:240px;height:135px;opacity:0.01;pointer-events:none;z-index:-1;overflow:hidden;';
    document.body.appendChild(host);

    const mount = document.createElement('div');
    mount.id = MOUNT_ID;
    mount.style.cssText = 'width:100%;height:100%;';
    host.appendChild(mount);
  }
  return host;
};

const loadYouTubeApi = (): Promise<any> => {
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };

    if (!document.querySelector('script[data-mz-yt-api]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.dataset.mzYtApi = 'true';
      document.head.appendChild(script);
    }
  });

  return ytApiPromise;
};

export const useYouTubeEmbed = () => {
  const persistedAudioState = backgroundAudioService.getState();
  const [state, setState] = useState<YouTubeState>({
    isPlaying: persistedAudioState.isPlaying,
    currentVideoId: persistedAudioState.currentVideoId,
    volume: persistedAudioState.volume,
    isLoading: false,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const hiddenContainerRef = useRef<HTMLDivElement | null>(null);
  const volumeRef = useRef(state.volume);
  const userPausedRef = useRef(false);
  volumeRef.current = state.volume;


  const isIOS =
    typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  /**
   * O iframe nunca muda de pai (isso derrubava o áudio). Em vez disso, o host
   * fixo é posicionado exatamente sobre o container visível.
   */
  const syncHostPosition = useCallback(() => {
    const host = getHost();
    if (!host) return;

    const target = containerRef.current;
    const rect = target?.getBoundingClientRect();
    const visible = !!rect && rect.width > 4 && rect.height > 4;

    if (visible) {
      host.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:1;pointer-events:auto;z-index:5;overflow:hidden;border-radius:12px;background:#000;`;
    } else {
      host.style.cssText =
        'position:fixed;left:-320px;bottom:0;width:240px;height:135px;opacity:0.01;pointer-events:none;z-index:-1;overflow:hidden;';
    }
  }, []);

  useEffect(() => {
    syncHostPosition();
    const onChange = () => {
      if (typeof document !== 'undefined' && document.hidden) return; // economiza CPU em background
      syncHostPosition();
    };
    window.addEventListener('scroll', onChange, true);
    window.addEventListener('resize', onChange);
    const timer = window.setInterval(onChange, 400);

    return () => {
      window.removeEventListener('scroll', onChange, true);
      window.removeEventListener('resize', onChange);
      window.clearInterval(timer);
    };
  }, [syncHostPosition, state.currentVideoId]);


  const attachControlHandlers = useCallback(() => {
    backgroundAudioService.setControlHandlers({
      play: () => {
        try {
          ytPlayer?.unMute?.();
          ytPlayer?.playVideo?.();
        } catch {
          /* player não pronto */
        }
      },
      pause: () => {
        try {
          ytPlayer?.pauseVideo?.();
        } catch {
          /* noop */
        }
        setState((prev) => ({ ...prev, isPlaying: false }));
      },
      stop: () => {
        try {
          ytPlayer?.stopVideo?.();
        } catch {
          /* noop */
        }
        setState((prev) => ({ ...prev, isPlaying: false, currentVideoId: null, isLoading: false }));
      },
    });
  }, []);

  const play = useCallback(
    async (videoId: string, _showVisible: boolean = true, metadata?: YouTubeMetadata) => {
      setState((prev) => ({ ...prev, isLoading: true, currentVideoId: videoId }));
      getHost();
      syncHostPosition();

      const YT = await loadYouTubeApi();
      if (!YT?.Player) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const finishStart = () => {
        setState((prev) => ({ ...prev, isLoading: false, isPlaying: true }));
        attachControlHandlers();
        backgroundAudioService.startAudio(videoId, metadata);
      };

      if (ytPlayer?.loadVideoById) {
        try {
          ytPlayer.loadVideoById({ videoId, startSeconds: 0 });
          ytPlayer.unMute?.();
          ytPlayer.setVolume?.(volumeRef.current);
          ytPlayer.playVideo?.();
          finishStart();
          return;
        } catch {
          ytPlayer = null;
        }
      }

      ytPlayer = new YT.Player(MOUNT_ID, {
        videoId,
        host: 'https://www.youtube.com',
        playerVars: {
          autoplay: 1,
          controls: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          loop: 1,
          playlist: videoId,
          enablejsapi: 1,
          origin: window.location.origin,
          fs: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onReady: (event: any) => {
            try {
              event.target.unMute();
              event.target.setVolume(volumeRef.current);
              event.target.playVideo();
            } catch {
              /* noop */
            }
            finishStart();
          },
          onStateChange: (event: any) => {
            const YTState = window.YT?.PlayerState;
            if (!YTState) return;

            if (event.data === YTState.PLAYING) {
              setState((prev) => ({ ...prev, isPlaying: true, isLoading: false }));
              backgroundAudioService.resumeAudio();
            } else if (event.data === YTState.PAUSED) {
              setState((prev) => ({ ...prev, isPlaying: false, isLoading: false }));
              backgroundAudioService.pauseAudio();
            } else if (event.data === YTState.BUFFERING) {
              setState((prev) => ({ ...prev, isLoading: true }));
            } else if (event.data === YTState.ENDED) {
              try {
                event.target.playVideo();
              } catch {
                /* noop */
              }
            }
          },
          onError: () => {
            setState((prev) => ({ ...prev, isLoading: false }));
          },
        },
      });
    },
    [attachControlHandlers, syncHostPosition],
  );

  const pause = useCallback(() => {
    try {
      ytPlayer?.pauseVideo?.();
    } catch {
      /* noop */
    }
    backgroundAudioService.pauseAudio();
    setState((prev) => ({ ...prev, isPlaying: false, isLoading: false }));
  }, []);

  const resume = useCallback(() => {
    if (!state.currentVideoId) return;
    try {
      ytPlayer?.unMute?.();
      ytPlayer?.setVolume?.(volumeRef.current);
      ytPlayer?.playVideo?.();
    } catch {
      /* noop */
    }
    backgroundAudioService.resumeAudio();
    setState((prev) => ({ ...prev, isPlaying: true, isLoading: false }));
  }, [state.currentVideoId]);

  const stop = useCallback(() => {
    try {
      ytPlayer?.stopVideo?.();
    } catch {
      /* noop */
    }
    backgroundAudioService.stopAudio();
    setState((prev) => ({
      isPlaying: false,
      currentVideoId: null,
      volume: prev.volume,
      isLoading: false,
    }));
    syncHostPosition();
  }, [syncHostPosition]);

  const resetPlayer = useCallback(() => {
    try {
      ytPlayer?.destroy?.();
    } catch {
      /* noop */
    }
    ytPlayer = null;
    const host = getHost();
    if (host && !document.getElementById(MOUNT_ID)) {
      const mount = document.createElement('div');
      mount.id = MOUNT_ID;
      mount.style.cssText = 'width:100%;height:100%;';
      host.appendChild(mount);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    volumeRef.current = volume;
    setState((prev) => ({ ...prev, volume }));
    try {
      ytPlayer?.setVolume?.(volume);
    } catch {
      /* noop */
    }
    backgroundAudioService.setVolume(volume);
  }, []);

  return {
    isPlaying: state.isPlaying,
    currentVideoId: state.currentVideoId,
    volume: state.volume,
    isLoading: state.isLoading,
    isIOS,
    containerRef,
    hiddenContainerRef,
    play,
    pause,
    resume,
    stop,
    resetPlayer,
    setVolume,
  };
};

export default useYouTubeEmbed;
