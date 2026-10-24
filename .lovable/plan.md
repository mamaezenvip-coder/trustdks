# App mais rápido + teste geral no celular

## 1. App mais rápido
- Carregar cada função (bebê 3D, leitor de ebooks, mapas, admin, guias) só quando a mãe abrir ela, em vez de baixar tudo ao abrir o app.
- Diminuir o peso das fotos (guias, receitas, remédios, especialistas) convertendo para um formato mais leve, sem perder qualidade visível.
- Mostrar uma tela de carregamento rosa/preta enquanto cada função abre.

## 2. Teste geral no celular
- Abrir o app em tamanho de celular (Android e iPhone), logado, e passar por todas as 13 funções do anel.
- Tirar fotos de cada tela e corrigir: textos cortados, botões pequenos demais, cores fora do preto/rosa/branco, telas que travam ou ficam pretas.
- Conferir player, sons para dormir, emergência, farmácia, ebooks e chat.

## Fora do plano
- Configuração do player do YouTube não será alterada.

## Detalhes técnicos
- React.lazy + Suspense para componentes pesados em Index.tsx (Baby3D, PdfReader, EmergencyMap, PharmacyMap, RouteMapDialog, Admin).
- manualChunks no vite.config para separar three/pdfjs/leaflet.
- Converter src/assets/*.jpg para WebP com sharp e atualizar imports.
- Playwright em viewport 390x844 com sessão injetada, screenshot por função.
