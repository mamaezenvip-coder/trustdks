import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, Heart, Clock, ChefHat } from 'lucide-react';
import { useState } from 'react';
import ChapterDialog from './ChapterDialog';
import EbookGallery from './EbookGallery';
import { guideChapters, guideImages, type GuideChapter } from '@/data/guideContent';

const GuideLibrary = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<GuideChapter | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
  };

  const openChapter = (chapter: GuideChapter) => {
    setSelectedChapter(chapter);
    setDialogOpen(true);
  };

  return (
    <Card className="border-primary/30 shadow-lg bg-card/60 backdrop-blur-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground leading-tight">Guia Completo</h2>
            <p className="text-xs text-foreground/70">15 capítulos · receitas passo a passo</p>
          </div>
        </div>

        <EbookGallery />

        <div className="border-t border-primary/20 my-6 pt-6">
          <h3 className="text-lg font-bold text-foreground mb-2">Emagrecimento Pós-Parto Saudável</h3>
          <p className="text-foreground/80 mb-4 text-sm leading-relaxed">
            Conteúdo completo com fotos, protocolos práticos e uma receita detalhada em cada capítulo —
            do preparo até a degustação.
          </p>
        </div>


        <div className="grid gap-4">
          {guideChapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => openChapter(chapter)}
              style={{ animationDelay: `${index * 45}ms` }}
              className="group text-left animate-fade-in rounded-2xl overflow-hidden border border-primary/25 bg-card/80 hover:border-primary/70 transition-all duration-300 hover:shadow-[0_0_28px_-6px_hsl(var(--primary)/0.55)] active:scale-[0.99]"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={guideImages[chapter.image]}
                  alt={`Capítulo ${chapter.id}: ${chapter.title}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 border border-primary/50 text-[11px] font-bold text-primary backdrop-blur-sm">
                  Capítulo {chapter.id}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 bg-background/60 backdrop-blur-sm hover:bg-background/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(chapter.id);
                  }}
                >
                  <Heart
                    className={`w-4 h-4 transition-all ${
                      favorites.includes(chapter.id)
                        ? 'fill-primary text-primary scale-110'
                        : 'text-foreground/70'
                    }`}
                  />
                </Button>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-foreground leading-tight">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-foreground/80 line-clamp-1">{chapter.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 text-[11px] text-foreground/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {chapter.minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <ChefHat className="w-3.5 h-3.5 text-primary" />
                    1 receita
                  </span>
                </div>

                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  Ler capítulo
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/30">
          <p className="text-sm text-center text-foreground/90">
            Esta jornada é sobre saúde, amor próprio e bem-estar. Você está fazendo um trabalho incrível.
          </p>
        </div>
      </div>

      <ChapterDialog chapter={selectedChapter} open={dialogOpen} onOpenChange={setDialogOpen} />
    </Card>
  );
};

export default GuideLibrary;
