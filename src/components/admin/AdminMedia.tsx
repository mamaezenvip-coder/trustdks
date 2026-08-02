import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, Trash2, Music, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import AdminMusicSession from '@/components/admin/AdminMusicSession';


interface MediaTrack {
  id: string;
  title: string;
  subtitle: string | null;
  category: 'ambient' | 'music' | 'meditation';
  audio_path: string;
  cover_path: string | null;
  duration_label: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const CATEGORY_LABEL: Record<MediaTrack['category'], string> = {
  ambient: 'Som Ambiente',
  music: 'Música',
  meditation: 'Meditação',
};

const client = supabase as any;

const AdminMedia = () => {
  const [tracks, setTracks] = useState<MediaTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<MediaTrack['category']>('ambient');
  const [durationLabel, setDurationLabel] = useState('');
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const fetchTracks = async () => {
    setLoading(true);
    const { data, error } = await client
      .from('media_tracks')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Erro ao carregar mídias');
    } else {
      setTracks((data as MediaTrack[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const uploadFile = async (file: File, prefix: string) => {
    const ext = file.name.split('.').pop() || 'bin';
    const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
    const { error } = await client.storage.from('media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    return path;
  };

  const handleUpload = async () => {
    const audioFile = audioInputRef.current?.files?.[0];
    if (!audioFile) {
      toast.error('Selecione o arquivo de áudio');
      return;
    }
    if (!title.trim()) {
      toast.error('Informe o título');
      return;
    }

    setUploading(true);
    try {
      const audio_path = await uploadFile(audioFile, 'audio');
      let cover_path: string | null = null;
      const coverFile = coverInputRef.current?.files?.[0];
      if (coverFile) {
        cover_path = await uploadFile(coverFile, 'covers');
      }

      const { error } = await client.from('media_tracks').insert({
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        category,
        audio_path,
        cover_path,
        duration_label: durationLabel.trim() || null,
        sort_order: tracks.length,
      });
      if (error) throw error;

      toast.success('Mídia adicionada!');
      setTitle('');
      setSubtitle('');
      setDurationLabel('');
      if (audioInputRef.current) audioInputRef.current.value = '';
      if (coverInputRef.current) coverInputRef.current.value = '';
      fetchTracks();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (track: MediaTrack) => {
    const { error } = await client
      .from('media_tracks')
      .update({ is_active: !track.is_active })
      .eq('id', track.id);
    if (error) {
      toast.error('Falha ao atualizar');
      return;
    }
    setTracks((prev) =>
      prev.map((t) => (t.id === track.id ? { ...t, is_active: !track.is_active } : t)),
    );
  };

  const handleDelete = async (track: MediaTrack) => {
    if (!confirm(`Excluir "${track.title}"?`)) return;
    const paths = [track.audio_path, track.cover_path].filter(Boolean) as string[];
    if (paths.length) {
      await client.storage.from('media').remove(paths);
    }
    const { error } = await client.from('media_tracks').delete().eq('id', track.id);
    if (error) {
      toast.error('Falha ao excluir');
      return;
    }
    toast.success('Removido');
    setTracks((prev) => prev.filter((t) => t.id !== track.id));
  };

  return (
    <div className="space-y-4">
      <AdminMusicSession />

      <Card className="p-4 bg-card/80 border-primary/30 backdrop-blur-sm shadow-[0_0_22px_-8px_hsl(var(--primary)/0.55)] rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Adicionar Mídia</h2>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Título</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chuva Suave"
                className="bg-background/60 border-primary/30"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as MediaTrack['category'])}>
                <SelectTrigger className="bg-background/60 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambient">Som Ambiente</SelectItem>
                  <SelectItem value="music">Música</SelectItem>
                  <SelectItem value="meditation">Meditação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Subtítulo (opcional)</Label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Som relaxante"
                className="bg-background/60 border-primary/30"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Duração (opcional)</Label>
              <Input
                value={durationLabel}
                onChange={(e) => setDurationLabel(e.target.value)}
                placeholder="10h HD"
                className="bg-background/60 border-primary/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Music className="w-3 h-3" /> Áudio (MP3/M4A)
              </Label>
              <Input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                className="bg-background/60 border-primary/30 file:text-primary file:bg-primary/10 file:border-0 file:rounded file:px-2"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Capa (opcional)
              </Label>
              <Input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="bg-background/60 border-primary/30 file:text-primary file:bg-primary/10 file:border-0 file:rounded file:px-2"
              />
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_18px_-4px_hsl(var(--primary)/0.8)]"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" /> Enviar Mídia
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-4 bg-card/80 border-primary/30 backdrop-blur-sm rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Biblioteca ({tracks.length})</h2>
          <Button variant="ghost" size="sm" onClick={fetchTracks} className="text-primary hover:bg-primary/10">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : tracks.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Nenhuma mídia ainda. Faça upload acima.
          </p>
        ) : (
          <div className="space-y-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/40 border border-primary/20"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{track.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {CATEGORY_LABEL[track.category]}
                    {track.duration_label ? ` • ${track.duration_label}` : ''}
                    {track.subtitle ? ` • ${track.subtitle}` : ''}
                  </p>
                </div>
                <Switch checked={track.is_active} onCheckedChange={() => toggleActive(track)} />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(track)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminMedia;
