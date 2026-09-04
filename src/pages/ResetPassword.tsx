import {useEffect, useState} from'react';
import {useNavigate} from'react-router-dom';
import {supabase} from'@/integrations/supabase/client';
import {Button} from'@/components/ui/button';
import {Input} from'@/components/ui/input';
import {Lock, Eye, EyeOff, Loader2, ShieldCheck} from'lucide-react';
import {toast} from'sonner';
import mamaeZenLogo from'@/assets/mamae-zen-logo.png';

const ResetPassword = () => {
 const navigate = useNavigate();
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [hasSession, setHasSession] = useState(false);

 useEffect(() => {
 // Supabase auto-handles the recovery hash and creates a session
 supabase.auth.getSession().then(({data: {session}}) => {
 setHasSession(!!session);
});
 const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
 if (event ==='PASSWORD_RECOVERY'|| session) setHasSession(true);
});
 return () => subscription.unsubscribe();
}, []);

 const handleUpdate = async () => {
 if (password.length < 6) {
 toast.error('A senha deve ter pelo menos 6 caracteres.');
 return;
}
 if (password!== confirmPassword) {
 toast.error('As senhas não coincidem.');
 return;
}
 setIsSubmitting(true);
 try {
 const {error} = await supabase.auth.updateUser({password});
 if (error) {
 toast.error(error.message);
} else {
 toast.success('Senha redefinida com sucesso!');
 await supabase.auth.signOut();
 navigate('/login', {replace: true});
}
} finally {
 setIsSubmitting(false);
}
};

 return (
 <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex items-center justify-center px-5 py-8">
 <div className="w-full max-w-sm space-y-6">
 <div className="text-center space-y-3">
 <div className="inline-block w-20 h-20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/40 ring-2 ring-primary/20">
 <img src={mamaeZenLogo} alt="Mamãe Zen"className="w-full h-full object-cover"/>
 </div>
 <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
 Redefinir senha
 </h1>
 <p className="text-xs text-muted-foreground">
 Crie uma nova senha para sua conta MamãeZen
 </p>
 </div>

 <div className="space-y-3 p-5 rounded-2xl bg-card/40 backdrop-blur-md border border-border/30">
 {!hasSession && (
 <p className="text-[11px] text-destructive text-center">
 Link inválido ou expirado. Solicite um novo link na tela de login.
 </p>
)}

 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
 <Input
 type={showPassword?'text':'password'}
 placeholder="Nova senha"value={password}
 onChange={e => setPassword(e.target.value)}
 className="h-13 rounded-xl bg-muted/20 border-border/40 pl-12 pr-12 text-sm focus:border-primary/50"/>
 <button
 type="button"onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
 {showPassword? <EyeOff className="w-4 h-4"/>: <Eye className="w-4 h-4"/>}
 </button>
 </div>

 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
 <Input
 type={showPassword?'text':'password'}
 placeholder="Confirmar nova senha"value={confirmPassword}
 onChange={e => setConfirmPassword(e.target.value)}
 className="h-13 rounded-xl bg-muted/20 border-border/40 pl-12 text-sm focus:border-primary/50"/>
 </div>

 <p className="text-[11px] text-muted-foreground/80 leading-relaxed px-1">
 Use no mínimo 6 caracteres. Recomendamos misturar letras, números e símbolos.
 </p>

 <Button
 onClick={handleUpdate}
 disabled={isSubmitting ||!hasSession}
 className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl gap-3">
 {isSubmitting? <Loader2 className="w-5 h-5 animate-spin"/>: <ShieldCheck className="w-5 h-5"/>}
 {isSubmitting?'Salvando...':'Salvar nova senha'}
 </Button>

 <button
 onClick={() => navigate('/login')}
 className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
 Voltar para o login
 </button>
 </div>
 </div>
 </div>
);
};

export default ResetPassword;
