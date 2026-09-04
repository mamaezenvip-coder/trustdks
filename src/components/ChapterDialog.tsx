import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Users,
  ChefHat,
  Lightbulb,
  Utensils,
  Snowflake,
  Utensils as TasteIcon,
  ListChecks,
} from 'lucide-react';
import { guideImages, type GuideChapter } from '@/data/guideContent';

interface ChapterDialogProps {
  chapter: GuideChapter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChapterDialog = ({ chapter, open, onOpenChange }: ChapterDialogProps) => {
  if (!chapter) return null;

  const { recipe } = chapter;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[calc(100vw-1.5rem)] h-[88vh] p-0 gap-0 overflow-hidden bg-card border-primary/40">
        <div className="relative h-40 sm:h-48 shrink-0 overflow-hidden">
          <img
            src={guideImages[chapter.image]}
            alt={`${chapter.title} — ${chapter.subtitle}`}
            className="w-full h-full object-cover animate-scale-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
          <DialogHeader className="absolute bottom-0 left-0 right-0 p-5 text-left space-y-1">
            <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/50 text-[11px] font-bold text-primary">
              <ChefHat className="w-3 h-3" />
              Capítulo {chapter.id} · {chapter.minutes} min de leitura
            </span>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {chapter.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-primary/90">
              {chapter.subtitle}
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 h-full">
          <div className="p-5 sm:p-6 space-y-7 pb-10">
            {/* Intro */}
            <p className="text-[15px] leading-relaxed text-foreground/90 animate-fade-in">
              {chapter.intro}
            </p>

            {/* Sections */}
            {chapter.sections.map((section, sIdx) => (
              <div
                key={section.heading}
                style={{ animationDelay: `${80 + sIdx * 90}ms` }}
                className="animate-fade-in rounded-2xl border border-primary/25 bg-background/60 p-4 sm:p-5"
              >
                <h4 className="flex items-center gap-2 font-bold text-foreground mb-3">
                  <ListChecks className="w-4 h-4 text-primary shrink-0" />
                  {section.heading}
                </h4>
                <ul className="space-y-2.5">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-foreground/85 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_hsl(var(--primary))]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Tip */}
            <div className="animate-fade-in rounded-2xl border border-primary/50 bg-primary/10 p-4 sm:p-5">
              <h4 className="flex items-center gap-2 font-bold text-primary mb-2">
                <Lightbulb className="w-4 h-4" />
                Dica Mamãe Zen
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed">{chapter.tip}</p>
            </div>

            {/* Recipe */}
            <div className="animate-fade-in rounded-2xl border border-primary/40 overflow-hidden">
              <div className="bg-primary/15 px-4 sm:px-5 py-4 border-b border-primary/30">
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary mb-1">
                  <Utensils className="w-3.5 h-3.5" />
                  Receita completa do capítulo
                </span>
                <h4 className="text-lg font-bold text-foreground leading-tight">{recipe.name}</h4>
                <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed">{recipe.why}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 border border-primary/30 text-[11px] text-foreground/85">
                    <Clock className="w-3 h-3 text-primary" />
                    {recipe.time}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 border border-primary/30 text-[11px] text-foreground/85">
                    <Users className="w-3 h-3 text-primary" />
                    {recipe.yield}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-6 bg-background/50">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    Ingredientes
                  </h5>
                  <ul className="grid gap-2">
                    {recipe.ingredients.map((ing, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-foreground/85 border-b border-primary/10 pb-2 last:border-0"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="bg-primary/20" />

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    Modo de preparo
                  </h5>
                  <ol className="space-y-3">
                    {recipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 border border-primary/50 text-primary text-[11px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <p className="text-sm text-foreground/85 leading-relaxed pt-0.5">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <Separator className="bg-primary/20" />

                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    <TasteIcon className="w-3.5 h-3.5" />
                    Degustação
                  </h5>
                  <p className="text-sm text-foreground/85 leading-relaxed">{recipe.tasting}</p>
                </div>

                <div className="rounded-xl border border-primary/20 bg-background/70 p-4">
                  <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    <Snowflake className="w-3.5 h-3.5" />
                    Armazenamento
                  </h5>
                  <p className="text-sm text-foreground/85 leading-relaxed">{recipe.storage}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ChapterDialog;
