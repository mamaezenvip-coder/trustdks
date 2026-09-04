import {useState, useRef, useEffect} from'react';
import {useAuth} from'@/contexts/AuthContext';
import {supabase} from'@/integrations/supabase/client';
import {useCountry} from'@/contexts/CountryContext';
import {ScrollArea} from'@/components/ui/scroll-area';
import {Button} from'@/components/ui/button';
import {Input} from'@/components/ui/input';
import {
 MessageSquare, Send, X, ArrowLeft, ShieldCheck,
 Stethoscope, Brain, Heart, Baby, Apple
} from'lucide-react';
import {toast} from'sonner';
import ReactMarkdown from'react-markdown';
import specialistPediatra from'@/assets/specialist-pediatra.jpg';
import specialistPsicologa from'@/assets/specialist-psicologa.jpg';
import specialistEnfermeira from'@/assets/specialist-enfermeira.jpg';
import specialistDoutora from'@/assets/specialist-doutora.jpg';
import specialistNutricionista from'@/assets/specialist-nutricionista.jpg';

type Specialist = {
 id: string;
 name: string;
 title: string;
 icon: React.ReactNode;
 color: string;
 greeting: string;
 avatar: string;
};

const specialists: Specialist[] = [
 {
 id:'pediatra',
 name:'Dra. Ana',
 title:'Pediatra',
 icon: <Baby className="w-5 h-5"/>,
 color:'text-primary',
 greeting:'Olá mamãe! Sou a Dra. Ana, pediatra. Como posso ajudar com seu bebê hoje?',
 avatar: specialistPediatra,
},
 {
 id:'psicologa',
 name:'Dra. Sofia',
 title:'Psicóloga',
 icon: <Brain className="w-5 h-5"/>,
 color:'text-secondary',
 greeting:'Oi querida! Sou a Dra. Sofia, psicóloga perinatal. Estou aqui para te ouvir e ajudar.',
 avatar: specialistPsicologa,
},
 {
 id:'enfermeira',
 name:'Enf. Carla',
 title:'Enfermeira',
 icon: <Heart className="w-5 h-5"/>,
 color:'text-primary',
 greeting:'Olá mamãe! Sou a Enf. Carla, especialista em cuidados com recém-nascidos. No que posso te ajudar?',
 avatar: specialistEnfermeira,
},
 {
 id:'doutora',
 name:'Dra. Maria',
 title:'Ginecologista',
 icon: <Stethoscope className="w-5 h-5"/>,
 color:'text-accent-foreground',
 greeting:'Olá! Sou a Dra. Maria, ginecologista-obstetra. Como posso te ajudar com sua saúde?',
 avatar: specialistDoutora,
},
 {
 id:'nutricionista',
 name:'Dra. Beatriz',
 title:'Nutricionista',
 icon: <Apple className="w-5 h-5"/>,
 color:'text-primary',
 greeting:'Oi mamãe! Sou a Dra. Beatriz, nutricionista materno-infantil. Vamos falar sobre alimentação?',
 avatar: specialistNutricionista,
},
];
type Message = {role:'user'|'assistant'; content: string};

