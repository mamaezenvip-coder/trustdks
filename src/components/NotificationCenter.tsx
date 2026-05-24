import {useState, useEffect} from"react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from"@/components/ui/card";
import {Button} from"@/components/ui/button";
import {Bell, Plus, X, Calendar, Clock} from"lucide-react";
import {Badge} from"@/components/ui/badge";
import {toast} from"sonner";
import {Input} from"@/components/ui/input";
import {Label} from"@/components/ui/label";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from"@/components/ui/dialog";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";

interface Notification {
 id: string;
 title: string;
 description: string;
 type:"vaccine"|"appointment"|"medicine"|"custom";
 date: string;
 time: string;
 enabled: boolean;
}

const NotificationCenter = () => {
 const [notifications, setNotifications] = useState<Notification[]>([]);
 const [isDialogOpen, setIsDialogOpen] = useState(false);
 const [newNotification, setNewNotification] = useState({
 title:"",
 description:"",
 type:"custom"as Notification["type"],
 date:"",
 time:"",
});

 useEffect(() => {
 // Load notifications from localStorage
 const saved = localStorage.getItem("mamae-zen-notifications");
 if (saved) {
 setNotifications(JSON.parse(saved));
}
}, []);

 useEffect(() => {
 // Save notifications to localStorage
 localStorage.setItem("mamae-zen-notifications", JSON.stringify(notifications));
}, [notifications]);

 const addNotification = () => {
 if (!newNotification.title ||!newNotification.date ||!newNotification.time) {
 toast.error("Preencha todos os campos obrigatórios");
 return;
}

 const notification: Notification = {
 id: Date.now().toString(),
...newNotification,
 enabled: true,
};

 setNotifications([...notifications, notification]);
 setNewNotification({
 title:"",
 description:"",
 type:"custom",
 date:"",
 time:"",
});
 setIsDialogOpen(false);
 toast.success("Lembrete criado com sucesso!");
};

 const removeNotification = (id: string) => {
 setNotifications(notifications.filter((n) => n.id!== id));
 toast.success("Lembrete removido");
};

 const getTypeIcon = (type: Notification["type"]) => {
 switch (type) {
 case"vaccine":
 return"";
 case"appointment":
 return"";
 case"medicine":
 return"";
 default:
 return"";
}
};

 const getTypeColor = (type: Notification["type"]) => {
 switch (type) {
 case"vaccine":
 return"bg-accent";
 case"appointment":
 return"bg-green-500";
 case"medicine":
 return"bg-secondary";
 default:
 return"bg-orange-500";
}
};

 return (
 <Card className="bg-gradient-to-br from-[#1e1b4b] via-[#581c87]/50 to-[#831843]/50 border-2 border-secondary/30 shadow-lg">
 <CardHeader className="pb-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Bell className="w-5 h-5 text-primary"/>
 <CardTitle className="text-lg text-foreground">
 Central de Lembretes
 </CardTitle>
 </div>
 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
 <DialogTrigger asChild>
 <Button size="sm"className="bg-primary hover:bg-primary">
 <Plus className="w-4 h-4 mr-1"/>
 Novo
 </Button>
 </DialogTrigger>
 <DialogContent className="sm:max-w-md bg-[#1e1b4b] border-secondary/30">
 <DialogHeader>
 <DialogTitle className="text-foreground">Criar Novo Lembrete</DialogTitle>
 <DialogDescription className="text-secondary">
 Configure um lembrete importante para não esquecer
 </DialogDescription>
 </DialogHeader>
 <div className="space-y-4 py-4">
 <div className="space-y-2">
 <Label htmlFor="type">Tipo</Label>
 <Select
 value={newNotification.type}
 onValueChange={(value) =>
 setNewNotification({...newNotification, type: value as Notification["type"]})
}
 >
 <SelectTrigger>
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="vaccine"> Vacina</SelectItem>
 <SelectItem value="appointment"> Consulta</SelectItem>
 <SelectItem value="medicine"> Medicamento</SelectItem>
 <SelectItem value="custom"> Personalizado</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-2">
 <Label htmlFor="title">Título *</Label>
 <Input
 id="title"placeholder="Ex: Vacina de 3 meses"value={newNotification.title}
 onChange={(e) =>
 setNewNotification({...newNotification, title: e.target.value})
}
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="description">Descrição</Label>
 <Input
 id="description"placeholder="Detalhes adicionais (opcional)"value={newNotification.description}
 onChange={(e) =>
 setNewNotification({...newNotification, description: e.target.value})
}
 />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
 <Label htmlFor="date">Data *</Label>
 <Input
 id="date"type="date"value={newNotification.date}
 onChange={(e) =>
 setNewNotification({...newNotification, date: e.target.value})
}
 />
 </div>
 <div className="space-y-2">
 <Label htmlFor="time">Hora *</Label>
 <Input
 id="time"type="time"value={newNotification.time}
 onChange={(e) =>
 setNewNotification({...newNotification, time: e.target.value})
}
 />
 </div>
 </div>
 <Button onClick={addNotification} className="w-full">
 Criar Lembrete
 </Button>
 </div>
 </DialogContent>
 </Dialog>
 </div>
 <CardDescription className="text-xs leading-relaxed text-secondary">
 Configure lembretes para vacinas, consultas e medicamentos
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-2 p-3 pt-0">
 {notifications.length === 0? (
 <div className="text-center py-8 text-secondary">
 <Bell className="w-12 h-12 mx-auto mb-3 opacity-30"/>
 <p className="text-sm">Nenhum lembrete configurado</p>
 <p className="text-xs mt-1 text-secondary">Clique em"Novo"para criar</p>
 </div>
): (
 notifications.map((notification) => (
 <Card key={notification.id} className="relative overflow-hidden hover:shadow-md transition-shadow bg-[#1e1b4b] border-secondary/30">
 <div className={`absolute left-0 top-0 bottom-0 w-1 ${getTypeColor(notification.type)}`} />
 <CardContent className="p-3 pl-4">
 <div className="flex items-start justify-between gap-2">
 <div className="flex-1 space-y-1">
 <div className="flex items-center gap-2">
 <span className="text-lg">{getTypeIcon(notification.type)}</span>
 <h4 className="font-semibold text-sm leading-tight text-foreground">{notification.title}</h4>
 </div>
 {notification.description && (
 <p className="text-xs text-secondary pl-7">{notification.description}</p>
)}
 <div className="flex items-center gap-3 pl-7 text-xs text-secondary">
 <div className="flex items-center gap-1">
 <Calendar className="w-3 h-3"/>
 {new Date(notification.date).toLocaleDateString("pt-BR")}
 </div>
 <div className="flex items-center gap-1">
 <Clock className="w-3 h-3"/>
 {notification.time}
 </div>
 </div>
 </div>
 <Button
 variant="ghost"size="sm"onClick={() => removeNotification(notification.id)}
 className="h-8 w-8 p-0 text-secondary hover:text-foreground hover:bg-secondary/20">
 <X className="w-4 h-4"/>
 </Button>
 </div>
 </CardContent>
 </Card>
))
)}
 </CardContent>
 </Card>
);
};

export default NotificationCenter;
