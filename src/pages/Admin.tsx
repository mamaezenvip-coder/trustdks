import {useEffect} from'react';
import {useNavigate} from'react-router-dom';
import {useAuth} from'@/contexts/AuthContext';
import {useAdmin} from'@/hooks/useAdmin';
import {Button} from'@/components/ui/button';
import {Badge} from'@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from'@/components/ui/tabs';
import {Users, MessageSquare, ArrowLeft, Key, LayoutDashboard, RefreshCw, Music, UserCog} from'lucide-react';
import AdminDashboard from'@/components/admin/AdminDashboard';
import AdminUsers from'@/components/admin/AdminUsers';
import AdminSupport from'@/components/admin/AdminSupport';
import AdminLicenseKeys from'@/components/admin/AdminLicenseKeys';
import AdminMedia from'@/components/admin/AdminMedia';
import AdminClients from'@/components/admin/AdminClients';


const Admin = () => {
 const {user, loading: authLoading} = useAuth();
 const {isAdmin, loading: adminLoading} = useAdmin();
 const navigate = useNavigate();

 useEffect(() => {
 if (!authLoading &&!adminLoading) {
 if (!user ||!isAdmin) {
 navigate('/', {replace: true});
}
}
}, [user, isAdmin, authLoading, adminLoading, navigate]);

 if (authLoading || adminLoading) {
 return (
 <div className="min-h-screen bg-background flex items-center justify-center">
 <RefreshCw className="w-8 h-8 animate-spin text-primary"/>
 </div>
);
}

 if (!isAdmin) return null;

  return (
 <div className="min-h-screen bg-background">
 <div className="max-w-4xl mx-auto p-4 space-y-4">
 <div className="flex items-center gap-3">
 <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="border border-primary/30 hover:bg-primary/10">
 <ArrowLeft className="w-5 h-5 text-primary"/>
 </Button>
 <h1 className="text-2xl font-bold text-foreground neon-text">Painel Admin</h1>
 <Badge className="ml-auto bg-primary/10 text-primary border border-primary/40 truncate max-w-[180px]">
 {user?.email}
 </Badge>
 </div>

 <Tabs defaultValue="dashboard">
 <TabsList className="grid w-full grid-cols-6 bg-card/60 border border-primary/30 rounded-xl backdrop-blur-sm shadow-[0_0_20px_-8px_hsl(var(--primary)/0.55)]">
 {[
  {v:'dashboard', Icon: LayoutDashboard, label:'Painel'},
  {v:'clients', Icon: UserCog, label:'Clientes'},
  {v:'users', Icon: Users, label:'Usuários'},
  {v:'support', Icon: MessageSquare, label:'Suporte'},
  {v:'keys', Icon: Key, label:'Chaves'},
  {v:'media', Icon: Music, label:'Mídia'},
 ].map(({v, Icon, label}) => (
 <TabsTrigger
 key={v}
 value={v}
 className="flex items-center gap-1 text-[11px] rounded-lg border border-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-[0_0_18px_-4px_hsl(var(--primary)/0.8)] hover:border-primary/40"
 >
 <Icon className="w-3.5 h-3.5"/> {label}
 </TabsTrigger>
 ))}
 </TabsList>

 <TabsContent value="dashboard"className="mt-4">
 <AdminDashboard />
 </TabsContent>

 <TabsContent value="users"className="mt-4">
 <AdminUsers />
 </TabsContent>

 <TabsContent value="support"className="mt-4">
 <AdminSupport />
 </TabsContent>

 <TabsContent value="keys"className="mt-4">
 <AdminLicenseKeys />
 </TabsContent>

 <TabsContent value="media"className="mt-4">
 <AdminMedia />
 </TabsContent>
 </Tabs>

 </div>
 </div>
);
};

export default Admin;
