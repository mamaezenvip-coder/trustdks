import {useEffect, useState} from'react';
import {supabase} from'@/integrations/supabase/client';
import {Card, CardContent, CardHeader, CardTitle} from'@/components/ui/card';
import {Users, MessageSquare, Key, Clock, TrendingUp, UserCheck} from'lucide-react';

interface Stats {
 totalUsers: number;
 activeToday: number;
 openTickets: number;
 totalTickets: number;
 totalKeys: number;
 usedKeys: number;
}

const AdminDashboard = () => {
 const [stats, setStats] = useState<Stats>({
 totalUsers: 0, activeToday: 0, openTickets: 0,
 totalTickets: 0, totalKeys: 0, usedKeys: 0,
});
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const load = async () => {
 const today = new Date();
 today.setHours(0, 0, 0, 0);

 const [profiles, tickets, keys] = await Promise.all([
 supabase.from('profiles').select('id, last_seen_at', {count:'exact'}),
 supabase.from('support_tickets').select('id, status', {count:'exact'}),
 supabase.from('license_keys').select('id, is_used', {count:'exact'}),
]);

 const activeToday = (profiles.data || []).filter(p =>
 p.last_seen_at && new Date(p.last_seen_at) >= today
).length;

 const openTickets = (tickets.data || []).filter(t => t.status ==='open').length;

 setStats({
 totalUsers: profiles.count || 0,
 activeToday,
 openTickets,
 totalTickets: tickets.count || 0,
 totalKeys: keys.count || 0,
 usedKeys: (keys.data || []).filter(k => k.is_used).length,
});
 setLoading(false);
};
 load();
}, []);

 const cards = [
 {label:'Total Usuários', value: stats.totalUsers, icon: Users, color:'text-accent-foreground'},
 {label:'Ativos Hoje', value: stats.activeToday, icon: UserCheck, color:'text-primary'},
 {label:'Tickets Abertos', value: stats.openTickets, icon: MessageSquare, color:'text-primary'},
 {label:'Total Tickets', value: stats.totalTickets, icon: Clock, color:'text-secondary'},
 {label:'Chaves Criadas', value: stats.totalKeys, icon: Key, color:'text-primary'},
 {label:'Chaves Usadas', value: stats.usedKeys, icon: TrendingUp, color:'text-primary'},
];

 if (loading) {
 return (
 <div className="grid grid-cols-2 gap-3">
 {Array.from({length: 6}).map((_, i) => (
 <Card key={i} className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)] animate-pulse">
 <CardContent className="p-4 h-20"/>
 </Card>
))}
 </div>
);
}

 return (
 <div className="grid grid-cols-2 gap-3">
 {cards.map(c => (
 <Card key={c.label} className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)]">
 <CardContent className="p-4 flex items-center gap-3">
 <div className={`p-2 rounded-lg bg-muted ${c.color}`}>
 <c.icon className="w-5 h-5"/>
 </div>
 <div>
 <p className="text-2xl font-bold text-foreground">{c.value}</p>
 <p className="text-xs text-muted-foreground">{c.label}</p>
 </div>
 </CardContent>
 </Card>
))}
 </div>
);
};

export default AdminDashboard;
