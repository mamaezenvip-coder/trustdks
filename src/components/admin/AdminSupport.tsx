import {useEffect, useState} from'react';
import {useAuth} from'@/contexts/AuthContext';
import {supabase} from'@/integrations/supabase/client';
import {Card} from'@/components/ui/card';
import {Button} from'@/components/ui/button';
import {Badge} from'@/components/ui/badge';
import {Input} from'@/components/ui/input';
import {ScrollArea} from'@/components/ui/scroll-area';
import {ArrowLeft, Send, Clock, CheckCircle} from'lucide-react';
import {toast} from'sonner';

interface Profile {
 id: string;
 email: string | null;
 display_name: string | null;
}

interface Ticket {
 id: string;
 user_id: string;
 subject: string;
 status: string;
 created_at: string;
 updated_at: string;
 profiles?: Profile | null;
}

interface Message {
 id: string;
 ticket_id: string;
 sender_id: string;
 content: string;
 created_at: string;
}

const formatDate = (d: string) =>
 new Date(d).toLocaleString('pt-BR', {day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit'});

const AdminSupport = () => {
 const {user} = useAuth();
 const [tickets, setTickets] = useState<Ticket[]>([]);
 const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
 const [messages, setMessages] = useState<Message[]>([]);
 const [newMessage, setNewMessage] = useState('');
 const [sending, setSending] = useState(false);
 const [filter, setFilter] = useState<'all'|'open'|'closed'>('all');

 useEffect(() => {
 const load = async () => {
 const {data} = await supabase
.from('support_tickets')
.select('*')
.order('updated_at', {ascending: false});
 if (data) {
 // Fetch profiles separately since FK points to auth.users
 const userIds = [...new Set(data.map(t => t.user_id))];
 const {data: profilesData} = await supabase
.from('profiles')
.select('*')
.in('id', userIds);
 const profilesMap = new Map((profilesData || []).map(p => [p.id, p]));
 const ticketsWithProfiles = data.map(t => ({
...t,
 profiles: profilesMap.get(t.user_id) || null,
}));
 setTickets(ticketsWithProfiles as Ticket[]);
}
};
 load();

 const channel = supabase
.channel('admin-tickets')
.on('postgres_changes', {event:'*', schema:'public', table:'support_tickets'}, () => load())
.subscribe();
 return () => {supabase.removeChannel(channel);};
}, []);

 useEffect(() => {
 if (!selectedTicket) return;
 const load = async () => {
 const {data} = await supabase
.from('support_messages')
.select('*')
.eq('ticket_id', selectedTicket.id)
.order('created_at', {ascending: true});
 if (data) setMessages(data);
};
 load();

 const channel = supabase
.channel(`ticket-${selectedTicket.id}`)
.on('postgres_changes', {
 event:'INSERT',
 schema:'public',
 table:'support_messages',
 filter:`ticket_id=eq.${selectedTicket.id}`,
}, (payload) => {
 setMessages(prev => [...prev, payload.new as Message]);
})
.subscribe();
 return () => {supabase.removeChannel(channel);};
}, [selectedTicket]);

 const sendMessage = async () => {
 if (!newMessage.trim() ||!selectedTicket ||!user) return;
 setSending(true);
 const {error} = await supabase.from('support_messages').insert({
 ticket_id: selectedTicket.id,
 sender_id: user.id,
 content: newMessage.trim().slice(0, 2000),
});
 if (error) toast.error('Erro ao enviar mensagem');
 else setNewMessage('');
 setSending(false);
};

 const updateTicketStatus = async (ticketId: string, status: string) => {
 const {error} = await supabase
.from('support_tickets')
.update({status, updated_at: new Date().toISOString()})
.eq('id', ticketId);
 if (error) toast.error('Erro ao atualizar status');
 else {
 toast.success(`Ticket ${status ==='closed'?'fechado':'reaberto'}`);
 if (selectedTicket?.id === ticketId) {
 setSelectedTicket(prev => prev? {...prev, status}: null);
}
}
};

 const filteredTickets = tickets.filter(t =>
 filter ==='all'|| t.status === filter
);

 if (selectedTicket) {
 return (
 <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)]">
 <div className="p-3 border-b border-primary/25 flex items-center gap-2">
 <Button variant="ghost"size="icon"onClick={() => setSelectedTicket(null)}>
 <ArrowLeft className="w-4 h-4"/>
 </Button>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium truncate">{selectedTicket.subject}</p>
 <p className="text-xs text-muted-foreground">
 {(selectedTicket.profiles as Profile | null)?.display_name || (selectedTicket.profiles as Profile | null)?.email ||'Usuário'}
 </p>
 </div>
 <Button
 variant="outline"size="sm"onClick={() => updateTicketStatus(selectedTicket.id, selectedTicket.status ==='open'?'closed':'open')}
 >
 {selectedTicket.status ==='open'?'Fechar':'Reabrir'}
 </Button>
 </div>

 <ScrollArea className="h-[50vh] p-4">
 <div className="space-y-3">
 {messages.map(m => {
 const isMe = m.sender_id === user?.id;
 return (
 <div key={m.id} className={`flex ${isMe?'justify-end':'justify-start'}`}>
 <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe?'bg-primary text-primary-foreground':'bg-muted text-foreground'}`}>
 <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
 <p className={`text-[10px] mt-1 ${isMe?'text-primary-foreground/70':'text-muted-foreground'}`}>{formatDate(m.created_at)}</p>
 </div>
 </div>
);
})}
 {messages.length === 0 && (
 <p className="text-center text-muted-foreground py-8">Nenhuma mensagem</p>
)}
 </div>
 </ScrollArea>

 <div className="p-3 border-t border-primary/25 flex gap-2">
 <Input
 placeholder="Responder..."value={newMessage}
 onChange={e => setNewMessage(e.target.value)}
 onKeyDown={e => e.key ==='Enter'&&!e.shiftKey && sendMessage()}
 maxLength={2000}
 className="bg-background/60 border border-primary/25"/>
 <Button onClick={sendMessage} disabled={sending ||!newMessage.trim()} size="icon">
 <Send className="w-4 h-4"/>
 </Button>
 </div>
 </Card>
);
}

 return (
 <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)]">
 <div className="p-3 border-b border-primary/25 flex gap-2">
 {(['all','open','closed'] as const).map(f => (
 <Button
 key={f}
 variant={filter === f?'default':'outline'}
 size="sm"onClick={() => setFilter(f)}
 className="text-xs">
 {f ==='all'?'Todos': f ==='open'?'Abertos':'Fechados'}
 {f ==='open'&& tickets.filter(t => t.status ==='open').length > 0 && (
 <Badge variant="destructive"className="ml-1 text-[10px] px-1.5 py-0">
 {tickets.filter(t => t.status ==='open').length}
 </Badge>
)}
 </Button>
))}
 </div>
 <ScrollArea className="h-[60vh]">
 <div className="p-3 space-y-2">
 {filteredTickets.map(t => (
 <button
 key={t.id}
 onClick={() => setSelectedTicket(t)}
 className="w-full text-left p-3 rounded-lg bg-muted/50 border border-primary/20 hover:bg-muted transition-colors">
 <div className="flex items-center gap-2">
 {t.status ==='open'? <Clock className="w-3.5 h-3.5 text-primary"/>: <CheckCircle className="w-3.5 h-3.5 text-primary"/>}
 <span className="text-sm font-medium text-foreground flex-1 truncate">{t.subject}</span>
 <Badge variant={t.status ==='open'?'default':'secondary'} className="text-[10px]">
 {t.status ==='open'?'Aberto':'Fechado'}
 </Badge>
 </div>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-xs text-muted-foreground">
 {(t.profiles as Profile | null)?.display_name || (t.profiles as Profile | null)?.email ||'Usuário'}
 </span>
 <span className="text-xs text-muted-foreground ml-auto">{formatDate(t.created_at)}</span>
 </div>
 </button>
))}
 {filteredTickets.length === 0 && (
 <p className="text-center text-muted-foreground py-8">Nenhum ticket encontrado</p>
)}
 </div>
 </ScrollArea>
 </Card>
);
};

export default AdminSupport;
