import {useState} from'react';
import {useAuth} from'@/contexts/AuthContext';
import {useCountry} from'@/contexts/CountryContext';
import {Button} from'@/components/ui/button';
import {Input} from'@/components/ui/input';
import {Card} from'@/components/ui/card';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from'@/components/ui/dialog';
import {Key, Unlock, ShieldCheck} from'lucide-react';
import {toast} from'sonner';

interface LicenseActivationProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
}

const LicenseActivation = ({open, onOpenChange}: LicenseActivationProps) => {
 const {activateKey, license} = useAuth();
 const {isUSA} = useCountry();
 const [keyInput, setKeyInput] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 const handleActivate = async () => {
 if (!keyInput.trim()) return;
 setIsLoading(true);
 const result = await activateKey(keyInput.trim().toUpperCase());
 setIsLoading(false);

 if (result.success) {
 toast.success(isUSA?'License activated! Premium features unlocked for 360 days!':'Licença ativada! Recursos premium liberados por 360 dias!');
 setKeyInput('');
 onOpenChange(false);
} else {
 toast.error(isUSA?'Invalid or already used key':'Chave inválida ou já utilizada');
}
};

 if (license.isActive) {
 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="sm:max-w-md bg-card border-border">
 <DialogHeader>
 <DialogTitle className="flex items-center gap-2 text-foreground">
 <ShieldCheck className="w-5 h-5 text-green-400"/>
 {isUSA?'Premium Active':'Premium Ativo'}
 </DialogTitle>
 </DialogHeader>
 <div className="text-center space-y-3 py-4">
 <p className="text-sm text-muted-foreground">
 {isUSA 
?`Your premium license is active until ${new Date(license.expiresAt!).toLocaleDateString()}`:`Sua licença premium está ativa até ${new Date(license.expiresAt!).toLocaleDateString('pt-BR')}`}
 </p>
 <span className="inline-block px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-semibold text-sm border border-green-500/30">
 PREMIUM
 </span>
 </div>
 </DialogContent>
 </Dialog>
);
}

 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="sm:max-w-md bg-card border-border">
 <DialogHeader>
 <DialogTitle className="flex items-center gap-2 text-foreground">
 <Key className="w-5 h-5 text-primary"/>
 {isUSA?'Activate Premium':'Ativar Premium'}
 </DialogTitle>
 </DialogHeader>
 <div className="space-y-4 py-2">
 <p className="text-sm text-muted-foreground">
 {isUSA
?'Enter your license key to unlock all premium features for 360 days.':'Digite sua chave de licença para liberar todas as funções premium por 360 dias.'}
 </p>
 <Input
 placeholder="MZ-XXXX-XXXX-XXXX-XXXX"value={keyInput}
 onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
 onKeyDown={(e) => e.key ==='Enter'&& handleActivate()}
 className="text-center font-mono text-base tracking-wider bg-muted border-border text-foreground"maxLength={22}
 />
 <Button
 onClick={handleActivate}
 disabled={!keyInput.trim() || isLoading}
 className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold"size="lg">
 <Unlock className="w-4 h-4 mr-2"/>
 {isLoading
? (isUSA?'Activating...':'Ativando...')
: (isUSA?'Activate Key':'Ativar Chave')}
 </Button>

 <div className="relative py-1">
 <div className="absolute inset-0 flex items-center">
 <span className="w-full border-t border-border"/>
 </div>
 <div className="relative flex justify-center text-[10px] uppercase">
 <span className="bg-card px-2 text-muted-foreground">
 {isUSA?'Don\'t have a key?':'Não tem chave?'}
 </span>
 </div>
 </div>

 <Button
 asChild
 size="lg"className="w-full bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-foreground font-bold shadow-[0_0_20px_hsl(330_100%_60%/0.5)]">
 <a
 href="https://pay.cakto.com.br/c88zju2_683076"target="_blank"rel="noopener noreferrer">
 <Key className="w-4 h-4 mr-2"/>
 {isUSA?'Buy Premium License':'Comprar Licença Premium'}
 </a>
 </Button>
 </div>
 </DialogContent>
 </Dialog>
);
};

export default LicenseActivation;
