import {Card} from'@/components/ui/card';
import {Button} from'@/components/ui/button';
import {BookOpen, ChevronRight, Heart} from'lucide-react';
import {useState} from'react';
import ChapterDialog from'./ChapterDialog';
import EbookGallery from'./EbookGallery';

const chapters = [
 {id: 1, title:'O Começo da Jornada', subtitle:'Entendendo o Seu Corpo Pós-Parto', emoji:''},
 {id: 2, title:'Nutrição Essencial', subtitle:'Alimentando o Corpo e a Alma', emoji:''},
 {id: 3, title:'Hidratação', subtitle:'O Elemento Essencial', emoji:''},
 {id: 4, title:'O Poder da Amamentação', subtitle:'Para Quem Escolhe Amamentar', emoji:''},
 {id: 5, title:'O Timing é Tudo', subtitle:'Quando Começar os Exercícios', emoji:'⏰'},
 {id: 6, title:'Exercícios Seguros', subtitle:'Fortalecendo o Pós-Parto', emoji:''},
 {id: 7, title:'Diástase dos Retos', subtitle:'Entenda e Recupere', emoji:''},
 {id: 8, title:'Durma Bem', subtitle:'A Importância do Descanso', emoji:''},
 {id: 9, title:'Gerenciando o Estresse', subtitle:'Cuidando das Emoções', emoji:''},
 {id: 10, title:'Criando uma Rotina', subtitle:'Sustentável com um Bebê', emoji:''},
 {id: 11, title:'Além da Balança', subtitle:'Desapegando dos Números', emoji:''},
 {id: 12, title:'Superando Obstáculos', subtitle:'Fadiga, Tempo e Motivação', emoji:''},
 {id: 13, title:'A Força da Comunidade', subtitle:'Buscar Apoio', emoji:''},
 {id: 14, title:'Celebrando o Corpo', subtitle:'Autocuidado e Autoaceitação', emoji:''},
 {id: 15, title:'Mantenha o Foco', subtitle:'Sustentabilidade a Longo Prazo', emoji:''},
];

const GuideLibrary = () => {
 const [favorites, setFavorites] = useState<number[]>([]);
 const [selectedChapter, setSelectedChapter] = useState<typeof chapters[0] | null>(null);
 const [dialogOpen, setDialogOpen] = useState(false);

 const toggleFavorite = (id: number) => {
 setFavorites(prev => 
 prev.includes(id)? prev.filter(fav => fav!== id): [...prev, id]
);
};

 const openChapter = (chapter: typeof chapters[0]) => {
 setSelectedChapter(chapter);
 setDialogOpen(true);
};

 return (
 <Card className="border-secondary/30 shadow-lg bg-[hsl(var(--card))]/50">
 <div className="p-6">
 <div className="flex items-center gap-3 mb-6">
 <BookOpen className="w-6 h-6 text-primary"/>
 <h2 className="text-2xl font-bold text-foreground">Guia Completo</h2>
 </div>

 {/* E-book Gallery */}
 <EbookGallery />

 <div className="border-t border-primary/20 my-6 pt-6">
 <h3 className="text-lg font-bold text-foreground mb-2"> Guia Completo</h3>
 <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
 Emagrecimento Pós-Parto Saudável: seu guia completo para emagrecer após o parto de forma saudável e sustentável.
 </p>
 </div>

 <div className="grid gap-3">
 {chapters.map((chapter) => (
 <div
 key={chapter.id}
 className="group bg-[hsl(var(--card))]/80 hover:bg-[hsl(var(--card))] backdrop-blur-sm rounded-xl p-4 border border-secondary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl group-hover:scale-110 transition-transform duration-300">
 {chapter.emoji}
 </div>
 
 <div className="flex-1 min-w-0">
 <div className="flex items-start justify-between gap-2 mb-1">
 <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
 Capítulo {chapter.id}: {chapter.title}
 </h3>
 <Button
 variant="ghost"size="icon"className="flex-shrink-0 -mt-1 -mr-2"onClick={() => toggleFavorite(chapter.id)}
 >
 <Heart 
 className={`w-5 h-5 transition-colors ${
 favorites.includes(chapter.id) 
?'fill-primary text-primary':'text-secondary'}`} 
 />
 </Button>
 </div>
 <p className="text-sm text-secondary mb-3">{chapter.subtitle}</p>
 
 <Button 
 variant="ghost"size="sm"className="h-8 px-3 text-primary hover:text-primary hover:bg-primary/20 -ml-3"onClick={() => openChapter(chapter)}
 >
 Ler capítulo
 <ChevronRight className="w-4 h-4 ml-1"/>
 </Button>
 </div>
 </div>
 </div>
))}
 </div>

 <div className="mt-6 p-4 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-xl border border-primary/30">
 <p className="text-sm text-center text-primary">
 Lembre-se: esta jornada é sobre saúde, amor próprio e bem-estar. Você está fazendo um trabalho incrível!
 </p>
 </div>
 </div>
 
 <ChapterDialog 
 chapter={selectedChapter}
 open={dialogOpen}
 onOpenChange={setDialogOpen}
 />
 </Card>
);
};

export default GuideLibrary;
