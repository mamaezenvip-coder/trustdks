import guideNutrition from '@/assets/guide-nutrition.jpg';
import guideHydration from '@/assets/guide-hydration.jpg';
import guideBreastfeeding from '@/assets/guide-breastfeeding.jpg';
import guideExercise from '@/assets/guide-exercise.jpg';
import guideSleep from '@/assets/guide-sleep.jpg';
import guideSelfcare from '@/assets/guide-selfcare.jpg';

export const guideImages = {
  nutrition: guideNutrition,
  hydration: guideHydration,
  breastfeeding: guideBreastfeeding,
  exercise: guideExercise,
  sleep: guideSleep,
  selfcare: guideSelfcare,
};

export type GuideImageKey = keyof typeof guideImages;

export type Recipe = {
  name: string;
  why: string;
  time: string;
  yield: string;
  ingredients: string[];
  steps: string[];
  tasting: string;
  storage: string;
};

export type GuideSection = {
  heading: string;
  items: string[];
};

export type GuideChapter = {
  id: number;
  title: string;
  subtitle: string;
  image: GuideImageKey;
  minutes: number;
  intro: string;
  sections: GuideSection[];
  tip: string;
  recipe: Recipe;
};

export const guideChapters: GuideChapter[] = [
  {
    id: 1,
    title: 'O Começo da Jornada',
    subtitle: 'Entendendo o Seu Corpo Pós-Parto',
    image: 'selfcare',
    minutes: 6,
    intro:
      'Nas primeiras semanas o seu corpo está fazendo um trabalho invisível e gigantesco: o útero volta ao tamanho original, o sangue circulante reduz, o assoalho pélvico cicatriza e os hormônios despencam. Nada disso acontece em uma semana — e nada disso é culpa sua. Este capítulo é o mapa do que está acontecendo por dentro para você parar de brigar com o espelho e começar a colaborar com a sua recuperação.',
    sections: [
      {
        heading: 'A linha do tempo real da recuperação',
        items: [
          'Dias 1 a 10: contrações uterinas (as famosas cólicas de amamentação), lóquios intensos, inchaço nas pernas por retenção de líquidos.',
          'Semanas 2 a 6: o útero volta ao tamanho pré-gravidez, o sangramento diminui e o sono ainda é fragmentado.',
          'Semanas 6 a 12: liberação médica costuma acontecer, a força do core começa a responder e o humor estabiliza aos poucos.',
          'Meses 3 a 12: remodelagem de pele, cabelo e composição corporal. É a fase mais longa e a mais ignorada.',
        ],
      },
      {
        heading: 'Sinais de alerta — procure atendimento imediato',
        items: [
          'Sangramento que encharca um absorvente por hora, por mais de 2 horas.',
          'Febre acima de 38 °C, calafrios ou dor forte em um dos seios.',
          'Dor intensa e vermelhidão em uma panturrilha (risco de trombose).',
          'Dor de cabeça forte com visão embaçada ou pressão alta (risco de pré-eclâmpsia pós-parto).',
          'Pensamentos de machucar a si mesma ou o bebê: isso é urgência, não fraqueza.',
        ],
      },
    ],
    tip: 'Escreva em um papel três coisas que o seu corpo fez hoje (gerou leite, carregou o bebê, cicatrizou). Cole no espelho do banheiro e leia toda manhã por 7 dias.',
    recipe: {
      name: 'Caldo Restaurador de Frango e Gengibre',
      why: 'Rico em colágeno, ferro e eletrólitos — feito para as duas primeiras semanas, quando mastigar já parece esforço.',
      time: '1h20 (10 min de preparo)',
      yield: '6 porções',
      ingredients: [
        '1 carcaça de frango (ou 500 g de coxa com osso)',
        '2 L de água filtrada',
        '1 cebola cortada ao meio, com casca',
        '2 cenouras em rodelas grossas',
        '2 talos de salsão',
        '1 pedaço de gengibre (3 cm) em lascas',
        '3 dentes de alho amassados',
        '1 colher de sopa de azeite',
        '1 colher de chá de sal marinho, salsinha a gosto',
      ],
      steps: [
        'Aqueça o azeite na panela e doure a cebola com o alho por 2 minutos, até perfumar.',
        'Junte o frango e sele por 4 minutos de cada lado para dar cor ao caldo.',
        'Acrescente a água, a cenoura, o salsão e o gengibre. Leve à fervura.',
        'Abaixe o fogo e cozinhe destampado por 1 hora, retirando a espuma da superfície com uma escumadeira.',
        'Desfie o frango, descarte os ossos e devolva a carne ao caldo. Ajuste o sal.',
        'Finalize com salsinha fresca fora do fogo, para preservar o aroma.',
      ],
      tasting: 'Sirva bem quente em caneca, para conseguir tomar com uma mão só enquanto segura o bebê. O primeiro gole deve ser reconfortante e levemente picante do gengibre; se estiver aguado, ferva mais 10 minutos destampado para concentrar.',
      storage: 'Geladeira por 4 dias. Congele em potes de 300 ml por até 3 meses — descongele na panela, nunca em fogo alto.',
    },
  },
  {
    id: 2,
    title: 'Nutrição Essencial',
    subtitle: 'Alimentando o Corpo e a Alma',
    image: 'nutrition',
    minutes: 8,
    intro:
      'Dieta restritiva no pós-parto é sabotagem: derruba a produção de leite, aumenta a queda de cabelo e destrói o humor. O que funciona é densidade nutricional — comer menos vezes por dia, porém pratos completos que sustentam por horas. A regra é simples: em todo prato principal deve haver proteína, carboidrato complexo, gordura boa e cor.',
    sections: [
      {
        heading: 'O prato Mamãe Zen (montagem visual)',
        items: [
          '1/2 do prato: vegetais coloridos (folhas escuras, cenoura, abóbora, beterraba).',
          '1/4 do prato: proteína — frango, peixe, ovos, carne magra, lentilha ou grão-de-bico.',
          '1/4 do prato: carboidrato complexo — arroz integral, batata-doce, quinoa, aveia, mandioca.',
          '1 colher de gordura boa: azeite, abacate, castanhas ou sementes.',
          'Ferro + vitamina C na mesma refeição (feijão com laranja, por exemplo) triplica a absorção.',
        ],
      },
      {
        heading: 'Erros que travam a recuperação',
        items: [
          'Pular o café da manhã e compensar com doce às 16h.',
          'Café em excesso no lugar de comida — cafeína mascara a fome, não repõe energia.',
          'Cortar carboidrato à noite: piora o sono e a produção de leite da madrugada.',
          'Comer sempre em pé e apressada: mastigar pouco gera gases e desconforto abdominal.',
        ],
      },
    ],
    tip: 'Domingo à noite, deixe 3 potes prontos: proteína cozida, um cereal e legumes assados. A semana inteira vira montagem, não cozinha.',
    recipe: {
      name: 'Bowl Pós-Parto de Frango, Quinoa e Abóbora',
      why: 'Cerca de 38 g de proteína, ferro, magnésio e fibra em um prato só. É a receita da foto deste capítulo.',
      time: '35 minutos',
      yield: '2 porções',
      ingredients: [
        '1 xícara de quinoa crua, lavada',
        '2 xícaras de água ou caldo de legumes',
        '2 filés de frango (300 g) em tiras',
        '2 xícaras de abóbora cabotiá em cubos',
        '1 abacate pequeno fatiado',
        '1 xícara de folhas verdes',
        '1 colher de sopa de azeite + 1 para regar',
        'Suco de 1/2 limão, páprica doce, alho em pó, sal e pimenta-do-reino',
      ],
      steps: [
        'Aqueça o forno a 200 °C. Tempere a abóbora com azeite, sal e páprica e asse por 25 minutos, virando na metade.',
        'Enquanto isso, leve a quinoa com a água ao fogo médio, tampada, por 15 minutos, até os grãos abrirem. Solte com um garfo e deixe descansar 5 minutos.',
        'Tempere o frango com alho em pó, sal e pimenta. Grelhe em frigideira bem quente por 4 minutos de cada lado, sem mexer, para formar crosta dourada.',
        'Monte o bowl em camadas: quinoa na base, abóbora e frango lado a lado, folhas na borda.',
        'Finalize com abacate, fio de azeite e suco de limão na hora de servir.',
      ],
      tasting: 'Coma morno, misturando um pouco de cada camada na garfada. O contraste é o ponto alto: quinoa soltinha, abóbora adocicada e frango suculento. Se o frango ficar seco, é sinal de frigideira pouco quente e tempo demais — reduza para 3 minutos por lado.',
      storage: 'Guarde os componentes separados na geladeira por 3 dias e monte na hora. Abacate e limão sempre no momento de comer.',
    },
  },
  {
    id: 3,
    title: 'Hidratação',
    subtitle: 'O Elemento Essencial',
    image: 'hydration',
    minutes: 5,
    intro:
      'O leite materno é cerca de 88% água. Se você amamenta, a necessidade sobe para algo em torno de 3 a 3,5 litros por dia entre líquidos e alimentos. Desidratação leve já causa dor de cabeça, prisão de ventre, cansaço extremo e queda na produção de leite — sintomas que quase toda mãe atribui só ao sono ruim.',
    sections: [
      {
        heading: 'Sistema prático para não esquecer',
        items: [
          'Garrafa de 1 litro: encha 3 vezes ao dia e a meta está cumprida.',
          'Um copo cheio em cada mamada — deixe a garrafa na poltrona de amamentar.',
          'Cor do xixi como termômetro: amarelo-claro está ótimo, escuro é alerta.',
          'Frutas com muita água contam: melancia, melão, laranja, morango, pepino.',
          'Álcool e excesso de cafeína desidratam; para cada café, um copo de água.',
        ],
      },
      {
        heading: 'Quando água pura não basta',
        items: [
          'Calor intenso, febre, diarreia ou vômito pedem reposição de sais minerais.',
          'Água de coco natural é a reposição mais simples de eletrólitos.',
          'Soro caseiro (1 L de água, 1 colher de chá de sal, 1 colher de sopa de açúcar) em casos de desidratação leve.',
        ],
      },
    ],
    tip: 'Deixe uma garrafa cheia em cada ambiente que você mais usa: quarto, sala e cozinha. Visibilidade vence disciplina.',
    recipe: {
      name: 'Água Aromatizada de Limão, Frutas Vermelhas e Hortelã',
      why: 'Hidrata sem açúcar, tem antioxidantes e resolve o problema de quem "não gosta de água pura".',
      time: '10 min + 2 h de infusão',
      yield: '1,5 litro',
      ingredients: [
        '1,5 L de água filtrada bem gelada',
        '1 limão-siciliano em rodelas finas',
        '1 xícara de frutas vermelhas (morango, framboesa, amora)',
        '10 folhas de hortelã fresca',
        'Gelo a gosto',
      ],
      steps: [
        'Lave as frutas e a hortelã em água corrente e seque delicadamente.',
        'Amasse levemente as frutas com um garfo — só o suficiente para liberar o suco, sem virar purê.',
        'Bata as folhas de hortelã entre as palmas das mãos antes de colocar na jarra: isso libera os óleos essenciais.',
        'Monte camadas na jarra: frutas, limão, hortelã e por último a água gelada.',
        'Leve à geladeira por no mínimo 2 horas (ideal: 4 horas) para a infusão pegar sabor.',
      ],
      tasting: 'Sirva bem gelada, com uma rodela de limão no copo. Deve estar refrescante e levemente adocicada pelas frutas — se ficar amarga, o limão passou de 12 horas na jarra: retire as rodelas ao completar esse tempo.',
      storage: 'Geladeira por até 24 horas. Depois disso, coe as frutas e beba a água no mesmo dia.',
    },
  },
  {
    id: 4,
    title: 'O Poder da Amamentação',
    subtitle: 'Para Quem Escolhe Amamentar',
    image: 'breastfeeding',
    minutes: 8,
    intro:
      'Amamentar gasta entre 300 e 500 calorias por dia, mas não é uma dieta mágica: algumas mulheres emagrecem, outras seguram peso justamente para sustentar a produção. Este capítulo é sobre pega correta, prevenção de fissuras e o que realmente aumenta o leite — sem culpa para quem complementa ou usa fórmula.',
    sections: [
      {
        heading: 'Pega correta em 5 checagens',
        items: [
          'Boca bem aberta, abocanhando aréola e não só o bico.',
          'Lábio inferior virado para fora, queixo encostado no seio.',
          'Bochechas arredondadas — covinha significa pega errada.',
          'Som de deglutição ritmado, sem estalos.',
          'Não dói. Dor persistente é sinal para corrigir a pega ou procurar uma consultora de amamentação.',
        ],
      },
      {
        heading: 'O que ajuda de verdade na produção',
        items: [
          'Esvaziar bem a mama: oferta e demanda é a única regra fisiológica.',
          'Mamadas noturnas — a prolactina é mais alta de madrugada.',
          'Água e comida suficientes; nenhum chá substitui isso.',
          'Descanso possível: cortisol alto derruba a ejeção do leite.',
          'Ingurgitamento com dor e febre pode ser mastite: procure atendimento.',
        ],
      },
    ],
    tip: 'Monte um "kit de amamentação" na poltrona: garrafa de água, lanche de uma mão só, carregador, pomada de lanolina e um pano limpo.',
    recipe: {
      name: 'Cookies de Aveia, Linhaça e Castanha (Lanche da Madrugada)',
      why: 'Aveia, linhaça e gorduras boas em um lanche que se come com uma mão só, às 3 da manhã, sem sujar nada.',
      time: '30 minutos',
      yield: '18 cookies',
      ingredients: [
        '2 xícaras de aveia em flocos',
        '1 xícara de farinha de aveia (bata os flocos no liquidificador)',
        '3 colheres de sopa de linhaça dourada moída',
        '1/2 xícara de açúcar mascavo ou 1/3 de xícara de melado',
        '1/2 xícara de pasta de amendoim integral',
        '2 bananas maduras amassadas',
        '1/3 de xícara de castanhas picadas',
        '1 colher de chá de canela, 1 pitada de sal, 1 colher de chá de fermento',
      ],
      steps: [
        'Aqueça o forno a 180 °C e forre uma assadeira com papel-manteiga.',
        'Em uma tigela, misture os secos: aveia, farinha de aveia, linhaça, canela, sal e fermento.',
        'Em outra tigela, misture banana amassada, pasta de amendoim e açúcar mascavo até virar um creme homogêneo.',
        'Una as duas misturas com uma espátula, sem bater demais. Junte as castanhas.',
        'Faça bolinhas com uma colher de sopa, achate levemente e distribua com 3 cm de distância.',
        'Asse por 14 a 16 minutos, até as bordas dourarem. O centro sai macio e firma ao esfriar.',
      ],
      tasting: 'Espere 10 minutos antes de provar: quente, ele desmancha. O ponto certo é borda crocante e miolo úmido, com a canela aparecendo no final. Ótimo com o caldo do capítulo 1 ou com leite morno.',
      storage: 'Pote fechado por 5 dias, ou congelados por 2 meses — descongelam em 20 minutos fora da geladeira.',
    },
  },
  {
    id: 5,
    title: 'O Timing é Tudo',
    subtitle: 'Quando Começar os Exercícios',
    image: 'exercise',
    minutes: 6,
    intro:
      'Voltar cedo demais custa caro: incontinência, prolapso e diástase que não fecha. A liberação médica é obrigatória — em geral 6 semanas no parto vaginal e 8 a 12 semanas na cesárea. Mas isso não significa ficar parada: respiração e caminhada leve começam já nos primeiros dias, com autorização.',
    sections: [
      {
        heading: 'Progressão segura por fase',
        items: [
          'Semanas 0 a 2: respiração diafragmática, caminhadas curtas dentro de casa, postura ao amamentar.',
          'Semanas 2 a 6: caminhadas de 10 a 20 minutos, Kegel suave, alongamento de peitoral e lombar.',
          'Após liberação: ativação de transverso, ponte, agachamento com peso do corpo, remada elástica.',
          'A partir de 12 semanas: carga progressiva, impacto só quando não houver perda de urina.',
        ],
      },
      {
        heading: 'Sinais de que você acelerou demais',
        items: [
          'Perda de urina ao tossir, espirrar ou saltar.',
          'Sensação de peso ou bola na vagina.',
          'Abaulamento em formato de cone na linha do abdômen durante o esforço.',
          'Aumento do sangramento após o treino.',
        ],
      },
    ],
    tip: 'Antes de qualquer exercício: solte o ar pela boca ao fazer o esforço. Prender a respiração empurra tudo contra o assoalho pélvico.',
    recipe: {
      name: 'Smoothie Verde Pré-Caminhada',
      why: 'Energia de liberação lenta com proteína — evita a tontura de treinar em jejum na fase de sono ruim.',
      time: '5 minutos',
      yield: '1 copo grande (400 ml)',
      ingredients: [
        '1 banana congelada em rodelas',
        '1 xícara cheia de espinafre fresco',
        '1 colher de sopa de pasta de amendoim',
        '1 colher de sopa de aveia',
        '1 colher de chá de chia',
        '250 ml de leite (ou bebida vegetal)',
        'Opcional: 1 scoop de proteína neutra',
      ],
      steps: [
        'Coloque primeiro o líquido no liquidificador — isso evita que a lâmina trave.',
        'Adicione espinafre e bata 20 segundos, até não restar pedaço de folha.',
        'Junte banana, aveia, chia e pasta de amendoim e bata mais 40 segundos, em velocidade alta.',
        'Prove: se estiver grosso demais, acrescente 50 ml de líquido e pulse 5 segundos.',
      ],
      tasting: 'Beba em até 10 minutos, antes que a chia engrosse a mistura. A textura ideal é aveludada, doce apenas da banana, com o amendoim fechando o gole. Tome 30 minutos antes de caminhar.',
      storage: 'Não guarde pronto. Deixe os sólidos porcionados em saquinhos no congelador e bata na hora.',
    },
  },
  {
    id: 6,
    title: 'Exercícios Seguros',
    subtitle: 'Fortalecendo o Pós-Parto',
    image: 'exercise',
    minutes: 9,
    intro:
      'O core não é abdômen: é um cilindro formado por diafragma (topo), transverso (frente e laterais), multífidos (costas) e assoalho pélvico (base). Reconstruir essa unidade é o que devolve firmeza à barriga, tira a dor lombar e sustenta o corpo que carrega bebê o dia inteiro.',
    sections: [
      {
        heading: 'Treino base — 15 minutos, 4x por semana',
        items: [
          'Respiração 360°: 2 minutos. Inspire expandindo as costelas, expire fechando e ativando o assoalho.',
          'Ativação de transverso: 3 séries de 10, mantendo 5 segundos cada contração.',
          'Ponte de glúteo: 3 séries de 12, subindo na expiração.',
          'Dead bug adaptado: 3 séries de 8 por lado, lombar colada no chão.',
          'Prancha nos joelhos: 3 séries de 20 segundos, sem deixar o quadril cair.',
          'Agachamento no peso do corpo: 3 séries de 12, joelhos alinhados aos pés.',
        ],
      },
      {
        heading: 'Evite nesta fase',
        items: [
          'Abdominal tradicional, canivete e elevação de pernas deitada.',
          'Corrida e saltos antes de resolver perdas urinárias.',
          'Prancha completa com abaulamento visível no abdômen.',
          'Levantar peso prendendo a respiração.',
        ],
      },
    ],
    tip: 'Faça o treino no chão da sala com o bebê no tapete ao lado; sorria para ele nas pausas — a sessão vira brincadeira e você não falta.',
    recipe: {
      name: 'Panqueca Proteica de Banana e Aveia (Pós-Treino)',
      why: 'Proteína e carboidrato na janela pós-treino, pronta em menos tempo do que o bebê leva para acordar.',
      time: '12 minutos',
      yield: '4 panquecas pequenas',
      ingredients: [
        '1 banana madura',
        '2 ovos',
        '4 colheres de sopa de aveia em flocos finos',
        '1 colher de chá de fermento em pó',
        '1 pitada de canela e de sal',
        '1 colher de chá de óleo de coco para untar',
        'Para servir: iogurte natural e frutas vermelhas',
      ],
      steps: [
        'Amasse bem a banana com um garfo até virar purê sem pedaços.',
        'Bata os ovos com a banana, junte a aveia, o fermento, a canela e o sal. Deixe a massa descansar 3 minutos para a aveia hidratar.',
        'Aqueça a frigideira antiaderente em fogo médio-baixo e unte com óleo de coco.',
        'Despeje uma concha pequena e espere as bolhas aparecerem na superfície (cerca de 2 minutos) antes de virar.',
        'Doure o outro lado por 1 minuto e repita com o restante da massa.',
      ],
      tasting: 'Sirva imediatamente, empilhada, com iogurte por cima e frutas vermelhas. Deve ser fofinha e úmida por dentro; se ficar borrachuda, o fogo estava alto demais. A canela aparece no fim de cada garfada.',
      storage: 'Consuma no dia. A massa crua não guarda — o fermento perde efeito em 30 minutos.',
    },
  },
  {
    id: 7,
    title: 'Diástase dos Retos',
    subtitle: 'Entenda e Recupere',
    image: 'exercise',
    minutes: 7,
    intro:
      'A diástase é o afastamento dos músculos retos abdominais pela distensão da linha alba. Ela acontece em praticamente toda gestação a termo — o problema não é o afastamento em si, e sim a linha alba que não gera tensão. Por isso o objetivo não é "fechar o buraco", e sim recuperar a firmeza do tecido.',
    sections: [
      {
        heading: 'Autoteste (faça pela manhã, deitada)',
        items: [
          'Deite de costas com os joelhos dobrados e os pés no chão.',
          'Coloque os dedos na horizontal logo acima do umbigo.',
          'Levante apenas a cabeça e os ombros, alguns centímetros.',
          'Meça a largura: até 2 dedos é esperado. Acima disso, avalie com um fisioterapeuta pélvico.',
          'Sinta também a profundidade: se os dedos afundam sem resistência, falta tensão — esse é o dado importante.',
        ],
      },
      {
        heading: 'Protocolo de reconexão (diário, 10 minutos)',
        items: [
          'Respiração diafragmática deitada: 10 ciclos lentos.',
          'Ativação de transverso com expiração sonora ("shhh"): 3 séries de 10.',
          'Elevação de pelve com apoio total dos pés: 3 séries de 10.',
          'Deslizamento de calcanhar, uma perna por vez: 3 séries de 8.',
          'Postura no dia a dia: costelas empilhadas sobre a pelve, sem empinar o bumbum.',
        ],
      },
    ],
    tip: 'Ao levantar da cama, role para o lado e use os braços. Sentar direto da posição deitada é o gesto que mais agrava a diástase.',
    recipe: {
      name: 'Sopa Cremosa de Abóbora, Lentilha e Cúrcuma',
      why: 'Proteína vegetal, fibra e cúrcuma anti-inflamatória, com textura leve que não estufa o abdômen.',
      time: '40 minutos',
      yield: '4 porções',
      ingredients: [
        '500 g de abóbora cabotiá em cubos',
        '1 xícara de lentilha vermelha lavada',
        '1 cebola picada e 2 dentes de alho',
        '1 colher de chá de cúrcuma e 1/2 de cominho',
        '1,2 L de caldo de legumes',
        '1 colher de sopa de azeite',
        'Sal, pimenta-do-reino e sementes de abóbora para finalizar',
      ],
      steps: [
        'Refogue a cebola no azeite até ficar translúcida, cerca de 4 minutos. Junte o alho e as especiarias e mexa por 30 segundos para tostar levemente.',
        'Adicione a abóbora e a lentilha, misturando para envolver no refogado.',
        'Cubra com o caldo e cozinhe em fogo médio por 25 minutos, até a abóbora desmanchar ao toque da colher.',
        'Bata com mixer até obter creme liso. Se estiver grossa, ajuste com caldo quente.',
        'Ajuste sal e pimenta e cozinhe mais 2 minutos para os sabores se assentarem.',
      ],
      tasting: 'Sirva em prato fundo com sementes de abóbora tostadas e um fio de azeite. A textura deve ser aveludada, nunca aguada; o cominho aparece no aroma e a cúrcuma deixa o retrogosto terroso e quente.',
      storage: 'Geladeira por 4 dias, congelador por 3 meses. Reaqueça em fogo baixo mexendo sempre.',
    },
  },
  {
    id: 8,
    title: 'Durma Bem',
    subtitle: 'A Importância do Descanso',
    image: 'sleep',
    minutes: 7,
    intro:
      'Dormir mal desregula grelina e leptina — os hormônios da fome e da saciedade — e aumenta o cortisol. Resultado: mais vontade de doce, menos saciedade e mais gordura abdominal. Você não vai dormir 8 horas seguidas agora, mas dá para aumentar muito a qualidade do sono possível.',
    sections: [
      {
        heading: 'Protocolo do sono fragmentado',
        items: [
          'Durma no primeiro cochilo do bebê, não no terceiro — o primeiro é o mais profundo do dia.',
          'Quarto escuro de verdade: cortina blackout e nenhuma luz branca à noite.',
          'Luz âmbar ou vermelha para as mamadas da madrugada; luz branca corta a melatonina.',
          'Celular fora da cama. Se usar durante a mamada, ative o modo noturno com brilho mínimo.',
          'Divida a noite com o parceiro em blocos: 4 horas protegidas para cada um valem mais que 8 picadas.',
        ],
      },
      {
        heading: 'Ritual de 20 minutos antes de deitar',
        items: [
          'Banho morno — a queda de temperatura depois do banho induz o sono.',
          'Chá sem cafeína (camomila, melissa, erva-cidreira).',
          'Alongamento leve de pescoço e ombros, tensionados pela amamentação.',
          'Anotar em duas linhas o que ficou pendente, para o cérebro parar de repetir a lista.',
        ],
      },
    ],
    tip: 'Se em 20 minutos o sono não vier, levante, faça algo monótono com luz baixa e volte. Ficar na cama ansiosa ensina o cérebro a associar cama com angústia.',
    recipe: {
      name: 'Leite Dourado da Noite (Golden Milk)',
      why: 'Cúrcuma anti-inflamatória, triptofano do leite e magnésio — sem cafeína, seguro na amamentação.',
      time: '8 minutos',
      yield: '1 caneca (250 ml)',
      ingredients: [
        '250 ml de leite integral ou bebida vegetal (aveia funciona muito bem)',
        '1/2 colher de chá de cúrcuma em pó',
        '1 pitada generosa de canela',
        '1 pitada mínima de pimenta-do-reino (ativa a curcumina)',
        '1 colher de chá de mel ou melado',
        'Opcional: 1 lasca de gengibre',
      ],
      steps: [
        'Leve o leite ao fogo baixo com a cúrcuma, a canela, a pimenta e o gengibre.',
        'Aqueça mexendo sempre por 5 minutos, sem deixar ferver — fervura amarga a cúrcuma.',
        'Desligue o fogo, retire o gengibre e bata com um fouet por 20 segundos para criar espuma.',
        'Adoce com mel só depois de sair do fogo, para preservar as propriedades.',
      ],
      tasting: 'Beba morno, em goles lentos, 40 minutos antes de deitar. O sabor é adocicado e terroso, com um calor discreto da pimenta no final da garganta. Se sentir arenoso, coe antes de servir.',
      storage: 'Prepare na hora. A mistura seca de especiarias pode ficar pronta em um potinho para 10 doses.',
    },
  },
  {
    id: 9,
    title: 'Gerenciando o Estresse',
    subtitle: 'Cuidando das Emoções',
    image: 'selfcare',
    minutes: 8,
    intro:
      'Cortisol cronicamente alto favorece o acúmulo de gordura abdominal, aumenta a compulsão por açúcar e prejudica a cicatrização. Baby blues nas duas primeiras semanas é comum. Tristeza profunda, ansiedade intensa ou desinteresse que passam de 14 dias podem ser depressão pós-parto — e isso tem tratamento.',
    sections: [
      {
        heading: 'Ferramentas de regulação em minutos',
        items: [
          'Respiração 4-7-8: inspire em 4, segure 7, solte em 8. Cinco ciclos derrubam a frequência cardíaca.',
          'Sair de casa por 10 minutos: luz natural regula humor e sono.',
          'Nomear a emoção em voz alta ("estou sobrecarregada") reduz a ativação da amígdala.',
          'Contato físico: pele a pele com o bebê libera ocitocina em ambos.',
          'Cortar rolagem infinita de redes sociais — comparação é gatilho direto de culpa materna.',
        ],
      },
      {
        heading: 'Peça ajuda de forma específica',
        items: [
          '"Você pode lavar a louça agora?" funciona; "preciso de ajuda" costuma não gerar ação.',
          'Escale tarefas invisíveis: consultas, farmácia, mercado, lavanderia.',
          'Converse com o pediatra ou o obstetra sobre o seu humor — eles também cuidam de você.',
          'Se houver pensamento de morte ou de machucar alguém, procure atendimento imediato (CVV 188, 24 h).',
        ],
      },
    ],
    tip: 'Reserve 15 minutos por dia sem bebê, sem celular e sem tarefa. Não é luxo: é manutenção do sistema nervoso.',
    recipe: {
      name: 'Chá Calmante de Camomila, Melissa e Maçã',
      why: 'Apaziguante, sem cafeína e compatível com a amamentação — o ritual conta tanto quanto a bebida.',
      time: '12 minutos',
      yield: '2 xícaras',
      ingredients: [
        '500 ml de água',
        '1 colher de sopa de flores de camomila secas',
        '1 colher de sopa de melissa (erva-cidreira)',
        '1/2 maçã em fatias finas, com casca',
        '1 pau de canela',
        'Mel a gosto',
      ],
      steps: [
        'Ferva a água com a maçã e a canela por 5 minutos, para extrair o doce natural da fruta.',
        'Desligue o fogo e só então acrescente a camomila e a melissa — flores fervidas perdem os óleos essenciais.',
        'Tampe e deixe em infusão por 5 minutos exatos; mais tempo deixa amargo.',
        'Coe, adoce com mel se quiser e sirva.',
      ],
      tasting: 'Beba em uma caneca que você goste, sentada, sem tela por perto. O aroma de maçã com canela chega antes do sabor; o gole final deve ser suave e floral, nunca adstringente.',
      storage: 'Geladeira por 24 horas — fica ótimo gelado com gelo e limão nos dias quentes.',
    },
  },
  {
    id: 10,
    title: 'Criando uma Rotina',
    subtitle: 'Sustentável com um Bebê',
    image: 'nutrition',
    minutes: 7,
    intro:
      'Rotina com bebê não é horário fixo: é sequência previsível. O bebê não sabe que são 9h, mas reconhece a ordem "acorda, mama, brinca, dorme". A sua rotina se encaixa nessa sequência — e não o contrário.',
    sections: [
      {
        heading: 'Ciclo EASY adaptado',
        items: [
          'E (Eat): mamada logo ao acordar, não para dormir.',
          'A (Activity): tempo de barriga para baixo, banho de sol, conversa.',
          'S (Sleep): janela de sono respeitada evita o bebê hiperestimulado.',
          'Y (You): o tempo do sono dele é seu — escolha UMA coisa: dormir, comer ou banho.',
        ],
      },
      {
        heading: 'Regras de ouro da mãe realista',
        items: [
          'Três prioridades por dia, no máximo. O resto é bônus.',
          'Prepare o terreno na noite anterior: roupa, mamadeira, lanche, bolsa.',
          'Agrupe tarefas parecidas (todos os telefonemas juntos, todas as contas juntas).',
          'Casa arrumada não é meta de puerpério. Casa segura é.',
        ],
      },
    ],
    tip: 'Escreva a rotina em um quadro visível para quem ajudar em casa. Assim ninguém precisa perguntar — e você para de ser a central de informações.',
    recipe: {
      name: 'Overnight Oats de Preparo Semanal',
      why: 'Café da manhã completo pronto na geladeira: zero preparo na manhã caótica.',
      time: '10 minutos + noite na geladeira',
      yield: '4 potes',
      ingredients: [
        '2 xícaras de aveia em flocos',
        '2 colheres de sopa de chia',
        '500 ml de leite ou bebida vegetal',
        '4 colheres de sopa de iogurte natural',
        '2 colheres de sopa de mel ou melado',
        'Frutas picadas: banana, morango, manga',
        'Castanhas e coco em lascas para finalizar',
      ],
      steps: [
        'Separe 4 potes de vidro com tampa (300 ml cada).',
        'Em cada pote, coloque 1/2 xícara de aveia, 1/2 colher de chá de chia, 125 ml de leite e 1 colher de iogurte.',
        'Adoce com 1/2 colher de mel e misture bem com uma colher, raspando o fundo.',
        'Feche e leve à geladeira por no mínimo 6 horas (a noite toda é o ideal).',
        'Na hora de comer, acrescente as frutas frescas e as castanhas por cima.',
      ],
      tasting: 'A textura certa é cremosa, tipo mingau frio — a chia deve estar hidratada e sem grumos. Coma direto do pote com uma mão, enquanto embala o bebê com a outra. Se ficar seco, acrescente um pouco de leite e espere 2 minutos.',
      storage: 'Geladeira por 4 dias. Frutas só na hora, para não soltar água.',
    },
  },
  {
    id: 11,
    title: 'Além da Balança',
    subtitle: 'Desapegando dos Números',
    image: 'selfcare',
    minutes: 6,
    intro:
      'O peso oscila 1 a 2 kg no mesmo dia por líquidos, volume de leite, intestino e ciclo hormonal. Usar a balança como único termômetro no pós-parto é medir a maré para avaliar o oceano. Existem indicadores muito mais úteis.',
    sections: [
      {
        heading: 'Métricas que valem mais',
        items: [
          'Medidas de cintura, quadril e coxa a cada 4 semanas, sempre pela manhã.',
          'Como a roupa veste — a mesma calça é o melhor teste de composição corporal.',
          'Fotos de progresso mensais, mesma luz, mesma roupa, mesmo ângulo.',
          'Energia ao longo do dia e qualidade do sono.',
          'Força: quantas repetições você faz hoje comparado a um mês atrás.',
          'Ausência de dor lombar e de perdas urinárias.',
        ],
      },
      {
        heading: 'Se for pesar, faça direito',
        items: [
          'Uma vez por semana, no mesmo dia, em jejum e após o banheiro.',
          'Antes da mamada, nunca depois.',
          'Olhe a média do mês, não o número do dia.',
        ],
      },
    ],
    tip: 'Guarde a balança por 30 dias e acompanhe só medidas e fotos. Quase toda mãe relata queda imediata de ansiedade.',
    recipe: {
      name: 'Salada Morna de Grão-de-Bico e Batata-Doce',
      why: 'Saciedade real com fibra e proteína vegetal — a receita que prova que comida "de dieta" pode ser gostosa.',
      time: '35 minutos',
      yield: '3 porções',
      ingredients: [
        '2 batatas-doces médias em cubos',
        '1 lata (ou 2 xícaras) de grão-de-bico cozido e escorrido',
        '1 colher de sopa de azeite + 1 para o molho',
        '1 colher de chá de páprica defumada e 1/2 de cominho',
        '2 xícaras de rúcula ou espinafre',
        '1/2 cebola-roxa em fatias finas',
        'Molho: 2 colheres de iogurte natural, suco de 1/2 limão, 1 dente de alho ralado, sal',
      ],
      steps: [
        'Aqueça o forno a 210 °C. Tempere a batata-doce e o grão-de-bico com azeite, páprica, cominho e sal.',
        'Espalhe em assadeira grande sem sobrepor — amontoado cozinha no vapor e não doura.',
        'Asse por 25 minutos, mexendo aos 15, até o grão-de-bico ficar crocante e a batata macia por dentro.',
        'Misture os ingredientes do molho em um potinho até ficar liso.',
        'Monte sobre as folhas ainda morno, junte a cebola-roxa e regue com o molho na hora de servir.',
      ],
      tasting: 'Coma morna: as folhas murcham levemente e absorvem o molho. O contraste entre grão crocante, batata adocicada e molho cítrico é o coração do prato. Se o grão não crocar, faltou secar bem antes de temperar.',
      storage: 'Guarde assados e molho separados por 3 dias. Reaqueça no forno, nunca no micro-ondas, para manter a crocância.',
    },
  },
  {
    id: 12,
    title: 'Superando Obstáculos',
    subtitle: 'Fadiga, Tempo e Motivação',
    image: 'exercise',
    minutes: 6,
    intro:
      'Motivação é consequência, não causa. Quem espera vontade para começar não começa nunca no puerpério. A estratégia é reduzir o tamanho da tarefa até que ela caiba no seu pior dia.',
    sections: [
      {
        heading: 'Do obstáculo à solução',
        items: [
          'Fadiga extrema: troque o treino de 30 min por 3 blocos de 7 min ao longo do dia.',
          'Falta de tempo: use o "hábito âncora" — Kegel toda vez que amamentar, alongar toda vez que esperar a mamadeira.',
          'Sem motivação: comprometa-se com 5 minutos. Terminar é opcional; começar não.',
          'Culpa: cuidar de você é cuidar de quem cuida do bebê.',
          'Recaída alimentar: a refeição seguinte volta ao plano. Um dia não desfaz um mês.',
        ],
      },
      {
        heading: 'Sistema de consistência',
        items: [
          'Regra do "nunca duas seguidas": pode falhar um dia, nunca dois.',
          'Marque um X no calendário a cada dia cumprido — a corrente visual sustenta o hábito.',
          'Meça o mês, não o dia. 18 dias de 30 já é uma transformação.',
        ],
      },
    ],
    tip: 'Deixe o tênis e o tapete à vista. Fricção baixa é o que decide quando você está exausta.',
    recipe: {
      name: 'Energy Balls de Tâmara, Cacau e Castanha',
      why: 'Lanche de emergência para o momento da fissura por doce — 5 ingredientes, sem forno.',
      time: '15 minutos',
      yield: '16 bolinhas',
      ingredients: [
        '1 xícara de tâmaras sem caroço (deixe 10 min em água morna se estiverem secas)',
        '1 xícara de castanha-de-caju ou amêndoas',
        '3 colheres de sopa de cacau em pó 100%',
        '2 colheres de sopa de aveia',
        '1 pitada de sal e coco ralado para envolver',
      ],
      steps: [
        'Bata as castanhas no processador por 20 segundos, até virarem farofa grossa — não deixe virar pasta.',
        'Acrescente as tâmaras escorridas, o cacau, a aveia e o sal. Processe por 1 minuto, até a massa começar a formar uma bola.',
        'Teste o ponto: aperte um pouco na mão; se desmanchar, junte 1 tâmara e processe de novo.',
        'Modele bolinhas do tamanho de uma noz com as mãos levemente umedecidas.',
        'Passe no coco ralado e leve à geladeira por 30 minutos para firmar.',
      ],
      tasting: 'Coma gelada, uma de cada vez, mastigando devagar — o cacau amargo equilibra o doce da tâmara e mata a vontade de açúcar com duas unidades. Se estiver muito doce, aumente o cacau para 4 colheres na próxima vez.',
      storage: 'Pote fechado na geladeira por 2 semanas; congelador por 3 meses.',
    },
  },
  {
    id: 13,
    title: 'A Força da Comunidade',
    subtitle: 'Buscar Apoio',
    image: 'nutrition',
    minutes: 5,
    intro:
      'Maternidade solitária adoece. Historicamente, mulheres pariam cercadas de outras mulheres — hoje, muitas passam o dia inteiro sozinhas com um recém-nascido. Construir rede não é fraqueza, é biologia social.',
    sections: [
      {
        heading: 'Como construir a sua rede',
        items: [
          'Parceiro: combine tarefas por escrito, não por suposição.',
          'Família e amigos: quando perguntarem "precisa de algo?", tenha uma lista pronta.',
          'Profissionais: pediatra, obstetra, consultora de amamentação, fisioterapeuta pélvica, nutricionista.',
          'Grupos de mães da mesma fase — presenciais quando possível.',
          'Especialistas do app Mamãe Zen: suporte 24 h para dúvidas que aparecem de madrugada.',
        ],
      },
      {
        heading: 'Aprenda a dizer não',
        items: [
          'Visitas com hora marcada e curtas nas primeiras semanas.',
          'Quem visita ajuda: lava uma louça, traz comida ou segura o bebê enquanto você toma banho.',
          'Palpite não solicitado: "obrigada, vou conversar com a pediatra" encerra o assunto.',
        ],
      },
    ],
    tip: 'Combine com duas amigas um rodízio de comida congelada uma vez por mês. Custa pouco e resolve semanas inteiras.',
    recipe: {
      name: 'Escondidinho de Frango com Mandioca (Para Congelar e Dividir)',
      why: 'Prato completo para presentear ou estocar — a receita que a sua rede pode fazer por você.',
      time: '50 minutos',
      yield: '6 porções',
      ingredients: [
        '1 kg de mandioca descascada em pedaços',
        '600 g de peito de frango cozido e desfiado',
        '1 cebola e 2 dentes de alho picados',
        '2 tomates sem semente picados',
        '200 ml de leite quente e 1 colher de sopa de manteiga',
        '2 colheres de sopa de azeite, cheiro-verde, sal e pimenta',
        '100 g de queijo muçarela ralado (opcional)',
      ],
      steps: [
        'Cozinhe a mandioca em água com sal por 25 minutos, até desmanchar ao toque do garfo. Escorra e retire os fiapos centrais.',
        'Amasse ainda quente com a manteiga e o leite quente, até virar um purê liso e cremoso.',
        'Refogue cebola e alho no azeite, junte o tomate e cozinhe 5 minutos, até formar um molho encorpado.',
        'Acrescente o frango desfiado, ajuste o sal, cozinhe 5 minutos e finalize com cheiro-verde.',
        'Monte em refratário: frango no fundo, purê por cima, alisando com as costas da colher. Cubra com queijo, se usar.',
        'Leve ao forno a 200 °C por 20 minutos, até gratinar a superfície.',
      ],
      tasting: 'Deixe descansar 10 minutos antes de servir — assim a colherada sai inteira, com a camada de purê dourada por cima e o recheio úmido embaixo. Cada garfada deve ter as duas camadas.',
      storage: 'Monte em marmitas individuais e congele sem assar por até 3 meses. Asse direto do congelador a 180 °C por 45 minutos.',
    },
  },
  {
    id: 14,
    title: 'Celebrando o Corpo',
    subtitle: 'Autocuidado e Autoaceitação',
    image: 'selfcare',
    minutes: 6,
    intro:
      'Estrias, cicatriz de cesárea, barriga mais mole, seios diferentes: seu corpo mudou porque fez algo extraordinário. Aceitar não significa desistir de cuidar — significa cuidar por afeto, e não por punição. Corpo tratado como inimigo não colabora.',
    sections: [
      {
        heading: 'Prática diária de reconexão',
        items: [
          'Hidrate a pele com atenção plena por 3 minutos, sentindo o toque em vez de avaliar a aparência.',
          'Troque "preciso perder isso" por "preciso fortalecer isso".',
          'Use roupas do tamanho de agora. Roupa apertada é lembrete diário de inadequação.',
          'Cicatriz de cesárea: massagem circular suave após a cicatrização completa, com liberação médica.',
          'Silencie perfis que te fazem sentir menos. Curadoria de feed é autocuidado.',
        ],
      },
      {
        heading: 'Autocuidado que cabe na vida real',
        items: [
          'Banho de 10 minutos com a porta fechada, sem pressa.',
          'Um hobby de 20 minutos por semana que não envolva a maternidade.',
          'Contato social adulto — mesmo que por chamada de vídeo.',
          'Terapia, quando possível: é manutenção, não emergência.',
        ],
      },
    ],
    tip: 'Grave um áudio de 1 minuto para você mesma daqui a 6 meses, contando o que está sendo difícil hoje. Ouvir depois é a melhor medida de progresso.',
    recipe: {
      name: 'Mousse de Chocolate 70% com Abacate',
      why: 'Sobremesa cremosa com gordura boa e magnésio — prazer sem culpa, em 10 minutos.',
      time: '10 min + 1 h de geladeira',
      yield: '4 taças pequenas',
      ingredients: [
        '2 abacates maduros (polpa bem escura e macia)',
        '100 g de chocolate 70% derretido',
        '3 colheres de sopa de cacau em pó',
        '4 colheres de sopa de mel ou melado',
        '3 colheres de sopa de leite',
        '1 pitada de sal e 1/2 colher de chá de essência de baunilha',
        'Raspas de chocolate e frutas vermelhas para servir',
      ],
      steps: [
        'Derreta o chocolate em banho-maria ou no micro-ondas em intervalos de 20 segundos, mexendo entre eles.',
        'Bata a polpa do abacate no processador por 1 minuto, até ficar completamente lisa — qualquer pedaço aparece no resultado final.',
        'Junte cacau, mel, leite, baunilha e sal e bata mais 30 segundos.',
        'Adicione o chocolate derretido morno (não quente) e bata até a mistura ficar brilhante e uniforme.',
        'Distribua em taças, cubra com filme encostado na superfície e leve à geladeira por 1 hora.',
      ],
      tasting: 'Sirva gelada, com raspas de chocolate e frutas vermelhas. A textura é sedosa, quase de ganache, e o abacate desaparece por completo no sabor. Coma devagar, com colher pequena: uma taça satisfaz. Se sentir gosto de abacate, faltou cacau ou o fruto estava verde.',
      storage: 'Geladeira por 2 dias, sempre com filme encostado para não escurecer.',
    },
  },
  {
    id: 15,
    title: 'Mantenha o Foco',
    subtitle: 'Sustentabilidade a Longo Prazo',
    image: 'nutrition',
    minutes: 7,
    intro:
      'Você chegou ao fim do guia — e ao começo da parte que importa: transformar o que leu em rotina. Nada aqui foi feito para durar 30 dias. Foi feito para caber na sua vida pelos próximos anos, com bebê, com criança e com você inteira.',
    sections: [
      {
        heading: 'Seu plano dos próximos 90 dias',
        items: [
          'Dias 1 a 30: hidratação, sono possível e o treino base 3x por semana.',
          'Dias 31 a 60: acrescente carga aos exercícios e organize o preparo semanal de comida.',
          'Dias 61 a 90: revise medidas e fotos, ajuste o que não coube na rotina e mantenha só o que funciona.',
          'Revisão mensal de 15 minutos: o que manteve, o que travou, o que muda.',
        ],
      },
      {
        heading: 'Princípios que sustentam tudo',
        items: [
          'Consistência imperfeita vence perfeição intermitente.',
          'Hábito pequeno feito hoje vale mais que plano perfeito para segunda-feira.',
          'Comida de verdade, sono possível, força progressiva e rede de apoio: esses são os quatro pilares.',
          'Celebre vitórias que não aparecem no espelho — energia, humor e força.',
        ],
      },
    ],
    tip: 'Releia o capítulo que você mais precisou uma vez por mês. Este guia é de consulta, não de leitura única.',
    recipe: {
      name: 'Marmitas Coloridas da Semana (Batch Cooking em 90 minutos)',
      why: 'O método que sustenta todos os outros capítulos: uma sessão de cozinha resolve 10 refeições.',
      time: '90 minutos',
      yield: '10 marmitas',
      ingredients: [
        '1 kg de peito de frango em filés',
        '500 g de patinho moído',
        '2 xícaras de arroz integral cru',
        '2 xícaras de feijão cozido',
        '3 batatas-doces em cubos',
        '1 maço de brócolis e 3 cenouras',
        'Azeite, alho, cebola, páprica, cominho, sal e pimenta',
      ],
      steps: [
        'Ligue o forno a 200 °C e comece pela assadeira: batata-doce, cenoura e brócolis temperados com azeite e sal (o brócolis entra só nos 12 minutos finais).',
        'Enquanto assa, cozinhe o arroz integral (40 minutos) em uma panela e refogue o feijão temperado em outra.',
        'Grelhe o frango em duas levas, 4 minutos por lado, para não soltar água na frigideira.',
        'Refogue a carne moída com cebola, alho e cominho por 12 minutos, até secar o líquido e dourar.',
        'Deixe tudo esfriar completamente sobre a bancada antes de montar — marmita quente cria condensação e estraga antes.',
        'Monte em potes com divisórias: 1/4 proteína, 1/4 arroz e feijão, 1/2 legumes.',
      ],
      tasting: 'Reaqueça 3 minutos no micro-ondas com uma colher de água sobre o arroz — ele volta soltinho. A marmita bem-feita tem cor em todas as divisórias; se estiver monocromática, faltou vegetal.',
      storage: '5 marmitas na geladeira (até 4 dias) e 5 no congelador (até 3 meses). Etiquete com a data.',
    },
  },
];

export const getChapter = (id: number) => guideChapters.find((c) => c.id === id);
