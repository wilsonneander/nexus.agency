---
baseline_commit: 272cf45
---

# Story 4.2 — Ajustar distâncias e intensidades por breakpoint

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 4 — Responsividade e acessibilidade                                                |
| **Área**        | motion                                                                                  |
| **Seções**      | About, Banners, Projects, Services, Contact, Footer                                     |
| **Tamanho**     | M — várias seções (6 wrappers com reveal) e [presets.ts](../../src/animations/presets.ts); sem dependência nova, sem mudança de conteúdo |
| **Depende de**  | [4.1](4-1-comportamento-por-breakpoint.md) (`DONE` — `MOTION_MEDIA` e o padrão `gsap.matchMedia()` depois da guarda de reduced motion), [4.3](4-3-reduced-motion.md) (`DONE` — guarda síncrona `prefersReducedMotion()`), [4.7](4-7-card-design-banner-invisivel.md) (`DONE` — destino explícito, nunca `gsap.from`) |
| **Requisitos**  | FR-10 ("ajustar distância, duração e intensidade das animações por dispositivo"), FR-04 (reveals), FR-11 |
| **Baseline**    | `272cf45` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Medido em 2026-11-05 com `npx next dev -p 3008` e uma sonda CDP temporária (fora
do repositório; Chrome headless, `mobile: false`, `prefers-reduced-motion: reduce`
para ler o layout sem transform). Para cada grupo de reveal, a sonda calcula a
posição de rolagem em que o trigger dispara (`topo do trigger − start × altura da
tela`) e onde cada alvo está nesse instante.

1. **Os cards animam fora da tela.** Os reveals das seções são animações com
   duração própria (0,5–0,7 s, `toggleActions: "play none none reverse"`)
   disparadas por **um** trigger para o grupo inteiro (a grade, a seção ou o 1º
   item), com `stagger` de 0,1–0,18 s. Abaixo de 769 px as grades viram 1 coluna,
   e quando o trigger dispara a maioria dos cards ainda está abaixo da tela: a
   animação acaba antes de o usuário chegar até eles, e ele vê os cards já
   parados. No desktop acontece o mesmo com a 2ª linha das grades de 3 colunas e
   com o rodapé, em menor escala.

   Alvos **fora da tela** quando o trigger dispara (pior caso = topo do último
   alvo, em alturas de tela abaixo do topo da tela):

   | Grupo (arquivo) | Alvos | 375×667 | 480×854 | 768×1024 | 1200×800 |
   | --- | --- | --- | --- | --- | --- |
   | Serviços ([ServicesClient.tsx:30-49](../../src/sections/Services/ServicesClient.tsx)) | 6 | **5** (4,33) | **5** (3,54) | 4 (1,96) | 3 (1,53) |
   | Projetos ([Projects/index.tsx:46-63](../../src/sections/Projects/index.tsx)) | 6 | **5** (2,87) | 4 (1,26) | 4 (1,41) | 3 (1,22) |
   | Valores ([AboutClient.tsx:146-169](../../src/sections/About/AboutClient.tsx)) | 6 | **5** (2,13) | 4 (1,47) | 4 (1,25) | 3 (1,11) |
   | Rodapé ([FooterClient.tsx:22-33](../../src/components/layout/FooterClient.tsx)) | 4 | **4** (1,90) | 4 (1,68) | 3 (1,38) | 4 (1,00) |
   | Pacotes ([ServicesClient.tsx:77-97](../../src/sections/Services/ServicesClient.tsx)) | 3 | **2** (1,79) | 2 (1,59) | 0 (0,85) | 0 (0,85) |
   | Banners ([BannersClient.tsx:35-49](../../src/sections/Banners/BannersClient.tsx)) | 3 | **2** (1,52) | 2 (1,34) | 1 (1,16) | 0 (0,95) |
   | Missão/Visão ([AboutClient.tsx:122-144](../../src/sections/About/AboutClient.tsx)) | 2 | 1 (1,38) | 1 (1,22) | 0 | 0 |
   | Campos do Contato ([Contact/index.tsx:45-61](../../src/sections/Contact/index.tsx)) | 4 | 3 (1,30) | 3 (1,22) | 2 (1,16) | 3 (1,25) |
   | Parágrafos do About ([AboutClient.tsx:60-81](../../src/sections/About/AboutClient.tsx)) | 2 | 1 (1,14) | 1 (1,07) | 0 | 0 |

   Os ícones dos Banners e os selos dos Serviços (`[data-banner-icon]`,
   `[data-service-badge]`) ficam **dentro** dos cards e usam o mesmo trigger do
   grupo: animam fora da tela junto com eles.

