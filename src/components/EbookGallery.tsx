import {useState} from'react';
import {Card} from'@/components/ui/card';
import {Button} from'@/components/ui/button';
import {BookOpen, Eye, BookOpenCheck} from'lucide-react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from'@/components/ui/dialog';
import {useCountry} from'@/contexts/CountryContext';
import PdfReader from'@/components/PdfReader';

import cover1 from'@/assets/ebook-cover-1.jpg';
import cover2 from'@/assets/ebook-cover-2.jpg';
import cover3 from'@/assets/ebook-cover-3.jpg';
import cover4 from'@/assets/ebook-cover-4.jpg';
import cover5 from'@/assets/ebook-cover-5.jpg';

interface Ebook {
 id: number;
 title: string;
 titleEN: string;
 description: string;
 descriptionEN: string;
 cover: string;
 file: string;
 category: string;
 categoryEN: string;
}

const ebooks: Ebook[] = [
 {
 id: 1,
 title:'Primeiros Passos do Bebê',
 titleEN:"Baby's First Steps",
 description:'Guia completo para acompanhar os primeiros marcos do desenvolvimento do seu bebê.',
 descriptionEN:'Complete guide to follow your baby\'s first developmental milestones.',
 cover: cover1,
 file:'/ebooks/Primeiros-Passos-do-Bebe.pdf',
 category:'Bebê',
 categoryEN:'Baby',
},
 {
 id: 2,
 title:'Odeio Ser Mãe',
 titleEN:'I Hate Being a Mom',
 description:'Um olhar honesto sobre os desafios da maternidade que ninguém conta.',
 descriptionEN:'An honest look at the challenges of motherhood nobody talks about.',
 cover: cover2,
 file:'/ebooks/Odeio_ser_mae.pdf',
 category:'Maternidade',
 categoryEN:'Motherhood',
},
 {
 id: 3,
 title:'O Diadema de Cinzas',
 titleEN:'The Ash Diadem',
 description:'Uma história envolvente de fantasia e superação para momentos de relaxamento.',
 descriptionEN:'An engaging fantasy story of overcoming for relaxation moments.',
 cover: cover3,
 file:'/ebooks/O-Diadema-de-Cinzas.pdf',
 category:'Literatura',
 categoryEN:'Literature',
},
 {
 id: 4,
 title:'O Despertar da Mãe Confiante',
 titleEN:'The Awakening of the Confident Mother',
 description:'Desperte a mãe confiante que existe em você com técnicas práticas.',
 descriptionEN:'Awaken the confident mother within you with practical techniques.',
 cover: cover4,
 file:'/ebooks/O-Despertar-da-Mae-Confiante.pdf',
 category:'Autoajuda',
 categoryEN:'Self-help',
},
 {
 id: 5,
 title:'As 7 Técnicas Avançadas Kabutizukito',
 titleEN:'The 7 Advanced Kabutizukito Techniques',
 description:'Técnicas avançadas para equilíbrio emocional e bem-estar na maternidade.',
 descriptionEN:'Advanced techniques for emotional balance and well-being in motherhood.',
 cover: cover5,
 file:'/ebooks/AS-7-TECNICAS-AVANCADAS-KABUTIZUKITO.pdf',
 category:'Bem-estar',
 categoryEN:'Wellness',
},
];