const CHAT_URL =`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const SupportChat = () => {
 const {user} = useAuth();
 const {isUSA} = useCountry();
 const [open, setOpen] = useState(false);
 const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
 const [conversations, setConversations] = useState<Record<string, Message[]>>({});
 const [input, setInput] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const scrollRef = useRef<HTMLDivElement>(null);
 const abortRef = useRef<AbortController | null>(null);

 const messages = selectedSpecialist? (conversations[selectedSpecialist.id] || []): [];

 useEffect(() => {
 if (scrollRef.current) {
 scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
}
}, [messages]);

 const streamChat = async (specialist: Specialist, allMessages: Message[]) => {
 setIsLoading(true);
 const controller = new AbortController();
 abortRef.current = controller;

 let assistantSoFar ='';

 const updateAssistant = (chunk: string) => {
 assistantSoFar += chunk;
 setConversations(prev => {
 const msgs = [...(prev[specialist.id] || [])];
 const last = msgs[msgs.length - 1];
 if (last?.role ==='assistant') {
 msgs[msgs.length - 1] = {...last, content: assistantSoFar};
} else {
 msgs.push({role:'assistant', content: assistantSoFar});
}
 return {...prev, [specialist.id]: msgs};
});
};

  try {
   const {data: sessionData} = await supabase.auth.getSession();
   const accessToken = sessionData.session?.access_token;
   if (!accessToken) {
    toast.error('Sessão expirada. Faça login novamente.');
    setIsLoading(false);
    return;
   }

   const resp = await fetch(CHAT_URL, {
 method:'POST',
 headers: {'Content-Type':'application/json',
 Authorization:`Bearer ${accessToken}`,
},
 body: JSON.stringify({messages: allMessages, specialist: specialist.id}),
 signal: controller.signal,
});

 if (!resp.ok) {
 const err = await resp.json().catch(() => ({error:'Erro desconhecido'}));
 toast.error(err.error ||'Erro ao conectar com a IA');
 setIsLoading(false);
 return;
}

 if (!resp.body) throw new Error('No response body');

 const reader = resp.body.getReader();
 const decoder = new TextDecoder();
 let textBuffer ='';

 while (true) {
 const {done, value} = await reader.read();
 if (done) break;
 textBuffer += decoder.decode(value, {stream: true});

 let newlineIndex: number;
 while ((newlineIndex = textBuffer.indexOf('\n'))!== -1) {
 let line = textBuffer.slice(0, newlineIndex);
 textBuffer = textBuffer.slice(newlineIndex + 1);

 if (line.endsWith('\r')) line = line.slice(0, -1);
 if (line.startsWith(':') || line.trim() ==='') continue;
 if (!line.startsWith('data:')) continue;

 const jsonStr = line.slice(6).trim();
 if (jsonStr ==='[DONE]') break;

 try {
 const parsed = JSON.parse(jsonStr);
 const content = parsed.choices?.[0]?.delta?.content;
 if (content) updateAssistant(content);
} catch {
 textBuffer = line +'\n'+ textBuffer;
 break;
}
}
}
} catch (e: any) {
 if (e.name!=='AbortError') {
 console.error('Stream error:', e);
 toast.error('Erro na conexão com a IA');
}
} finally {
 setIsLoading(false);
 abortRef.current = null;
}
};

 const sendMessage = async () => {
 if (!input.trim() ||!selectedSpecialist || isLoading) return;

 const userMsg: Message = {role:'user', content: input.trim()};
 const updatedMessages = [...messages, userMsg];

 setConversations(prev => ({
...prev,
 [selectedSpecialist.id]: updatedMessages,
}));
 setInput('');

 await streamChat(selectedSpecialist, updatedMessages);
};

 const selectSpecialist = (s: Specialist) => {
 setSelectedSpecialist(s);
 if (!conversations[s.id]) {
 setConversations(prev => ({
...prev,
 [s.id]: [{role:'assistant', content: s.greeting}],
}));
}
};

 if (!user) return null;

 return (
 <>
 {/* FAB */}
 <button
 onClick={() => setOpen(true)}
 className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95"aria-label="Chat IA">
 <MessageSquare className="w-6 h-6"/>
 </button>

 {/* Chat panel */}
 {open && (
 <div className="fixed inset-0 z-50 bg-background flex flex-col">
 {/* Header */}
 <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
 {selectedSpecialist? (
 <Button
 variant="ghost"size="icon"onClick={() => {
 if (abortRef.current) abortRef.current.abort();
 setSelectedSpecialist(null);
}}
 className="shrink-0">
 <ArrowLeft className="w-5 h-5"/>
 </Button>
): null}
 <div className="flex-1 min-w-0">
 {selectedSpecialist? (
 <div className="flex items-center gap-2">
 <img src={selectedSpecialist.avatar} alt={selectedSpecialist.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30"/>
 <div>
 <p className="text-sm font-bold text-foreground leading-none">{selectedSpecialist.name}</p>
 <p className="text-[10px] text-muted-foreground">{selectedSpecialist.title} • Online 24h</p>
 </div>
 <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-1"/>
 </div>
): (
 <div className="flex flex-col">
 <div className="flex items-center gap-2">
 <ShieldCheck className="w-5 h-5 text-primary"/>
 <p className="text-base font-bold text-foreground">
 {isUSA?'Private Care':'Atendimento Particular'}
 </p>
 </div>
 <p className="text-[10px] text-primary font-semibold tracking-wide">MamãeZen</p>
 </div>
)}
 </div>
 <Button
 variant="ghost"size="icon"onClick={() => {
 if (abortRef.current) abortRef.current.abort();
 setOpen(false);
}}
 className="shrink-0">
 <X className="w-5 h-5"/>
 </Button>
 </div>

 {selectedSpecialist? (
 /* Chat view */
 <>
 <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
 <div className="space-y-4 max-w-lg mx-auto pb-2">
 {messages.map((m, i) => (
 <div key={i} className={`flex ${m.role ==='user'?'justify-end':'justify-start'}`}>
 <div
 className={`max-w-[85%] rounded-2xl px-4 py-3 ${
 m.role ==='user'?'bg-primary text-primary-foreground rounded-br-md':'bg-card border border-border rounded-bl-md'}`}
 >
 {m.role ==='assistant'&& (
 <p className={`text-[10px] font-bold mb-1 ${selectedSpecialist.color}`}>
 {selectedSpecialist.name}
 </p>
)}
 <div className="text-sm prose prose-sm prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&_li]:text-sm">
 <ReactMarkdown>{m.content}</ReactMarkdown>
 </div>
 </div>
 </div>
))}
 {isLoading && messages[messages.length - 1]?.role ==='user'&& (
 <div className="flex justify-start">
 <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
 <p className={`text-[10px] font-bold mb-1 ${selectedSpecialist.color}`}>
 {selectedSpecialist.name}
 </p>
 <div className="flex gap-1">
 <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"style={{animationDelay:'0ms'}} />
 <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"style={{animationDelay:'150ms'}} />
 <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"style={{animationDelay:'300ms'}} />
 </div>
 </div>
 </div>
)}
 </div>
 </div>

 {/* Input */}
 <div className="p-4 border-t border-border bg-card/30">
 <div className="flex gap-2 max-w-lg mx-auto">
 <Input
 placeholder={isUSA?'Type your question...':'Digite sua pergunta...'}
 value={input}
 onChange={e => setInput(e.target.value)}
 onKeyDown={e => e.key ==='Enter'&&!e.shiftKey && sendMessage()}
 maxLength={2000}
 disabled={isLoading}
 className="bg-muted/50 border-border rounded-xl"/>
 <Button
 onClick={sendMessage}
 disabled={isLoading ||!input.trim()}
 size="icon"className="rounded-xl bg-primary shrink-0">
 <Send className="w-4 h-4"/>
 </Button>
 </div>
 <p className="text-[9px] text-muted-foreground/50 text-center mt-2">
 {isUSA
?'AI responses are educational. Always consult a doctor.':'Respostas da IA são educativas. Sempre consulte um médico.'}
 </p>
 </div>
 </>
): (
 /* Specialist selection */
 <div className="flex-1 overflow-y-auto p-4">
 <div className="max-w-lg mx-auto space-y-3">
 <div className="text-center py-4">
 <h3 className="text-lg font-bold text-foreground mb-1">
 {isUSA?'Private Care':'Atendimento Particular'}
 </h3>
 <p className="text-xs text-primary font-semibold">MamãeZen</p>
 <p className="text-xs text-muted-foreground mt-1">
 {isUSA?'Available 24 hours a day':'Disponíveis 24 horas por dia'}
 </p>
 </div>

 {specialists.map(s => (
 <button
 key={s.id}
 onClick={() => selectSpecialist(s)}
 className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-[0.98]">
 <img src={s.avatar} alt={s.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"loading="lazy"/>
 <div className="flex-1 text-left">
 <p className="text-sm font-bold text-foreground">{s.name}</p>
 <p className="text-xs text-muted-foreground">{s.title}</p>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-primary"/>
 <span className="text-[10px] text-primary font-medium">Online</span>
 </div>
 </button>
))}

 <p className="text-[10px] text-muted-foreground/50 text-center pt-4">
 {isUSA
?'AI assistants for educational purposes only. They do not replace medical consultations.':'Assistentes IA para fins educativos. Não substituem consultas médicas.'}
 </p>
 </div>
 </div>
)}
 </div>
)}
 </>
);
};

export default SupportChat;
