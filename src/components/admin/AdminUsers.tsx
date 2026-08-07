import {useEffect, useState} from'react';
import {supabase} from'@/integrations/supabase/client';
import {Card} from'@/components/ui/card';
import {ScrollArea} from'@/components/ui/scroll-area';
import {Input} from'@/components/ui/input';
import {Search} from'lucide-react';

interface Profile {
 id: string;
 email: string | null;
 display_name: string | null;
 avatar_url: string | null;
 last_seen_at: string | null;
 created_at: string;
}

const formatDate = (d: string) =>
 new Date(d).toLocaleString('pt-BR', {day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit'});

const isOnline = (lastSeen: string | null) => {
 if (!lastSeen) return false;
 return Date.now() - new Date(lastSeen).getTime() < 5 * 60 * 1000;
};

const AdminUsers = () => {
 const [profiles, setProfiles] = useState<Profile[]>([]);
 const [search, setSearch] = useState('');

 useEffect(() => {
 const load = async () => {
 const {data} = await supabase
.from('profiles')
.select('*')
.order('last_seen_at', {ascending: false, nullsFirst: false});
 if (data) setProfiles(data);
};
 load();

 const channel = supabase
.channel('admin-profiles')
.on('postgres_changes', {event:'*', schema:'public', table:'profiles'}, () => load())
.subscribe();
 return () => {supabase.removeChannel(channel);};
}, []);

 const filtered = profiles.filter(p =>
!search || (p.display_name ||'').toLowerCase().includes(search.toLowerCase()) ||
 (p.email ||'').toLowerCase().includes(search.toLowerCase())
);

 return (
 <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)]">
 <div className="p-3 border-b border-primary/25">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
 <Input
 placeholder="Buscar usuários..."value={search}
 onChange={e => setSearch(e.target.value)}
 className="pl-9 bg-background/60 border border-primary/25"/>
 </div>
 </div>
 <ScrollArea className="h-[60vh]">
 <div className="p-3 space-y-2">
 {filtered.map(p => (
 <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-primary/20">
 <div className="relative">
 {p.avatar_url? (
 <img src={p.avatar_url} alt=""className="w-10 h-10 rounded-full object-cover"/>
): (
 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
 {(p.display_name || p.email ||'?')[0].toUpperCase()}
 </div>
)}
 <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${isOnline(p.last_seen_at)?'bg-primary':'bg-muted-foreground/40'}`} />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-foreground truncate">{p.display_name ||'Sem nome'}</p>
 <p className="text-xs text-muted-foreground truncate">{p.email}</p>
 </div>
 <div className="text-right shrink-0">
 <p className="text-[10px] text-muted-foreground">
 {isOnline(p.last_seen_at)?'Online':'Visto'}
 </p>
 <p className="text-xs text-foreground">
 {p.last_seen_at? formatDate(p.last_seen_at): formatDate(p.created_at)}
 </p>
 </div>
 </div>
))}
 {filtered.length === 0 && (
 <p className="text-center text-muted-foreground py-8">Nenhum usuário encontrado</p>
)}
 </div>
 </ScrollArea>
 </Card>
);
};

export default AdminUsers;
