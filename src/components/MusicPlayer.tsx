import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Play,
  Pause,
  Search,
  Music,
  Volume2,
  X,
  Loader2,
  Square,
  Info,
  FileAudio,
  FileVideo,
  Library,
  Waves,
  CloudRain,
  Heart,
  Moon,
  Wind,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/contexts/CountryContext';
import { useYouTubeEmbed } from '@/hooks/useYouTubeEmbed';
import { useMusicSession } from '@/hooks/useMusicSession';

import type { LucideIcon } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail?: string;
}

interface PinnedSound {
  id: string;
  youtubeId: string;
  name: string;
  nameEN: string;
  description: string;
  descriptionEN: string;
  icon: LucideIcon;
  quality: string;
}

const pinnedTracks: PinnedSound[] = [
  {
    id: 'white-noise',
    youtubeId: 'nMfPqeZjc2c',
    name: 'Ruído Branco',
    nameEN: 'White Noise',
    description: 'Som contínuo que acalma o bebê',
    descriptionEN: 'Continuous sound that calms baby',
    icon: Waves,
    quality: '10h 4K',
  },
  {
    id: 'rain',
    youtubeId: 'mPZkdNFkNps',
    name: 'Chuva Suave',
    nameEN: 'Gentle Rain',
    description: 'Som relaxante de chuva caindo',
    descriptionEN: 'Relaxing rain falling sound',
    icon: CloudRain,
    quality: '10h 4K',
  },
  {
    id: 'heartbeat',
    youtubeId: 'P9nd2GbmLWU',
    name: 'Para você mamãe',
    nameEN: 'For you mom',
    description: 'Melodia especial para o coração',
    descriptionEN: 'Special melody for the heart',
    icon: Heart,
    quality: 'Premium HD',
  },
  {
    id: 'lullaby',
    youtubeId: 'sgfMb2WycDo',
    name: 'Canção de Ninar',
    nameEN: 'Lullaby',
    description: 'Melodia suave para dormir',
    descriptionEN: 'Soft melody for sleeping',
    icon: Moon,
    quality: 'HD',
  },
  {
    id: 'ocean',
    youtubeId: 'WHPEKLQID4U',
    name: 'Ondas do Mar',
    nameEN: 'Ocean Waves',
    description: 'Som tranquilo do oceano',
    descriptionEN: 'Peaceful ocean sound',
    icon: Waves,
    quality: '12h 4K',
  },
  {
    id: 'wind',
    youtubeId: 'wzjWIxXBs_s',
    name: 'Vento Suave',
    nameEN: 'Gentle Wind',
    description: 'Brisa relaxante',
    descriptionEN: 'Relaxing breeze',
    icon: Wind,
    quality: '10h 4K',
  },
];

