import {useState, useEffect, Suspense, lazy} from'react';
import {Button} from'@/components/ui/button';
import {Card} from'@/components/ui/card';
import {ScrollArea} from'@/components/ui/scroll-area';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from'@/components/ui/accordion';
import {Calendar, Baby, Heart, ArrowLeft, ArrowRight, TrendingUp, Info, Loader2, Stethoscope, AlertTriangle, Apple, Activity} from'lucide-react';
import {useCountry} from'@/contexts/CountryContext';

const Baby3D = lazy(() => import('./Baby3D'));

interface PregnancyData {
 lastPeriodDate: string;
 cycleLength: number;
}

interface WeekData {
 size: string;
 weight: string;
 length: string;
 description: string;
 developments: string[];
 comparison: string;
 momSymptoms: string[];
 momTips: string[];
 exams: string[];
 warnings: string[];
 nutrition: string[];
}

const fetalDevelopmentData: Record<number, WeekData> = {
 4: {
 size:"0.4mm",
 weight:"< 1g",
 length:"Microscópico",
 description:"O embrião está se implantando no útero. As células começam a se diferenciar formando o blastocisto. A placenta e o saco amniótico começam a se desenvolver.",
 developments: ["Implantação no útero (nidação)","Formação do saco gestacional","Início da formação da placenta","Divisão celular acelerada","Formação das três camadas germinativas"],
 comparison:"Semente de papoula",
 momSymptoms: ["Atraso menstrual","Possível sangramento de implantação (leve)","Sensibilidade nos seios","Leve cansaço","Humor oscilante"],
 momTips: ["Faça o teste de gravidez","Inicie ácido fólico 400mcg/dia (se ainda não começou)","Evite álcool, cigarro e drogas","Reduza cafeína (máximo 200mg/dia)","Agende consulta com obstetra"],
 exams: ["Teste de gravidez (beta-hCG)","Primeira consulta pré-natal"],
 warnings: ["Sangramento intenso com cólicas fortes","Dor abdominal aguda de um lado (pode indicar gravidez ectópica)"],
 nutrition: ["Ácido fólico: previne defeitos do tubo neural","Ferro: previne anemia","Evitar: peixes crus, carnes mal passadas, queijos não pasteurizados"]
},
 5: {
 size:"2mm",
 weight:"< 1g",
 length:"2mm",
 description:"O coração primitivo começa a bater! É um tubo simples que pulsa aproximadamente 100-120 vezes por minuto. O tubo neural, que formará o cérebro e medula espinhal, está se desenvolvendo.",
 developments: ["Coração primitivo começa a bater (100-120 bpm)","Formação do tubo neural (futuro cérebro e medula)","Início do sistema circulatório","Formação dos brotos dos olhos e ouvidos","Placenta assumindo funções nutricionais"],
 comparison:"Semente de gergelim",
 momSymptoms: ["Náuseas (enjoo matinal)","Fadiga intensa","Aumento da frequência urinária","Seios doloridos e inchados","Aversão a certos cheiros e alimentos"],
 momTips: ["Coma pequenas porções várias vezes ao dia","Tenha biscoitos cream cracker à mão para náuseas","Descanse sempre que possível","Hidrate-se bem (8-10 copos de água/dia)","Use gengibre para aliviar enjoos"],
 exams: ["Ultrassom transvaginal (confirmar gravidez intrauterina)","Exames de sangue iniciais","Tipagem sanguínea e fator Rh"],
 warnings: ["Sangramento vermelho vivo","Cólicas muito fortes e persistentes","Febre acima de 38°C"],
 nutrition: ["Continue ácido fólico","Proteínas magras: frango, peixe cozido, ovos","Vegetais verde-escuros: espinafre, brócolis, couve"]
},
 6: {
 size:"5mm",
 weight:"< 1g",
 length:"5-6mm",
 description:"Os brotos dos braços e pernas começam a aparecer como pequenas protuberâncias. O coração já está dividido em câmaras. Os pulmões, fígado e rins começam a se desenvolver.",
 developments: ["Brotos dos membros (braços e pernas)","Coração dividindo-se em câmaras","Formação do fígado, pâncreas e pulmões","Desenvolvimento do intestino","Formação das narinas"],
 comparison:"Lentilha",
 momSymptoms: ["Náuseas mais intensas","Salivação excessiva","Prisão de ventre","Azia e refluxo","Mudanças de humor frequentes"],
 momTips: ["Evite alimentos gordurosos e condimentados","Coma antes de levantar da cama","Consuma fibras para combater constipação","Durma mais cedo","Converse com seu parceiro sobre suas emoções"],
 exams: ["Ultrassom para ver batimentos cardíacos","Hemograma completo","Glicemia de jejum"],
 warnings: ["Vômitos incontroláveis (hiperêmese gravídica)","Perda de peso significativa","Desidratação"],
 nutrition: ["Frutas frescas: banana, maçã, pera","Grãos integrais: arroz integral, aveia","Cálcio: leite, iogurte, queijo pasteurizado"]
},
 7: {
 size:"1cm",
 weight:"< 1g",
 length:"1cm (cabeça-nádegas)",
 description:"O rosto começa a tomar forma com olhos (como pontos escuros), narinas e boca. As mãos e pés parecem pequenas raquetes. O cérebro cresce rapidamente.",
 developments: ["Formação do rosto (olhos, boca, nariz)","Dedos começando a se separar","Fígado produzindo células sanguíneas","Apêndice e pâncreas formados","Cérebro crescendo rapidamente"],
 comparison:"Mirtilo",
 momSymptoms: ["Pico das náuseas matinais","Aumento do volume sanguíneo","Veias mais aparentes nos seios","Aréolas escurecendo","Sensação de inchaço abdominal"],
 momTips: ["Experimente acupressão para náuseas (pulseira anti-enjoo)","Evite deitar logo após comer","Use sutiã de suporte confortável","Faça caminhadas leves","Comece a planejar o enxoval aos poucos"],
 exams: ["Ultrassom morfológico do primeiro trimestre (entre 11-14 semanas)","Sorologia para rubéola, toxoplasmose, CMV, HIV, hepatites"],
 warnings: ["Sangramento vaginal","Dor pélvica intensa","Corrimento com odor forte"],
 nutrition: ["DHA (ômega-3): salmão cozido, sardinha","Vitamina D: exposição solar moderada, ovos","Evite: adoçantes artificiais em excesso"]
},
 8: {
 size:"1.6cm",
 weight:"1g",
 length:"1.6cm",
 description:"Todos os órgãos principais começaram a se formar! Os dedos das mãos e pés estão se separando. O embrião começa a fazer pequenos movimentos, mas você ainda não sente.",
 developments: ["Dedos das mãos e pés separados","Pálpebras se formando (ainda fechadas)","Orelhas externas tomando forma","Lábio superior formado","Sistema nervoso respondendo ao toque"],
 comparison:"Framboesa",
 momSymptoms: ["Cansaço extremo","Sonhos vívidos e estranhos","Congestão nasal","Dores de cabeça","Útero do tamanho de uma laranja"],
 momTips: ["Tire cochilos durante o dia se possível","Use travesseiro extra para dormir de lado","Mantenha alimentação regular mesmo com náuseas","Evite medicamentos sem orientação médica","Conte para família e amigos próximos"],
 exams: ["Urina tipo I (infecção urinária)","Urocultura"],
 warnings: ["Dor ao urinar (pode ser infecção)","Febre","Sangramento com coágulos"],
 nutrition: ["Vitamina C: laranja, acerola, morango","Zinco: carne vermelha magra, castanhas","Mantenha hidratação constante"]
},
 9: {
 size:"2.3cm",
 weight:"2g",
 length:"2.3cm",
 description:"O bebê começa a se mover ativamente, embora você ainda não sinta. Os músculos estão se desenvolvendo. Os órgãos genitais começam a se formar, mas ainda não são visíveis no ultrassom.",
 developments: ["Movimentos reflexos começam","Órgãos genitais começando a se formar","Ossos começando a endurecer (ossificação)","Coração completamente formado com 4 câmaras","Intestinos começando a funcionar"],
 comparison:"Uva",
 momSymptoms: ["Alterações de humor intensas","Acne pode surgir ou piorar","Gengivas mais sensíveis (podem sangrar)","Prisão de ventre","Gases e inchaço"],
 momTips: ["Visite o dentista para limpeza","Use fio dental com cuidado","Aumente fibras e água na dieta","Pratique exercícios leves com autorização médica","Pesquise sobre aulas de preparação para o parto"],
 exams: ["Avaliação de pressão arterial","Peso e altura","Ausculta do coração fetal (doppler)"],
 warnings: ["Sangramento gengival excessivo","Dores abdominais tipo cólica forte","Diminuição súbita dos sintomas de gravidez"],
 nutrition: ["Fibras: feijão, grão-de-bico, lentilha","Magnésio: banana, abacate, chocolate amargo","Iodo: sal iodado (moderadamente)"]
},
 10: {
 size:"3.1cm",
 weight:"4g",
 length:"3.1cm",
 description:"Fase embrionária completa! A partir de agora é oficialmente um FETO. Todos os órgãos vitais estão formados e passam a amadurecer. As unhas começam a crescer.",
 developments: ["Transição de embrião para feto","Unhas dos dedos começando","Rins funcionando (produzindo urina)","Fígado produzindo bile","Tireoide produzindo hormônios"],
 comparison:"Kumquat",
 momSymptoms: ["Náuseas começando a diminuir","Veias mais visíveis na pele","Aumento de corrimento vaginal claro","Dor ligamentar (pontadas laterais)","Fome aumentando"],
 momTips: ["Comece a usar cremes hidratantes na barriga","Evite ganho de peso excessivo","Considere aulas de yoga para gestantes","Comece a pesquisar sobre tipos de parto","Tire fotos da evolução da barriga"],
 exams: ["Translucência nucal (11-14 semanas)","PAPP-A e beta-hCG livre (rastreio cromossômico)"],
 warnings: ["Sangramento vermelho vivo","Dor abdominal intensa","Febre alta"],
 nutrition: ["Aumente gradualmente calorias (+300kcal/dia)","Proteínas: 75g/dia","Continue suplementação de ácido fólico"]
},
 11: {
 size:"4.1cm",
 weight:"7g",
 length:"4.1cm",
 description:"O bebê pode abrir e fechar os punhos! A cabeça ainda representa metade do corpo. Os genitais externos estão se diferenciando em masculino ou feminino.",
 developments: ["Movimentos mais coordenados","Botões dentários se formando nas gengivas","Cabelo e unhas crescendo","Orelhas movendo para posição final","Diafragma formado"],
 comparison:"Figo",
 momSymptoms: ["Energia começando a voltar","Apetite aumentando","Linea nigra pode começar a aparecer","Cabelos mais volumosos","Pele mais oleosa ou seca"],
 momTips: ["Aproveite a energia extra para se exercitar","Comece a pensar no quarto do bebê","Mantenha consultas pré-natais em dia","Converse com o bebê - ele começa a ouvir!","Pesquise sobre licença maternidade"],
 exams: ["Ultrassom morfológico 1º trimestre","Exame de translucência nucal","Osso nasal fetal"],
 warnings: ["Corrimento com odor ou coceira (pode ser infecção)","Dor lombar intensa","Inchaço súbito das mãos e rosto"],
 nutrition: ["Cálcio: 1000mg/dia (leite, iogurte, queijo)","Vitamina B12: carnes, ovos, laticínios","Folhas verdes: ricas em ferro e ácido fólico"]
},
 12: {
 size:"5.4cm",
 weight:"14g",
 length:"5.4cm",
 description:"Fim do primeiro trimestre! Risco de aborto espontâneo cai significativamente. O bebê tem reflexo de sucção e pode chupar o polegar. A placenta assume totalmente a produção hormonal.",
 developments: ["Reflexo de sucção desenvolvido","Sistema digestivo praticando movimentos","Medula óssea produzindo células sanguíneas","Placenta totalmente funcional","Intestinos dentro do abdômen"],
 comparison:"Limão",
 momSymptoms: ["Náuseas diminuindo significativamente","Energia retornando","Barriga começando a aparecer","Menor frequência urinária temporariamente","Brilho da gravidez (pele mais radiante)"],
 momTips: ["Hora de anunciar a gravidez se desejar!","Comece a usar roupas mais confortáveis","Inicie exercícios pélvicos (Kegel)","Pesquise sobre testes genéticos opcionais","Planeje viagens para o segundo trimestre"],
 exams: ["NIPT (teste pré-natal não invasivo) - opcional","Avaliação da morfologia fetal","Medição do comprimento céfalo-nádegas"],
 warnings: ["Qualquer sangramento vaginal","Ausência de movimentos no ultrassom","Diminuição drástica dos sintomas"],
 nutrition: ["Ômega-3: 200-300mg DHA/dia","Ferro: pode precisar suplementação","Evite excesso de vitamina A (retinol)"]
},
 13: {
 size:"7.4cm",
 weight:"23g",
 length:"7.4cm",
 description:"Início do segundo trimestre - a'lua de mel'da gravidez! As impressões digitais únicas estão se formando. O bebê pode bocejar e soluçar.",
 developments: ["Impressões digitais únicas formando","Cordas vocais se formando","Intestinos totalmente no abdômen","Pâncreas produzindo insulina","Baço produzindo células sanguíneas"],
 comparison:"Vagem de ervilha",
 momSymptoms: ["Aumento do desejo sexual","Menos náuseas","Mais energia","Dor ligamentar redonda (pontadas laterais)","Possível congestão nasal"],
 momTips: ["Melhor fase para viajar (segundo trimestre)","Compre calças com elástico ou gestantes","Mantenha atividade física moderada","Hidrate a pele para prevenir estrias","Aproveite para arrumar a casa antes do terceiro trimestre"],
 exams: ["Consulta pré-natal mensal","Pesquisa de diabetes gestacional (se fatores de risco)"],
 warnings: ["Dor pélvica que não melhora com repouso","Sangramento vaginal","Contrações regulares"],
 nutrition: ["Aumentar calorias gradualmente","Proteínas em cada refeição","Lanches saudáveis entre refeições"]
},
 14: {
 size:"8.7cm",
 weight:"43g",
 length:"8.7cm",
 description:"O bebê pode fazer expressões faciais como franzir a testa, fazer caretas e apertar os lábios! Os órgãos genitais podem ser visíveis no ultrassom.",
 developments: ["Expressões faciais variadas","Pode franzir a testa e fazer caretas","Órgãos genitais mais desenvolvidos","Lanugem (pelos finos) cobrindo o corpo","Fígado produzindo bile"],
 comparison:"Pêssego",
 momSymptoms: ["Energia renovada","Barriga mais evidente","Linha nigra mais visível","Apetite aumentado","Possível azia"],
 momTips: ["Agende ultrassom morfológico (18-22 semanas)","Pesquise sobre aulas de parto","Comece a dormir do lado esquerdo","Compre sutiãs maiores se necessário","Mantenha boa postura"],
 exams: ["Ultrassom para verificar sexo do bebê (se desejado)","Exames de rotina: urina, pressão"],
 warnings: ["Dores de cabeça frequentes e intensas","Visão turva","Inchaço súbito"],
 nutrition: ["Ferro: carne vermelha, feijão, espinafre","Vitamina C junto com ferro (melhora absorção)","Evite café junto com refeições (atrapalha ferro)"]
},
 15: {
 size:"10.1cm",
 weight:"70g",
 length:"10.1cm",
 description:"O bebê está formando papilas gustativas e pode sentir o sabor do líquido amniótico! A pele é ainda translúcida, mostrando os vasos sanguíneos.",
 developments: ["Papilas gustativas formadas","Pele fina e translúcida","Pode sentir luz forte através das pálpebras","Sistema esquelético endurecendo","Músculos fortalecendo"],
 comparison:"Maçã",
 momSymptoms: ["Possíveis primeiros movimentos (borboletas)","Congestão nasal persistente","Sangramento gengival","Dor nas costas leve","Sonhos vívidos"],
 momTips: ["Preste atenção aos primeiros movimentos","Use almofada entre as pernas para dormir","Faça exercícios para as costas","Visite o dentista se tiver sangramento gengival","Comece lista de enxoval"],
 exams: ["Amniocentese (se indicada, entre 15-20 semanas)","Alfa-fetoproteína (AFP) - triagem"],
 warnings: ["Perda de líquido vaginal","Contrações regulares","Sangramento"],
 nutrition: ["Ácidos graxos essenciais: azeite, abacate","Proteínas vegetais: tofu, quinoa","Comer o sabor que deseja oferecer ao bebê!"]
},
 16: {
 size:"11.6cm",
 weight:"100g",
 length:"11.6cm",
 description:"Você pode começar a sentir os primeiros movimentos (chutinhos)! Mães de segundo filho costumam sentir antes. O bebê pode ouvir sua voz e sons externos.",
 developments: ["Movimentos perceptíveis para a mãe","Sobrancelhas e cílios crescendo","Sistema circulatório totalmente funcional","Audição se desenvolvendo","Pode reagir a sons altos"],
 comparison:"Abacate",
 momSymptoms: ["Sensação de chutinhos ou bolhas","Aumento do apetite","Congestão nasal (rinite gravídica)","Pele mais sensível ao sol","Crescimento do útero perceptível"],
 momTips: ["Converse e cante para o bebê","Use protetor solar diariamente","Mantenha atividade física regular","Pesquise sobre cursos de preparação para o parto","Planeje o chá de bebê"],
 exams: ["Ultrassom morfológico do 2º trimestre (18-22 sem)","Ecocardiograma fetal (se indicado)"],
 warnings: ["Ausência de movimentos após sentir pela primeira vez","Dor abdominal intensa","Febre"],
 nutrition: ["Cálcio: importante para ossos do bebê","Vitamina D: 15 min de sol por dia","Magnésio: previne cãibras"]
},
 17: {
 size:"13cm",
 weight:"140g",
 length:"13cm",
 description:"O bebê está praticando respirar engolindo e expelindo líquido amniótico. A gordura subcutânea começa a se formar, ajudando na regulação térmica.",
 developments: ["Prática de respiração com líquido amniótico","Gordura subcutânea começando","Audição mais desenvolvida","Cartilagem endurecendo em osso","Impressões digitais completas"],
 comparison:"Pera",
 momSymptoms: ["Movimentos mais frequentes","Falta de ar leve","Cãibras nas pernas (especialmente à noite)","Coceira na barriga","Tontura ao levantar rápido"],
 momTips: ["Alongue as panturrilhas antes de dormir","Levante-se devagar da cama ou cadeira","Use hidratante na barriga diariamente","Beba bastante água","Comece a pensar em nomes para o bebê"],
 exams: ["Consulta pré-natal","Verificação de pressão arterial","Peso"],
 warnings: ["Cãibras que não passam","Inchaço excessivo nas pernas","Dor de cabeça persistente"],
 nutrition: ["Potássio: banana, água de coco (previne cãibras)","Fibras: previne constipação","Água: pelo menos 2-3 litros/dia"]
},
 18: {
 size:"14.2cm",
 weight:"190g",
 length:"14.2cm",
 description:"O bebê pode ouvir sons de fora! Pode se assustar com barulhos altos. A mielina começa a cobrir os nervos, melhorando a transmissão de sinais.",
 developments: ["Audição ativa - ouve sons externos","Padrões de sono sendo estabelecidos","Bocejos frequentes","Soluços podem ser sentidos","Sistema nervoso mais desenvolvido"],
 comparison:"Batata doce",
 momSymptoms: ["Movimentos claros do bebê","Possível soluço do bebê (pulsações rítmicas)","Dor lombar","Inchaço leve nos pés","Fome frequente"],
 momTips: ["Coloque música relaxante para o bebê","Evite ambientes muito barulhentos","Eleve as pernas quando possível","Use sapatos confortáveis e baixos","Agende o ultrassom morfológico"],
 exams: ["Ultrassom morfológico do 2º trimestre (ideal entre 20-24 semanas)","Avaliação do comprimento cervical"],
 warnings: ["Diminuição dos movimentos fetais","Perda de líquido vaginal","Contrações regulares"],
 nutrition: ["Colina: ovos, fígado (desenvolvimento cerebral)","Ômega-3: salmão, sardinha","Evite excesso de sal (reduz inchaço)"]
},
 19: {
 size:"15.3cm",
 weight:"240g",
 length:"15.3cm",
 description:"Vernix caseosa (substância cremosa protetora) começa a cobrir a pele do bebê. Os rins estão produzindo urina que compõe o líquido amniótico.",
 developments: ["Vernix caseosa protegendo a pele","Neurônios em rápido crescimento (milhões por minuto!)","Sentidos mais aguçados","Braços e pernas proporcionais","Cabelo permanente começando"],
 comparison:"Manga",
 momSymptoms: ["Chutinhos mais fortes","Dor no ligamento redondo (pontadas)","Manchas na pele (melasma/cloasma)","Corrimento aumentado","Fome constante"],
 momTips: ["Use protetor solar mesmo em dias nublados","Não se preocupe com manchas - geralmente somem após parto","Mantenha lanches saudáveis na bolsa","Continue exercícios pélvicos","Pesquise sobre plano de parto"],
 exams: ["Ultrassom morfológico (se ainda não fez)","Medição do fundo uterino"],
 warnings: ["Coceira intensa generalizada (pode ser colestase)","Manchas que coçam muito","Alterações visuais"],
 nutrition: ["Antioxidantes: frutas vermelhas","Vitamina E: castanhas, amêndoas","Mantenha alimentação colorida e variada"]
},
 20: {
 size:"16.4cm",
 weight:"300g",
 length:"25.6cm (cabeça-pés)",
 description:"Metade da gravidez! A partir de agora, medimos o bebê da cabeça aos pés. O bebê engole líquido amniótico e produz mecônio (primeira fezes).",
 developments: ["Metade da gravidez - marco importante!","Engole líquido amniótico regularmente","Produz mecônio (fezes do recém-nascido)","Cabelo (lanugo) cobrindo o corpo","Unhas crescidas até a ponta dos dedos"],
 comparison:"Banana",
 momSymptoms: ["Barriga bem evidente","Umbigo começando a saltar","Possível falta de ar","Dor nas costas aumentando","Azia e refluxo"],
 momTips: ["Comemore a metade da jornada!","Faça uma sessão de fotos da barriga","Durma do lado esquerdo com travesseiro entre pernas","Evite refeições pesadas à noite","Comece a preparar o quarto do bebê"],
 exams: ["Ultrassom morfológico detalhado","Avaliação da placenta e líquido amniótico","Medição do colo uterino"],
 warnings: ["Sangramento vaginal","Perda de líquido","Contrações regulares antes da hora"],
 nutrition: ["Ferro: necessidade aumenta muito nesta fase","Proteínas: essenciais para crescimento","Cálcio: ossos do bebê endurecendo"]
},
 22: {
 size:"27.8cm",
 weight:"430g",
 length:"27.8cm",
 description:"O bebê responde a sons e pode reconhecer sua voz! Os olhos estão formados, mas a íris ainda não tem cor. As sobrancelhas estão visíveis.",
 developments: ["Reconhece a voz da mãe","Pálpebras se abrem e fecham","Cérebro em rápido crescimento","Coordenação mão-boca (suga o polegar)","Pulmões produzindo surfactante"],
 comparison:"Papaia",
 momSymptoms: ["Contrações de Braxton-Hicks (treino)","Estrias podem aparecer","Inchaço nos pés e tornozelos","Dificuldade para dormir","Aumento do corrimento"],
 momTips: ["Leia e cante para o bebê diariamente","Use óleo ou creme para estrias","Evite ficar muito tempo em pé","Use meias de compressão se indicado","Comece a fazer exercícios de respiração"],
 exams: ["Teste de tolerância à glicose (TOTG) - entre 24-28 semanas","Hemograma para checar anemia"],
 warnings: ["Contrações regulares (mais de 4/hora)","Pressão pélvica intensa","Sangramento"],
 nutrition: ["Ferro + Vitamina C combinados","Proteínas em todas as refeições","Evite jejum prolongado"]
},
 24: {
 size:"30cm",
 weight:"600g",
 length:"30cm",
 description:"Limite de viabilidade! Bebês nascidos agora podem sobreviver com cuidados intensivos. Os pulmões estão produzindo surfactante, essencial para respirar.",
 developments: ["Surfactante pulmonar em produção","Ciclos de sono REM (sonhos)","Responde a estímulos externos","Face completamente formada","Pode ter soluços perceptíveis"],
 comparison:"Espiga de milho",
 momSymptoms: ["Bebê muito ativo","Dor no nervo ciático (dor nas pernas)","Prisão de ventre","Hemorroidas possíveis","Ronco durante o sono"],
 momTips: ["Faça alongamentos para ciático","Consuma muitas fibras e água","Use almofada para apoiar a barriga ao dormir","Evite ficar sentada muito tempo","Faça pausas para caminhar"],
 exams: ["Teste de glicose (rastreio diabetes gestacional)","Vacina dTpa (coqueluche) - entre 27-36 semanas","Anti-D se Rh negativo"],
 warnings: ["Dor abdominal intensa","Diminuição dos movimentos fetais","Perda de líquido"],
 nutrition: ["Proteínas: crescimento acelerado do bebê","DHA: desenvolvimento cerebral","Ferro: prevenção de anemia"]
},
 26: {
 size:"35.6cm",
 weight:"760g",
 length:"35.6cm",
 description:"O bebê abre os olhos pela primeira vez! Pode piscar e reagir à luz. Os pulmões continuam amadurecendo. O cérebro tem ondas cerebrais típicas de recém-nascido.",
 developments: ["Olhos se abrem pela primeira vez","Pode piscar e reagir à luz","Ondas cerebrais de sonho","Cílios e sobrancelhas definidos","Sistema imunológico se desenvolvendo"],
 comparison:"Alface",
 momSymptoms: ["Dificuldade para respirar","Azia frequente","Contrações de Braxton-Hicks mais frequentes","Dor lombar","Dificuldade para encontrar posição confortável"],
 momTips: ["Durma com a cabeceira elevada","Coma pequenas porções várias vezes","Evite deitar após comer","Faça curso de preparação para o parto","Monte a mala da maternidade aos poucos"],
 exams: ["Consulta pré-natal quinzenal a partir de agora","Monitoramento de pressão arterial","Pesquisa de estreptococo grupo B (35-37 semanas)"],
 warnings: ["Inchaço súbito de face e mãos","Dor de cabeça forte que não passa","Visão turva ou pontos brilhantes"],
 nutrition: ["Cálcio: ossos do bebê endurecendo rapidamente","Vitamina K: vegetais verde-escuros","Evite alimentos que causam azia"]
},
 28: {
 size:"37.6cm",
 weight:"1kg",
 length:"37.6cm",
 description:"Terceiro trimestre! O bebê pode sonhar durante o sono REM. A visão está se desenvolvendo e pode diferenciar luz de escuro. Os pulmões praticam respirar.",
 developments: ["Sonhos durante o sono REM","Visão funcional (distingue luz/escuro)","Pode diferenciar vozes","Pisca os olhos","Sistema nervoso mais maduro"],
 comparison:"Berinjela",
 momSymptoms: ["Falta de ar ao se esforçar","Insônia","Dor nas costelas (bebê chutando)","Vazamento de colostro dos seios","Cãibras nas pernas"],
 momTips: ["Comece a pensar na licença maternidade","Prepare a mala da maternidade","Lave as roupinhas do bebê","Escolha pediatra","Visite a maternidade"],
 exams: ["Ultrassom do 3º trimestre","Avaliação do crescimento fetal","Vacina dTpa (se ainda não tomou)"],
 warnings: ["Diminuição significativa dos movimentos","Inchaço excessivo súbito","Dor de cabeça persistente com alteração visual"],
 nutrition: ["Refeições menores e frequentes","Evite comer deitada","Mantenha hidratação"]
},
 30: {
 size:"39.9cm",
 weight:"1.3kg",
 length:"39.9cm",
 description:"O bebê está ganhando peso rapidamente - cerca de 200g por semana! A pele está ficando mais lisa à medida que a gordura se acumula.",
 developments: ["Ganho de peso acelerado","Medula óssea produzindo células sanguíneas","Unhas crescidas","Gordura se acumulando","Menos espaço para movimentos amplos"],
 comparison:"Repolho",
 momSymptoms: ["Barriga bem grande","Dificuldade para respirar profundamente","Dor nas costas constante","Vontade frequente de urinar","Dificuldade para caminhar longas distâncias"],
 momTips: ["Descanse com os pés elevados","Use cinta de gestante se indicado","Faça exercícios na água (hidroterapia)","Prepare o enxoval","Converse sobre plano de parto com seu médico"],
 exams: ["Consultas a cada 2 semanas","Cardiotocografia (CTG) se indicada","Ultrassom para verificar posição do bebê"],
 warnings: ["Menos de 10 movimentos em 2 horas","Contrações regulares","Perda de líquido"],
 nutrition: ["Cálcio: ossos do bebê em formação final","Ferro: estoque para o bebê","Proteínas: 80-100g/dia"]
},
 32: {
 size:"42.4cm",
 weight:"1.7kg",
 length:"42.4cm",
 description:"A pele está ficando menos enrugada à medida que a gordura se acumula. O bebê está praticando respirar e os pulmões estão quase maduros.",
 developments: ["Pele mais lisa (menos enrugada)","Pratica movimentos respiratórios","Ossos totalmente formados (mas ainda moles)","Unhas dos pés crescidas","Cabelo na cabeça mais visível"],
 comparison:"Jicama",
 momSymptoms: ["Contrações de Braxton-Hicks mais frequentes","Vazamento de urina ao tossir/espirrar","Dificuldade para dormir","Inchaço nas pernas e pés","Falta de ar"],
 momTips: ["Faça exercícios de Kegel diariamente","Durma do lado esquerdo","Evite viagens longas","Mantenha a mala pronta","Descanse bastante"],
 exams: ["Ultrassom de crescimento","Avaliação da posição fetal","Pesquisa de estreptococo B (35-37 semanas)"],
 warnings: ["Contrações regulares antes de 37 semanas","Sangramento vaginal","Diminuição dos movimentos"],
 nutrition: ["Vitamina K: couve, brócolis","Proteínas magras","Hidratação constante"]
},
 34: {
 size:"45cm",
 weight:"2.1kg",
 length:"45cm",
 description:"O sistema nervoso central está amadurecendo. Os pulmões estão quase prontos. Muitos bebês já estão de cabeça para baixo.",
 developments: ["Sistema nervoso maduro","Pulmões quase prontos para o mundo externo","Maioria dos bebês em posição cefálica","Gordura acumulando nas bochechas","Reflexos de sucção fortes"],
 comparison:"Melão cantaloupe",
 momSymptoms: ["Pressão na pelve","Dificuldade para andar","Fadiga extrema","Contrações mais frequentes","Bebê encaixando na pelve"],
 momTips: ["Descanse sempre que possível","Conheça os sinais de trabalho de parto","Tenha o telefone do médico à mão","Deixe tudo preparado para ir à maternidade","Durma bastante (será difícil depois!)"],
 exams: ["Consultas semanais a partir de 36 semanas","Cardiotocografia","Avaliação do colo uterino"],
 warnings: ["Perda do tampão mucoso com sangue","Ruptura da bolsa","Contrações a cada 5 minutos"],
 nutrition: ["Mantenha alimentação equilibrada","Evite grandes quantidades de uma vez","Alimentos de fácil digestão"]
},
 36: {
 size:"47.4cm",
 weight:"2.6kg",
 length:"47.4cm",
 description:"O bebê está perdendo o lanugo (pelos finos que cobriam o corpo). Está ganhando gordura rapidamente. Os pulmões estão praticamente maduros.",
 developments: ["Perde lanugo (penugem)","Ganha gordura rapidamente","Pulmões produzindo surfactante adequado","Sistema imunológico recebendo anticorpos da mãe","Movimentos mais limitados (pouco espaço)"],
 comparison:"Alface romana",
 momSymptoms: ["Bebê encaixado - respira melhor","Mais vontade de urinar","Pressão na bexiga e pelve","Dificuldade para andar","Contrações de treino frequentes"],
 momTips: ["Reconheça os sinais de trabalho de parto verdadeiro","Mantenha celular carregado","Descanse quando puder","Faça estoque de comidas para o pós-parto","Prepare o apoio para amamentação"],
 exams: ["Pesquisa de estreptococo do grupo B (swab vaginal/retal)","Cardiotocografia semanal","Avaliação do colo"],
 warnings: ["Sangramento vermelho vivo","Ruptura de bolsa (líquido claro ou esverdeado)","Ausência de movimentos fetais"],
 nutrition: ["Alimentos leves e nutritivos","Muitas frutas e vegetais","Proteínas para energia no parto"]
},
 37: {
 size:"48.6cm",
 weight:"2.9kg",
 length:"48.6cm",
 description:"TERMO COMPLETO! O bebê pode nascer a qualquer momento e está totalmente desenvolvido. Os pulmões estão maduros e prontos para respirar.",
 developments: ["Considerado termo completo","Todos os órgãos maduros","Pronto para o nascimento","Reflexos de sucção e deglutição perfeitos","Sistema imune com anticorpos da mãe"],
 comparison:"Acelga",
 momSymptoms: ["Ansiedade e expectativa","Dificuldade para dormir","Contrações de treino frequentes","Possível perda do tampão mucoso","Instinto de'ninho'(vontade de organizar tudo)"],
 momTips: ["Descanse o máximo possível","Aproveite os últimos momentos a dois","Tenha paciência - o bebê virá na hora certa","Caminhe se se sentir bem","Relaxe e confie no seu corpo"],
 exams: ["Consulta semanal","Cardiotocografia","Avaliação de dilatação se necessário"],
 warnings: ["Contrações regulares a cada 5 min por 1 hora","Ruptura de bolsa","Sangramento","Diminuição importante dos movimentos"],
 nutrition: ["Carboidratos complexos: energia para o parto","Mantenha-se bem hidratada","Refeições leves"]
},
 38: {
 size:"49.8cm",
 weight:"3.1kg",
 length:"49.8cm",
 description:"O bebê continua ganhando peso e desenvolvendo o cérebro. Está treinando a respiração e a digestão. Os reflexos estão afiados.",
 developments: ["Cérebro ainda em crescimento rápido","Reflexos totalmente prontos","Coordenação melhorada","Pulmões produzindo surfactante abundante","Pronto para a vida fora do útero"],
 comparison:"Alho-poró",
 momSymptoms: ["Contrações mais frequentes","Possível dilatação inicial","Pressão pélvica intensa","Dificuldade para andar","Cansaço extremo mas também energia súbita"],
 momTips: ["Aprenda as posições que ajudam no parto","Pratique respiração","Durma sempre que puder","Faça atividades leves que gosta","Mantenha-se positiva"],
 exams: ["Monitoramento fetal","Avaliação do colo do útero","Cardiotocografia"],
 warnings: ["Contrações dolorosas regulares","Ruptura de bolsa","Diminuição dos movimentos"],
 nutrition: ["Alimentos energéticos","Hidratação abundante","Refeições frequentes e leves"]
},
 39: {
 size:"50.7cm",
 weight:"3.3kg",
 length:"50.7cm",
 description:"Os pulmões estão completamente maduros e prontos para o primeiro choro. O sistema imune está fortalecido com anticorpos da mãe.",
 developments: ["Pulmões completamente maduros","Sistema imune fortalecido","Pronto para respirar sozinho","Gordura suficiente para termorregulação","Cordão umbilical longo e forte"],
 comparison:"Melancia mini",
 momSymptoms: ["Pode sentir que o parto está próximo","Contrações mais intensas","Energia renovada (instinto de ninho)","Ansiedade e excitação","Possível perda do tampão"],
 momTips: ["Fique atenta aos sinais de parto","Mantenha a calma","Revise o plano de parto com seu parceiro","Tenha os contatos de emergência prontos","Descanse e acumule energia"],
 exams: ["Monitoramento fetal","Avaliação de dilatação","Verificação de sinais de parto"],
 warnings: ["Contrações a cada 5 minutos","Ruptura de bolsa (líquido esverdeado = urgência)","Sangramento intenso"],
 nutrition: ["Carboidratos de absorção lenta","Proteínas leves","Muita água"]
},
 40: {
 size:"51.2cm",
 weight:"3.5kg",
 length:"51.2cm",
 description:"DATA PREVISTA DO PARTO! O bebê está totalmente pronto para nascer. Se passar desta data, seu médico vai monitorar de perto.",
 developments: ["Totalmente desenvolvido para a vida externa","Pronto para nascer","Aguardando o grande momento","Todos os sistemas funcionando","Pronto para o primeiro encontro!"],
 comparison:"Abóbora pequena",
 momSymptoms: ["Ansiedade máxima","Desconforto intenso","Contrações podem iniciar a qualquer momento","Dificuldade para descansar","Excitação pelo encontro"],
 momTips: ["Mantenha a calma - poucos bebês nascem na DPP exata","Até 41+6 é considerado normal","Continue as consultas de monitoramento","Métodos naturais de indução (caminhada, relação, estimulação mamilar)","Confie no seu corpo e no seu bebê"],
 exams: ["Cardiotocografia frequente","Avaliação do líquido amniótico","Discussão sobre indução se necessário"],
 warnings: ["Diminuição dos movimentos fetais","Líquido verde ou marrom (mecônio)","Sangramento","Sinais de infecção"],
 nutrition: ["Mantenha-se bem alimentada para o parto","Hidratação essencial","Alimentos de fácil digestão"]
}
};

