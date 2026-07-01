import {useEffect, useState} from'react';
import {useNavigate} from'react-router-dom';
import {useAuth} from'@/contexts/AuthContext';
import {useCountry} from'@/contexts/CountryContext';
import {supabase} from'@/integrations/supabase/client';
import {Button} from'@/components/ui/button';
import {Input} from'@/components/ui/input';
import {Shield, Star, Key, Sparkles, Mail, Lock, UserPlus, LogIn, Eye, EyeOff} from'lucide-react';
import mamaeZenLogo from'@/assets/mamae-zen-logo.png';
import previewGuias from'@/assets/preview-guias.png';
import previewMusicas from'@/assets/preview-musicas.png';
import previewGravidez from'@/assets/preview-gravidez.png';
import previewEmergencia from'@/assets/preview-emergencia.png';
import previewLojinha from'@/assets/preview-lojinha.png';
import previewPlayer from'@/assets/preview-player.png';
import {toast} from'sonner';
import CountrySelector from'@/components/CountrySelector';
import {checkRateLimit} from'@/utils/rateLimiter';
import HumanCheck from'@/components/HumanCheck';
import {lovable} from'@/integrations/lovable';

const features = [
 {image: previewGuias, labelPt:'Guias do Bebê', labelEn:'Baby Guides'},
 {image: previewMusicas, labelPt:'Músicas', labelEn:'Music'},
 {image: previewGravidez, labelPt:'Gravidez', labelEn:'Pregnancy'},
 {image: previewEmergencia, labelPt:'Emergência', labelEn:'Emergency'},
 {image: previewLojinha, labelPt:'Lojinha', labelEn:'Shop'},
 {image: previewPlayer, labelPt:'Player', labelEn:'Player'},
];

type AuthMode ='login'|'signup'|'license';

