import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const client = supabase as any;
const SETTING_KEY = 'music_session_version';

/**
 * Limpa "cookies"/caches que costumam derrubar o player do YouTube
 * (Service Worker caches + chaves de storage do embed), sem tocar
 * na sessão de login do usuário.
 */
export const clearMusicSessionCache = async () => {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !k.includes('supabase') && !k.includes('auth')).map((k) => caches.delete(k)),
      );
    }
  } catch (e) {
    console.warn('cache clear failed', e);
  }

  try {
    ['yt-player', 'yt-remote', 'yt.innertube', 'ytidb', 'PIREF', 'yt-'].forEach(() => undefined);
    Object.keys(localStorage)
      .filter((k) => k.toLowerCase().startsWith('yt') || k.toLowerCase().includes('youtube'))
      .forEach((k) => localStorage.removeItem(k));
    Object.keys(sessionStorage)
      .filter((k) => k.toLowerCase().startsWith('yt') || k.toLowerCase().includes('youtube'))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch (e) {
    console.warn('storage clear failed', e);
  }
};

/**
 * Acompanha a versão da sessão de música controlada pelo admin.
 * Quando o admin aperta "Atualizar Cookies" no painel, a versão muda,
 * o cache é limpo e o callback recebe a ordem de recarregar o player.
 */
export const useMusicSession = (onRefresh?: () => void) => {
  const [version, setVersion] = useState<number | null>(null);
  const versionRef = useRef<number | null>(null);
  const callbackRef = useRef(onRefresh);
  callbackRef.current = onRefresh;

  const applyVersion = useCallback(async (next: number) => {
    const previous = versionRef.current;
    versionRef.current = next;
    setVersion(next);
    if (previous !== null && next !== previous) {
      await clearMusicSessionCache();
      callbackRef.current?.();
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await client
        .from('app_settings')
        .select('value')
        .eq('key', SETTING_KEY)
        .maybeSingle();
      if (!active) return;
      const v = Number(data?.value?.version ?? 1);
      applyVersion(Number.isFinite(v) ? v : 1);
    })();

    const channel = client
      .channel('music-session-version')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_settings', filter: `key=eq.${SETTING_KEY}` },
        (payload: any) => {
          const v = Number(payload?.new?.value?.version ?? 0);
          if (Number.isFinite(v) && v > 0) applyVersion(v);
        },
      )
      .subscribe();

    return () => {
      active = false;
      client.removeChannel(channel);
    };
  }, [applyVersion]);

  return { version };
};

export default useMusicSession;
