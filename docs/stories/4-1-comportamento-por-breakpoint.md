---
baseline_commit: c71044c3c8819e26c3cbdcc9fb53c7e822fa7028
---

# Story 4.1 — Definir comportamento desktop/tablet/mobile

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 4 — Responsividade e acessibilidade                                                |
| **Área**        | layout/UI, motion                                                                       |
| **Seções**      | global (breakpoints), Hero, About, Banners, `WhatsAppFloat`                             |
| **Tamanho**     | M — muda o [tailwind.config.ts](../../tailwind.config.ts) (todas as seções), uma primitiva de motion ([ParallaxImage.tsx](../../src/components/motion/ParallaxImage.tsx)) e [presets.ts](../../src/animations/presets.ts); sem dependência nova |
| **Depende de**  | [4.3](4-3-reduced-motion.md) (`DONE` — guarda síncrona `prefersReducedMotion()`, que continua obrigatória), [4.7](4-7-card-design-banner-invisivel.md) (`DONE` — `fromTo` dos Banners), `PEND-16` (`RESOLVED`) |
| **Requisitos**  | FR-01 (estados responsivos do legado), FR-04, FR-10, FR-11                              |
| **Baseline**    | `c71044c` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Medido em 2026-11-05 com `npx next dev -p 3008` e uma sonda CDP temporária (Chrome
headless, `mobile: false` para não esconder o transbordo no viewport de layout),
comparando o rebuild com o `index.html` legado aberto como arquivo.

1. **Os breakpoints viram 1 px antes do legado.** O [tailwind.config.ts:11-16](../../tailwind.config.ts)
   define `sm: 480px`, `md: 768px`, `lg: 1024px`, que o Tailwind traduz em
   `min-width` (inclui o valor). O legado usa `@media (width > 480px)`,
   `(width > 768px)` e `(width > 1024px)` (`styles.css:841`, `:874`, `:954`). Nos
   três viewports de validação que caem exatamente na fronteira, o layout diverge:

   | Largura | Legado | Rebuild hoje |
   | --- | --- | --- |
   | 480 | Banners em 1 coluna (`448px`), sem scroll horizontal | Banners em 2 colunas (`204px 204px`), documento com **504 px** |
   | 768 | menu hambúrguer, Banners em 2 colunas, rodapé em 2 colunas | menu horizontal (`Navbar.tsx:29`, `hidden md:flex`), Banners em 3 colunas, bloco social fixo visível (`Hero/index.tsx:28`) |
   | 1024 | `gap: 1rem` nas grades | `gap` de `lg` já aplicado |

   O transbordo de 480 vem do card "Desenvolvimento" dos Banners: `h4.text-lg`
   e `p.text-white/70` com borda direita em 504 px ([Banners/index.tsx:42-43](../../src/sections/Banners/index.tsx)).
   É o achado da [7.1](7-1-hero-background-animado.md) (lá medido 497 px, antes dos cards de vidro da 7.2).
   As camadas `.hero-glow__*` também passam da borda (até 616 px em 480), mas
   são cortadas pelo `overflow` do Hero e não contam no `scrollWidth`.

2. **Os Banners em 2 colunas transbordam entre ~481 e ~550 px, no legado
   também.** Legado: 516 px de documento em 481. Rebuild: 505 em 481, 524 em
   520, sem transbordo a partir de 560. A coluna de texto do card fica com ~88 px
   e "Desenvolvimento" em `text-lg` semibold precisa de ~160 px. Igualar os
   breakpoints não resolve esta faixa.

