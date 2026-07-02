import {useState, useEffect} from'react';
import {Link} from'react-router-dom';
import {useCountry} from'@/contexts/CountryContext';
import {useAuth} from'@/contexts/AuthContext';
import {useAdmin} from'@/hooks/useAdmin';
import {supabase} from'@/integrations/supabase/client';
import ThemeSelector from'@/components/ThemeSelector';
import WelcomeGreeting from'@/components/WelcomeGreeting';
import LicenseActivation from'@/components/LicenseActivation';
import {Button} from'@/components/ui/button';
import {Card} from'@/components/ui/card';
import MusicPlayer from'@/components/MusicPlayer';
import RoutineCalendar from'@/components/RoutineCalendar';
import GuideLibrary from'@/components/GuideLibrary';
import PracticalGuides from'@/components/PracticalGuides';
import SleepTracker from'@/components/SleepTracker';
import FeedingTracker from'@/components/FeedingTracker';
import MedicineGuide from'@/components/MedicineGuide';
import AutismGuide from'@/components/AutismGuide';
import EmergencyMap from'@/components/EmergencyMap';
import PharmacyMap from'@/components/PharmacyMap';
import NotificationCenter from'@/components/NotificationCenter';
import AntiInspect from'@/components/AntiInspect';
import {PregnancyTracker} from'@/components/PregnancyTracker';
import ProductShowcase from'@/components/ProductShowcase';
import TrialBanner from'@/components/TrialBanner';
import {Tabs, TabsContent, TabsList, TabsTrigger} from'@/components/ui/tabs';
import {Baby, Music, Calendar, BookOpen, Moon, Milk, Sparkles, Pill, Brain, MapPin, Instagram, ShoppingBag, Cross, Bell, Heart, Lock, Key, LogOut, Shield} from'lucide-react';
import mamaeZenLogo from'@/assets/mamae-zen-logo.png';
import mamaeZenBrand from'@/assets/mamae-zen-banner.png.asset.json';
import {toast} from'sonner';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from'@/components/ui/dialog';
import {Input} from'@/components/ui/input';

const LOCKED_TABS = ['sounds','emergency','pregnancy'];

