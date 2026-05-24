import {useState} from'react';
import {useAuth} from'@/contexts/AuthContext';
import {Button} from'@/components/ui/button';
import {X} from'lucide-react';
import LicenseActivation from'./LicenseActivation';
import mamaezenIcon from'@/assets/mamaezen-premium-icon.png';

const PAYMENT_URL ='https://pay.cakto.com.br/c88zju2_683076';

const TrialBanner = () => {
 const {license, licenseLoading} = useAuth();
 const [dismissed, setDismissed] = useState(false);
 const [keyDialog, setKeyDialog] = useState(false);

 if (licenseLoading || dismissed) return null;

 // Trial ativo
 if (license.isActive && license.isTrial) {
 return (
 <div className="sticky top-0 z-40 px-3 pt-3">
 <div className="relative rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/20 via-secondary/15 to-primary/20 backdrop-blur-md p-3 shadow-[0_0_25px_hsl(330_100%_60%/0.4)]">
 <button
 onClick={() => setDismissed(true)}
 className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"aria-label="Fechar">
 <X className="w-4 h-4"/>
 </button>
 <div className="flex items-start gap-3 pr-6">
 <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden">
 <img src={mamaezenIcon} alt="Mamãe Zen"width={48} height={48} loading="lazy"className="w-full h-full object-contain"/>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-bold text-foreground leading-tight">
 Premium grátis por {license.daysRemaining} {license.daysRemaining === 1?'dia':'dias'}
 </p>
 <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
 Garanta sua chave antes do fim do período de teste e continue com tudo liberado.
 </p>
 <div className="flex gap-2 mt-2">
 <Button
 asChild
 size="sm"className="h-8 px-3 text-xs bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-foreground font-bold shadow-[0_0_15px_hsl(330_100%_60%/0.5)]">
 <a href={PAYMENT_URL} target="_blank"rel="noopener noreferrer">
 Comprar Premium
 </a>
 </Button>
 <Button
 size="sm"variant="outline"className="h-8 px-3 text-xs"onClick={() => setKeyDialog(true)}
 >
 Tenho chave
 </Button>
 </div>
 </div>
 </div>
 </div>
 <LicenseActivation open={keyDialog} onOpenChange={setKeyDialog} />
 </div>
);
}

 // Trial expirado / sem licença
 if (!license.isActive) {
 return (
 <div className="sticky top-0 z-40 px-3 pt-3">
 <div className="relative rounded-2xl border border-destructive/40 bg-gradient-to-r from-destructive/15 via-primary/10 to-destructive/15 backdrop-blur-md p-3 shadow-[0_0_25px_hsl(0_80%_60%/0.3)]">
 <button
 onClick={() => setDismissed(true)}
 className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"aria-label="Fechar">
 <X className="w-4 h-4"/>
 </button>
 <div className="flex items-start gap-3 pr-6">
 <div className="shrink-0 w-10 h-10 rounded-xl bg-destructive/30 flex items-center justify-center">
 <img src={mamaezenIcon} alt="Mamãe Zen"width={48} height={48} loading="lazy"className="w-full h-full object-contain"/>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-bold text-foreground leading-tight">
 Seu período de teste terminou
 </p>
 <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
 Garanta sua licença Premium para continuar com Música, Emergência e Gravidez liberados.
 </p>
 <div className="flex gap-2 mt-2">
 <Button
 asChild
 size="sm"className="h-8 px-3 text-xs bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-foreground font-bold shadow-[0_0_15px_hsl(330_100%_60%/0.5)]">
 <a href={PAYMENT_URL} target="_blank"rel="noopener noreferrer">
 Comprar Premium
 </a>
 </Button>
 <Button
 size="sm"variant="outline"className="h-8 px-3 text-xs"onClick={() => setKeyDialog(true)}
 >
 Ativar chave
 </Button>
 </div>
 </div>
 </div>
 </div>
 <LicenseActivation open={keyDialog} onOpenChange={setKeyDialog} />
 </div>
);
}

 return null;
};

export default TrialBanner;
