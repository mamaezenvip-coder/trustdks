import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { Play, Pause, Volume2, Music, Loader2, Info, Square } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCountry } from "@/contexts/CountryContext";
import { useNativeMediaPlayer, type PlayableTrack } from "@/hooks/useNativeMediaPlayer";
import { supabase } from "@/integrations/supabase/client";

interface DbTrack extends PlayableTrack {
  category: string;
  duration_label: string | null;
  is_active: boolean;
}

const client = supabase as any;

export default function BabySounds() {
  const { isUSA } = useCountry();
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

  const [tracks, setTracks] = useState<DbTrack[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await client
        .from('media_tracks')
        .select('id,title,subtitle,audio_path,cover_path,category,duration_label,is_active')
        .eq('category', 'ambient')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (!error) setTracks((data as DbTrack[]) || []);
      setLoadingList(false);
    })();
  }, []);

  const currentTrack = tracks.find((t) => t.id === currentTrackId);

  const texts = {
    title: isUSA ? 'Soothing Sounds Mamãe Zen' : 'Sons Calmantes Mamãe Zen',
    description: isUSA
      ? 'High-quality audio with lockscreen background playback'
      : 'Áudios em alta qualidade tocando com tela bloqueada',
    playing: isUSA ? 'Playing' : 'Tocando',
    paused: isUSA ? 'Paused' : 'Pausado',
    loading: isUSA ? 'Loading...' : 'Carregando...',
    empty: isUSA
      ? 'No sounds available yet. The admin can add them from the admin panel.'
      : 'Nenhum som cadastrado ainda. O admin pode adicionar pelo painel /admin.',
    lockscreen: isUSA
      ? 'Native player: keeps playing with the screen locked.'
      : 'Player nativo: continua tocando com a tela bloqueada.',
  };

  const handleSelect = (track: DbTrack) => {
    if (currentTrackId === track.id) {
      if (isPlaying) {
        pause();
        toast({ title: texts.paused });
      } else {
        resume();
        toast({ title: texts.playing });
      }
      return;
    }
    play(track);
    toast({ title: track.title, description: track.subtitle || undefined });
  };

  return (
    <Card className="border-primary/30 bg-card/70 backdrop-blur-sm rounded-2xl shadow-[0_0_22px_-8px_hsl(var(--primary)/0.55)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <Music className="w-5 h-5 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
          {texts.title}
        </CardTitle>
        <CardDescription className="text-xs text-primary/80">
          {texts.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {loadingList ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : tracks.length === 0 ? (
          <div className="p-4 rounded-lg bg-background/40 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground">{texts.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {tracks.map((track) => {
              const active = currentTrackId === track.id;
              return (
                <Button
                  key={track.id}
                  variant={active ? 'default' : 'outline'}
                  disabled={isLoading && active}
                  onClick={() => handleSelect(track)}
                  className={`h-auto flex-col gap-1 p-3 relative text-xs transition-all rounded-xl ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_18px_-4px_hsl(var(--primary)/0.9)]'
                      : 'border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/60'
                  }`}
                >
                  {isLoading && active ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Music className="w-5 h-5" />
                  )}
                  <div className="text-center">
                    <div className="font-semibold text-xs leading-tight line-clamp-2">
                      {track.title}
                    </div>
                    {track.duration_label && (
                      <div className="text-[10px] opacity-70 mt-0.5">{track.duration_label}</div>
                    )}
                  </div>
                  {active && isPlaying && (
                    <div className="absolute top-1 right-1">
                      <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        )}

        {currentTrack && (
          <div className="space-y-3 p-3 rounded-lg bg-background/50 border border-primary/30">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Music className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {isLoading ? texts.loading : isPlaying ? texts.playing : texts.paused}
                    {currentTrack.duration_label ? ` • ${currentTrack.duration_label}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => (isPlaying ? pause() : resume())}
                  className="h-8 w-8 border-primary/40 text-primary hover:bg-primary/10"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={stop}
                  className="h-8 w-8 border-primary/40 text-primary hover:bg-primary/10"
                >
                  <Square className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="w-3 h-3 text-primary/70" />
              <Slider
                value={[volume]}
                onValueChange={(v) => setVolume(v[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-primary/70 w-10 text-right">{volume}%</span>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-start gap-2">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">{texts.lockscreen}</p>
        </div>
      </CardContent>
    </Card>
  );
}