const Index = () => {
 const {isUSA} = useCountry();
 const {user, license, signOut} = useAuth();
 const {isAdmin} = useAdmin();
 const [selectedMood, setSelectedMood] = useState<string | null>(null);
 const [userName, setUserName] = useState<string>('');
 const [tempName, setTempName] = useState<string>('');
 const [showNameDialog, setShowNameDialog] = useState<boolean>(false);
 const [showLicenseDialog, setShowLicenseDialog] = useState(false);

 useEffect(() => {
 const savedName = localStorage.getItem('userName');
 if (savedName) {
 setUserName(savedName);
} else {
 setShowNameDialog(true);
}
 // Update last_seen_at
 if (user) {
 supabase.from('profiles').update({last_seen_at: new Date().toISOString()}).eq('id', user.id).then(() => {});
}
}, [user]);

 const handleNameSubmit = () => {
 if (tempName.trim()) {
 const sanitizedName = tempName.trim().slice(0, 50).replace(/[<>]/g,'');
 if (sanitizedName.length < 2) {
 toast.error(isUSA?'Name must have at least 2 characters':'O nome deve ter pelo menos 2 caracteres');
 return;
}
 setUserName(sanitizedName);
 localStorage.setItem('userName', sanitizedName);
 setShowNameDialog(false);
 toast.success(isUSA?`Welcome, ${sanitizedName}!`:`Bem-vinda, ${sanitizedName}!`);
}
};

 const handleMoodSelect = (mood: string) => {
 setSelectedMood(mood);
 const moodMessagesBR: Record<string, string> = {
 good:'Que ótimo! Continue assim, você está incrível!',
 calm:'Maravilhoso estar tranquila. Aproveite esse momento de paz.',
 tired:'Eu entendo, minha linda. Lembre-se de descansar sempre que possível.',
 anxious:'Respire fundo. Você está fazendo um trabalho incrível.',
 happy:'Que alegria! Sua felicidade ilumina tudo ao redor!',
};
 const moodMessagesUSA: Record<string, string> = {
 good:"That's great! Keep it up, you're amazing!",
 calm:'Wonderful to feel calm. Enjoy this moment of peace.',
 tired:'I understand, dear. Remember to rest whenever possible.',
 anxious:"Take a deep breath. You're doing an incredible job.",
 happy:'How joyful! Your happiness brightens everything around!',
};
 const messages = isUSA? moodMessagesUSA: moodMessagesBR;
 toast.success(messages[mood] || (isUSA?'Thanks for sharing!':'Obrigada por compartilhar!'));
};

 const renderTabTrigger = (value: string, icon: React.ReactNode, label: string) => {
 const isLocked = LOCKED_TABS.includes(value) &&!license.isActive;
 return (
 <TabsTrigger
 value={value}
 className="flex-col gap-1 py-2 px-1 text-xs text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-lg transition-all relative">
 <div className="relative">
 {icon}
 {isLocked && <Lock className="w-3 h-3 text-yellow-400 absolute -top-1 -right-2"/>}
 </div>
 <span>{label}</span>
 </TabsTrigger>
);
};

 const lockDescriptions: Record<string, {pt: string; en: string}> = {
 sounds: {
 pt:'Libere a opção de pesquisar qualquer música ou vídeo do YouTube sem anúncios, em qualidade 4K. Músicas relaxantes, canções de ninar e muito mais para o seu bebê!',
 en:'Unlock the ability to search any music or YouTube video ad-free in 4K quality. Relaxing songs, lullabies and more for your baby!'},
 emergency: {
 pt:'Libere o mapa de emergências com localização em tempo real de hospitais, UPAs e prontos-socorros mais próximos. Atendimento rápido quando você mais precisa!',
 en:'Unlock the emergency map with real-time locations of nearby hospitals and urgent care centers. Quick help when you need it most!'},
 pregnancy: {
 pt:'Libere o acompanhamento completo da gravidez semana a semana, com dicas personalizadas, desenvolvimento do bebê e lembretes de consultas!',
 en:'Unlock full week-by-week pregnancy tracking with personalized tips, baby development info and appointment reminders!'},
};

 const LockedOverlay = ({tabKey}: {tabKey: string}) => {
 const desc = lockDescriptions[tabKey];
 return (
 <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-4 p-6 text-center">
 <Lock className="w-12 h-12 text-primary animate-pulse"/>
 <div className="max-w-sm space-y-2">
 <h3 className="text-base font-bold text-foreground">
 {isUSA?'Premium Feature':'Recurso Premium'}
 </h3>
 <p className="text-sm text-muted-foreground leading-relaxed">
 {desc? (isUSA? desc.en: desc.pt): (isUSA?'This feature requires a Premium license':'Este recurso requer uma licença Premium')}
 </p>
 </div>
 <Button
 onClick={() => setShowLicenseDialog(true)}
 className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold"size="sm">
 <Key className="w-4 h-4 mr-2"/>
 {isUSA?'Activate Key':'Ativar Chave'}
 </Button>
 </div>
);
};

 const wrapWithLock = (tabValue: string, content: React.ReactNode) => {
 const isLocked = LOCKED_TABS.includes(tabValue) &&!license.isActive;
 return (
 <div className="relative">
 {isLocked && <LockedOverlay tabKey={tabValue} />}
 <div className={isLocked?'pointer-events-none select-none':''}>
 {content}
 </div>
 </div>
);
};

 return (
 <>
 <AntiInspect />
 <LicenseActivation open={showLicenseDialog} onOpenChange={setShowLicenseDialog} />
 <TrialBanner />

 {/* Name Dialog */}
 <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
 <DialogContent className="sm:max-w-md bg-card border-border">
 <DialogHeader>
 <DialogTitle className="text-2xl text-center text-foreground">
 {isUSA?'Welcome, Mom!':'Bem-vinda, Mamãe!'}
 </DialogTitle>
 <DialogDescription className="text-center text-base pt-2 text-muted-foreground">
 {isUSA?'Enter your name for a special experience':'Informe o seu nome para uma experiência especial'}
 </DialogDescription>
 </DialogHeader>
 <div className="flex flex-col gap-4 py-4">
 <Input
 placeholder={isUSA?'Enter your name...':'Digite seu nome...'}
 value={tempName}
 onChange={(e) => setTempName(e.target.value)}
 onKeyDown={(e) => e.key ==='Enter'&& handleNameSubmit()}
 className="text-center text-lg bg-muted border-border text-foreground"autoFocus
 maxLength={50}
 minLength={2}
 />
 <Button
 onClick={handleNameSubmit}
 disabled={!tempName.trim()}
 className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"size="lg">
 {isUSA?'Start my journey':'Começar minha jornada'}
 </Button>
 </div>
 </DialogContent>
 </Dialog>

 <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))] transition-colors duration-500">
 <div className="w-full max-w-md mx-auto p-4 space-y-6">
 {/* Header */}
 <div className="text-center space-y-2 animate-fade-in pt-2">
   <div className="flex items-center justify-center mb-1">
     <img
       src={mamaeZenBrand.url}
       alt="Mamãe Zen"
       loading="eager"
       className="w-40 h-40 md:w-48 md:h-48 object-contain rounded-full drop-shadow-[0_0_35px_hsl(330_100%_60%/0.55)]"
     />
   </div>
  <p className="text-muted-foreground text-sm font-medium px-4">
 {isUSA?'Premium motherhood app':'App premium de maternidade'}
 </p>
 <a
 href="https://www.instagram.com/app_mamae_zen?igsh=bGlydG9udHp3aXhs"target="_blank"rel="noopener noreferrer"className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
 <Instagram className="w-5 h-5"/>
 <span>@app_mamae_zen</span>
 </a>
 <div className="flex items-center justify-center gap-2 text-xs">
  {license.isActive? (
  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-semibold text-xs border border-green-500/30">PREMIUM</span>
): (
 <Button
 variant="ghost"size="sm"onClick={() => setShowLicenseDialog(true)}
 className="px-3 py-1 h-auto rounded-full bg-primary/20 text-primary font-semibold text-xs border border-primary/30 hover:bg-primary/30">
 <Key className="w-3 h-3 mr-1"/>
 {isUSA?'Activate Key':'Ativar Chave'}
 </Button>
)}
 </div>

 {/* User info & logout */}
 <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
 {isAdmin && (
 <Link to="/admin">
 <Button variant="ghost"size="sm"className="h-6 px-2 text-xs text-primary hover:text-primary/80">
 <Shield className="w-3 h-3 mr-1"/> Admin
 </Button>
 </Link>
)}
 <span>{user?.email}</span>
 <Button variant="ghost"size="sm"onClick={signOut} className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive">
 <LogOut className="w-3 h-3"/>
 </Button>
 </div>
 </div>

 {/* Theme Selector */}
 <div className="animate-fade-in">
 <ThemeSelector />
 </div>

 {/* Welcome */}
 {userName && (
 <div className="animate-scale-in">
 <WelcomeGreeting userName={userName} onMoodSelect={handleMoodSelect} />
 </div>
)}

 {/* Tabs */}
 <Tabs defaultValue="guides"className="animate-fade-in">
 <TabsList className="grid w-full grid-cols-4 gap-1 h-auto p-1.5 bg-card/80 border border-border rounded-xl">
 {renderTabTrigger('guides', <Baby className="w-4 h-4"/>, isUSA?'Guides':'Guias')}
 {renderTabTrigger('sounds', <Music className="w-4 h-4"/>, isUSA?'Music':'Músicas')}
 {renderTabTrigger('medicine', <Pill className="w-4 h-4"/>, isUSA?'Medicine':'Remédios')}
 {renderTabTrigger('emergency', <MapPin className="w-4 h-4"/>, isUSA?'Emergency':'Emergência')}
 </TabsList>

 <TabsList className="grid w-full grid-cols-4 gap-1 h-auto p-1.5 mt-2 bg-card/80 border border-border rounded-xl">
 {renderTabTrigger('notifications', <Bell className="w-4 h-4"/>, isUSA?'Reminders':'Lembretes')}
 {renderTabTrigger('pharmacy', <Cross className="w-4 h-4"/>, isUSA?'Pharmacy':'Farmácia')}
 {renderTabTrigger('pregnancy', <Heart className="w-4 h-4"/>, isUSA?'Pregnancy':'Gravidez')}
 {renderTabTrigger('shop', <ShoppingBag className="w-4 h-4"/>, isUSA?'Shop':'Lojinha')}
 </TabsList>

 <div className="mt-4">
 <TabsContent value="guides"className="mt-0 animate-fade-in"><PracticalGuides /></TabsContent>
  <TabsContent value="sounds" className="mt-0 animate-fade-in">{wrapWithLock('sounds', <MusicPlayer />)}</TabsContent>
 <TabsContent value="medicine"className="mt-0 animate-fade-in"><MedicineGuide /></TabsContent>
 <TabsContent value="emergency"className="mt-0 animate-fade-in">{wrapWithLock('emergency', <EmergencyMap />)}</TabsContent>
 <TabsContent value="notifications"className="mt-0 animate-fade-in"><NotificationCenter /></TabsContent>
 <TabsContent value="pharmacy"className="mt-0 animate-fade-in"><PharmacyMap /></TabsContent>
 <TabsContent value="pregnancy"className="mt-0 animate-fade-in">{wrapWithLock('pregnancy', <PregnancyTracker />)}</TabsContent>
 <TabsContent value="shop"className="mt-0 animate-fade-in">
 <ProductShowcase />
 </TabsContent>
 </div>

 {/* Secondary Tabs */}
 <div className="mt-4 p-3 rounded-xl bg-card/60 border border-border shadow-lg">
 <details className="group">
 <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-sm text-foreground">
 <span>{isUSA?'More Premium Features':'Mais Recursos Premium'}</span>
 <span className="transition group-open:rotate-180 text-primary">▼</span>
 </summary>
 <div className="mt-3 space-y-2">
 <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1.5 bg-muted/50 rounded-lg">
 {renderTabTrigger('sleep', <Moon className="w-4 h-4"/>, isUSA?'Sleep':'Sono')}
 {renderTabTrigger('feeding', <Milk className="w-4 h-4"/>, isUSA?'Feed':'Mamar')}
 {renderTabTrigger('autism', <Brain className="w-4 h-4"/>, isUSA?'Autism':'Autismo')}
 {renderTabTrigger('routine', <Calendar className="w-4 h-4"/>, isUSA?'Routine':'Rotina')}
 <TabsTrigger value="ebook"className="flex-col gap-1 py-2 text-xs text-muted-foreground data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground rounded-lg col-span-2">
 <BookOpen className="w-4 h-4"/>
 <span>E-book</span>
 </TabsTrigger>
 </TabsList>
 <TabsContent value="sleep"className="mt-2"><SleepTracker /></TabsContent>
 <TabsContent value="feeding"className="mt-2"><FeedingTracker /></TabsContent>
 <TabsContent value="autism"className="mt-2"><AutismGuide /></TabsContent>
 <TabsContent value="routine"className="mt-2"><RoutineCalendar /></TabsContent>
 <TabsContent value="ebook"className="mt-2"><GuideLibrary /></TabsContent>
 </div>
 </details>
 </div>
 </Tabs>

 {/* Footer */}
 <div className="text-center space-y-2 pt-6 pb-4 border-t border-border">
 <p className="text-xs text-muted-foreground">{isUSA?'Made with love for moms':'Feito com amor para mamães'}</p>
 <p className="text-xs font-semibold text-foreground/80">© {new Date().getFullYear()} Mamãe Zen Premium</p>
 <p className="text-[10px] text-muted-foreground/70">
 {isUSA?'All rights reserved to':'Todos os direitos reservados a'}{''}
 <span className="text-primary font-semibold">Hemerson Deckson</span>
 </p>
  <p className="text-[10px] text-muted-foreground/70">
  {isUSA?'Developed by':'Desenvolvido por'}{' '}
  <span className="text-primary font-semibold">Hemerson Deckson</span>
  </p>
 <Link to="/privacy">
 <Button variant="link"size="sm"className="text-[10px] h-auto p-0 text-primary hover:text-primary/80">
 {isUSA?'Privacy Policy':'Política de Privacidade'}
 </Button>
 </Link>
 </div>
 </div>
 </div>
 </>
);
};

export default Index;
