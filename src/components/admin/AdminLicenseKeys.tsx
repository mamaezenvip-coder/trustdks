import {useEffect, useState} from'react';
import {supabase} from'@/integrations/supabase/client';
import {Card} from'@/components/ui/card';
import {Button} from'@/components/ui/button';
import {Badge} from'@/components/ui/badge';
import {ScrollArea} from'@/components/ui/scroll-area';
import {Input} from'@/components/ui/input';
import {Key, Copy, Plus, Search} from'lucide-react';
import {toast} from'sonner';

interface LicenseKey {
 id: string;
 key: string;
 is_used: boolean;
 created_at: string;
 duration_days?: number;
}

const generateKey = () => {
 const chars ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
 const segments = Array.from({length: 4}, () =>
 Array.from({length: 5}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
);
 return`MZ-${segments.join('-')}`;
};

const AdminLicenseKeys = () => {
 const [keys, setKeys] = useState<LicenseKey[]>([]);
 const [search, setSearch] = useState('');
 const [generating, setGenerating] = useState(false);
 const [batchCount, setBatchCount] = useState(1);
 const [durationDays, setDurationDays] = useState(360);

 const load = async () => {
 const {data} = await supabase
.from('license_keys')
.select('*')
.order('created_at', {ascending: false});
 if (data) setKeys(data);
};

 useEffect(() => {load();}, []);

 const generateKeys = async () => {
 setGenerating(true);
 const count = Math.min(Math.max(1, batchCount), 50);
 const newKeys = Array.from({length: count}, () => ({
 key: generateKey(),
 duration_days: durationDays,
}));

  const {error} = await supabase.from('license_keys').insert(newKeys);
 if (error) {
 toast.error('Erro ao gerar chaves');
} else {
 toast.success(`${count} chave(s) gerada(s)`);
 load();
}
 setGenerating(false);
};

 const copyKey = (key: string) => {
 navigator.clipboard.writeText(key);
 toast.success('Chave copiada!');
};

 const filtered = keys.filter(k =>
!search || k.key.toLowerCase().includes(search.toLowerCase())
);

 const unused = keys.filter(k =>!k.is_used).length;
 const used = keys.filter(k => k.is_used).length;

 return (
 <div className="space-y-3">
 {/* Stats */}
 <div className="grid grid-cols-3 gap-2">
 <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)] p-3 text-center">
 <p className="text-lg font-bold text-foreground">{keys.length}</p>
 <p className="text-[10px] text-muted-foreground">Total</p>
 </Card>
 <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)] p-3 text-center">
 <p className="text-lg font-bold text-primary">{unused}</p>
 <p className="text-[10px] text-muted-foreground">Disponíveis</p>
 </Card>
 <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)] p-3 text-center">
 <p className="text-lg font-bold text-primary">{used}</p>
 <p className="text-[10px] text-muted-foreground">Usadas</p>
 </Card>
 </div>

 {/* Generate */}
 <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)] p-3 space-y-3">
 <div className="grid grid-cols-2 gap-2">
 <Button
 type="button"
 variant={durationDays === 30?'default':'outline'}
 onClick={() => setDurationDays(30)}
 className="h-10 text-xs font-bold">
 30 dias
 </Button>
 <Button
 type="button"
 variant={durationDays === 360?'default':'outline'}
 onClick={() => setDurationDays(360)}
 className="h-10 text-xs font-bold">
 Anual
 </Button>
 </div>
 <div className="flex gap-2 items-center">
 <Input
 type="number"min={1}
 max={50}
 value={batchCount}
 onChange={e => setBatchCount(Number(e.target.value))}
 className="w-20 bg-background/60 border border-primary/25"/>
 <Button onClick={generateKeys} disabled={generating} className="flex-1">
 <Plus className="w-4 h-4 mr-1"/>
 {generating?'Gerando...':`Gerar ${batchCount} chave(s) ${durationDays === 30?'30 dias':'anual'}`}
 </Button>
 </div>
 </Card>

 {/* Search */}
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
 <Input
 placeholder="Buscar chave..."value={search}
 onChange={e => setSearch(e.target.value)}
 className="pl-9 bg-background/60 border border-primary/25"/>
 </div>

 {/* Keys list */}
 <Card className="bg-card/80 border border-primary/30 shadow-[0_0_18px_-8px_hsl(var(--primary)/0.55)]">
 <ScrollArea className="h-[45vh]">
 <div className="p-3 space-y-2">
 {filtered.map(k => (
 <div key={k.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-primary/20">
 <Key className={`w-4 h-4 shrink-0 ${k.is_used?'text-muted-foreground':'text-primary'}`} />
 <code className={`text-xs flex-1 font-mono truncate ${k.is_used?'text-muted-foreground line-through':'text-foreground'}`}>
 {k.key}
 </code>
 <Badge variant={k.is_used?'secondary':'default'} className="text-[10px] shrink-0">
 {k.is_used?'Usada':`${k.duration_days === 30?'30d':'Anual'}`}
 </Badge>
 <Button variant="ghost"size="icon"className="h-7 w-7 shrink-0"onClick={() => copyKey(k.key)}>
 <Copy className="w-3 h-3"/>
 </Button>
 </div>
))}
 {filtered.length === 0 && (
 <p className="text-center text-muted-foreground py-8">Nenhuma chave encontrada</p>
)}
 </div>
 </ScrollArea>
 </Card>
 </div>
);
};

export default AdminLicenseKeys;
