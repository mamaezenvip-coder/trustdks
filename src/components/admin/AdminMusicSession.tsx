import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cookie, Loader2, RefreshCw, Radio, RotateCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const client = supabase as any;
const SETTING_KEY = 'music_session_version';

const AdminMusicSession = () => {
  const [version, setVersion] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const { data } = await client
      .from('app_settings')
      .select('value, updated_at')
      .eq('key', SETTING_KEY)
      .maybeSingle();
    setVersion(Number(data?.value?.version ?? 1));
    setUpdatedAt(data?.updated_at ?? null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const refreshSession = async (mode: 'refresh' | 'reconnect' | 'reset' = 'refresh') => {
    setRefreshing(true);
    const next = (version ?? 1) + 1;
    const { error } = await client
      .from('app_settings')
      .upsert(
        {
          key: SETTING_KEY,
          value: { version: next, mode, requested_at: new Date().toISOString() },
          updated_by: (await client.auth.getUser()).data?.user?.id ?? null,
        },
        { onConflict: 'key' },
      );

    if (error) {
      console.error(error);
      toast.error('Erro ao atualizar cookies do player');
    } else {
      const labels = {
        refresh: 'Cache limpo e players atualizados',
        reconnect: 'Reconexão enviada para todos os players',
        reset: 'Recuperação completa enviada para todos os players',
      };
      toast.success(`${labels[mode]} (v${next})`);
      setVersion(next);
      setUpdatedAt(new Date().toISOString());
    }
    setRefreshing(false);
  };

  return (
    <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)] p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-foreground text-sm">Central de Recuperação do Player</p>
          <p className="text-xs text-muted-foreground">
            Comandos reais enviados em tempo real aos aparelhos conectados. Comece pela reconexão
            e use a recuperação completa somente se o player continuar travado.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        ) : (
          <Badge className="bg-primary/15 text-primary border border-primary/40 text-[10px]">
            Sessão v{version}
          </Badge>
        )}
        {updatedAt && (
          <span className="text-[10px] text-muted-foreground">
            Atualizado em {new Date(updatedAt).toLocaleString('pt-BR')}
          </span>
        )}
      </div>

      <div className="grid gap-2">
      <Button onClick={() => refreshSession('reconnect')} disabled={refreshing || loading} className="w-full font-bold">
        {refreshing ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Radio className="w-4 h-4 mr-2" />
        )}
        Reconectar Players
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => refreshSession('refresh')} disabled={refreshing || loading}>
          <RefreshCw className="w-4 h-4 mr-2" /> Limpar Cache
        </Button>
        <Button variant="outline" onClick={() => refreshSession('reset')} disabled={refreshing || loading}>
          <RotateCcw className="w-4 h-4 mr-2" /> Recuperar Tudo
        </Button>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        O áudio em execução é preservado sempre que o sistema operacional permitir.
      </div>
      </div>
    </Card>
  );
};

export default AdminMusicSession;