const trimesterInfo = [
 {name:"1º Trimestre", weeks:"1-12", color:"from-primary to-primary/80"},
 {name:"2º Trimestre", weeks:"13-26", color:"from-primary to-primary/70"},
 {name:"3º Trimestre", weeks:"27-40", color:"from-primary to-primary/50"}
];

export const PregnancyTracker = () => {
 const {isBrazil} = useCountry();
 const isPT = isBrazil;
 
 const [pregnancyData, setPregnancyData] = useState<PregnancyData | null>(null);
 const [showSetup, setShowSetup] = useState(true);
 const [lastPeriodDate, setLastPeriodDate] = useState('');
 const [cycleLength, setCycleLength] = useState(28);
 const [currentWeek, setCurrentWeek] = useState(4);
 const [showGrowthChart, setShowGrowthChart] = useState(false);

 useEffect(() => {
 const saved = localStorage.getItem('pregnancyData');
 if (saved) {
 const data = JSON.parse(saved);
 setPregnancyData(data);
 setShowSetup(false);
 calculateCurrentWeek(data.lastPeriodDate);
}
}, []);

 const calculateCurrentWeek = (lmpDate: string) => {
 const lmp = new Date(lmpDate);
 const today = new Date();
 const diffTime = Math.abs(today.getTime() - lmp.getTime());
 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
 const weeks = Math.floor(diffDays / 7);
 setCurrentWeek(Math.min(Math.max(weeks, 4), 40));
};

 const calculateDueDate = (lmpDate: string): Date => {
 const lmp = new Date(lmpDate);
 const dueDate = new Date(lmp);
 dueDate.setDate(dueDate.getDate() + 280);
 return dueDate;
};

 const handleSubmit = () => {
 if (!lastPeriodDate) return;
 
 const data: PregnancyData = {
 lastPeriodDate,
 cycleLength
};
 
 localStorage.setItem('pregnancyData', JSON.stringify(data));
 setPregnancyData(data);
 setShowSetup(false);
 calculateCurrentWeek(lastPeriodDate);
};

 const handleReset = () => {
 localStorage.removeItem('pregnancyData');
 setPregnancyData(null);
 setShowSetup(true);
 setLastPeriodDate('');
 setCycleLength(28);
};

 const getWeekData = (week: number): WeekData => {
 const availableWeeks = Object.keys(fetalDevelopmentData).map(Number).sort((a, b) => a - b);
 const closestWeek = availableWeeks.reduce((prev, curr) => 
 Math.abs(curr - week) < Math.abs(prev - week)? curr: prev
);
 return fetalDevelopmentData[closestWeek];
};

 const getTrimester = (week: number): number => {
 if (week <= 12) return 1;
 if (week <= 26) return 2;
 return 3;
};

 const getDaysToGo = (): number => {
 if (!pregnancyData) return 0;
 const dueDate = calculateDueDate(pregnancyData.lastPeriodDate);
 const today = new Date();
 const diffTime = dueDate.getTime() - today.getTime();
 return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

 const formatDate = (date: Date): string => {
 return date.toLocaleDateString(isPT?'pt-BR':'en-US', {
 day:'2-digit',
 month:'2-digit',
 year:'numeric'});
};

 const weekData = getWeekData(currentWeek);
 const trimester = getTrimester(currentWeek);

 const GrowthChart = () => {
 const weeks = [8, 12, 16, 20, 24, 28, 32, 36, 40];
 
 return (
 <Card className="p-4 bg-gradient-to-br from-primary/12 to-primary/5 border-primary/30">
 <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
 <TrendingUp className="w-5 h-5 text-primary"/>
 {isPT?'Gráfico de Crescimento':'Growth Chart'}
 </h3>
 <div className="flex items-end justify-between gap-1 h-40">
 {weeks.map((week) => {
 const heightPercent = (week / 40) * 100;
 const isCurrentWeek = week === Math.round(currentWeek / 4) * 4;
 
 return (
 <div key={week} className="flex flex-col items-center flex-1">
 <div 
 className={`w-full rounded-t-lg transition-all ${
 isCurrentWeek 
?'bg-gradient-to-t from-primary to-primary/60 shadow-lg shadow-primary/50':'bg-gradient-to-t from-primary/40 to-primary/20'}`}
 style={{height:`${heightPercent}%`}}
 />
 <span className="text-xs text-muted-foreground mt-1 font-medium">{week}</span>
 </div>
);
})}
 </div>
 <p className="text-center text-muted-foreground text-xs mt-2">
 {isPT?'Semanas de gestação':'Weeks of pregnancy'}
 </p>
 </Card>
);
};

 if (showSetup) {
 return (
 <div className="space-y-4">
 <Card className="p-6 bg-gradient-to-br from-primary/12 to-primary/5 border-primary/30">
 <div className="text-center mb-6">
 <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/40">
 <Baby className="w-8 h-8 text-primary-foreground"/>
 </div>
 <h2 className="text-xl font-bold text-foreground mb-2">
 {isPT?'Acompanhe sua Gravidez':'Track Your Pregnancy'}
 </h2>
 <p className="text-muted-foreground text-sm">
 {isPT 
?'Veja o desenvolvimento do seu bebê semana a semana com informações médicas completas':'See your baby\'s development week by week with complete medical information'}
 </p>
 </div>

 <div className="space-y-4">
 <div>
 <label className="block text-foreground text-sm font-medium mb-2">
 {isPT 
?'Data do primeiro dia da última menstruação (DUM)':'First day of your last period (LMP)'}
 </label>
 <input
 type="date"value={lastPeriodDate}
 onChange={(e) => setLastPeriodDate(e.target.value)}
 className="w-full px-4 py-3 rounded-xl bg-card border border-primary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"/>
 </div>

 <div>
 <label className="block text-foreground text-sm font-medium mb-2">
 {isPT 
?'Duração do ciclo menstrual (dias)':'Length of menstrual cycle (days)'}
 </label>
 <input
 type="number"value={cycleLength}
 onChange={(e) => setCycleLength(Number(e.target.value))}
 min={21}
 max={35}
 className="w-full px-4 py-3 rounded-xl bg-card border border-primary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"/>
 <p className="text-xs text-muted-foreground mt-1">
 {isPT?'Ciclo normal: 21-35 dias (média 28)':'Normal cycle: 21-35 days (average 28)'}
 </p>
 </div>

 <Button
 onClick={handleSubmit}
 disabled={!lastPeriodDate}
 className="w-full py-6 bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/40 transition-all">
 <Calendar className="w-5 h-5 mr-2"/>
 {isPT?'Calcular Idade Gestacional':'Calculate Gestational Age'}
 </Button>
 </div>
 </Card>
 </div>
);
}

 return (
 <ScrollArea className="h-[calc(100vh-200px)]">
 <div className="space-y-4 pb-4">
 {/* Header com informações principais */}
 <Card className="p-4 bg-gradient-to-br from-primary/12 to-primary/5 border-primary/30">
 <div className="flex justify-between items-start mb-4">
 <div>
 <p className="text-muted-foreground text-xs font-medium">
 {isPT?'Data prevista do parto (DPP)':'Estimated due date (EDD)'}
 </p>
 <p className="text-foreground font-bold text-lg">
 {pregnancyData && formatDate(calculateDueDate(pregnancyData.lastPeriodDate))}
 </p>
 </div>
 <div className="text-right">
 <p className="text-muted-foreground text-xs font-medium">
 {isPT?'Faltam':'Days to go'}
 </p>
 <p className="text-foreground font-bold text-lg">
 {getDaysToGo()} {isPT?'dias':'days'}
 </p>
 </div>
 </div>

 {/* Trimestre */}
 <div className="flex gap-2 mb-4">
 {trimesterInfo.map((tri, index) => (
 <div 
 key={index}
 className={`flex-1 py-2 px-3 rounded-lg text-center transition-all ${
 trimester === index + 1 
?`bg-gradient-to-r ${tri.color} shadow-lg shadow-primary/30 text-primary-foreground`:'bg-card border border-primary/20 text-foreground'}`}
 >
 <p className="text-xs font-bold">{tri.name}</p>
 <p className="text-xs opacity-80">{tri.weeks}</p>
 </div>
))}
 </div>

 <Button
 variant="outline"onClick={handleReset}
 className="w-full bg-card border-primary/30 text-foreground hover:bg-primary/10">
 {isPT?'Recalcular DPP':'Recalculate EDD'}
 </Button>
 </Card>

 {/* Ilustração 3D do bebê */}
 <Card className="p-4 border-2 border-primary/30 shadow-xl shadow-primary/20 bg-gradient-to-br from-primary/12 to-primary/5">
 <Suspense fallback={
 <div className="w-full h-72 flex items-center justify-center rounded-2xl bg-card">
 <div className="flex flex-col items-center gap-2">
 <Loader2 className="w-8 h-8 animate-spin text-primary"/>
 <span className="text-muted-foreground text-sm">{isPT?'Carregando 3D...':'Loading 3D...'}</span>
 </div>
 </div>
}>
 <Baby3D week={currentWeek} />
 </Suspense>
 
 {/* Navegação entre semanas */}
 <div className="flex items-center justify-between mt-4">
 <Button
 variant="ghost"onClick={() => setCurrentWeek(Math.max(4, currentWeek - 1))}
 disabled={currentWeek <= 4}
 className="text-foreground hover:bg-primary/10">
 <ArrowLeft className="w-5 h-5"/>
 </Button>
 
 <div className="text-center">
 <p className="text-muted-foreground text-xs font-medium">
 {isPT?'Idade gestacional':"Gestational age"}
 </p>
 <p className="text-foreground font-bold text-xl">
 {currentWeek} {isPT?'semanas':'weeks'}
 </p>
 </div>
 
 <Button
 variant="ghost"onClick={() => setCurrentWeek(Math.min(40, currentWeek + 1))}
 disabled={currentWeek >= 40}
 className="text-foreground hover:bg-primary/10">
 <ArrowRight className="w-5 h-5"/>
 </Button>
 </div>
 </Card>

 {/* Informações básicas da semana */}
 <Card className="p-4 bg-card border-primary/30">
 <div className="flex items-center gap-2 mb-3">
 <Baby className="w-5 h-5 text-primary"/>
 <h3 className="text-foreground font-semibold">
 {isPT?`Desenvolvimento na Semana ${currentWeek}`:`Development at Week ${currentWeek}`}
 </h3>
 </div>
 
 <div className="grid grid-cols-3 gap-3 mb-4">
 <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
 <p className="text-muted-foreground text-xs font-medium">{isPT?'Tamanho':'Size'}</p>
 <p className="text-foreground font-bold">{weekData.size}</p>
 </div>
 <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
 <p className="text-muted-foreground text-xs font-medium">{isPT?'Peso':'Weight'}</p>
 <p className="text-foreground font-bold">{weekData.weight}</p>
 </div>
 <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
 <p className="text-muted-foreground text-xs font-medium">{isPT?'Comparação':'Compared to'}</p>
 <p className="text-foreground font-bold text-xs">{weekData.comparison}</p>
 </div>
 </div>

 <p className="text-foreground/80 text-sm mb-4">{weekData.description}</p>

 <div className="space-y-2">
 <p className="text-foreground font-medium text-sm">
 {isPT?'Desenvolvimentos desta fase:':'Developments at this stage:'}
 </p>
 {weekData.developments.map((dev, index) => (
 <div key={index} className="flex items-center gap-2">
 <Heart className="w-3 h-3 text-primary flex-shrink-0"/>
 <span className="text-foreground/80 text-sm">{dev}</span>
 </div>
))}
 </div>
 </Card>

 {/* Accordion com informações detalhadas */}
 <Accordion type="single"collapsible className="w-full space-y-2">
 {/* Sintomas da Mãe */}
 <AccordionItem value="symptoms"className="border border-primary/30 rounded-lg px-3 bg-card">
 <AccordionTrigger className="hover:no-underline py-3">
 <div className="flex items-center gap-2">
 <div className="p-1.5 rounded-full bg-primary/10">
 <Activity className="w-4 h-4 text-primary"/>
 </div>
 <span className="font-semibold text-foreground">
 {isPT?'Sintomas Comuns da Mamãe':"Mom's Common Symptoms"}
 </span>
 </div>
 </AccordionTrigger>
 <AccordionContent className="pb-3">
 <div className="space-y-2">
 {weekData.momSymptoms.map((symptom, index) => (
 <div key={index} className="flex items-start gap-2">
 <span className="text-primary mt-0.5">•</span>
 <span className="text-foreground/80 text-sm">{symptom}</span>
 </div>
))}
 </div>
 </AccordionContent>
 </AccordionItem>

 {/* Dicas para a Mãe */}
 <AccordionItem value="tips"className="border border-primary/30 rounded-lg px-3 bg-card">
 <AccordionTrigger className="hover:no-underline py-3">
 <div className="flex items-center gap-2">
 <div className="p-1.5 rounded-full bg-primary/20">
 <Info className="w-4 h-4 text-primary"/>
 </div>
 <span className="font-semibold text-foreground">
 {isPT?'Dicas para Esta Semana':'Tips for This Week'}
 </span>
 </div>
 </AccordionTrigger>
 <AccordionContent className="pb-3">
 <div className="space-y-2">
 {weekData.momTips.map((tip, index) => (
 <div key={index} className="flex items-start gap-2">
 <span className="text-primary mt-0.5 font-bold"></span>
 <span className="text-foreground/80 text-sm">{tip}</span>
 </div>
))}
 </div>
 </AccordionContent>
 </AccordionItem>

 {/* Exames Recomendados */}
 <AccordionItem value="exams"className="border border-primary/30 rounded-lg px-3 bg-card">
 <AccordionTrigger className="hover:no-underline py-3">
 <div className="flex items-center gap-2">
 <div className="p-1.5 rounded-full bg-primary/10">
 <Stethoscope className="w-4 h-4 text-foreground"/>
 </div>
 <span className="font-semibold text-foreground">
 {isPT?'Exames Recomendados':'Recommended Tests'}
 </span>
 </div>
 </AccordionTrigger>
 <AccordionContent className="pb-3">
 <div className="space-y-2">
 {weekData.exams.map((exam, index) => (
 <div key={index} className="flex items-start gap-2">
 <span className="text-foreground mt-0.5"></span>
 <span className="text-foreground/80 text-sm">{exam}</span>
 </div>
))}
 </div>
 </AccordionContent>
 </AccordionItem>

 {/* Nutrição */}
 <AccordionItem value="nutrition"className="border border-primary/30 rounded-lg px-3 bg-card">
 <AccordionTrigger className="hover:no-underline py-3">
 <div className="flex items-center gap-2">
 <div className="p-1.5 rounded-full bg-primary/20">
 <Apple className="w-4 h-4 text-primary"/>
 </div>
 <span className="font-semibold text-foreground">
 {isPT?'Nutrição e Alimentação':'Nutrition & Diet'}
 </span>
 </div>
 </AccordionTrigger>
 <AccordionContent className="pb-3">
 <div className="space-y-2">
 {weekData.nutrition.map((item, index) => (
 <div key={index} className="flex items-start gap-2">
 <span className="text-primary mt-0.5"></span>
 <span className="text-foreground/80 text-sm">{item}</span>
 </div>
))}
 </div>
 </AccordionContent>
 </AccordionItem>

 {/* Sinais de Alerta */}
 <AccordionItem value="warnings"className="border border-primary/50 rounded-lg px-3 bg-primary/5">
 <AccordionTrigger className="hover:no-underline py-3">
 <div className="flex items-center gap-2">
 <div className="p-1.5 rounded-full bg-primary/15">
 <AlertTriangle className="w-4 h-4 text-primary"/>
 </div>
 <span className="font-semibold text-primary">
 {isPT?'Sinais de Alerta - Procure o Médico':'Warning Signs - See Doctor'}
 </span>
 </div>
 </AccordionTrigger>
 <AccordionContent className="pb-3">
 <div className="space-y-2">
 {weekData.warnings.map((warning, index) => (
 <div key={index} className="flex items-start gap-2">
 <span className="text-primary mt-0.5"></span>
 <span className="text-foreground/80 text-sm">{warning}</span>
 </div>
))}
 <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-primary/50">
 <p className="text-xs text-primary font-medium">
 {isPT 
?'Em caso de qualquer sinal acima, procure atendimento médico imediatamente!':'If you experience any of the above, seek medical attention immediately!'}
 </p>
 </div>
 </div>
 </AccordionContent>
 </AccordionItem>
 </Accordion>

 {/* Toggle gráfico de crescimento */}
 <Button
 variant="outline"onClick={() => setShowGrowthChart(!showGrowthChart)}
 className="w-full bg-card border-primary/30 text-foreground hover:bg-primary/10">
 <TrendingUp className="w-4 h-4 mr-2"/>
 {showGrowthChart 
? (isPT?'Ocultar Gráfico':'Hide Chart')
: (isPT?'Ver Gráfico de Crescimento':'View Growth Chart')}
 </Button>

 {showGrowthChart && <GrowthChart />}
 </div>
 </ScrollArea>
);
};