const MusicPlayer = () => {
  const { isUSA } = useCountry();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState([70]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [view, setView] = useState<'library' | 'search'>('library');

  const {
    isPlaying,
    currentVideoId,
    isLoading,
    isIOS,
    containerRef,
    hiddenContainerRef,
    play,
    pause,
    resume,
    stop,
    setVolume: setPlayerVolume,
  } = useYouTubeEmbed();

  // Admin aperta "Atualizar Cookies" no painel -> limpa cache e religa o player
  useMusicSession(() => {
    if (!currentTrack) return;
    play(currentTrack.id, true, {
      title: currentTrack.title,
      artist: currentTrack.artist,
      artwork: currentTrack.thumbnail,
    });
    toast.success(isUSA ? 'Player session refreshed' : 'Sessão do player atualizada');
  });



  const texts = {
    title: 'Mamãe Zen Music',
    subtitle: isUSA ? 'Premium Player' : 'Player Premium',
    search: isUSA ? 'Search music or artist...' : 'Buscar música ou artista...',
    resultsFor: isUSA ? 'Results for' : 'Resultados para',
    playing: isUSA ? 'Playing' : 'Tocando',
    stopped: isUSA ? 'Playback stopped' : 'Reprodução parada',
    paused: isUSA ? 'Paused' : 'Pausado',
    resumed: isUSA ? 'Playing again' : 'Tocando novamente',
    premium: isUSA
      ? 'Search and play any YouTube music.'
      : 'Pesquise e toque qualquer música do YouTube.',
    searchError: isUSA ? 'Error searching music' : 'Erro ao buscar músicas',
    noResults: isUSA ? 'No music found' : 'Nenhuma música encontrada',
    typeToSearch: isUSA ? 'Type something to search' : 'Digite algo para pesquisar',
    found: isUSA ? 'Found' : 'Encontradas',
    musics: isUSA ? 'songs' : 'músicas',
    tapToPlay: isUSA ? 'Tap play on video to start' : 'Toque play no vídeo para iniciar',
    downloadAudio: isUSA ? 'Download MP3' : 'Baixar MP3',
    downloadVideo: isUSA ? 'Download Video' : 'Baixar Vídeo',
    downloading: isUSA ? 'Opening download...' : 'Abrindo download...',
    library: isUSA ? 'Library' : 'Biblioteca',
    results: isUSA ? 'Results' : 'Resultados',
    relaxingSounds: isUSA ? 'Relaxing sounds' : 'Sons relaxantes',
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error(texts.typeToSearch);
      return;
    }
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { query: searchQuery },
      });
      if (error) throw error;
      if (data?.results && data.results.length > 0) {
        setSearchResults(data.results);
        setView('search');
        toast.success(`${texts.found} ${data.results.length} ${texts.musics}`);
      } else {
        setSearchResults([]);
        toast.error(texts.noResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(texts.searchError);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    play(track.id, true, { title: track.title, artist: track.artist, artwork: track.thumbnail });
    toast.success(`${texts.playing}: ${track.title}`);
  };

  const handleVolumeChange = (nextVolume: number[]) => {
    setVolume(nextVolume);
    setPlayerVolume(nextVolume[0]);
  };

  const handleTrackSelect = (track: Track) => {
    if (currentVideoId === track.id) {
      if (isPlaying) {
        pause();
        toast.success(`${texts.paused}: ${track.title}`);
      } else {
        resume();
        toast.success(`${texts.resumed}: ${track.title}`);
      }
    } else {
      playTrack(track);
    }
  };

  const handlePinnedSelect = (sound: PinnedSound) => {
    handleTrackSelect({
      id: sound.youtubeId,
      title: isUSA ? sound.nameEN : sound.name,
      artist: isUSA ? sound.descriptionEN : sound.description,
    });
  };

  const handleStop = () => {
    stop();
    setCurrentTrack(null);
    toast.success(texts.stopped);
  };

  const handlePauseResume = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      pause();
      toast.success(`${texts.paused}: ${currentTrack.title}`);
    } else {
      resume();
      toast.success(`${texts.resumed}: ${currentTrack.title}`);
    }
  };

  const handleDownload = async (format: 'audio' | 'video') => {
    if (!currentTrack) return;
    const formatLabel = format === 'audio' ? 'MP3' : 'MP4';
    toast.info(`${texts.downloading} ${formatLabel}...`);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-download', {
        body: { videoId: currentTrack.id, format },
      });
      if (error || !data?.success) throw new Error('Download failed');
      if (data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
        toast.success(
          isUSA
            ? `Opening ${formatLabel} download for "${currentTrack.title}"`
            : `Abrindo download ${formatLabel} de "${currentTrack.title}"`
        );
      }
    } catch (err) {
      console.error('Download error:', err);
      const fallbackUrl =
        format === 'audio'
          ? `https://cnvmp3.com/download.php?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${currentTrack.id}`)}`
          : `https://ssyoutube.com/watch?v=${currentTrack.id}`;
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="overflow-hidden border border-border bg-card shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-[var(--shadow-glow-pink)]">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{texts.title}</h2>
            <p className="text-xs text-muted-foreground">{texts.subtitle}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={texts.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} disabled={isSearching} className="px-6">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mt-3">
          <Button
            variant={view === 'library' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setView('library')}
            className="text-xs"
          >
            <Library className="w-3 h-3 mr-1" />
            {texts.library}
          </Button>
          {searchResults.length > 0 && (
            <Button
              variant={view === 'search' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('search')}
              className="text-xs"
            >
              <Search className="w-3 h-3 mr-1" />
              {texts.results} ({searchResults.length})
            </Button>
          )}
        </div>
      </div>

      {/* YouTube Player */}
      <div className={currentVideoId ? 'px-4 mb-2' : 'h-0 overflow-hidden'}>
        <div
          ref={containerRef}
          className="rounded-xl overflow-hidden shadow-lg border border-border min-h-[200px] bg-background"
        />
        {currentVideoId && isIOS && (
          <p className="text-center text-xs text-primary mt-2 flex items-center justify-center gap-1">
            <Info className="w-3 h-3" />
            {texts.tapToPlay}
          </p>
        )}
      </div>

      <div ref={hiddenContainerRef} className="fixed bottom-0 left-0 w-px h-px opacity-[0.01] pointer-events-none -z-10" />

      {/* Content Area */}
      <div className="p-4 pt-2">
        <ScrollArea className="h-[280px] pr-2">
          {view === 'library' ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground/80 mb-2">{texts.relaxingSounds}</h3>
              <div className="grid grid-cols-2 gap-2">
                {pinnedTracks.map((sound) => {
                  const Icon = sound.icon;
                  const active = currentVideoId === sound.youtubeId;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => handlePinnedSelect(sound)}
                      disabled={isLoading}
                      className={`relative p-4 rounded-xl transition-all duration-300 text-left border ${
                        active
                          ? 'bg-primary/15 border-primary/50 shadow-[var(--shadow-glow-pink)]'
                          : 'bg-muted/40 border-border hover:bg-muted/70'
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        {isLoading && active ? (
                          <Loader2 className="w-7 h-7 text-primary animate-spin" />
                        ) : (
                          <Icon className={`w-7 h-7 ${active ? 'text-primary' : 'text-foreground/80'}`} />
                        )}
                        <div>
                          <p className="font-semibold text-foreground text-sm leading-tight">
                            {isUSA ? sound.nameEN : sound.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{sound.quality}</p>
                        </div>
                      </div>
                      {active && isPlaying && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80 mb-2">
                {texts.resultsFor} "{searchQuery}"
              </h3>
              {searchResults.map((track) => {
                const active = currentVideoId === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    disabled={isLoading}
                    className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-left border ${
                      active
                        ? 'bg-primary/15 border-primary/50'
                        : 'bg-muted/40 border-border hover:bg-muted/70'
                    }`}
                  >
                    {track.thumbnail ? (
                      <img src={track.thumbnail} alt={track.title} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-primary flex items-center justify-center flex-shrink-0">
                        {active && isPlaying ? (
                          <Pause className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <Play className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    {active && isPlaying && (
                      <Badge className="bg-primary/20 text-primary text-xs border-0">{texts.playing}</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center rounded-xl border border-border bg-muted/30 px-6">
              <Music className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">{texts.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{texts.premium}</p>
            </div>
          )}
        </ScrollArea>

        {/* Player Controls */}
        {currentTrack && (
          <div className="mt-4 p-4 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground text-sm truncate">{currentTrack.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={handlePauseResume} className="h-10 w-10">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex gap-2 mb-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload('audio')}
                className="flex-1 h-8 text-xs"
              >
                <FileAudio className="w-3.5 h-3.5 mr-1.5" />
                {texts.downloadAudio}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload('video')}
                className="flex-1 h-8 text-xs"
              >
                <FileVideo className="w-3.5 h-3.5 mr-1.5" />
                {texts.downloadVideo}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
              <span className="text-xs text-muted-foreground w-10 text-right flex-shrink-0">{volume[0]}%</span>
            </div>
          </div>
        )}

        {/* Premium Badge */}
        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-foreground/80">
            <strong className="text-primary">Premium:</strong> {texts.premium}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MusicPlayer;