2. **As distâncias são as mesmas em toda largura.** Deslocamentos de `y: 24` a
   `y: 55` px (Serviços 55, Banners 50, Projetos 48, Pacotes 48, Valores 40,
   Contato 36/24, Missão/Visão 32, parágrafos e rodapé 30). A
   [TECHNICAL-SPEC.md § 4](../TECHNICAL-SPEC.md) pede "em mobile, reduzir
   distância, intensidade e complexidade; preservar a intenção do efeito".

3. **Contato e rodapé ainda usam `gsap.from`** ([Contact/index.tsx:29-79](../../src/sections/Contact/index.tsx),
   [FooterClient.tsx:22](../../src/components/layout/FooterClient.tsx)), o padrão
   que deixou o card dos Banners invisível na [4.7](4-7-card-design-banner-invisivel.md).

4. **Medida para o scrub por elemento** (início `top 92%`, fim `top 68%`, as
   posições propostas em _Decisões_): nenhum alvo começa dentro da tela no
   carregamento (nada nasce meio transparente no topo da página). O único alvo
   que não alcança o fim da animação no fim da página é a **última coluna do
   rodapé** até 768 px: ficaria em 56% (375×667), 40% (375×812), 37% (480×854)
   e 25% (768×1024) do caminho. Em 1024 e 1200 todos alcançam.

**Também medido, sem defeito:**
- **Leitura progressiva (`ScrollText`, 5 textos):** já é scrub; o trecho entre
  `start` e `end` fica entre 0,55 e 0,80 da altura da tela em todos os viewports
  (máx. 1,06 no parágrafo do Hero em 375×667). Não muda.
- **Entrada do Hero** (`y` 20/30 px, na 1ª tela): não muda.
- **`[data-about-image]` não existe na página** (o reveal `x: -60` do About não
  tem alvo; achado da 4.1, limpeza na 6.9).

**Resultado pretendido (responsável, 2026-11-05):** "as animações ativas de
acordo com o scroll que o usuário for subindo ou descendo, sem bugar". Cada card
entra **atrelado ao scroll** (scrub) quando ele mesmo atravessa a parte de baixo
da tela, para quem desce e para quem sobe, em todas as larguras, com distâncias
menores até 768 px.

**Este contexto não cobre** teclado/foco (4.5), contraste (4.6) nem o piscar do
Hero na hidratação (4.8).

## Escopo

- Os 9 grupos da tabela, mais o cabeçalho e o botão do Contato, passam de
  animação disparada por grupo para **scrub por elemento**: a entrada de cada
  alvo (opacidade 0 → 1 e deslocamento → 0) acompanha a posição dele entre 92% e
  68% da altura da tela. Rolou metade, o card está meio entrado; parou, para;
  subiu, volta na mesma medida.
- Ícones dos Banners e selos dos Serviços: a entrada em escala faz parte da
  timeline do seu card, na 2ª metade do trecho.
- Até 768 px, deslocamento menor e igual para todos (`y: 24`); acima de 768 px,
  o deslocamento de cada grupo de hoje (30–55 px).
- O fim de cada animação limitado ao fim da página, para o rodapé terminar
  visível.
- Valores num lugar só, em [presets.ts](../../src/animations/presets.ts).
- Contato e rodapé saem do `gsap.from` (consome esse item da 6.9).

**Se for preciso cortar:** sai primeiro o scrub dos **Projetos** (único com
Flip; exige um elemento a mais no markup — ver _Riscos_); eles continuam com o
reveal de hoje. Os outros grupos não saem: são o pedido.

## Fora de escopo

