import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Pill, Baby, Heart, Stethoscope, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCountry } from "@/contexts/CountryContext";
import { medicineDataBR, medicineDataUSA } from "@/data/medicineData";

import medHero from "@/assets/med-hero.jpg";
import medBaby from "@/assets/med-baby.jpg";
import medMom from "@/assets/med-mom.jpg";
import medConditions from "@/assets/med-conditions.jpg";

interface SectionImageProps {
  src: string;
  alt: string;
}

const SectionImage = ({ src, alt }: SectionImageProps) => (
  <div className="relative h-36 w-full overflow-hidden rounded-xl border border-primary/30 mb-3">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={1024}
      height={576}
      className="h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
  </div>
);

const MedicineGuide = () => {
  const { isUSA } = useCountry();
  const data = isUSA ? medicineDataUSA : medicineDataBR;
  const { babyMedicines, momMedicines, commonConditions } = data;

  return (
    <div className="space-y-5">
      {/* Cabeçalho com imagem */}
      <Card className="overflow-hidden border-2 border-primary/40 bg-card">
        <div className="relative h-40 w-full">
          <img
            src={medHero}
            alt={isUSA ? "Baby medicine essentials" : "Itens essenciais de medicamentos para bebê"}
            width={1024}
            height={512}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-extrabold text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]">
              {isUSA ? "Medicine Guide" : "Guia de Medicamentos"}
            </h2>
          </div>
        </div>
        <CardContent className="p-4 pt-3">
          <div className="flex items-start gap-2 rounded-xl border border-primary/50 bg-primary/10 p-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm font-semibold leading-relaxed text-foreground">
              {isUSA
                ? "WARNING: Always consult a pediatrician before giving any medication to your baby"
                : "ATENÇÃO: Sempre consulte um pediatra antes de administrar qualquer medicamento ao seu bebê"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Medicamentos para Bebês */}
      <Card>
        <CardHeader className="pb-2">
          <SectionImage
            src={medBaby}
            alt={isUSA ? "Baby medicines" : "Medicamentos para o bebê"}
          />
          <div className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              {isUSA ? "Baby Medicines" : "Medicamentos para o Bebê"}
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {isUSA
              ? "Dosage, warnings and risks for each medicine"
              : "Dosagem, cuidados e riscos de cada medicamento"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Accordion type="single" collapsible className="w-full">
            {babyMedicines.map((med, index) => (
              <AccordionItem key={index} value={`baby-med-${index}`}>
                <AccordionTrigger className="py-3 text-base hover:no-underline">
                  <div className="flex flex-wrap items-center gap-2 text-left">
                    <Pill className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-bold">{med.name}</span>
                    <Badge variant="outline" className="border-primary/40 px-2 py-0 text-xs text-primary">
                      {med.age}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4 text-sm leading-relaxed">
                  <div>
                    <p className="font-bold text-primary">{isUSA ? "What it's for:" : "Para que serve:"}</p>
                    <p className="text-foreground">{med.use}</p>
                  </div>
                  <div>
                    <p className="font-bold text-primary">{isUSA ? "Dosage:" : "Dosagem:"}</p>
                    <p className="text-foreground">{med.dosage}</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                    <p className="font-bold text-foreground">{isUSA ? "Important:" : "Importante:"}</p>
                    <p className="text-foreground/85">{med.warning}</p>
                  </div>
                  {med.risks && (
                    <div className="rounded-xl border border-primary/50 bg-primary/10 p-3">
                      <p className="font-bold text-primary">
                        {isUSA ? "Risks if misused:" : "Riscos se usado errado:"}
                      </p>
                      <p className="text-foreground/85">{med.risks}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Medicamentos para Mamãe */}
      <Card>
        <CardHeader className="pb-2">
          <SectionImage
            src={medMom}
            alt={isUSA ? "Mom's medicines" : "Medicamentos para a mamãe"}
          />
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              {isUSA ? "Mom's Medicines" : "Medicamentos para a Mamãe"}
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {isUSA
              ? "Safe medicines during breastfeeding"
              : "Medicamentos seguros durante a amamentação"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Accordion type="single" collapsible className="w-full">
            {momMedicines.map((med, index) => (
              <AccordionItem key={index} value={`mom-med-${index}`}>
                <AccordionTrigger className="py-3 text-base hover:no-underline">
                  <div className="flex flex-wrap items-center gap-2 text-left">
                    <Pill className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-bold">{med.name}</span>
                    {med.safe ? (
                      <Badge className="bg-primary px-2 py-0 text-xs text-primary-foreground">
                        {isUSA ? "Safe" : "Seguro"}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-primary/60 bg-primary/10 px-2 py-0 text-xs text-primary"
                      >
                        {isUSA ? "Caution" : "Cuidado"}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4 text-sm leading-relaxed">
                  <div>
                    <p className="font-bold text-primary">{isUSA ? "What it's for:" : "Para que serve:"}</p>
                    <p className="text-foreground">{med.use}</p>
                  </div>
                  <div>
                    <p className="font-bold text-primary">{isUSA ? "Dosage:" : "Dosagem:"}</p>
                    <p className="text-foreground">{med.dosage}</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                    <p className="font-bold text-foreground">{isUSA ? "Important:" : "Importante:"}</p>
                    <p className="text-foreground/85">{med.warning}</p>
                  </div>
                  {med.risks && (
                    <div className="rounded-xl border border-primary/50 bg-primary/10 p-3">
                      <p className="font-bold text-primary">
                        {isUSA ? "Risks if misused:" : "Riscos se usado errado:"}
                      </p>
                      <p className="text-foreground/85">{med.risks}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Doenças Comuns */}
      <Card>
        <CardHeader className="pb-2">
          <SectionImage
            src={medConditions}
            alt={isUSA ? "Common conditions" : "Condições comuns"}
          />
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              {isUSA ? "Common Conditions & Illnesses" : "Condições e Doenças Comuns"}
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {isUSA
              ? "How to identify and treat common problems"
              : "Como identificar e tratar problemas comuns"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Accordion type="single" collapsible className="w-full">
            {commonConditions.map((item, index) => (
              <AccordionItem key={index} value={`condition-${index}`}>
                <AccordionTrigger className="py-3 text-base hover:no-underline">
                  <span className="text-left font-bold">{item.condition}</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4 text-sm leading-relaxed">
                  <div>
                    <p className="font-bold text-primary">{isUSA ? "Symptoms:" : "Sintomas:"}</p>
                    <p className="text-foreground">{item.symptoms}</p>
                  </div>
                  <div>
                    <p className="font-bold text-primary">
                      {isUSA ? "Home treatment:" : "Tratamento em casa:"}
                    </p>
                    <p className="text-foreground">{item.treatment}</p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                    <p className="font-bold text-foreground">
                      {isUSA ? "When to see a doctor:" : "Quando procurar médico:"}
                    </p>
                    <p className="text-foreground/85">{item.when}</p>
                  </div>
                  {item.risks && (
                    <div className="rounded-xl border border-primary/50 bg-primary/10 p-3">
                      <p className="font-bold text-primary">
                        {isUSA ? "SERIOUS RISKS:" : "RISCOS GRAVES:"}
                      </p>
                      <p className="text-foreground/85">{item.risks}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineGuide;