3. **Nenhum efeito muda por dispositivo.** Não há `matchMedia` de largura nem
   `gsap.matchMedia()` em `src/` (só o de reduced motion em
   [useReducedMotion.ts](../../src/hooks/useReducedMotion.ts)). Em 375 px rodam os
   mesmos 12 efeitos do desktop, incluindo os dois parallax com `scrub`
   (brilho do Hero, [HeroClient.tsx:58-68](../../src/sections/Hero/HeroClient.tsx);
   ilustração do About, [ParallaxImage.tsx:47-59](../../src/components/motion/ParallaxImage.tsx))
   e a mola de hover do [WhatsAppFloat.tsx:38-55](../../src/components/ui/WhatsAppFloat.tsx),
   ligada a `mouseenter`/`mouseleave`: em toque, o navegador emula esses eventos
   no toque e a mola briga com o feedback de clique (FR-10: "não depender
   exclusivamente de hover"). O CSS de hover do projeto já está protegido com
   `@media (hover: hover)` em [globals.css](../../src/app/globals.css).

4. **Os Banners piscam antes de o trigger disparar.** Com a seção a 95% da
   altura da tela (abaixo do `start: "top 88%"`), as opacidades dos 3 cards são
   `[0, 1, 1]` nos 5 viewports: só o 1º recebe o estado inicial do `fromTo`
   ([BannersClient.tsx:33-45](../../src/sections/Banners/BannersClient.tsx)). Ao
   cruzar 88%, o 2º e o 3º somem e entram animados. Achado do review da
   [4.7](4-7-card-design-banner-invisivel.md), atribuído à 4.1 no [TASKS.md](../TASKS.md).

**Resultado pretendido:** os pontos de virada do layout iguais aos do legado,
nenhum scroll horizontal entre 375 e 1200 px, e uma matriz explícita de quais
efeitos rodam em cada faixa, aplicada no código.

**Este contexto não cobre** as distâncias, durações e `start` por faixa (4.2),
nem teclado/foco (4.5) e contraste (4.6).

**Também medido, sem defeito:** rodapé e Contato terminam com opacidade 1 ao
chegar no fim da página, nos dois sentidos. Depois de resize 1200 → 375 no fim
da página, as colunas do rodapé ficam em `opacity: 0` porque o documento cresce
e o rodapé sai da tela (o `reverse` do trigger é o comportamento correto);
voltam a 1 ao rolar até ele.

## Escopo

- Pontos de virada iguais aos do legado no menu, nos ícones sociais fixos e nos Banners (revisto no review: as telas globais do Tailwind não mudam — ver _Decisões_); no plano original:
  `width > 480`, `> 768`, `> 1024` (`PEND-16`).
- Card dos Banners sem transbordo na faixa de 2 colunas: só entre 481 e 768 px
  o ícone fica acima do texto, para "Desenvolvimento" caber inteiro no tamanho
  de hoje (`PEND-16`; ver _Decisões_ e o Change Log — o plano inicial de só
  diminuir o título não cabia).
- Matriz de comportamento por faixa (abaixo) aplicada no código.
- Os 3 cards dos Banners com o mesmo estado antes do trigger.

**Matriz de comportamento** (faixas pelos breakpoints do legado):

| Efeito | Mobile ≤ 480 | Phablet/tablet 481–768 | Desktop > 768 |
| --- | --- | --- | --- |
| Entrada do Hero (h4, h1, bloco social) | roda | roda | roda |
| Leitura progressiva (`ScrollText`, 5 textos) | roda | roda | roda |
| Reveals das seções (About, Banners, Projetos, Serviços, Contato, rodapé) | roda | roda | roda |
| Flip do filtro de Projetos | roda | roda | roda |
| Contador "+50" | roda | roda | roda |
| Parallax do brilho do Hero (`yPercent`) | **não** | **não** | roda |
| Loop CSS do brilho do Hero | roda | roda | roda |
| `ParallaxImage` (primitiva; hoje sem uso renderizado, ver Change Log) | **não** | **não** | roda |
| Mola de hover do `WhatsAppFloat` | só com `(hover: hover) and (pointer: fine)` | idem | idem |
| Feedback de clique do `WhatsAppFloat` | roda | roda | roda |
| Pulso CSS `WaveWhatsApp`, rotação dos `SocialIcons` | inalterados (FR-07, `PEND-13`) | idem | idem |

Com reduced motion, nada da coluna "roda" roda (regra da [4.3](4-3-reduced-motion.md), inalterada).

**Se for preciso cortar:** sai primeiro a correção do piscar dos Banners (item 4
do contexto; não esconde conteúdo, só pisca). Os breakpoints e o transbordo não
saem: são o critério de liberação (QA § 4, "sem overflow horizontal").

## Fora de escopo

- **Não ajusta distâncias, durações, `stagger` nem `start` por faixa.** É a
  [4.2](../TASKS.md), que depende desta.
- **Não migra os 12 efeitos para `gsap.matchMedia()`.** Só os três que mudam por
  faixa (ver _Decisões_).
- **Não troca os `gsap.from` do rodapé e do Contato por `fromTo`.** Medidos sem
  defeito neste baseline; a padronização fica para a limpeza da 6.9.
- **Não muda o piscar do Hero na hidratação.** Não depende de largura; a
  [4.3](4-3-reduced-motion.md) o empurrou para cá por ser "comportamento", mas
  nenhuma linha da matriz o resolve. Vira a tarefa nova **4.8** no [TASKS.md](../TASKS.md).
- **Não mexe no pulso do WhatsApp nem na rotação dos ícones sociais.** FR-07 e `PEND-13`.
- **Não altera conteúdo, links, cores nem a ordem das seções.**

## Decisões

- **Decidido (responsável, `PEND-16`, 2026-11-05):** igualar os breakpoints ao
  legado (`width > N`). **Descartado:** manter os do rebuild e corrigir só os
  Banners. **Porque:** os viewports de validação 480/768/1024 caem exatamente
  na fronteira, e é neles que o rebuild diverge do legado. Consequência
  aceita: em 480 e 768 exatos o visual muda em relação às capturas aprovadas nas
  stories 7.x (768 passa a ter menu hambúrguer, sem o bloco social fixo, e
  grades em 2 colunas, como o legado).
- **Revisto no review (responsável, 2026-11-05) — vale este, não os dois itens
  seguintes:** as telas do Tailwind **não mudam**; menu/hambúrguer, ícones
  sociais fixos e grade/card dos Banners usam `min-[481px]:`/`min-[769px]:`.
  **Descartado:** a troca global das telas (abaixo, implementada e medida).
  **Porque:** as grades do rebuild não correspondem uma a uma às do legado; a
  troca global deixou Projetos e Serviços em 2 colunas em 1024 (antes e legado:
  3), títulos de 48 → 36 px em 1024, e Serviços, Pacotes e rodapé em 1 coluna
  em 768. Com o ajuste pontual, o resto do site fica idêntico ao de antes.
- ~~**Decidido:** telas `sm: "481px"`, `md: "769px"`, `lg: "1025px"`~~ (superado acima); `xl`
  continua `1200px` (o legado não tem media query em 1200; é o `max-width` do
  container). **Descartado:** telas `raw` (`(width > 480px)`). **Porque:** o
  Tailwind 3 não gera as variantes `max-*` nem ordena telas `raw` junto das
  `min`; em pixels inteiros `min-width: 481px` equivale a `width > 480px`.
- **Decidido (responsável, `PEND-16`, revisto na implementação):** na faixa de
  2 colunas (481–768 px), o ícone do card dos Banners fica acima do texto
  (`sm:flex-col md:flex-row`, `sm:p-5`, `min-w-0` na coluna de texto); título e
  texto no tamanho de hoje. **Descartado:** só diminuir o título (a 1ª escolha).
  **Porque:** medido em 481 px, sobram 88 px para o texto e "Desenvolvimento"
  precisa de 125 px mesmo em 14 px. **Descartado também:** card compacto (ícone
  40 px, padding 16 px, título 14 px), que ainda ficava no limite; 1 coluna até
  ~560 px; deixar o bug do legado. "Desenvolvimento" nunca quebra no meio da
  palavra.
- **Decidido:** `gsap.matchMedia()` só nos três efeitos que mudam por faixa
  (parallax do Hero, `ParallaxImage`, mola do `WhatsAppFloat`), com as
  consultas num lugar só (`MOTION_MEDIA` em [presets.ts](../../src/animations/presets.ts)).
  **Descartado:** migrar os 12 efeitos. **Porque:** os outros 9 rodam igual em
  toda largura; reescrevê-los é risco sem ganho, e a guarda da 4.3 já cobre
  reduced motion. **Descartado:** `window.innerWidth` no efeito. **Porque:** não
  reage a resize/rotação; o `gsap.matchMedia()` reverte e recria o efeito
  quando a consulta muda.
- **Decidido:** a guarda `if (reduced || prefersReducedMotion()) return;`
  continua no início de cada efeito, antes do `gsap.matchMedia()`.
  **Descartado:** só a condição `prefers-reduced-motion` do `matchMedia`.
  **Porque:** a 4.3 mediu que a 1ª passada precisa da guarda síncrona; mudar o
  padrão está fora desta story.
- **Decidido:** parallax desligado até 768 px. **Descartado:** só até 480.
  **Porque:** abaixo de 769 o About e o Hero são de uma coluna (legado), e a
  ilustração fica no fluxo do texto; o FR-10 pede evitar efeitos pesados em
  telas pequenas. O deslocamento visual perdido é decorativo.

## Critérios de aceite

### AC #1 — Pontos de virada iguais aos do legado

Em 479, 480, 481, 767, 768, 769, 1024 e 1025 px, o número de colunas da grade
dos Banners e a visibilidade do botão hambúrguer batem com o `index.html`
legado na mesma largura (480 → 1 coluna; 768 → 2 colunas e hambúrguer; 769 →
3 colunas e menu horizontal). Verifica-se com a sonda de `gridTemplateColumns`
e `display` do botão, rebuild e legado lado a lado.

### AC #2 — Nenhum scroll horizontal de 375 a 1200 px

`document.documentElement.scrollWidth === innerWidth` em 375, 480, 481, 500,
520, 540, 560, 768, 1024 e 1200 px (Chrome headless, `mobile: false`). Em toda a
faixa de 2 colunas, "Desenvolvimento" aparece inteiro, sem hifenizar nem cortar
(captura em 481 e 520).

### AC #3 — Parallax só acima de 768 px

Rolando 600 px a partir do topo: em 1024 e 1200, o `[data-hero-glow]` e o
contêiner da ilustração do About ganham `transform` com `translateY` diferente
de zero; em 375, 480 e 768, os dois ficam sem `transform`. Voltando ao topo, o
deslocamento volta a 0 nas larguras em que roda.

### AC #4 — Resize atravessando 768/769 liga e desliga o parallax

Com a página rolada no meio do About: 1200 → 375 deixa os dois contêineres sem
`transform` (nada fica preso no meio do scrub); 375 → 1200 religa o parallax e
ele acompanha o scroll nos dois sentidos.

### AC #5 — Mola do WhatsApp só com mouse

Com `(hover: hover) and (pointer: fine)` (desktop), passar o mouse escala o
botão (~1.18) e sair volta a 1. Com emulação de toque (`Emulation.setTouchEmulationEnabled`
+ `Emulation.setEmitTouchEventsForMouse`), um toque produz só o feedback de
clique e o botão termina em `scale(1)`. O `href` continua
`SITE_CONFIG.whatsapp.url` e o pulso `WaveWhatsApp` continua rodando (FR-07).

### AC #6 — Banners com o mesmo estado antes do trigger

Com a seção a 95% da altura da tela, as opacidades dos 3 cards são iguais entre
si nos 5 viewports; ao cruzar 88% os três entram animados e terminam em 1; ao
rolar para cima voltam juntos. Recarregando com a seção já na tela, os 3 ficam
visíveis (opacidade 1). Nenhum card some depois de visível na tela.

### AC #7 — Reduced motion e sem JS continuam iguais

Com `prefers-reduced-motion: reduce`, nenhum efeito roda em nenhuma faixa
(sem `transform`/`opacity` inline depois de rolar a página inteira nos dois
sentidos) e o conteúdo fica visível desde o 1º quadro. Sem JS
(`node scripts/capture_nojs.js`), as capturas de 375 e 1200 mostram todos os
blocos; em 480, a sonda com `Emulation.setScriptExecutionDisabled` mostra os
Banners em 1 coluna e `scrollWidth === 480` (o layout é CSS, não depende de JS).

### AC #8 — Fidelidade nos 5 viewports

Captura da página em 375, 480, 768, 1024 e 1200 comparada com o legado nas
mesmas larguras: ordem das seções, número de colunas por grade e posição do
bloco social fixo iguais (o bloco social some em 768, como no legado). As
exceções autorizadas (Hero `PEND-14`, cards `PEND-15`, rodapé 7.3–7.5) seguem
como estão. `git diff c71044c -- src/components/ui/SocialIcons* src/lib/constants.ts`
vazio.

### AC #9 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes, sem warning de hidratação/SSR;
`node scripts/check_ids.js` com os IDs presentes; nenhum item do
[QA-CHECKLIST](../QA-CHECKLIST.md) § 9 violado; evidência em
`docs/references/qa/`; **SHA** citado no Change Log.

## Plano técnico

- [tailwind.config.ts](../../tailwind.config.ts): `screens` → `sm: "481px"`,
  `md: "769px"`, `lg: "1025px"`, `xl: "1200px"`, com comentário citando
  `styles.css` (`width > N`). Nenhuma classe muda de nome.
- [presets.ts](../../src/animations/presets.ts): `MOTION_MEDIA = { desktop: "(min-width: 769px)", finePointer: "(hover: hover) and (pointer: fine)" }`,
  fonte única das consultas (o `769` repete o `md` do Tailwind; comentário
  ligando os dois).
- [HeroClient.tsx](../../src/sections/Hero/HeroClient.tsx): o `gsap.to(glow, …)`
  vai para dentro de `mm.add(MOTION_MEDIA.desktop, …)`, criado dentro do
  `gsap.context()`; a entrada (h4/h1/social) fica fora, em toda largura. Cleanup
  `ctx.revert()` (reverte o `mm` junto).
- [ParallaxImage.tsx](../../src/components/motion/ParallaxImage.tsx): o
  `gsap.to` vai para `mm.add(MOTION_MEDIA.desktop, …)`. A prop de faixa não é
  necessária hoje (um único uso, no About).
- [WhatsAppFloat.tsx](../../src/components/ui/WhatsAppFloat.tsx): listeners de
  `mouseenter`/`mouseleave` só registrados dentro de
  `mm.add(MOTION_MEDIA.finePointer, …)` (o retorno do `add` remove os
  listeners); o `click` continua em toda largura. URL, classes `.whatsapp-link`/`.wpp`
  e o CSS do pulso intocados.
- [Banners/index.tsx](../../src/sections/Banners/index.tsx): `min-w-0` no `div`
  do texto; título com tamanho menor só na faixa de 2 colunas (ex.:
  `sm:text-base md:text-lg`), medido para "Desenvolvimento" caber em 481 px.
- [BannersClient.tsx](../../src/sections/Banners/BannersClient.tsx): investigar
  por que o `fromTo` com `stagger` só aplica o estado inicial no 1º card antes
  do trigger (provável `immediateRender` do tween escalonado); corrigir de forma
  que os 3 recebam o estado inicial ao montar só quando a seção está abaixo do
  `start`, mantendo o destino explícito da 4.7.
- Docs: [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) e [ARCHITECTURE.md](../ARCHITECTURE.md)
  (breakpoints `> N` e `MOTION_MEDIA`); [CLAUDE.md](../../CLAUDE.md) (linha de
  breakpoints e de parallax); [AUDIT.md](../AUDIT.md) § breakpoints, se citar os do Tailwind.

**Regras que se aplicam** ([AGENTS.md](../../AGENTS.md) § 4 e § 7,
[TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 2): animação no `*Client.tsx` via
`data-*`; `gsap.context()` + `ctx.revert()`; guarda síncrona de reduced motion
no início do efeito; só `transform`/`opacity`/`color`; sem `pin`; tokens do
Tailwind; botões sociais e WhatsApp intocados (só a mola GSAP muda de
condição, o que o FR-07 permite); nenhuma dependência nova (`gsap.matchMedia()`
é do GSAP 3.15 já instalado).

## Tasks

- [x] Captura "antes" em 375/480/768/1024/1200, com JS, na pasta temporária (AC #8)
- [x] Telas do Tailwind alinhadas ao legado (AC #1, #8)
  - [x] Conferir em 768 o Navbar (hambúrguer), o bloco social fixo e o rodapé
- [x] Card dos Banners sem transbordo na faixa 481–768 (AC #2)
- [x] `MOTION_MEDIA` em `presets.ts` (AC #3, #5)
- [x] Parallax do Hero e do About só em desktop (AC #3, #4)
- [x] Mola do `WhatsAppFloat` só com ponteiro fino (AC #5)
- [x] Estado inicial dos 3 cards dos Banners (AC #6)
- [x] Reduced motion e sem JS (AC #7)
- [x] Docs técnicos e `CLAUDE.md` (DoD)
- [x] Validação e evidência final (AC #9)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | sempre | `npx tsc --noEmit` |
| build | sempre | `npm run build` (exit 0, sem warning) |
| âncoras | Navbar muda em 768 | `npx next start -p 3008` + `node scripts/check_ids.js` |
| visual | breakpoints e transbordo | sonda CDP temporária (colunas, hambúrguer, `scrollWidth`) rebuild × legado nas larguras do AC #1/#2; capturas em 375/480/768/1024/1200 |
| movimento | parallax, resize, mola, Banners | sonda CDP: `transform` antes/depois de rolar, resize 1200 ↔ 375, toque emulado, opacidades dos Banners a 95%/50% da tela e de volta |
| movimento | reduced motion | `Emulation.setEmulatedMedia` com `prefers-reduced-motion: reduce`, página inteira nos dois sentidos |
| sem JS | conteúdo visível | `node scripts/capture_nojs.js` (375/1200) + sonda sem JS em 480 |
| QA-CHECKLIST | § 3 (animações), § 4 (responsividade, "sem overflow horizontal"), § 5 (reduced motion), § 9 | evidência na linha de cada item |

## Riscos e armadilhas

- **Sonda com `mobile: true` esconde o transbordo.** Com emulação mobile o
  Chrome alarga o viewport de layout até o conteúdo (`innerWidth` vira 504 em
  480) e a busca por elementos além da borda não acha nada. Medir com
  `mobile: false`.
- **A mudança de telas é global.** Toda classe `sm:`/`md:`/`lg:` de 10 arquivos
  muda de ponto de virada. O risco está em 768 exatos: Navbar, Hero (bloco
  social `hidden md:flex`), About em 2 colunas e rodapé. Sinal: diferença
  inesperada na captura de 768 frente ao legado.
- **`gsap.matchMedia()` dentro de `gsap.context()`.** O `mm` precisa ser criado
  dentro do contexto (ou revertido explicitamente no cleanup); senão os
  ScrollTriggers do parallax sobrevivem ao desmonte e ao Fast Refresh.
- **O parallax do Hero nunca vai na `<section>`.** Transform nela prende o bloco
  social `fixed` ao Hero (comentário em `HeroClient.tsx:56-57`, story 7.1). Preservar.
- **Banners: o `fromTo` da 4.7 não pode voltar a `from`.** O destino explícito é
  o que evita o card invisível; a correção do piscar mexe só no estado inicial.
- **O estado inicial com a seção já na tela.** Ao recarregar abaixo dos
  Banners, aplicar `opacity: 0` antes de o trigger tocar faz os cards piscarem;
  o AC #6 cobre esse caso.
- **Preservar:** comentário "FR-06 (inviolável)" do `WhatsAppFloat`, o
  `href`, as classes `.whatsapp-link`/`.wpp` e o keyframe `WaveWhatsApp`; o
  comentário da 7.1 sobre o parallax no `[data-hero-glow]`.

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [x] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-16` registrado como `RESOLVED` (feito na criação da story).
- [x] Docs afetados (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md) atualizados.
- [x] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:**
- [tailwind.config.ts](../../tailwind.config.ts) — telas inalteradas; só o comentário que explica por que não mudar.
- [Navbar.tsx](../../src/components/layout/Navbar.tsx) — menu horizontal, botão e menu móvel em `min-[769px]:` (AC #1, #8).
- [Hero/index.tsx](../../src/sections/Hero/index.tsx) — bloco social fixo em `min-[769px]:flex` (AC #1, #8).
- [presets.ts](../../src/animations/presets.ts) — `MOTION_MEDIA` (`desktop`, `finePointer`).
- [HeroClient.tsx](../../src/sections/Hero/HeroClient.tsx) — parallax do brilho em `mm.add(MOTION_MEDIA.desktop)`; entrada fora, em toda largura (AC #3, #4).
- [ParallaxImage.tsx](../../src/components/motion/ParallaxImage.tsx) — mesmo padrão (primitiva sem uso hoje).
- [WhatsAppFloat.tsx](../../src/components/ui/WhatsAppFloat.tsx) — `mouseenter`/`mouseleave` em `mm.add(MOTION_MEDIA.finePointer)`; `click`, `href`, classes e pulso intocados (AC #5).
- [Banners/index.tsx](../../src/sections/Banners/index.tsx) — grade em `min-[481px]:`/`min-[769px]:`, ícone acima do texto em 481–768 px, `min-w-0` (AC #1, #2).
- [BannersClient.tsx](../../src/sections/Banners/BannersClient.tsx) — `gsap.set` explícito do estado inicial de cards e ícones; destino `fromTo` da 4.7 mantido (AC #6).
- Docs: [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md), [ARCHITECTURE.md](../ARCHITECTURE.md), [QA-CHECKLIST.md](../QA-CHECKLIST.md) § 4, [CLAUDE.md](../../CLAUDE.md), [TASKS.md](../TASKS.md).
- Evidência: `breakpoints_banners_480.png`, `breakpoints_banners_481.png`, `breakpoints_768.png`.

**O que divergiu do plano:**
- **O About não tem parallax.** O `ParallaxImage` é importado em [About/index.tsx](../../src/sections/About/index.tsx) mas não é renderizado, e não há `grafic.png` na página: a story e o CLAUDE.md citavam um efeito que não existe. A primitiva recebeu o mesmo `matchMedia` (para não voltar a rodar em mobile se for usada); o import morto fica para a 6.9. O AC #3/#4 vale só para o brilho do Hero.
- **Card dos Banners:** ícone acima do texto em vez de só título menor (medição e nova decisão do responsável em _Decisões_).
- **Causa do piscar dos Banners:** com `stagger`, o `fromTo` vira uma timeline interna e o `immediateRender` só desenha o tempo 0, que é o 1º alvo. Corrigido com `gsap.set` explícito antes do `fromTo`, nos cards e nos ícones (os ícones tinham o mesmo defeito).
- O `gsap.matchMedia()` ficou fora do `gsap.context()`, com `mm.revert()` explícito no cleanup.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `c71044c` (código medido em `fddacb2`; o commit seguinte só toca docs). Decisões do responsável no `PEND-16`: breakpoints iguais ao legado e card dos Banners encolhendo na faixa 481–550 px. Piscar do Hero na hidratação separado na tarefa nova 4.8. |
| 2026-11-05 | IN_PROGRESS | Iniciada sobre `c71044c` com o aval do responsável ("pode implementar"), depois de a story ser explicada em linguagem simples. |
| 2026-11-05 | IN_PROGRESS | Implementada; validação na árvore de trabalho sobre `c71044c`. `npx tsc --noEmit` → OK. `npm run build` → exit 0, `/` 13.6 kB / 178 kB, sem warning. `npx next start -p 3008` (HTTP 200) + `node scripts/check_ids.js` → IDs presentes. Sonda CDP temporária (fora do repositório, `mobile: false`): **AC #1** colunas dos Banners, hambúrguer e bloco social iguais ao legado em 375/479/480/481/500/520/540/560/767/768/769/1024/1025/1200; **AC #2** `scrollWidth === innerWidth` nas 14 larguras (legado: 516 em 481 e 500); **AC #3** `[data-hero-glow]` com `translateY` 30.4 px depois de rolar 600 px em 1024/1200 e `none` em 375/480/768, 0 de volta ao topo; **AC #4** 1200 → 375 deixa o brilho em `none`, 375 → 1200 religa (15.2 px em 300, 32.9 px em 650, 0 no topo); **AC #5** mouse: escala 1.17 no hover e 1 ao sair; toque emulado (`hover: none`, `pointer: coarse`): o `mouseenter` emulado dispara mas não escala, pico 1.06 do feedback de clique e fim em 1; `href` `wa.me/556192985392` e `WaveWhatsApp` rodando; **AC #6** Banners `[0,0,0]` (cards e ícones) a 95% da tela, `[1,1,1]` depois de cruzar, `[0,0,0]` de volta ao topo e `[1,1,1]` recarregando com a seção na tela, nos 5 viewports (antes: `[0,1,1]`); **AC #7** reduced motion em 375/1200: 0 `style` inline com opacity/transform e 0 elemento com opacidade 0 depois de rolar a página nos dois sentidos, brilho sem transform; sem JS: `OUT_DIR=<temp> node scripts/capture_nojs.js` com os 10 `[data-word]` em `rgb(255, 255, 255)`, e em 480 1 coluna com `scrollWidth` 480. **AC #8** capturas recortadas rebuild × legado (480, 520, 768) e topo em 375–1200 conferidas a olho; `git diff c71044c -- SocialIcons.tsx constants.ts globals.css` vazio. **Não verificado:** toque num aparelho real (só emulação CDP). Divergências em _Execução_. Aguarda `review-mr`. |
| 2026-11-05 | IN_PROGRESS | Review (`close-story` → `review-mr`, árvore de trabalho sobre `c71044c`). **Bloqueador achado:** a troca global das telas do Tailwind (481/769/1025) piorava a fidelidade fora do menu e dos Banners — com a sonda de grades, "antes em W" = "agora em W+1": em 1024 Projetos e Serviços iam de 3 para 2 colunas (legado 3) e os títulos de 48 para 36 px; em 768 Serviços ia de 2 para 1 coluna (legado 2), Pacotes de 3 para 1 e o rodapé para 1 coluna. O AC #8 tinha só o topo e os Banners conferidos em 768 (parcial). **Decisão do responsável:** ponto do legado só onde a classe corresponde. Conserto: telas revertidas; `min-[769px]:` no [Navbar.tsx](../../src/components/layout/Navbar.tsx) (menu, botão, menu móvel) e no bloco social de [Hero/index.tsx](../../src/sections/Hero/index.tsx); `min-[481px]:`/`min-[769px]:` na grade e no card dos Banners; comentários de `tailwind.config.ts` e `presets.ts` ajustados. Sem outros achados: `SocialIcons`, `WaveWhatsApp`, `href` e comentário "FR-06 (inviolável)" intactos; nenhum `any`/`!important`; nada do _Fora de escopo_ implementado. |
| 2026-11-05 | DONE | Revalidado depois do conserto, na árvore de trabalho sobre `c71044c` (o commit desta entrega contém exatamente o validado). `npx tsc --noEmit` → OK. `npm run build` → exit 0, `/` 13.6 kB / 178 kB, sem warning. `npx next start -p 3008` + `node scripts/check_ids.js` → 11 IDs presentes. Sonda de grades: em 768/1024 todas as grades fora dos Banners iguais a 769/1025 do baseline (1024: Valores 3, Projetos 3, Serviços 3, títulos 48 px; 768: Serviços 2, Pacotes 3, rodapé 12 trilhas); altura da página com JS em 1024 = 7676 px e em 1200 = 7237 px, iguais ao "antes". **AC #1/#2** colunas dos Banners, hambúrguer e bloco social iguais ao legado e `scrollWidth === innerWidth` em 375/479/480/481/500/520/540/560/767/768/769/1024/1025/1200. **AC #3/#4** brilho: `none` em 375/480/768; em 1200, 22.8 px a 450 de scroll, `none` depois de resize para 375, 15.2/32.9 px de volta a 1200, 0 no topo. **AC #5** mouse 1.17 → 1; toque emulado: pico 1.06 do clique, fim 1, `href` e `WaveWhatsApp` intactos. **AC #6** Banners `[0,0,0]` → `[1,1,1]` → `[0,0,0]` subindo, `[1,1,1]` recarregando com a seção na tela, nos 5 viewports. **AC #7** reduced motion 375/1200 sem estilo inline de animação e sem elemento com opacidade 0; sem JS 10 `[data-word]` brancos e 480 com 1 coluna. **AC #8** página inteira com JS em 768 conferida contra o "antes" (os cards vazios de Projetos aparecem nas duas: imagem lazy sem rolar na captura, não regressão) e recortes de Banners 480/481/768 conferidos; evidência renovada em `docs/references/qa/breakpoints_*.png`. **Não verificado:** toque em aparelho real. |