- **Não muda a leitura progressiva nem a entrada do Hero.** Medidas sem defeito.
- **Não muda o Flip do filtro de Projetos** (valores e comportamento ao trocar de filtro).
- **Não troca o contador "+50"** (dispara uma vez e conta; scrub num contador não ajuda a ler o número).
- **Não mexe no `[data-about-image]` sem alvo nem no `ParallaxImage`/`ScrollReveal` sem uso.** É a 6.9.
- **Não mexe no pulso do WhatsApp nem na rotação dos ícones sociais.** FR-07 e `PEND-13`.
- **Não altera conteúdo, cores, layout visível nem breakpoints de CSS.**

## Decisões

- **Decidido (responsável, 2026-11-05):** entrada atrelada ao scroll (scrub).
  **Descartado:** animação curta disparada por card, que desfaz ao sair por
  baixo (1ª versão desta story). **Porque:** é o comportamento pedido; e, como o
  estado de cada card passa a depender só da posição dele, rolagem rápida, troca
  de sentido, resize e recarga no meio da página caem sempre no estado certo.
- **Decidido (responsável, 2026-11-05):** em todas as larguras. **Descartado:**
  só até 768 px. **Porque:** o defeito também existe no desktop (2ª linha das
  grades, rodapé), e um comportamento só é mais simples de manter. Consequência
  aceita: o movimento do desktop muda de "dispara e toca" para scrub.
- **Decidido:** um ScrollTrigger por alvo, com `start: "top 92%"`,
  `end: "clamp(top 68%)"`, `scrub: 0.6`. **Descartado:** `ScrollTrigger.batch()`.
  **Porque:** o `batch` só dispara callbacks (não faz scrub). **Descartado:**
  `scrub: true`. **Porque:** 0,6 s de suavização evita tranco na roda do mouse e
  fica abaixo do 1,2 do `ScrollText`, para o card não "atrasar" demais em relação
  ao texto. São cerca de 40 triggers na página, dentro do que o ScrollTrigger
  aguenta sem custo perceptível (conferir na validação).
- **Decidido:** `clamp()` só no `end`. **Descartado:** sem `clamp`, ou `clamp`
  também no `start`. **Porque:** sem `clamp`, a última coluna do rodapé para em
  25–56% (contexto, item 4). `clamp` no `start` faria um alvo visível no
  carregamento começar em opacidade 0; hoje nenhum alvo está nessa situação, e
  sem `clamp` no `start` ele começaria no estado certo para a posição. `clamp()`
  existe desde o GSAP 3.12; o projeto usa o 3.15.
- **Decidido:** até 768 px `y: 24` em todos; acima, o `y` de cada grupo de hoje,
  via `gsap.matchMedia()` com as condições `{ narrow, desktop }` de
  `MOTION_MEDIA`. **Descartado:** reduzir cada valor por um fator. **Porque:** 24
  px é o menor deslocamento já usado no site; um valor só é mais fácil de
  conferir. Ajustes medidos na implementação entram no Change Log.
- **Decidido:** sem `stagger` dentro dos grupos. **Porque:** com um trigger por
  alvo, cards lado a lado já entram juntos e cards empilhados entram um depois do
  outro pela própria posição; um `stagger` sobre scrub só atrasaria o último.
- **Decidido:** estado inicial e final explícitos em `fromTo` por alvo, com
  `immediateRender` (o scrub precisa do estado da posição no 1º quadro).
  **Descartado:** `gsap.from`. **Porque:** é o padrão que a 4.7 proibiu.
- **Decidido:** nos Projetos, o scrub vai num elemento interno novo
  (`data-project-reveal`, que recebe as classes de `glass-card`); o
  `[data-project-card]` continua o item da grade, com o `data-flip-id`.
  **Descartado:** scrub no próprio `[data-project-card]`. **Porque:** o Flip
  anima o `transform` desse nó; dois donos do mesmo `transform` brigam.
  **Descartado:** scrub na imagem. **Porque:** a moldura de vidro ficaria
  parada enquanto a imagem se mexe dentro dela.

## Critérios de aceite

### AC #1 — A entrada acompanha o scroll, por card

Em 375×667, 768×1024 e 1200×800, rolando a página do topo ao fim em passos de
50 px e esperando 1 s a cada passo: a opacidade de cada alvo é 0 enquanto o topo
dele está abaixo de 92% da altura da tela, 1 depois de 68%, e cresce no meio sem
nunca diminuir enquanto se desce. Nenhum alvo muda de opacidade enquanto está
inteiro fora da tela. Verifica-se com a sonda CDP com JS.

