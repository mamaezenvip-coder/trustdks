import {useState, useRef, useCallback, useEffect} from'react';
import {backgroundAudioService} from'@/services/BackgroundAudioService';

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

export const useYouTubeEmbed = () => {
 const persistedAudioState = backgroundAudioService.getState();
 const [state, setState] = useState<YouTubeState>({
 isPlaying: persistedAudioState.isPlaying,
 currentVideoId: persistedAudioState.currentVideoId,
 volume: persistedAudioState.volume,
 isLoading: false,
});

 const iframeRef = useRef<HTMLIFrameElement | null>(null);
 const containerRef = useRef<HTMLDivElement | null>(null);
 const hiddenContainerRef = useRef<HTMLDivElement | null>(null);

 // Detecta se é iOS
 const isIOS = typeof navigator!=='undefined'&& /iPad|iPhone|iPod/.test(navigator.userAgent);

 const getPersistentHost = useCallback(() => {
  if (typeof document === 'undefined') return null;

  let host = document.getElementById('mamae-zen-persistent-audio-host') as HTMLDivElement | null;
  if (!host) {
   host = document.createElement('div');
   host.id = 'mamae-zen-persistent-audio-host';
   host.setAttribute('aria-hidden', 'true');
   host.style.cssText = 'position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0.01;pointer-events:none;z-index:-1;overflow:hidden;';
   document.body.appendChild(host);
  }

  return host;
 }, []);

 const persistIframe = useCallback(() => {
  if (!iframeRef.current || !backgroundAudioService.isPlaying()) return;

  const host = getPersistentHost();
  if (!host) return;

  iframeRef.current.style.cssText = 'width:1px;height:1px;position:absolute;opacity:0.01;pointer-events:none;';
  host.appendChild(iframeRef.current);
 }, [getPersistentHost]);

 // Cleanup ao desmontar
 useEffect(() => {
  if (!iframeRef.current) {
   const persistedIframe = document.getElementById('mamae-zen-youtube-player') as HTMLIFrameElement | null;
   if (persistedIframe) {
    iframeRef.current = persistedIframe;
   }
  }

  if (iframeRef.current && containerRef.current && state.currentVideoId) {
   iframeRef.current.style.cssText ='width:100%;height:200px;border-radius:12px;background:#000;';
   containerRef.current.appendChild(iframeRef.current);
  }

 return () => {
  persistIframe();
};
}, [persistIframe, state.currentVideoId]);

 const sendCommand = useCallback((func: string, args: unknown[] = []) => {
 try {
  iframeRef.current?.contentWindow?.postMessage(
  JSON.stringify({event:'command', func, args}),
  '*'
 );
 } catch (e) {
  if (import.meta.env.DEV) console.warn('YT command failed', e);
 }
}, []);

 const removeIframe = useCallback(() => {
 if (iframeRef.current) {
  iframeRef.current.src ='';
  iframeRef.current.remove();
  iframeRef.current = null;
 }
 if (containerRef.current) containerRef.current.innerHTML ='';
 if (hiddenContainerRef.current) hiddenContainerRef.current.innerHTML ='';
  const host = document.getElementById('mamae-zen-persistent-audio-host');
  if (host) host.innerHTML ='';
}, []);

 // Manter áudio em segundo plano
 useEffect(() => {
 const handleVisibilityChange = () => {
 if (document.visibilityState ==='hidden'&& state.isPlaying) {
 // Mantém o serviço de áudio em segundo plano ativo
 backgroundAudioService.startAudio(state.currentVideoId ||'');
  persistIframe();
  sendCommand('playVideo');
}
};

 document.addEventListener('visibilitychange', handleVisibilityChange);
 return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, [state.isPlaying, state.currentVideoId, sendCommand, persistIframe]);

 const createIframe = useCallback((videoId: string, showVisible: boolean = true, metadata?: YouTubeMetadata) => {
 // Atualiza estado primeiro para garantir que o container seja renderizado
 setState(prev => ({
...prev, 
 isLoading: true,
 currentVideoId: videoId,
}));

 // Aguarda um frame para o container ser renderizado
 requestAnimationFrame(() => {
 const container = showVisible? containerRef.current: hiddenContainerRef.current;
 if (!container) {
 console.error('Container não encontrado');
 setState(prev => ({...prev, isLoading: false}));
 return;
}

 // Remove iframe anterior
 if (iframeRef.current) {
 iframeRef.current.src ='';
 iframeRef.current.remove();
 iframeRef.current = null;
}

 // Limpa ambos os containers
 if (containerRef.current) containerRef.current.innerHTML ='';
 if (hiddenContainerRef.current) hiddenContainerRef.current.innerHTML ='';

 // Cria novo iframe
 const iframe = document.createElement('iframe');
  iframe.id ='mamae-zen-youtube-player';
 iframe.allow ='autoplay; encrypted-media; picture-in-picture; fullscreen';
 iframe.setAttribute('allowfullscreen','true');
 iframe.setAttribute('playsinline','true');
 iframe.setAttribute('frameborder','0');
 
 if (showVisible) {
 iframe.style.cssText ='width:100%;height:200px;border-radius:12px;background:#000;';
} else {
 // Player oculto para background
 iframe.style.cssText ='width:1px;height:1px;position:absolute;opacity:0.01;pointer-events:none;';
}

  // Parâmetros do YouTube otimizados para reprodução contínua
 // mute=1 garante que o autoplay funcione em todos os browsers; desmutamos via postMessage após carregar
 const params = new URLSearchParams({
 autoplay:'1',
 mute:'1',
 controls: showVisible?'1':'0',
 playsinline:'1',
 rel:'0',
 modestbranding:'1',
 loop:'1',
 playlist: videoId,
 enablejsapi:'1',
 origin: window.location.origin,
 fs:'1',
 iv_load_policy:'3',
 cc_load_policy:'0',
});

 iframe.src =`https://www.youtube.com/embed/${videoId}?${params.toString()}`;
 
 iframe.onload = () => {
 setState(prev => ({
...prev, 
 isLoading: false,
 isPlaying: true,
}));

 // Desmuta após pequeno delay para garantir que o player esteja pronto
 setTimeout(() => {
 sendCommand('unMute');
 sendCommand('playVideo');
}, 800);
 
 // Atualiza o serviço de áudio em segundo plano
 backgroundAudioService.setControlHandlers({
   play: () => {
    sendCommand('unMute');
    sendCommand('playVideo');
   },
   pause: () => {
    sendCommand('pauseVideo');
    backgroundAudioService.pauseAudio();
    setState(prev => ({...prev, isPlaying: false}));
   },
  stop: () => {
  removeIframe();
  setState(prev => ({...prev, isPlaying: false, currentVideoId: null, isLoading: false}));
 },
 });
 backgroundAudioService.startAudio(videoId, metadata);
};

 container.appendChild(iframe);
 iframeRef.current = iframe;
});
}, [removeIframe, sendCommand]);

 const play = useCallback((videoId: string, showVisible: boolean = true, metadata?: YouTubeMetadata) => {
 createIframe(videoId, showVisible, metadata);
}, [createIframe]);

 const stop = useCallback(() => {
 removeIframe();
 
 // Para o serviço de áudio em segundo plano
 backgroundAudioService.stopAudio();
 
 setState({
 isPlaying: false,
 currentVideoId: null,
 volume: state.volume,
 isLoading: false,
});
}, [removeIframe, state.volume]);

 const pause = useCallback(() => {
  sendCommand('pauseVideo');
  backgroundAudioService.pauseAudio();
  setState(prev => ({...prev, isPlaying: false, isLoading: false}));
 }, [sendCommand]);

 const resume = useCallback(() => {
  if (!state.currentVideoId) return;

  sendCommand('unMute');
  sendCommand('playVideo');
  backgroundAudioService.resumeAudio();
  setState(prev => ({...prev, isPlaying: true, isLoading: false}));
 }, [sendCommand, state.currentVideoId]);

 const setVolume = useCallback((volume: number) => {
 setState(prev => ({...prev, volume}));
 sendCommand('setVolume', [volume]);
 backgroundAudioService.setVolume(volume);
}, [sendCommand]);

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
 setVolume,
};
};

export default useYouTubeEmbed;
