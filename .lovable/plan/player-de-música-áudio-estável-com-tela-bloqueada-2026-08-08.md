# Player de música: áudio estável com tela bloqueada

## Objetivo

Fazer a música continuar tocando com a tela apagada / app em segundo plano, sem mudar nada do que já funciona: busca de qualquer música, biblioteca, visual preto + rosa neon + branco, e o botão "Atualizar Cookies" do painel admin.

## O que muda

1. **Player único e persistente**
   Hoje o iframe é criado à mão, movido entre containers, tem o `src` limpo e é recriado a cada troca de faixa. Isso é o que derruba o áudio quando a tela apaga. Passa a existir **um único player** criado uma vez, que nunca é destruído nem remontado — trocar de música só muda o vídeo dentro dele.

2. **API oficial do YouTube (YT.Player)**
   Em vez de comandos por `postMessage` no escuro, o player usa a API oficial. Isso registra uma sessão de mídia real no sistema, então o Android/iOS entende que há mídia tocando e não suspende o áudio.

3. **Fim do truque de mute + unmute atrasado**
   Hoje começa mudo e desmuta 800ms depois. Se a tela apaga nessa janela, o som morre. O volume passa a ser aplicado no momento em que o player fica pronto.

4. **Controles de mídia no bloqueio**
   Título, subtítulo e capa da faixa aparecem nos controles de mídia do sistema, com play/pause funcionando de lá.

## O que NÃO muda

- Busca de qualquer música continua igual (Edge Function `youtube-search` não é tocada).
- Biblioteca de faixas, ícones, textos PT/EN e layout permanecem iguais.
- "Atualizar Cookies" no admin continua recarregando a sessão do player.
- Nenhuma alteração de cores ou de outras telas.

## Limite honesto

No navegador do celular isso melhora muito, mas o **garantido** com tela bloqueada é no app nativo. Para isso o iOS precisa de `UIBackgroundModes = audio` e o Android de um serviço de mídia em primeiro plano — passos que já estão documentados em `BACKGROUND_AUDIO_SETUP.md` e são feitos uma vez após exportar o projeto. Nenhum código JS substitui isso.

## Detalhes técnicos

- `src/hooks/useYouTubeEmbed.tsx`: reescrito para carregar a IFrame API, instanciar um `YT.Player` único num host fixo no `body`, e expor `play/pause/resume/stop/setVolume` via métodos do player. Troca de faixa usa `loadVideoById`, nunca recria o iframe.
- Remoção da lógica de mover o iframe entre containers e do `visibilitychange` que reenvia `playVideo`.
- `src/services/BackgroundAudioService.ts`: mantém Wake Lock e passa a alimentar `navigator.mediaSession` com metadata e handlers.
- `src/components/MusicPlayer.tsx` e `src/components/BabySounds.tsx`: apenas ajuste das chamadas ao hook, sem mudança de UI.
