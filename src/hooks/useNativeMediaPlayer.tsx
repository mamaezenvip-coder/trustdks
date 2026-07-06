import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { backgroundAudioService } from '@/services/BackgroundAudioService';

export interface PlayableTrack {
  id: string;
  title: string;
  subtitle?: string | null;
  audio_path: string;
  cover_path?: string | null;
}

const client = supabase as any;
const SIGNED_URL_TTL = 60 * 60 * 6; // 6h

const signedUrlCache = new Map<string, { url: string; expires: number }>();

async function getSignedUrl(path: string): Promise<string> {
  const cached = signedUrlCache.get(path);
  if (cached && cached.expires > Date.now()) return cached.url;
  const { data, error } = await client.storage.from('media').createSignedUrl(path, SIGNED_URL_TTL);
  if (error || !data?.signedUrl) throw error || new Error('signed url failed');
  signedUrlCache.set(path, { url: data.signedUrl, expires: Date.now() + (SIGNED_URL_TTL - 60) * 1000 });
  return data.signedUrl;
}

async function getPublicOrSignedCover(path?: string | null): Promise<string | undefined> {
  if (!path) return undefined;
  try {
    return await getSignedUrl(path);
  } catch {
    return undefined;
  }
}

export const useNativeMediaPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(70);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    let el = document.getElementById('mamae-zen-native-audio') as HTMLAudioElement | null;
    if (!el) {
      el = document.createElement('audio');
      el.id = 'mamae-zen-native-audio';
      el.preload = 'auto';
      el.crossOrigin = 'anonymous';
      el.loop = true;
      (el as any).playsInline = true;
      el.setAttribute('playsinline', 'true');
      el.style.display = 'none';
      document.body.appendChild(el);
    }
    audioRef.current = el;
    return el;
  }, []);

  useEffect(() => {
    const el = ensureAudio();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);
    el.addEventListener('waiting', onWaiting);
    el.addEventListener('canplay', onCanPlay);
    el.volume = volume / 100;
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('waiting', onWaiting);
      el.removeEventListener('canplay', onCanPlay);
    };
  }, [ensureAudio, volume]);

  const play = useCallback(
    async (track: PlayableTrack) => {
      const el = ensureAudio();
      setIsLoading(true);
      setCurrentTrackId(track.id);
      try {
        const [audioUrl, coverUrl] = await Promise.all([
          getSignedUrl(track.audio_path),
          getPublicOrSignedCover(track.cover_path),
        ]);
        if (el.src !== audioUrl) {
          el.src = audioUrl;
          el.load();
        }
        el.volume = volume / 100;
        await el.play();

        backgroundAudioService.setControlHandlers({
          play: () => el.play().catch(() => undefined),
          pause: () => el.pause(),
          stop: () => {
            el.pause();
            el.currentTime = 0;
            setCurrentTrackId(null);
          },
        });
        backgroundAudioService.startAudio(track.id, {
          title: track.title,
          artist: track.subtitle || 'Mamãe Zen',
          artwork: coverUrl,
        });
      } catch (e) {
        console.error('play failed', e);
      } finally {
        setIsLoading(false);
      }
    },
    [ensureAudio, volume],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    backgroundAudioService.pauseAudio();
  }, []);

  const resume = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      await el.play();
      backgroundAudioService.resumeAudio();
    } catch (e) {
      console.warn('resume failed', e);
    }
  }, []);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    backgroundAudioService.stopAudio();
    setCurrentTrackId(null);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
    backgroundAudioService.setVolume(v);
  }, []);

  return {
    currentTrackId,
    isPlaying,
    isLoading,
    volume,
    play,
    pause,
    resume,
    stop,
    setVolume,
  };
};
