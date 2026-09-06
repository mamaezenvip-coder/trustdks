import {Card, CardContent, CardDescription, CardHeader, CardTitle} from"@/components/ui/card";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from"@/components/ui/accordion";
import {Pill, Baby, Heart} from"lucide-react";
import {Badge} from"@/components/ui/badge";
import {useCountry} from"@/contexts/CountryContext";
import {medicineDataBR, medicineDataUSA} from"@/data/medicineData";

const MedicineGuide = () => {
 const {isUSA} = useCountry();
 const data = isUSA? medicineDataUSA: medicineDataBR;
 const {babyMedicines, momMedicines, commonConditions} = data;

 return (
 <div className="space-y-4">
 <Card className="bg-gradient-to-br from-primary/12 to-primary/5 border-2 border-primary/30">
 <CardHeader className="pb-3">
 <div className="flex items-center gap-2">
 <Pill className="w-5 h-5 text-primary"/>
 <CardTitle className="text-lg text-primary">{isUSA?'Medicine Guide':'Guia de Medicamentos'}</CardTitle>
 </div>
 <CardDescription className="text-sm font-medium bg-primary/10 text-primary p-2 rounded-lg border border-primary/40 mt-2">
 {isUSA?"WARNING: Always consult a pediatrician before giving any medication to your baby":"ATENÇÃO: Sempre consulte um pediatra antes de administrar qualquer medicamento ao seu bebê"}
 </CardDescription>
 </CardHeader>
 </Card>

 {/* Medicamentos para Bebês */}
 <Card>
 <CardHeader className="pb-3">
 <div className="flex items-center gap-2">
 <Baby className="w-5 h-5 text-primary"/>
 <CardTitle className="text-base">{isUSA?"Baby Medicines":"Medicamentos para o Bebê"}</CardTitle>
 </div>
 </CardHeader>
 <CardContent className="p-3 pt-0">
 <Accordion type="single"collapsible className="w-full">
 {babyMedicines.map((med, index) => (
 <AccordionItem key={index} value={`baby-med-${index}`}>
 <AccordionTrigger className="text-sm py-2 hover:no-underline">
 <div className="flex items-center gap-2">
 <Pill className="w-4 h-4 text-primary"/>
 <span className="font-semibold">{med.name}</span>
 <Badge variant="outline"className="text-[10px] px-1.5 py-0 border-primary/40 text-primary">{med.age}</Badge>
 </div>
 </AccordionTrigger>
 <AccordionContent className="text-xs space-y-2 pb-3">
 <div>
 <p className="font-semibold text-primary">{isUSA?"What it's for:":"Para que serve:"}</p>
 <p>{med.use}</p>
 </div>
 <div>
 <p className="font-semibold text-primary">{isUSA?"Dosage:":"Dosagem:"}</p>
 <p>{med.dosage}</p>
 </div>
 <div className="bg-primary/10 p-2 rounded-lg border border-primary/30">
 <p className="font-semibold text-foreground"> {isUSA?"Important:":"Importante:"}</p>
 <p className="text-foreground/80">{med.warning}</p>
 </div>
 {med.risks && (
 <div className="bg-primary/10 p-2 rounded-lg border border-primary/50">
 <p className="font-semibold text-primary"> {isUSA?"Risks if misused:":"Riscos se usado errado:"}</p>
 <p className="text-foreground/80">{med.risks}</p>
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
 <CardHeader className="pb-3">
 <div className="flex items-center gap-2">
 <Heart className="w-5 h-5 text-primary"/>
 <CardTitle className="text-base">{isUSA?"Mom's Medicines":"Medicamentos para a Mamãe"}</CardTitle>
 </div>
 <CardDescription className="text-xs">
 {isUSA?"Safe medicines during breastfeeding":"Medicamentos seguros durante a amamentação"}
 </CardDescription>
 </CardHeader>
 <CardContent className="p-3 pt-0">
 <Accordion type="single"collapsible className="w-full">
 {momMedicines.map((med, index) => (
 <AccordionItem key={index} value={`mom-med-${index}`}>
 <AccordionTrigger className="text-sm py-2 hover:no-underline">
 <div className="flex items-center gap-2">
 <Pill className="w-4 h-4 text-primary"/>
 <span className="font-semibold">{med.name}</span>
 {med.safe? (
 <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground"> {isUSA?"Safe":"Seguro"}</Badge>
): (
 <Badge variant="outline"className="text-[10px] px-1.5 py-0 border-primary/60 text-primary bg-primary/10"> {isUSA?"Caution":"Cuidado"}</Badge>
)}
 </div>
 </AccordionTrigger>
 <AccordionContent className="text-xs space-y-2 pb-3">
 <div>
 <p className="font-semibold text-primary">{isUSA?"What it's for:":"Para que serve:"}</p>
 <p>{med.use}</p>
 </div>
 <div>
 <p className="font-semibold text-primary">{isUSA?"Dosage:":"Dosagem:"}</p>
 <p>{med.dosage}</p>
 </div>
 <div className={`p-2 rounded-lg border ${med.safe?'bg-primary/10 border-primary/30':'bg-primary/10 border-primary/30'}`}>
 <p className={`font-semibold ${med.safe?'text-primary':'text-foreground'}`}>
 {med.safe?'':''} {isUSA?"Important:":"Importante:"}
 </p>
 <p className="text-foreground/80">
 {med.warning}
 </p>
 </div>
 {med.risks && (
 <div className="bg-primary/10 p-2 rounded-lg border border-primary/50">
 <p className="font-semibold text-primary"> {isUSA?"Risks if misused:":"Riscos se usado errado:"}</p>
 <p className="text-foreground/80">{med.risks}</p>
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
 <CardHeader className="pb-3">
 <CardTitle className="text-base">{isUSA?"Common Conditions & Illnesses":"Condições e Doenças Comuns"}</CardTitle>
 <CardDescription className="text-xs">
 {isUSA?"How to identify and treat common problems":"Como identificar e tratar problemas comuns"}
 </CardDescription>
 </CardHeader>
 <CardContent className="p-3 pt-0">
 <Accordion type="single"collapsible className="w-full">
 {commonConditions.map((item, index) => (
 <AccordionItem key={index} value={`condition-${index}`}>
 <AccordionTrigger className="text-sm py-2 hover:no-underline">
 <span className="font-semibold">{item.condition}</span>
 </AccordionTrigger>
 <AccordionContent className="text-xs space-y-2 pb-3">
 <div>
 <p className="font-semibold text-primary">{isUSA?"Symptoms:":"Sintomas:"}</p>
 <p>{item.symptoms}</p>
 </div>
 <div>
 <p className="font-semibold text-primary">{isUSA?"Home treatment:":"Tratamento em casa:"}</p>
 <p>{item.treatment}</p>
 </div>
 <div className="bg-primary/10 p-2 rounded-lg border border-primary/30">
 <p className="font-semibold text-foreground"> {isUSA?"When to see a doctor:":"Quando procurar médico:"}</p>
 <p className="text-foreground/80">{item.when}</p>
 </div>
 {item.risks && (
 <div className="bg-primary/10 p-2 rounded-lg border border-primary/50">
 <p className="font-semibold text-primary"> {isUSA?"SERIOUS RISKS:":"RISCOS GRAVES:"}</p>
 <p className="text-foreground/80">{item.risks}</p>
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