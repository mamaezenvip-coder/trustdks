# Vídeos ilustrativos nos Guias Práticos

## O que muda para a usuária
- Cada um dos 8 guias (arrotar, acalmar, sono, cólica, amamentação/mamadeira, desenvolvimento, higiene, segurança) ganha um vídeo curto feito pela IA (cerca de 8 segundos), no estilo do app: fundo escuro e luz rosa neon.
- O vídeo mostra o gesto principal do guia, por exemplo a mãe com o bebê no ombro dando tapinhas nas costas, ou embalando o bebê devagar para acalmar.
- Ao abrir o guia, o vídeo aparece no lugar da foto grande. Ele toca sozinho, sem som, repete sem parar e não abre em tela cheia. A foto fica como capa enquanto o vídeo carrega.
- O texto continua igual, logo abaixo do vídeo.

## Custo e limites
- São 8 vídeos gerados, o que gasta créditos.
- Vídeos feitos por IA são ilustrativos e podem ter pequenas imperfeições. Por isso o aviso "consulte o pediatra" continua visível.
- Se algum vídeo sair estranho (mãos ou bebê deformados), refaço só aquele.

## Detalhes técnicos
- Gerar cada vídeo a partir da foto que o guia já usa (pg-*.jpg) como primeiro quadro, assim o visual continua o mesmo. Formato 16:9, 480p para carregar rápido no celular, câmera estável e sem áudio.
- Salvar os vídeos como assets na CDN (ponteiros `.asset.json` em src/assets/videos/) e não colocar os MP4 no repositório.
- PracticalGuides.tsx: incluir o campo `video` nos dados de cada guia e, no conteúdo aberto, trocar a foto por `<video autoPlay muted loop playsInline poster={image} preload="metadata">`. O vídeo não interfere no player de música nem no áudio em segundo plano, porque é mudo.
- Seguir a paleta preto, rosa e branco, sem emojis.
