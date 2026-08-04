import {Card, CardContent, CardDescription, CardHeader, CardTitle} from"@/components/ui/card";
import {Button} from"@/components/ui/button";
import {useState, useEffect} from"react";
import {Moon, Sun, Clock, TrendingUp} from"lucide-react";
import {toast} from"@/hooks/use-toast";
import {useCountry} from"@/contexts/CountryContext";

interface SleepEntry {
 id: string;
 startTime: Date;
 endTime?: Date;
 duration?: number;
 type:'night'|'nap';
}

const MAX_ENTRIES = 100;

export default function SleepTracker() {
 const {isUSA} = useCountry();
 const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
 const [currentSleep, setCurrentSleep] = useState<SleepEntry | null>(null);
 const [totalSleepToday, setTotalSleepToday] = useState(0);

 // Textos traduzidos
 const texts = {
 title: isUSA?'Sleep Tracker':'Tracker de Sono',
 description: isUSA?"Monitor baby's sleep":'Monitore o sono do bebê',
 totalToday: isUSA?'Total Today':'Total Hoje',
 sessions: isUSA?'Sessions':'Sessões',
 sleeping: isUSA?'Sleeping...':'Dormindo...',
 napping: isUSA?'Napping...':'Soneca...',
 start: isUSA?'Start:':'Início:',
 wakeUp: isUSA?'Awake! Register':'Acordou! Registrar',
 nightSleep: isUSA?'Night Sleep':'Sono Noturno',
 nap: isUSA?'Nap':'Soneca',
 today: isUSA?'Today':'Hoje',
 night: isUSA?'Night':'Noturno',
 goal: isUSA 
?'Goal: 0-3m: 14-17h | 3-6m: 12-15h | 6-12m: 12-14h':'Meta: 0-3m: 14-17h | 3-6m: 12-15h | 6-12m: 12-14h',
 goodNight: isUSA?'Good night!':'Boa noite!',
 napStarted: isUSA?'Nap started':'Soneca iniciada',
 recordingStart: isUSA?'Recording sleep start at':'Registrando início do sono às',
 sleepRecorded: isUSA?'Sleep recorded!':'Sono registrado!',
 duration: isUSA?'Duration:':'Duração:',
 now: isUSA?'Now':'Agora',
};

 useEffect(() => {
 try {
 const stored = localStorage.getItem('sleepEntries');
 if (stored) {
 const parsed = JSON.parse(stored);
 const entries = parsed.slice(0, MAX_ENTRIES).map((entry: any) => ({
...entry,
 startTime: new Date(entry.startTime),
 endTime: entry.endTime? new Date(entry.endTime): undefined
}));
 setSleepEntries(entries);
}
} catch (error) {
 console.error('Error loading sleep entries:', error);
 localStorage.removeItem('sleepEntries');
}
}, []);

 useEffect(() => {
 if (sleepEntries.length > 0) {
 try {
 const toStore = sleepEntries.slice(0, MAX_ENTRIES);
 localStorage.setItem('sleepEntries', JSON.stringify(toStore));
 calculateTotalSleep();
} catch (error) {
 console.error('Error saving sleep entries:', error);
}
}
}, [sleepEntries]);

 const calculateTotalSleep = () => {
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 
 const todayEntries = sleepEntries.filter(entry => {
 const entryDate = new Date(entry.startTime);
 entryDate.setHours(0, 0, 0, 0);
 return entryDate.getTime() === today.getTime() && entry.duration;
});

 const total = todayEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
 setTotalSleepToday(total);
};

 const startSleep = (type:'night'|'nap') => {
 const newEntry: SleepEntry = {
 id: Date.now().toString(),
 startTime: new Date(),
 type
};
 setCurrentSleep(newEntry);
 
 const locale = isUSA?'en-US':'pt-BR';
 toast({
 title: type ==='night'? texts.goodNight: texts.napStarted,
 description:`${texts.recordingStart}${new Date().toLocaleTimeString(locale, {hour:'2-digit', minute:'2-digit'})}`});
};

 const endSleep = () => {
 if (!currentSleep) return;

 const endTime = new Date();
 const duration = Math.round((endTime.getTime() - currentSleep.startTime.getTime()) / 1000 / 60);
 
 const completedEntry: SleepEntry = {
...currentSleep,
 endTime,
 duration
};

 setSleepEntries(prev => [completedEntry,...prev].slice(0, MAX_ENTRIES));
 setCurrentSleep(null);

 const hours = Math.floor(duration / 60);
 const minutes = duration % 60;

 toast({
 title: texts.sleepRecorded,
 description:`${texts.duration}${hours}h ${minutes}min`});
};

 const formatDuration = (minutes: number) => {
 const hours = Math.floor(minutes / 60);
 const mins = minutes % 60;
 return`${hours}h ${mins}min`;
};

 const formatTime = (date: Date) => {
 const locale = isUSA?'en-US':'pt-BR';
 return new Date(date).toLocaleTimeString(locale, {hour:'2-digit', minute:'2-digit'});
};

 const todayEntries = sleepEntries.filter(entry => {
 const today = new Date();
 const entryDate = new Date(entry.startTime);
 return entryDate.toDateString() === today.toDateString();
});

 return (
 <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-secondary/40 to-secondary/40">
 <CardHeader className="bg-gradient-to-r from-secondary/20 to-secondary/20 pb-3">
 <CardTitle className="text-lg flex items-center gap-2 text-foreground">
 <Moon className="w-5 h-5 text-secondary"/>
 {texts.title}
 </CardTitle>
 <CardDescription className="text-xs text-primary/70">
 {texts.description}
 </CardDescription>
 </CardHeader>
 <CardContent className="pt-4 space-y-4">
 {/* Stats */}
 <div className="grid grid-cols-2 gap-2">
 <div className="p-3 rounded-lg bg-[hsl(var(--card))] border border-secondary/30">
 <div className="flex items-center gap-1.5 text-xs text-primary/70 mb-1">
 <Clock className="w-3 h-3"/>
 {texts.totalToday}
 </div>
 <div className="text-lg font-bold text-foreground">
 {formatDuration(totalSleepToday)}
 </div>
 </div>
 <div className="p-3 rounded-lg bg-[hsl(var(--card))] border border-secondary/30">
 <div className="flex items-center gap-1.5 text-xs text-primary/70 mb-1">
 <TrendingUp className="w-3 h-3"/>
 {texts.sessions}
 </div>
 <div className="text-lg font-bold text-foreground">
 {todayEntries.length}
 </div>
 </div>
 </div>

 {/* Controls */}
 {currentSleep? (
 <div className="p-3 rounded-lg bg-[hsl(var(--card))] border-2 border-secondary/50 space-y-3">
 <div className="flex items-center justify-between">
 <div>
 <p className="font-semibold text-sm text-foreground">
 {currentSleep.type ==='night'? texts.sleeping: texts.napping}
 </p>
 <p className="text-xs text-primary/70">
 {texts.start}{formatTime(currentSleep.startTime)}
 </p>
 </div>
 <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"/>
 </div>
 <Button onClick={endSleep} className="w-full text-sm bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-foreground"size="sm">
 {texts.wakeUp}
 </Button>
 </div>
): (
 <div className="grid grid-cols-2 gap-2">
 <Button
 onClick={() => startSleep('night')}
 size="sm"className="h-auto py-4 flex-col gap-1.5 bg-gradient-to-r from-secondary to-secondary hover:from-secondary hover:to-secondary text-foreground">
 <Moon className="w-5 h-5"/>
 <div className="text-center">
 <div className="font-semibold text-xs">{texts.nightSleep}</div>
 </div>
 </Button>
 <Button
 onClick={() => startSleep('nap')}
 variant="outline"size="sm"className="h-auto py-4 flex-col gap-1.5 border-secondary/30 text-primary hover:bg-secondary/20 hover:text-foreground">
 <Sun className="w-5 h-5"/>
 <div className="text-center">
 <div className="font-semibold text-xs">{texts.nap}</div>
 </div>
 </Button>
 </div>
)}

 {/* History */}
 {todayEntries.length > 0 && (
 <div className="space-y-2">
 <h3 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
 {texts.today}
 </h3>
 <div className="space-y-1.5 max-h-48 overflow-y-auto">
 {todayEntries.map((entry) => (
 <div
 key={entry.id}
 className="p-2 rounded-lg bg-[hsl(var(--card))] border border-secondary/20 flex items-center justify-between text-xs">
 <div className="flex items-center gap-2">
 {entry.type ==='night'? (
 <Moon className="w-4 h-4 text-secondary"/>
): (
 <Sun className="w-4 h-4 text-primary"/>
)}
 <div>
 <p className="font-medium text-xs text-foreground">
 {entry.type ==='night'? texts.night: texts.nap}
 </p>
 <p className="text-[10px] text-primary/60">
 {formatTime(entry.startTime)} - {entry.endTime? formatTime(entry.endTime): texts.now}
 </p>
 </div>
 </div>
 {entry.duration && (
 <div className="text-xs font-semibold text-primary">
 {formatDuration(entry.duration)}
 </div>
)}
 </div>
))}
 </div>
 </div>
)}

 <div className="p-3 bg-[hsl(var(--card))] rounded-lg border border-primary/30">
 <p className="text-xs text-muted-foreground">
 <strong>{texts.goal}</strong>
 </p>
 </div>
 </CardContent>
 </Card>
);
}
