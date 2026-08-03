import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, RefreshCw, Ban, PauseCircle, PlayCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const client = supabase as any;

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
}

interface Activation {
  user_id: string;
  expires_at: string;
  source: string;
  status: string;
  paused_days_left: number | null;
}

const daysLeft = (iso: string) =>
  Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));

const statusLabel = (a?: Activation) => {
  if (!a) return { text: 'Sem licença', cls: 'bg-muted text-muted-foreground border-border' };
  if (a.status === 'blocked') return { text: 'Bloqueado', cls: 'bg-destructive/15 text-destructive border-destructive/40' };
  if (a.status === 'paused') return { text: `Pausado (${a.paused_days_left ?? 0}d)`, cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40' };
  if (new Date(a.expires_at) <= new Date()) return { text: 'Expirado', cls: 'bg-muted text-muted-foreground border-border' };
  return { text: `Ativo (${daysLeft(a.expires_at)}d)`, cls: 'bg-primary/15 text-primary border-primary/40' };
};

const AdminClients = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activations, setActivations] = useState<Record<string, Activation>>({});
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [{ data: profs }, { data: acts }] = await Promise.all([
      client.from('profiles').select('id, email, display_name').order('created_at', { ascending: false }),
      client.from('key_activations').select('user_id, expires_at, source, status, paused_days_left').order('expires_at', { ascending: false }),
    ]);
    setProfiles(profs || []);
    const map: Record<string, Activation> = {};
    (acts || []).forEach((a: Activation) => {
      if (!map[a.user_id]) map[a.user_id] = a;
    });
    setActivations(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const renew = async (userId: string, days: number) => {
    setBusy(userId);
    const { error } = await client.rpc('admin_renew_client', { p_user_id: userId, p_days: days });
    if (error) toast.error('Erro ao renovar cliente');
    else {
      toast.success(`Cliente renovado por ${days} dias`);
      await load();
    }
    setBusy(null);
  };

  const setStatus = async (userId: string, status: 'active' | 'paused' | 'blocked') => {
    setBusy(userId);
    const { data, error } = await client.rpc('admin_set_client_status', { p_user_id: userId, p_status: status });
    if (error) toast.error('Erro ao atualizar cliente');
    else if (data && data.success === false) toast.error(data.message || 'Cliente sem licença');
    else {
      toast.success(
        status === 'blocked' ? 'Cliente bloqueado' : status === 'paused' ? 'Cliente pausado' : 'Cliente reativado',
      );
      await load();
    }
    setBusy(null);
  };

  const filtered = profiles.filter(
    (p) =>
      !search ||
      (p.display_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)]">
      <div className="p-3 border-b border-primary/25 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/60 border border-primary/25"
          />
        </div>
        <Button variant="outline" size="icon" onClick={load} className="border-primary/40">
          <RefreshCw className="w-4 h-4 text-primary" />
        </Button>
      </div>

      <ScrollArea className="h-[60vh]">
        <div className="p-3 space-y-3">
          {loading && <p className="text-center text-muted-foreground py-8">Carregando...</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum cliente encontrado</p>
          )}
          {filtered.map((p) => {
            const act = activations[p.id];
            const st = statusLabel(act);
            const isBusy = busy === p.id;
            return (
              <div key={p.id} className="p-3 rounded-xl bg-background/50 border border-primary/25 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {p.display_name || 'Sem nome'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                  </div>
                  <Badge className={`text-[10px] border ${st.cls}`}>{st.text}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[30, 90, 360].map((d) => (
                    <Button
                      key={d}
                      size="sm"
                      disabled={isBusy}
                      onClick={() => renew(p.id, d)}
                      className="text-[11px] font-bold"
                    >
                      {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : `Renovar ${d}d`}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => setStatus(p.id, 'paused')}
                    className="text-[11px] border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <PauseCircle className="w-3.5 h-3.5 mr-1" /> Pausar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => setStatus(p.id, 'blocked')}
                    className="text-[11px] border-destructive/40 text-destructive hover:bg-destructive/10"
                  >
                    <Ban className="w-3.5 h-3.5 mr-1" /> Bloquear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => setStatus(p.id, 'active')}
                    className="text-[11px] border-primary/40 text-primary hover:bg-primary/10"
                  >
                    <PlayCircle className="w-3.5 h-3.5 mr-1" /> Reativar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default AdminClients;