const EbookGallery = () => {
 const {isUSA} = useCountry();
 const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
 const [readingEbook, setReadingEbook] = useState<Ebook | null>(null);

 return (
 <div className="space-y-4">
 <div className="flex items-center gap-3 mb-3">
 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"style={{boxShadow:'0 0 16px hsl(330 85% 60% / 0.4)'}}>
 <BookOpen className="w-5 h-5 text-primary-foreground"/>
 </div>
 <div>
 <h3 className="font-bold text-lg text-foreground">
 {isUSA?'E-book Gallery':'Galeria de E-books'}
 </h3>
 <p className="text-xs text-muted-foreground">
 {isUSA?'Tap to read inside the app':'Toque para ler dentro do app'}
 </p>
 </div>
 </div>

 {/* Horizontal scroll carousel */}
 <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide"style={{scrollbarWidth:'none', msOverflowStyle:'none'}}>
 {ebooks.map((ebook) => (
 <div
 key={ebook.id}
 className="group cursor-pointer flex-shrink-0 w-36 snap-start"onClick={() => setSelectedEbook(ebook)}
 >
 <div
 className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-primary/20 transition-all duration-500 group-hover:scale-[1.03]"style={{
 boxShadow:'0 0 15px hsl(330 85% 60% / 0.2), 0 0 30px hsl(280 75% 55% / 0.1), 0 8px 32px hsl(0 0% 0% / 0.4)',
}}
 >
 {/* Neon glow on hover */}
 <div className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"style={{
 background:'linear-gradient(135deg, hsl(330 85% 60% / 0.5), hsl(280 75% 55% / 0.3), hsl(330 85% 60% / 0.5))',
 filter:'blur(8px)',
}} />
 <img
 src={ebook.cover}
 alt={isUSA? ebook.titleEN: ebook.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-[1]"loading="lazy"/>
 {/* Bottom gradient overlay */}
 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-3 pt-10 z-[2]">
 <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-primary/90">
 {isUSA? ebook.categoryEN: ebook.category}
 </span>
 <h4 className="text-[11px] font-bold text-foreground leading-tight line-clamp-2 mt-0.5">
 {isUSA? ebook.titleEN: ebook.title}
 </h4>
 </div>
 {/* Hover overlay */}
 <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-[3]">
 <div className="w-10 h-10 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center border border-primary/40"style={{boxShadow:'0 0 20px hsl(330 85% 60% / 0.4)'}}>
 <Eye className="w-5 h-5 text-primary-foreground"/>
 </div>
 </div>
 </div>
 </div>
))}
 </div>

 <Dialog open={!!selectedEbook} onOpenChange={() => setSelectedEbook(null)}>
 <DialogContent className="sm:max-w-md bg-card border-primary/20 max-h-[90vh] overflow-y-auto"style={{boxShadow:'0 0 40px hsl(330 85% 60% / 0.15), 0 0 80px hsl(280 75% 55% / 0.1)'}}>
 {selectedEbook && (
 <>
 <DialogHeader>
 <DialogTitle className="text-foreground text-lg">
 {isUSA? selectedEbook.titleEN: selectedEbook.title}
 </DialogTitle>
 </DialogHeader>
 <div className="space-y-4">
 <div className="aspect-[2/3] max-h-72 mx-auto overflow-hidden rounded-2xl border border-primary/20"style={{boxShadow:'0 0 20px hsl(330 85% 60% / 0.2)'}}>
 <img
 src={selectedEbook.cover}
 alt={isUSA? selectedEbook.titleEN: selectedEbook.title}
 className="w-full h-full object-cover"/>
 </div>
 <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
 {isUSA? selectedEbook.categoryEN: selectedEbook.category}
 </span>
 <p className="text-sm text-muted-foreground leading-relaxed">
 {isUSA? selectedEbook.descriptionEN: selectedEbook.description}
 </p>
 <Button
 onClick={() => {
 setReadingEbook(selectedEbook);
 setSelectedEbook(null);
}}
 className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"size="lg"style={{boxShadow:'0 0 20px hsl(var(--primary) / 0.35)'}}
 >
 <BookOpenCheck className="w-4 h-4 mr-2"/>
 {isUSA?'Read in the app':'Ler no aplicativo'}
 </Button>
 </div>
 </>
)}
 </DialogContent>
 </Dialog>

 {/* Leitor integrado */}
 <Dialog open={!!readingEbook} onOpenChange={() => setReadingEbook(null)}>
 <DialogContent className="max-w-3xl w-[calc(100vw-1rem)] h-[92vh] p-0 gap-0 overflow-hidden bg-background border-primary/40">
 <DialogHeader className="px-4 py-3 border-b border-primary/30 bg-card/80 backdrop-blur">
 <DialogTitle className="text-sm font-bold text-foreground pr-8 truncate">
 {readingEbook? (isUSA? readingEbook.titleEN: readingEbook.title):''}
 </DialogTitle>
 </DialogHeader>
 {readingEbook && (
 <iframe
 src={`${readingEbook.file}#toolbar=0&navpanes=0&view=FitH`}
 title={isUSA? readingEbook.titleEN: readingEbook.title}
 className="w-full h-full bg-black border-0"
 />
)}
 </DialogContent>
 </Dialog>
 </div>
);
};

export default EbookGallery;
