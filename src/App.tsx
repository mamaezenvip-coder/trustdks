import {Toaster} from"@/components/ui/toaster";
import {Toaster as Sonner} from"@/components/ui/sonner";
import {TooltipProvider} from"@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from"@tanstack/react-query";
import {BrowserRouter, Routes, Route, Navigate} from"react-router-dom";
import {CountryProvider} from"@/contexts/CountryContext";
import {ThemeProvider} from"@/contexts/ThemeContext";
import {AuthProvider, useAuth} from"@/contexts/AuthContext";
import {useCacheCleanup} from"@/hooks/useCacheCleanup";
import Index from"./pages/Index";
import NotFound from"./pages/NotFound";
import Privacy from"./pages/Privacy";
import Login from"./pages/Login";
import ResetPassword from"./pages/ResetPassword";
import Admin from"./pages/Admin";
import SupportChat from"./components/SupportChat";
import PageMeta from"./components/PageMeta";

const queryClient = new QueryClient();

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
 const {user, loading} = useAuth();
 if (loading) return null;
 if (!user) return <Navigate to="/login"replace />;
 return <>{children}</>;
};

const AppContent = () => {
 useCacheCleanup();
 const {user} = useAuth();
 
 return (
 <>
 <Toaster />
 <Sonner />
 <BrowserRouter>
 <Routes>
 <Route path="/login" element={<><PageMeta path="/login" title="Entrar ou criar conta | Mamãe Zen Premium" description="Acesse o Mamãe Zen Premium com e-mail, Google ou chave de licença e libere guias, trackers e sons calmantes para o seu bebê." /><Login /></>} />
 <Route path="/reset-password" element={<><PageMeta path="/reset-password" title="Redefinir senha | Mamãe Zen Premium" description="Crie uma nova senha para a sua conta Mamãe Zen Premium com segurança e volte a acompanhar a rotina do seu bebê." noindex /><ResetPassword /></>} />
 <Route path="/privacy" element={<><PageMeta path="/privacy" title="Política de Privacidade | Mamãe Zen Premium" description="Saiba como o Mamãe Zen trata seus dados: armazenamento local, uso da localização em emergências, cookies e segurança." /><Privacy /></>} />
 <Route path="/privacidade" element={<><PageMeta path="/privacy" title="Política de Privacidade | Mamãe Zen Premium" description="Saiba como o Mamãe Zen trata seus dados: armazenamento local, uso da localização em emergências, cookies e segurança." /><Privacy /></>} />
 <Route path="/admin" element={<><PageMeta path="/admin" title="Painel administrativo | Mamãe Zen Premium" description="Área restrita de gestão do Mamãe Zen: clientes, chaves de licença, mídias e suporte." noindex /><ProtectedRoute><Admin /></ProtectedRoute></>} />
 <Route path="/" element={<><PageMeta path="/" title="Mamãe Zen Premium - Sistema para mães de primeira viagem" description="Guias práticos, trackers de sono e amamentação, mapa de emergência, sons calmantes e e-books para mães de primeira viagem." /><ProtectedRoute><Index /></ProtectedRoute></>} />
 <Route path="*" element={<><PageMeta path="/404" title="Página não encontrada | Mamãe Zen Premium" description="A página que você procura não existe no Mamãe Zen. Volte para o início e continue acompanhando a rotina do seu bebê." noindex /><NotFound /></>} />
 </Routes>
 {user && <SupportChat />}
 </BrowserRouter>
 </>
);
};

const App = () => (
 <QueryClientProvider client={queryClient}>
 <ThemeProvider>
 <CountryProvider>
 <AuthProvider>
 <TooltipProvider>
 <AppContent />
 </TooltipProvider>
 </AuthProvider>
 </CountryProvider>
 </ThemeProvider>
 </QueryClientProvider>
);

export default App;