const Login = () => {
 const {user, loading} = useAuth();
 const {isUSA} = useCountry();
 const navigate = useNavigate();
 const [mode, setMode] = useState<AuthMode>('login');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [licenseKey, setLicenseKey] = useState('');
 const [activeSlide, setActiveSlide] = useState(0);
 const [humanVerified, setHumanVerified] = useState(false);

 useEffect(() => {
 if (!loading && user) navigate('/', {replace: true});
}, [user, loading, navigate]);

 useEffect(() => {
 const interval = setInterval(() => {
 setActiveSlide(prev => (prev + 1) % features.length);
}, 3000);
 return () => clearInterval(interval);
}, []);

 const handleSignUp = async () => {
 const {allowed, retryAfterMs} = checkRateLimit('login');
 if (!allowed) {
 const seconds = Math.ceil(retryAfterMs / 1000);
 toast.error(isUSA?`Too many attempts. Try again in ${seconds}s.`:`Muitas tentativas. Tente novamente em ${seconds}s.`);
 return;
}

 if (!email.trim() ||!password.trim()) {
 toast.error(isUSA?'Fill in all fields.':'Preencha todos os campos.');
 return;
}

 if (!humanVerified) {
 toast.error(isUSA?'Please confirm you are not a robot.':'Confirme que você não é um robô.');
 return;
}

 if (password!== confirmPassword) {
 toast.error(isUSA?'Passwords do not match.':'As senhas não coincidem.');
 return;
}

 if (password.length < 6) {
 toast.error(isUSA?'Password must be at least 6 characters.':'A senha deve ter pelo menos 6 caracteres.');
 return;
}

 setIsSubmitting(true);
 try {
 const {error} = await supabase.auth.signUp({
 email: email.trim(),
 password,
 options: {
 emailRedirectTo: window.location.origin,
},
});

 if (error) {
 toast.error(error.message);
} else {
 toast.success(
 isUSA
?'Account created! Check your email to confirm your MamãeZen account.':'Conta criada! Verifique seu e-mail para confirmar sua conta MamãeZen.',
 {duration: 8000}
);
 setMode('login');
 setPassword('');
 setConfirmPassword('');
}
} catch (e) {
 toast.error(isUSA?'Error creating account.':'Erro ao criar conta.');
} finally {
 setIsSubmitting(false);
}
};

 const handleLogin = async () => {
 const {allowed, retryAfterMs} = checkRateLimit('login');
 if (!allowed) {
 const seconds = Math.ceil(retryAfterMs / 1000);
 toast.error(isUSA?`Too many attempts. Try again in ${seconds}s.`:`Muitas tentativas. Tente novamente em ${seconds}s.`);
 return;
}

 if (!email.trim() ||!password.trim()) {
 toast.error(isUSA?'Fill in all fields.':'Preencha todos os campos.');
 return;
}

 if (!humanVerified) {
 toast.error(isUSA?'Please confirm you are not a robot.':'Confirme que você não é um robô.');
 return;
}

 setIsSubmitting(true);
 try {
 const {error} = await supabase.auth.signInWithPassword({
 email: email.trim(),
 password,
});

 if (error) {
 if (error.message.includes('Email not confirmed')) {
 toast.error(isUSA?'Please confirm your email first. Check your inbox.':'Confirme seu e-mail primeiro. Verifique sua caixa de entrada.');
} else {
 toast.error(isUSA?'Invalid email or password.':'E-mail ou senha inválidos.');
}
}
} catch (e) {
 toast.error(isUSA?'Login failed.':'Falha no login.');
} finally {
 setIsSubmitting(false);
}
};

 const handleForgotPassword = async () => {
 if (!email.trim()) {
 toast.error(isUSA?'Enter your email above first.':'Digite seu e-mail acima primeiro.');
 return;
}
 try {
 const {error} = await supabase.auth.resetPasswordForEmail(email.trim(), {
 redirectTo:`${window.location.origin}/reset-password`,
});
 if (error) {
 toast.error(error.message);
} else {
 toast.success(
 isUSA
?'Password reset link sent! Check your email.':'Link para redefinir a senha enviado! Verifique seu e-mail.',
 {duration: 8000}
);
}
} catch {
 toast.error(isUSA?'Error sending reset link.':'Erro ao enviar link.');
}
};

 const handleResendConfirmation = async () => {
 if (!email.trim()) {
 toast.error(isUSA?'Enter your email above first.':'Digite seu e-mail acima primeiro.');
 return;
}
 try {
 const {error} = await supabase.auth.resend({
 type:'signup',
 email: email.trim(),
 options: {emailRedirectTo: window.location.origin},
});
 if (error) {
 toast.error(error.message);
} else {
 toast.success(
 isUSA
?'Confirmation email resent.':'E-mail de confirmação reenviado.',
 {duration: 8000}
);
}
} catch {
 toast.error(isUSA?'Error resending email.':'Erro ao reenviar e-mail.');
}
};

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(isUSA ? 'Google sign-in failed.' : 'Falha ao entrar com Google.');
        setIsSubmitting(false);
      }
    } catch {
      toast.error(isUSA ? 'Google sign-in failed.' : 'Falha ao entrar com Google.');
      setIsSubmitting(false);
    }
  };

 if (loading) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex items-center justify-center">
 <div className="flex flex-col items-center gap-4">
 <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/40 animate-pulse">
 <img src={mamaeZenLogo} alt="Mamãe Zen"className="w-full h-full object-cover"/>
 </div>
 </div>
 </div>
);
}

 return (
 <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] flex flex-col relative overflow-hidden">
 
 {/* Animated background elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className="absolute w-[600px] h-[600px] rounded-full bg-primary/15 blur-[120px] -top-48 -right-48 animate-pulse"/>
 <div className="absolute w-[500px] h-[500px] rounded-full bg-secondary/12 blur-[100px] -bottom-32 -left-32 animate-pulse"style={{animationDelay:'1s'}} />
 <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/10 blur-[90px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"style={{animationDelay:'2s'}} />
 </div>

 {/* Main content */}
 <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 relative z-10">
 
 {/* Logo & Brand */}
 <div className="text-center mb-6 space-y-3">
 <div className="relative inline-flex group">
 <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity"/>
 <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-2xl shadow-primary/50 ring-2 ring-primary/20">
 <img src={mamaeZenLogo} alt="Mamãe Zen"className="w-full h-full object-cover"/>
 </div>
 </div>
 
 <div className="space-y-1.5">
 <h1 className="text-3xl font-extrabold tracking-tight">
 <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">
 Mamãe Zen
 </span>
 </h1>
 <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed">
 {isUSA 
?'The complete premium app for confident moms':'O app premium completo para mamães confiantes'}
 </p>
 </div>

 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
 <Star className="w-3 h-3 text-primary fill-primary"/>
 <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Premium</span>
 <Star className="w-3 h-3 text-primary fill-primary"/>
 </div>
 </div>

 {/* Feature showcase */}
 <div className="w-full max-w-sm mb-6">
 <div className="relative h-[300px] flex items-center justify-center">
 {features.map((feat, i) => {
 const diff = (i - activeSlide + features.length) % features.length;
 const position = diff <= features.length / 2? diff: diff - features.length;
 const isActive = position === 0;
 const isVisible = Math.abs(position) <= 1;

 if (!isVisible) return null;

 return (
 <div
 key={i}
 onClick={() => setActiveSlide(i)}
 className="absolute transition-all duration-500 ease-out cursor-pointer"style={{
 transform:`translateX(${position * 110}px) scale(${isActive? 1: 0.78}) translateZ(0)`,
 zIndex: isActive? 10: 5,
 opacity: isActive? 1: 0.5,
 filter: isActive?'none':'brightness(0.6)',
}}
 >
 <div className={`relative w-[160px] rounded-2xl overflow-hidden transition-shadow duration-500 ${
 isActive 
?'shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.5)] ring-2 ring-primary/40':'shadow-xl ring-1 ring-border/20'}`}>
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[6px] bg-background/80 rounded-b-lg z-20"/>
 <img 
 src={feat.image} 
 alt={isUSA? feat.labelEn: feat.labelPt}
 className="w-full h-[240px] object-cover object-top"/>
 </div>
 {isActive && (
 <p className="mt-3 text-center text-sm font-bold text-foreground animate-in fade-in duration-300">
 {isUSA? feat.labelEn: feat.labelPt}
 </p>
)}
 </div>
);
})}
 </div>

 <div className="flex justify-center gap-1.5 -mt-2">
 {features.map((_, i) => (
 <button
 key={i}
 onClick={() => setActiveSlide(i)}
 className={`h-1.5 rounded-full transition-all duration-300 ${
 activeSlide === i 
?'w-6 bg-primary':'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}
 />
))}
 </div>
 </div>

 {/* Auth card */}
 <div className="w-full max-w-sm">
 <div className="relative p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-primary/30 space-y-5 shadow-[0_0_60px_-10px_hsl(var(--primary)/0.5),inset_0_1px_0_hsl(var(--primary)/0.1)]">
 
 {/* Card header */}
 <div className="flex flex-col items-center gap-3">
 <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
 <img src={mamaeZenLogo} alt="Mamãe Zen"className="w-full h-full object-cover"/>
 </div>
 <div className="text-center space-y-1">
 <h2 className="text-lg font-bold">
 <span className="text-foreground">Mamãe</span>{''}
 <span className="text-primary">Zen</span>
 </h2>
 <p className="text-sm text-muted-foreground">
 {mode ==='signup'? (isUSA?'Create your account':'Crie sua conta')
: mode ==='license'? (isUSA?'Activate license':'Ativar licença')
: (isUSA?'Access your account':'Acesse sua conta')}
 </p>
 </div>
 </div>

 {/* Mode tabs */}
 <div className="flex gap-1 p-1 rounded-xl bg-muted/30 border border-border/20">
 <button
 onClick={() => setMode('login')}
 className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
 mode ==='login'?'bg-primary text-primary-foreground shadow-md':'text-muted-foreground hover:text-foreground'}`}
 >
 <LogIn className="w-3.5 h-3.5"/>
 {isUSA?'Login':'Entrar'}
 </button>
 <button
 onClick={() => setMode('signup')}
 className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
 mode ==='signup'?'bg-primary text-primary-foreground shadow-md':'text-muted-foreground hover:text-foreground'}`}
 >
 <UserPlus className="w-3.5 h-3.5"/>
 {isUSA?'Sign Up':'Criar Conta'}
 </button>
 <button
 onClick={() => setMode('license')}
 className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
 mode ==='license'?'bg-primary text-primary-foreground shadow-md':'text-muted-foreground hover:text-foreground'}`}
 >
 <Key className="w-3.5 h-3.5"/>
 {isUSA?'Key':'Chave'}
 </button>
 </div>

          {/* Login / Signup form */}
          {(mode ==='login'|| mode ==='signup') && (
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                variant="outline"
                className="w-full h-13 rounded-xl bg-card hover:bg-card/80 border-border/40 text-foreground font-semibold gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isUSA?'Continue with Google':'Continuar com Google'}
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40"/>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {isUSA?'or with email':'ou com e-mail'}
                  </span>
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <Input
                  type="email"placeholder={isUSA?'Your email':'Seu e-mail'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-13 rounded-xl bg-muted/20 border-border/40 pl-12 text-sm focus:border-primary/50"/>
              </div>
 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
 <Input
 type={showPassword?'text':'password'}
 placeholder={isUSA?'Password':'Senha'}
 value={password}
 onChange={e => setPassword(e.target.value)}
 className="h-13 rounded-xl bg-muted/20 border-border/40 pl-12 pr-12 text-sm focus:border-primary/50"/>
 <button
 type="button"onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
 {showPassword? <EyeOff className="w-4 h-4"/>: <Eye className="w-4 h-4"/>}
 </button>
 </div>
 {mode ==='signup'&& (
 <p className="text-[11px] text-muted-foreground/80 leading-relaxed px-1">
 {isUSA
?'Use at least 6 characters. We recommend mixing uppercase, lowercase letters, numbers and symbols (e.g. Mamae@2026).':'Use no mínimo 6 caracteres. Recomendamos misturar letras maiúsculas, minúsculas, números e símbolos (ex: Mamae@2026).'}
 </p>
)}
 {mode ==='signup'&& (
 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
 <Input
 type={showPassword?'text':'password'}
 placeholder={isUSA?'Confirm password':'Confirmar senha'}
 value={confirmPassword}
 onChange={e => setConfirmPassword(e.target.value)}
 className="h-13 rounded-xl bg-muted/20 border-border/40 pl-12 text-sm focus:border-primary/50"/>
 </div>
)}
 <HumanCheck verified={humanVerified} onVerify={setHumanVerified} />
 <Button
 onClick={mode ==='signup'? handleSignUp: handleLogin}
 disabled={isSubmitting}
 className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-70 gap-3"size="lg">
 {isSubmitting? (
 <Sparkles className="w-5 h-5 animate-spin"/>
): mode ==='signup'? (
 <UserPlus className="w-5 h-5"/>
): (
 <LogIn className="w-5 h-5"/>
)}
 {isSubmitting 
? (isUSA?'Loading...':'Carregando...') 
: mode ==='signup'? (isUSA?'Create Account':'Criar Conta')
: (isUSA?'Sign In':'Entrar')}
 </Button>

 {mode ==='login'&& (
 <div className="flex items-center justify-between gap-2 px-1 text-[11px]">
 <button
 type="button"onClick={handleForgotPassword}
 className="text-primary hover:text-primary/80 font-medium underline-offset-2 hover:underline">
 {isUSA?'Forgot password?':'Esqueci minha senha'}
 </button>
 <button
 type="button"onClick={handleResendConfirmation}
 className="text-muted-foreground hover:text-foreground font-medium underline-offset-2 hover:underline">
 {isUSA?'Resend confirmation':'Reenviar confirmação'}
 </button>
 </div>
)}

 {mode ==='signup'&& (
 <p className="text-center text-[11px] text-muted-foreground/70 leading-relaxed">
 {isUSA 
?'You will receive a confirmation email to activate your MamãeZen account':'Você receberá um e-mail para confirmar sua conta MamãeZen'}
 </p>
)}
 </div>
)}

 {/* License key form */}
 {mode ==='license'&& (
 <div className="space-y-3">
 <p className="text-xs text-muted-foreground text-center">
 {isUSA 
?'First create an account or login, then activate your key in the app.':'Primeiro crie uma conta ou faça login, depois ative sua chave no app.'}
 </p>
 <div className="relative">
 <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
 <Input
 placeholder="MZ-XXXXX-XXXXX-XXXXX"value={licenseKey}
 onChange={e => setLicenseKey(e.target.value.toUpperCase())}
 maxLength={50}
 className="h-13 rounded-xl bg-muted/20 border-border/40 pl-12 font-mono tracking-wider text-sm focus:border-primary/50"/>
 </div>
 <Button
 onClick={() => {
 if (!licenseKey.trim()) return;
 sessionStorage.setItem('pending_license_key', licenseKey.trim());
 toast.info(isUSA 
?'Key saved! Login or create account to activate.':'Chave salva! Faça login ou crie uma conta para ativar.');
 setMode('login');
}}
 disabled={!licenseKey.trim()}
 className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl gap-3 text-base">
 <Key className="w-5 h-5"/>
 {isUSA?'Save Key & Login':'Salvar Chave & Entrar'}
 </Button>

 <div className="relative py-1">
 <div className="absolute inset-0 flex items-center">
 <span className="w-full border-t border-border/40"/>
 </div>
 <div className="relative flex justify-center text-[10px] uppercase">
 <span className="bg-background px-2 text-muted-foreground">
 {isUSA?"Don't have a key?":'Não tem chave?'}
 </span>
 </div>
 </div>

 <a
 href="https://pay.cakto.com.br/c88zju2_683076"target="_blank"rel="noopener noreferrer"className="flex items-center justify-center gap-3 w-full h-14 rounded-xl font-bold text-base text-foreground bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 shadow-[0_0_25px_hsl(330_100%_60%/0.55)] transition-all">
 <Key className="w-5 h-5"/>
 {isUSA?'Buy Premium License':'Comprar Licença Premium'}
 </a>
 </div>
)}
 </div>

 {/* Security badge & country */}
 <div className="flex items-center justify-between px-2 mt-4">
 <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
 <Shield className="w-3 h-3"/>
 <span>{isUSA?'Secure login':'Login seguro'}</span>
 </div>
 <div className="rounded-xl bg-card/20 backdrop-blur-sm border border-border/10 px-2 py-0.5">
 <CountrySelector />
 </div>
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="relative z-10 pb-6 px-6 text-center space-y-1.5">
 <p className="text-[9px] text-muted-foreground/30">
 {isUSA?'By signing up you agree to our terms':'Ao criar conta você concorda com nossos termos'}
 </p>
 <p className="text-[9px] text-muted-foreground/40 font-medium">
 © {new Date().getFullYear()} Mamãe Zen Premium
 </p>
 </div>
 </div>
);
};

export default Login;
