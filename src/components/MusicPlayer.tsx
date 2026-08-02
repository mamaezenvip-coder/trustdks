import { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/contexts/CountryContext';
import { useNativeMediaPlayer, type PlayableTrack } from '@/hooks/useNativeMediaPlayer';

interface DbTrack extends PlayableTrack {
  category: string;
  duration_label: string | null;
}

const client = supabase as any;

const CATEGORIES = ['all', 'music', 'ambient', 'meditation'] as const;
type Category = (typeof CATEGORIES)[number];

const MusicPlayer = () => {
  const { isUSA } = useCountry();
  const [tracks, setTracks] = useState<DbTrack[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');

  const {
    currentTrackId,
    isPlaying,
    isLoading,
    volume,
    play,
    pause,
    resume,
    stop,
    setVolume,
  } = useNativeMediaPlayer();

  const texts = {
    title: 'Mamãe Zen Music',
    subtitle: isUSA ? 'Native Player' : 'Player Nativo',
    search: isUSA ? 'Search in library...' : 'Buscar na biblioteca...',
    playing: isUSA ? 'Playing' : 'Tocando',
    stopped: isUSA ? 'Playback stopped' : 'Reprodução parada',
    paused: isUSA ? 'Paused' : 'Pausado',
    resumed: isUSA ? 'Playing again' : 'Tocando novamente',
    loading: isUSA ? 'Loading...' : 'Carregando...',
    noResults: isUSA ? 'No music found' : 'Nenhuma música encontrada',
    empty: isUSA
      ? 'No tracks published yet. The admin can upload MP3 files from the admin panel.'
      : 'Nenhuma faixa publicada ainda. O admin pode enviar MP3 pelo painel /admin.',
    lockscreen: isUSA
      ? 'Native player: keeps playing with the app closed or the screen locked.'
      : 'Player nativo: continua tocando com o app fechado ou a tela bloqueada.',
    labels: {
      all: isUSA ? 'All' : 'Todas',
      music: isUSA ? 'Music' : 'Músicas',
      ambient: isUSA ? 'Ambient' : 'Ambiente',
      meditation: isUSA ? 'Meditation' : 'Meditação',
    } as Record<Category, string>,
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await client
        .from('media_tracks')
        .select('id,title,subtitle,audio_path,cover_path,category,duration_label')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) {
        console.error('media_tracks load error', error);
      } else {
        setTracks((data as DbTrack[]) || []);
      }
      setLoadingList(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tracks.filter((t) => {
      const matchesCategory = category === 'all' || t.category === category;
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.subtitle || '').toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [tracks, category, searchQuery]);

  const currentTrack = tracks.find((t) => t.id === currentTrackId);

  const handleTrackSelect = (track: DbTrack) => {
    if (currentTrackId === track.id) {
      if (isPlaying) {
        pause();
        toast.success(`${texts.paused}: ${track.title}`);
      } else {
        resume();
        toast.success(`${texts.resumed}: ${track.title}`);
      }
      return;
    }
    play(track);
    toast.success(`${texts.playing}: ${track.title}`);
  };

  const handleStop = () => {
    stop();
    toast.success(texts.stopped);
  };

  return (
    <Card className="overflow-hidden border border-primary/30 bg-card shadow-[0_0_28px_-12px_hsl(var(--primary)/0.7)]">
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

        {/* Search Bar (local library filter) */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={texts.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-background/60 border-primary/30"
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

        {/* Category Toggle */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCategory(cat)}
              className={`text-xs ${
                category === cat
                  ? 'bg-primary text-primary-foreground shadow-[0_0_16px_-4px_hsl(var(--primary)/0.9)]'
                  : 'border border-primary/25 text-foreground'
              }`}
            >
              {texts.labels[cat]}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 pt-2">
        <ScrollArea className="h-[300px] pr-2">
          {loadingList ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : tracks.length === 0 ? (
            <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center rounded-xl border border-primary/20 bg-muted/30 px-6">
              <Music className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">{texts.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{texts.empty}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-full min-h-[260px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">{texts.noResults}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((track) => {
                const active = currentTrackId === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-left border ${
                      active
                        ? 'bg-primary/15 border-primary/50 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.8)]'
                        : 'bg-muted/40 border-primary/20 hover:bg-muted/70'
                    }`}
                  >
                    <div className="w-10 h-10 rounded bg-primary flex items-center justify-center flex-shrink-0">
                      {isLoading && active ? (
                        <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                      ) : active && isPlaying ? (
                        <Pause className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Play className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.subtitle || texts.labels[(track.category as Category) || 'music']}
                        {track.duration_label ? ` • ${track.duration_label}` : ''}
                      </p>
                    </div>
                    {active && isPlaying && (
                      <Badge className="bg-primary/20 text-primary text-xs border-0">{texts.playing}</Badge>
                    )}
                  </button>
                );
              })}
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
                  <p className="text-xs text-muted-foreground truncate">
                    {isLoading ? texts.loading : isPlaying ? texts.playing : texts.paused}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => (isPlaying ? pause() : resume())}
                  className="h-10 w-10 text-primary"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={handleStop} className="h-10 w-10 text-primary">
                  <Square className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Slider
                value={[volume]}
                onValueChange={(v) => setVolume(v[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 text-right">{volume}%</span>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-start gap-2">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">{texts.lockscreen}</p>
        </div>
      </div>
    </Card>
  );
};

export default MusicPlayer;
