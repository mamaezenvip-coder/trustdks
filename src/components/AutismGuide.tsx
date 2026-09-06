import {Card, CardContent, CardDescription, CardHeader, CardTitle} from"@/components/ui/card";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from"@/components/ui/accordion";
import {Heart, Brain, Lightbulb, Eye, Ear, Hand} from"lucide-react";
import {Badge} from"@/components/ui/badge";

const AutismGuide = () => {
 const earlySigns = [
 {
 age:"0-6 meses",
 signs: ["Pouco ou nenhum contato visual","Não sorri quando você sorri","Não responde ao nome","Não demonstra interesse em rostos"],
 icon: Eye
},
 {
 age:"6-12 meses",
 signs: ["Não balbucia ou faz sons","Não gesticula (acenar, apontar)","Não demonstra interesse em brincadeiras sociais","Não responde a sons"],
 icon: Ear
},
 {
 age:"12-24 meses",
 signs: ["Não fala palavras simples aos 16 meses","Perde habilidades já adquiridas","Não aponta para objetos de interesse","Evita contato físico"],
 icon: Hand
}
];

 const strategies = [
 {
 title:"Comunicação Visual",
 description:"Use cartões com imagens para ajudar na comunicação",
 tips: ["Crie uma rotina visual com imagens das atividades do dia","Use fotos da família e objetos familiares","Mostre o que vai acontecer antes de fazer (banho, comida, etc)","Tenha paciência - pode levar tempo para o bebê entender"]
},
 {
 title:"Ambiente Calmo",
 description:"Reduza estímulos sensoriais excessivos",
 tips: ["Diminua luzes muito fortes - use luz indireta","Evite barulhos altos e repentinos","Crie um cantinho calmo com poucos brinquedos","Use música suave e sons da natureza","Mantenha a temperatura confortável"]
},
 {
 title:"Rotina Estruturada",
 description:"Crianças autistas se sentem mais seguras com rotinas",
 tips: ["Tenha horários fixos para acordar, comer e dormir","Avise com antecedência mudanças na rotina","Use sempre a mesma ordem nas atividades","Celebre pequenas conquistas com reforço positivo","Seja consistente todos os dias"]
},
 {
 title:"Estimulação Sensorial",
 description:"Atividades que ajudam no desenvolvimento",
 tips: ["Massagens suaves antes de dormir","Brincadeiras com texturas diferentes (macias, ásperas)","Banhos relaxantes com temperatura ideal","Brinquedos que fazem sons suaves","Contato pele a pele sempre que possível"]
},
 {
 title:"Alimentação",
 description:"Crianças autistas podem ter seletividade alimentar",
 tips: ["Respeite as preferências - não force","Introduza novos alimentos gradualmente","Mantenha o ambiente calmo durante as refeições","Use pratos com divisórias se não gostar de comidas misturadas","Textura pode ser mais importante que sabor"]
},
 {
 title:"Sono",
 description:"Problemas de sono são comuns",
 tips: ["Rotina noturna sempre igual e previsível","Quarto escuro, silencioso e confortável","Evite telas 2 horas antes de dormir","Use objetos de transição (naninha, cheirinho)","Considere usar ruído branco ou sons relaxantes"]
}
];

 const resources = [
 {
 title:"Quando Procurar Avaliação",
 items: ["Se notar qualquer dos sinais precoces mencionados","Se o bebê perdeu habilidades que já tinha","Se você tem alguma preocupação sobre o desenvolvimento","Quanto mais cedo o diagnóstico, melhor o prognóstico"]
},
 {
 title:"Profissionais que Podem Ajudar",
 items: ["Neuropediatra - diagnóstico e acompanhamento","Terapeuta Ocupacional - desenvolvimento sensorial","Fonoaudiólogo - comunicação e linguagem","Psicólogo - comportamento e emoções","Fisioterapeuta - desenvolvimento motor"]
},
 {
 title:"Apoio para os Pais",
 items: ["Grupos de apoio com outros pais autistas","Terapia familiar pode ajudar toda a família","Cuide da sua saúde mental - você não está sozinha","Celebre cada conquista, por menor que seja","Não compare seu filho com outras crianças"]
}
];

 return (
 <div className="space-y-4">
 <Card className="bg-gradient-to-br from-primary/12 to-primary/5 border-2 border-primary/30">
 <CardHeader className="pb-3">
 <div className="flex items-center gap-2">
 <Brain className="w-5 h-5 text-primary animate-pulse"/>
 <CardTitle className="text-lg text-foreground">Guia para Bebês Autistas</CardTitle>
 </div>
 <CardDescription className="text-xs leading-relaxed text-muted-foreground">
 Informações e estratégias para apoiar o desenvolvimento de crianças no espectro autista. 
 Cada criança é única e especial! 
 </CardDescription>
 </CardHeader>
 </Card>

 {/* Sinais Precoces */}
 <Card className="bg-card/50 border-primary/30">
 <CardHeader className="pb-3">
 <div className="flex items-center gap-2">
 <Eye className="w-5 h-5 text-primary"/>
 <CardTitle className="text-base text-foreground">Sinais Precoces por Idade</CardTitle>
 </div>
 <CardDescription className="text-xs text-muted-foreground">
 Identificação precoce pode fazer toda a diferença
 </CardDescription>
 </CardHeader>
 <CardContent className="p-3 pt-0 space-y-3">
 {earlySigns.map((item, index) => {
 const Icon = item.icon;
 return (
 <div key={index} className="bg-card p-3 rounded-lg border border-primary/30">
 <div className="flex items-center gap-2 mb-2">
 <Icon className="w-4 h-4 text-primary"/>
 <Badge className="text-xs bg-primary/20 text-primary border-primary/30">{item.age}</Badge>
 </div>
 <ul className="space-y-1 text-xs">
 {item.signs.map((sign, idx) => (
 <li key={idx} className="flex items-start gap-2 text-foreground/80">
 <span className="text-primary mt-0.5">•</span>
 <span>{sign}</span>
 </li>
))}
 </ul>
 </div>
);
})}
 <div className="bg-primary/10 p-3 rounded-lg border border-primary/30">
 <p className="text-xs text-foreground/80">
 <strong className="text-foreground"> Importante:</strong> Estes são apenas sinais de alerta. Somente um profissional pode fazer o diagnóstico. 
 Se você notar alguns desses sinais, procure um neuropediatra.
 </p>
 </div>
 </CardContent>
 </Card>

 {/* Estratégias */}
 <Card className="bg-card/50 border-primary/30">
 <CardHeader className="pb-3">
 <div className="flex items-center gap-2">
 <Lightbulb className="w-5 h-5 text-primary"/>
 <CardTitle className="text-base text-foreground">Estratégias de Apoio</CardTitle>
 </div>
 <CardDescription className="text-xs text-muted-foreground">
 Como ajudar seu bebê a se desenvolver e se sentir seguro
 </CardDescription>
 </CardHeader>
 <CardContent className="p-3 pt-0">
 <Accordion type="single"collapsible className="w-full">
 {strategies.map((strategy, index) => (
 <AccordionItem key={index} value={`strategy-${index}`} className="border-primary/30">
 <AccordionTrigger className="text-sm py-2 hover:no-underline">
 <div className="text-left">
 <p className="font-semibold text-foreground">{strategy.title}</p>
 <p className="text-xs text-muted-foreground">{strategy.description}</p>
 </div>
 </AccordionTrigger>
 <AccordionContent className="text-xs pb-3">
 <div className="p-3 rounded-lg border bg-primary/10 border-primary/30">
 <ul className="space-y-2">
 {strategy.tips.map((tip, idx) => (
 <li key={idx} className="flex items-start gap-2 text-foreground/80">
 <span className="text-primary mt-0.5 font-bold"></span>
 <span>{tip}</span>
 </li>
))}
 </ul>
 </div>
 </AccordionContent>
 </AccordionItem>
))}
 </Accordion>
 </CardContent>
 </Card>

 {/* Recursos e Suporte */}
 <Card className="bg-card/50 border-primary/30">
 <CardHeader className="pb-3">
 <div className="flex items-center gap-2">
 <Heart className="w-5 h-5 text-primary"/>
 <CardTitle className="text-base text-foreground">Recursos e Suporte</CardTitle>
 </div>
 </CardHeader>
 <CardContent className="p-3 pt-0 space-y-3">
 {resources.map((resource, index) => (
 <div key={index} className="bg-card p-3 rounded-lg border border-primary/30">
 <h4 className="font-semibold text-sm mb-2 text-primary">{resource.title}</h4>
 <ul className="space-y-1.5 text-xs">
 {resource.items.map((item, idx) => (
 <li key={idx} className="flex items-start gap-2 text-foreground/80">
 <span className="text-primary mt-0.5"></span>
 <span>{item}</span>
 </li>
))}
 </ul>
 </div>
))}
 </CardContent>
 </Card>

 <Card className="bg-gradient-to-r from-primary/12 to-primary/5 border-primary/30">
 <CardContent className="p-4">
 <p className="text-xs text-center leading-relaxed text-foreground/80">
 <strong className="text-primary"> Lembre-se:</strong> Cada criança é única e se desenvolve no seu próprio ritmo. 
 O autismo não define seu filho - ele é uma criança maravilhosa com necessidades especiais. 
 Você está fazendo um trabalho incrível! 
 </p>
 </CardContent>
 </Card>
 </div>
);
};

export default AutismGuide;