### AC #2 — Subindo, desfaz na mesma medida

Subindo de volta em passos de 50 px, cada alvo passa pelos mesmos valores de
opacidade/deslocamento da descida, na mesma posição (diferença ≤ 0,05 depois de
1 s parado). Parando no meio do trecho, o card fica parado no meio.

### AC #3 — Rolagem rápida, troca de sentido, resize e recarga não deixam card preso

- Pulando direto (`scrollTo`) do topo para o fim e do fim para o topo: depois de
  1 s, todo alvo acima de 68% da tela está com opacidade 1 e sem transform.
- Resize 1200 → 375 → 1200 com a página no meio dos Serviços: depois de 1 s,
  cada alvo está no estado da sua posição (mesma regra do AC #1).
- Recarregando com a página rolada até os Serviços: os cards já acima de 68% da
  tela aparecem inteiros sem precisar rolar.

### AC #4 — O fim da página termina visível

No fim da página, nos 5 viewports, as 4 colunas do rodapé, os campos e o botão do
Contato estão com opacidade 1 e sem transform (hoje, com scrub sem `clamp`, a
última coluna do rodapé pararia em 25–56% até 768 px).

### AC #5 — Distância por faixa

Logo abaixo do ponto de entrada (topo em ~93% da tela), o `translateY` de todo
alvo é 24 px em 375/480/768, e o valor do grupo de hoje em 1024/1200 (Serviços
55, Banners 50, Projetos 48, …). Ícones dos Banners e selos dos Serviços
terminam em `scale(1)` junto do seu card.

### AC #6 — Filtro de Projetos

Em 375×667 e 1200×800, com só parte dos cards de Projetos entrados, trocar de
filtro e voltar para "Todos": o Flip roda sem salto, e ao fim cada card está no
estado da sua posição (regra do AC #1). Visual do card (vidro, borda, imagem)
igual ao baseline em 375 e 1200.

### AC #7 — Reduced motion e sem JS

Com `prefers-reduced-motion: reduce`, nenhum `style` inline de opacity/transform
em nenhum alvo depois de rolar a página inteira nos dois sentidos, em 375 e 1200.
Sem JS (`node scripts/capture_nojs.js`), todos os blocos visíveis em 375 e 1200.

### AC #8 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes, sem warning de hidratação/SSR;
nenhum item do [QA-CHECKLIST](../QA-CHECKLIST.md) § 9 violado; `git diff 272cf45 --
src/components/ui/SocialIcons.tsx src/components/ui/WhatsAppFloat.tsx src/lib/constants.ts`
vazio; evidência em `docs/references/qa/`; **SHA** citado no Change Log.

## Plano técnico

- [presets.ts](../../src/animations/presets.ts): `MOTION_MEDIA.narrow = "(max-width: 768px)"`
  (complemento de `desktop`, comentado junto) e
  `MOTION_PRESETS.scrollReveal = { start: "top 92%", end: "clamp(top 68%)", scrub: 0.6, yNarrow: 24 }`.
- Helper `src/animations/scrollReveal.ts` — `scrubReveal(targets, { y, extra? })`:
  para cada alvo, uma timeline com ScrollTrigger (`trigger: alvo`, valores do
  preset, `invalidateOnRefresh: true`) e `fromTo(alvo, { y, opacity: 0 }, { y: 0, opacity: 1, ease: "none" })`;
  `extra(tl, alvo)` acrescenta o ícone/selo na 2ª metade. Chamado dentro do
  `gsap.context()` de cada wrapper.
- Em cada wrapper ([AboutClient.tsx](../../src/sections/About/AboutClient.tsx),
  [BannersClient.tsx](../../src/sections/Banners/BannersClient.tsx),
  [ServicesClient.tsx](../../src/sections/Services/ServicesClient.tsx),
  [Contact/index.tsx](../../src/sections/Contact/index.tsx),
  [FooterClient.tsx](../../src/components/layout/FooterClient.tsx),
  [Projects/index.tsx](../../src/sections/Projects/index.tsx)): guarda de reduced
  motion no início (inalterada) → `gsap.matchMedia()` com
  `mm.add({ narrow: MOTION_MEDIA.narrow, desktop: MOTION_MEDIA.desktop }, (c) => …)`
  escolhendo o `y` → `scrubReveal` nos grupos. Cleanup `mm.revert()` + `ctx.revert()`.
  O contador "+50" fica fora do `mm`. Os `gsap.set` + `fromTo` com `stagger` dos
  Banners (4.1) saem: o problema que eles corrigiam não existe sem `stagger`
  (atualizar o comentário).
- Projetos: o `[data-project-card]` fica só com o posicionamento da grade e o
  `data-flip-id`; um filho `data-project-reveal` recebe `glass-card group rounded-2xl overflow-hidden`.
  O `useEffect` do reveal aplica `scrubReveal` nos `[data-project-reveal]` e é
  refeito quando `filteredProjects` muda (cards novos), com `ScrollTrigger.refresh()`
  depois do Flip (`onComplete`). Sai o `hasRevealedRef`.
- Docs: [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 4 (reveal das seções é scrub
  por elemento; `clamp` no `end`), [ARCHITECTURE.md](../ARCHITECTURE.md) (decisão
  registrada), [CLAUDE.md](../../CLAUDE.md) (Motion: reveals scrub; a regra
  "stagger + `immediateRender`" vira histórica), [QA-CHECKLIST.md](../QA-CHECKLIST.md)
  § 3/§ 4; no [TASKS.md](../TASKS.md), tirar da 6.9 a padronização de Contato/rodapé.

**Regras que se aplicam** ([AGENTS.md](../../AGENTS.md) § 4 e § 7,
[TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 2): animação nos wrappers via
`data-*`; guarda síncrona `if (reduced || prefersReducedMotion()) return;` antes
do `gsap.matchMedia()`; `gsap.set`/`fromTo` dentro do contexto; `ctx.revert()`/`mm.revert()`
no cleanup; só `transform`/`opacity`; **sem `pin`** e sem mexer na rolagem
nativa (scrub não sequestra o scroll: lê a posição, não a controla);
`invalidateOnRefresh`; botões sociais e WhatsApp intocados; nenhuma dependência nova.

## Tasks

- [x] Sonda do AC #1–#4 pronta na pasta temporária (o baseline não foi rodado de novo: a medição do _Contexto_ já é dele)
- [x] `MOTION_MEDIA.narrow`, `MOTION_PRESETS.scrubReveal` e helper `scrubReveal` (AC #1, #2, #5)
- [x] Banners e Serviços (cards, ícones, selos, pacotes) (AC #1–#5)
- [x] About (parágrafos, Missão/Visão, Valores) (AC #1–#3, #5)
- [x] Contato e rodapé, com `clamp` conferido no fim da página (AC #4)
- [x] Projetos: elemento interno + Flip (AC #6)
- [x] Reduced motion e sem JS (AC #7)
- [x] Docs e `TASKS.md` (6.9) (DoD)
- [x] Validação e evidência final (AC #8)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | sempre | `npx tsc --noEmit` |
| build | sempre | `npm run build` (exit 0, sem warning) |
| movimento | scrub por card, ida e volta | sonda CDP temporária com JS em 375×667, 480×854, 768×1024, 1024×768, 1200×800: opacidade, `translateY` e topo de cada alvo a cada 50 px, descendo e subindo |
| movimento | sem card preso | sonda: `scrollTo` topo ↔ fim, resize 1200 ↔ 375 no meio, recarga rolada |
| movimento | filtro | sonda: clique de filtro com cards ainda fora da tela, 375 e 1200 |
| movimento | reduced motion | `Emulation.setEmulatedMedia` com `reduce`, página inteira nos dois sentidos |
| sem JS | conteúdo visível | `node scripts/capture_nojs.js` |
| visual | evidência e Projetos | captura em 375 e 1200 com um card no meio da entrada; recorte dos Projetos comparado ao baseline → `docs/references/qa/` |
| performance | ~40 triggers | Performance do Chrome rolando a página em 375 (CPU 4× mais lenta): sem tarefa longa atribuída ao ScrollTrigger |
| QA-CHECKLIST | § 3 (animações), § 4 (responsividade), § 5 (reduced motion), § 9 | evidência na linha de cada item |

## Riscos e armadilhas

- **Fim da página.** Sem `clamp()` no `end`, a última coluna do rodapé fica
  parada no meio da entrada até 768 px (medido). Sinal: AC #4.
- **`clamp` no `start` esconde o que está na tela.** Não usar; se algum dia um
  alvo ficar dentro da 1ª tela, ele começaria em opacidade 0 no topo da página.
- **Projetos: dois donos do `transform`.** O Flip move o `[data-project-card]`;
  o scrub precisa ficar no filho. Mover `glass-card` para o filho pode mudar a
  borda (`::after`) ou o `glass-ambient` da grade se algum seletor depender do
  filho direto — conferir no recorte do AC #6. Depois do filtro os cards mudam
  de posição: sem `ScrollTrigger.refresh()` os triggers ficam com as posições
  antigas.
- **Troca de faixa no resize.** O `mm.revert()` devolve o estado do servidor
  antes de a outra faixa criar os triggers; o `fromTo` com `immediateRender`
  então aplica o estado da posição. Sinal: AC #3.
- **Alvo cujo layout muda depois do carregamento** (imagens lazy dos Projetos):
  `invalidateOnRefresh` + o refresh do ScrollTrigger no `load`; se a altura muda
  sem refresh, os triggers abaixo ficam deslocados. Sinal: AC #1 em 375 nos
  Serviços (depois dos Projetos).
- **Preservar:** restauro do texto do contador no cleanup do About; a
  explicação da 4.7 sobre não usar `from` (o comentário do Banners é reescrito,
  não apagado).

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [x] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-xx` consumido marcado `RESOLVED` — nenhum nesta story.
- [x] Docs afetados (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md) atualizados.
- [x] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:**
- [presets.ts](../../src/animations/presets.ts) — `MOTION_MEDIA.narrow` (`not all and (min-width: 769px)`) e `MOTION_PRESETS.scrubReveal` (`startAt: 0.92`, `endAt: 0.68`, `scrub: 0.6`, `yNarrow: 24`).
- [scrubReveal.ts](../../src/animations/scrubReveal.ts) (novo) — `scrubReveal`, `popInside`, `REVEAL_MEDIA`, `revealY`.
- [AboutClient.tsx](../../src/sections/About/AboutClient.tsx), [BannersClient.tsx](../../src/sections/Banners/BannersClient.tsx), [ServicesClient.tsx](../../src/sections/Services/ServicesClient.tsx), [Contact/index.tsx](../../src/sections/Contact/index.tsx), [FooterClient.tsx](../../src/components/layout/FooterClient.tsx) — reveals de grupo trocados por `scrubReveal` dentro de `gsap.matchMedia()`; contador "+50" inalterado.
- [Projects/index.tsx](../../src/sections/Projects/index.tsx) — filho `[data-project-reveal]` com as classes do card; `setupReveal` refeito no `onComplete` do Flip, com `ScrollTrigger.refresh()`; sai o `hasRevealedRef`.
- Docs: [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md), [ARCHITECTURE.md](../ARCHITECTURE.md), [CLAUDE.md](../../CLAUDE.md), [QA-CHECKLIST.md](../QA-CHECKLIST.md) § 3, [TASKS.md](../TASKS.md) (incluindo a 6.9).
- Evidência: [scrub_reveal_375.png](../references/qa/scrub_reveal_375.png) (2º card de Serviços a 47% da entrada), [scrub_reveal_1200.png](../references/qa/scrub_reveal_1200.png) (2ª linha a 50%).

**O que divergiu do plano:**
- **Posições pelo `offsetTop`, não por `start: "top 92%"`.** Com o próprio alvo como trigger, o ScrollTrigger mede pelo `getBoundingClientRect`, que inclui o `y` inicial. No carregamento passou, mas depois de um resize que atravessa 768/769 (o `matchMedia` recria os triggers) a entrada atrasava exatamente o `y` do grupo (55 px nos Serviços, 48 nos Pacotes; 12 desvios na sonda). Um `ScrollTrigger.refresh()` depois de criar os triggers piorou (76 desvios em 375: o refresh também mede com o `y`). Agora `start`/`end` são funções sobre o topo de layout (`offsetTop`), com o `clamp` do fim feito com `ScrollTrigger.maxScroll`. O preset guarda as frações (`startAt`/`endAt`) em vez das strings.
- **`MOTION_MEDIA.narrow` é `not all and (min-width: 769px)`**, não `(max-width: 768px)`: complemento exato, sem buraco em larguras fracionárias (zoom), onde nenhuma condição do `matchMedia` rodaria e nada animaria.
- **O destaque do About (`[data-about-highlight]`)** não estava na tabela do _Contexto_, mas já tinha reveal; foi para o scrub junto (`y` 24).
- **Helper em `scrubReveal.ts`**, não `scrollReveal.ts`: evita confusão com o componente `ScrollReveal.tsx` sem uso (6.9).

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `272cf45`. Medido com sonda CDP temporária (`npx next dev -p 3008`) em 375×667, 375×812, 480×854, 768×1024, 1024×768 e 1200×800: reveals de grupo com a maioria dos alvos fora da tela no disparo abaixo de 769 px; leitura progressiva e entrada do Hero sem defeito. |
| 2026-11-05 | TODO | Revista com o responsável: entrada **atrelada ao scroll** (scrub por elemento) em **todas as larguras**, no lugar do disparo por card só até 768 px. Medido para o scrub (`top 92%` → `top 68%`): nenhum alvo dentro da tela no carregamento; a última coluna do rodapé não alcança o fim até 768 px (25–56%) → `clamp()` no `end`. |
| 2026-11-05 | IN_PROGRESS | Iniciada sobre `272cf45` com o aval do responsável ("pode implementar"). |
| 2026-11-05 | IN_PROGRESS | Implementada. Divergências em _Execução_ (posições pelo `offsetTop` depois de a sonda achar o atraso no resize). |
| 2026-11-05 | DONE | Validado na árvore de trabalho sobre `272cf45` (o commit desta entrega contém exatamente o validado, sem `package.json`/`package-lock.json`, alterados fora desta tarefa). `npx tsc --noEmit` → OK. `.next` apagado e `npm run build` → exit 0, `/` 13.9 kB / 178 kB (antes 13.6), sem warning. `npx next start -p 3008` + `node scripts/check_ids.js` → 11 IDs. Sonda CDP temporária (fora do repositório, `mobile: false`; 39 alvos, opacidade medida × esperada pela posição 92% → 68%, tolerância 0,08): **AC #1/#2** 0 desvios descendo e subindo em passos de 150 px (a story pedia 50) em 375×667, 480×854, 768×1024, 1024×768 e 1200×800, nenhum alvo muda fora da tela; **AC #3** 0 desvios em pulo topo ↔ fim, resize 1200 → 375 → 1200 no meio dos Serviços (e rolando depois nos dois sentidos) e recarga rolada, nos 5 viewports (375, resize e filtro repetidos em `next start`); **AC #4** rodapé, campos e botão do Contato inteiros no fim da página nos 5; **AC #5** `translateY` a 93% da tela: 24 px em 375/768 em todos os grupos, 55/50/40/48/30 (Serviços/Banners/Valores/Pacotes/rodapé) em 1024/1200, selo e ícone terminam em `scale(1)` (o Banners em 375 deu 21,3 px com 0,9 s de espera depois de um pulo de 4000 px e 24 com 2,5 s: é a suavização do `scrub: 0.6` alcançando); **AC #6** filtro "Tecnologia" → "Todos" com parte dos cards fora da tela, 375 e 1200: 0 desvios nos cards e nas seções abaixo, nenhum `[data-project-card]` preso em `absolute`/`transform`, altura sem JS em 1200 igual à 4.1 (7237 px); **AC #7** reduced motion 375/1200 sem `style` de opacity/transform nos alvos, sem JS (`OUT_DIR=<temp> node scripts/capture_nojs.js`) com todos os blocos e os 5 `[data-word]` brancos; **AC #8** `git diff 272cf45 -- SocialIcons.tsx WhatsAppFloat.tsx constants.ts` vazio. Performance: 375×667, CPU 4×, rolagem da página inteira: 316 quadros, nenhum > 50 ms, p95 18 ms, 1 tarefa longa (63 ms). **Não verificado:** toque em aparelho real (só emulação CDP). |
