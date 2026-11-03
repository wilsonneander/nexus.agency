---
baseline_commit: 94d4e2c1f7830117c397a8104f892ab67d5cc446
---

# Story 7.1 — Redesenhar o Hero com background roxo animado

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | IN_PROGRESS                                                                                 |
| **Fase**        | Fase 7 — Evolução visual (pós-entrega)                                                  |
| **Área**        | layout/UI, motion                                                                       |
| **Seções**      | Hero (`#home`)                                                                          |
| **Tamanho**     | M — além do Hero, mexe em [globals.css](../../src/app/globals.css) (keyframes e bloco de reduced motion), que é primitiva compartilhada |
| **Depende de**  | `PEND-14` (`RESOLVED` — redesign do Hero autorizado pelo responsável em 2026-11-03); [4.3](4-3-reduced-motion.md) (`DONE` — guarda síncrona de reduced motion que o Hero já usa); [4.4](4-4-conteudo-sem-javascript.md) (`DONE` — `<noscript><style>` que deixa o `ScrollText` legível sem JS) |
| **Requisitos**  | FR-02 (com a exceção do `PEND-14`), FR-03, FR-05, FR-07, FR-10, FR-11                   |
| **Baseline**    | `94d4e2c` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Hoje o Hero reproduz o legado: fundo fotográfico `header.webp` sob um overlay
escuro (`linear-gradient(rgba(4,9,29,0.7), rgba(4,9,29,0.75))`) em
[Hero/index.tsx:19-23](../../src/sections/Hero/index.tsx#L19-L23), equivalente a
`styles.css:92-96` do legado. O texto fica alinhado à esquerda a partir de 768px
([Hero/index.tsx:34](../../src/sections/Hero/index.tsx#L34); legado
`styles.css:911-915`) e centralizado abaixo disso (legado `styles.css:403-405`;
o rebuild usa `text-left` em todos os tamanhos). A única animação do fundo é o
parallax de `backgroundPositionY` em
[HeroClient.tsx:55-65](../../src/sections/Hero/HeroClient.tsx#L55-L65).

O responsável pediu um Hero **mais limpo e profissional**, com o nome da agência
e um **background roxo em movimento** no estilo da referência
[hero-glow-reference.png](../references/hero-glow-reference.png): fundo quase
preto, um brilho roxo em forma de anel/eclipse subindo do horizonte, um halo
largo e suave ao redor, e o título centralizado em cima. Da referência entra
**só o fundo**: o selo "New: …", a interface do produto (busca, notas,
calendário) e as linhas de grade ficam de fora.

Isso contraria o FR-02 ("reproduzir fielmente o hero existente") e o
[AGENTS.md](../../AGENTS.md) § 4 ("não redesenhar"). A exceção foi autorizada
pelo responsável e está registrada como `PEND-14` no
[TASKS.md](../TASKS.md); ela vale **só para o fundo e a composição do Hero**.

**Resultado pretendido:** o primeiro viewport mostra "Nexus Agency" / "Somos
Nexus Agency." centralizados sobre um fundo escuro com um brilho roxo da marca
que se move devagar, sem perder legibilidade, sem esconder conteúdo e parado
com reduced motion.

**Este contexto não cobre:** Navbar, botões sociais do topo (FR-07), as demais
seções e o texto do Hero, que continua o do legado
([CONTENT-MAPPING.md](../CONTENT-MAPPING.md) linha 02, `PRESERVAR`).

## Escopo

- Trocar o fundo fotográfico do Hero por um fundo escuro (`secondary`) com um
  brilho roxo em camadas: anel/eclipse luminoso no horizonte, halo largo e
  difuso, reflexo tênue abaixo da linha do horizonte.
- Animar o brilho em loop lento (respiração de escala/opacidade e deriva leve
  do halo), só com `transform` e `opacity`.
- Centralizar a composição (subtítulo, título e parágrafo) em todos os
  breakpoints, com o parágrafo em largura de leitura confortável.
- Fazer a base do Hero se fundir com o fundo do About, sem emenda visível.
- Substituir o parallax de `backgroundPositionY` (que deixa de ter imagem) por
  um deslocamento leve das camadas do brilho com o scroll (`transform`, `scrub`).
- Desligar todo o movimento do fundo com `prefers-reduced-motion: reduce`,
  mantendo o brilho estático e visível.

**Se for preciso cortar:** sai primeiro o deslocamento do brilho com o scroll
(fica só o loop CSS); depois, o reflexo abaixo do horizonte.

## Fora de escopo

- **Não muda o texto do Hero.** Subtítulo, título (com "Agency." em lilás) e
  parágrafo continuam os do legado (`index.html:61-69`). Trocar o título por
  "Nexus" ou encurtar o parágrafo é decisão de conteúdo: se o responsável
  quiser, abre-se um `PEND-xx` novo.
- **Não reproduz a interface de produto, o selo "New" nem a grade da
  referência.** Pedido explícito do responsável.
- **Não toca nos `SocialIcons` do topo nem no `WhatsAppFloat`** (FR-07). O
  bloco `data-hero-social` continua `fixed` à direita, com a mesma entrada.
- **Não remove `header.webp` de `public/assets/`.** Ele continua sendo a imagem
  OpenGraph/Twitter em [layout.tsx:32](../../src/app/layout.tsx#L32) e
  [layout.tsx:43](../../src/app/layout.tsx#L43); trocar a imagem social é outra
  decisão.
- **Não adiciona CTA ao Hero.** O legado não tem (AUDIT.md § 2, linha 02).
- **Não usa WebGL, canvas, vídeo nem biblioteca nova.** Ver _Decisões_.

## Decisões

- **Decidido** fundo feito de camadas CSS (`radial-gradient` em `div`s
  absolutos, `aria-hidden`) renderizadas pelo Server Component; **descartado**
  shader WebGL/canvas (exige dependência ou código de render pesado, e some
  sem JS) e vídeo em loop (asset novo, peso de rede, sem controle fino de
  reduced motion), **porque** gradiente CSS aparece no HTML do servidor, não
  depende de hidratação e não acrescenta dependência (AGENTS.md § 4).
- **Decidido** loop do brilho em `@keyframes` CSS em
  [globals.css](../../src/app/globals.css), com parada no bloco
  `@media (prefers-reduced-motion: reduce)` que já existe ali; **descartado**
  loop em GSAP (`repeat: -1`), **porque** o loop é decorativo e independente
  do scroll, roda sem JS e segue o mesmo padrão do `WaveWhatsApp`/`fluidPulse`.
  O deslocamento ligado ao scroll fica em GSAP no
  [HeroClient.tsx](../../src/sections/Hero/HeroClient.tsx), como os demais
  efeitos de scroll.
- **Decidido** suavidade pelos próprios stops do `radial-gradient`;
  **descartado** `filter: blur()` em camadas grandes, **porque** blur animado
  em área de viewport inteira força repaint caro, sobretudo no mobile.
- **Decidido** cores do brilho a partir dos tokens da marca (`primary-dark`
  `#a15cf5` e `span` `#ad7dff`, com núcleo quase branco), expostos como CSS
  vars; **descartado** copiar os hex da referência, **porque** o brilho tem de
  ser o roxo da Nexus, não o da referência (AGENTS.md § 4: sem cores novas).
- **Decidido** composição centralizada em todos os breakpoints; **descartado**
  manter o `text-left` do desktop, **porque** a referência e o pedido
  ("limpo") são centralizados e o próprio legado já centraliza abaixo de
  768px. Coberto pelo `PEND-14`.
- **Decidido** brilho posicionado **abaixo** do bloco de texto (horizonte na
  metade inferior do Hero); **descartado** brilho atrás do título, **porque**
  o `ScrollText` começa em branco a 22% e sumiria sobre o roxo claro.

## Critérios de aceite

### AC #1 — Composição e conteúdo do primeiro viewport

Em 1200px, o Hero mostra, centralizados, "Nexus Agency" (`h4`), "Somos Nexus
**Agency.**" (`h1`, "Agency." em `span` lilás) e o parágrafo do legado, sobre
fundo escuro sem a foto `header.webp`, com o brilho roxo visível na metade
inferior. Verifica-se por screenshot comparado com
[hero-glow-reference.png](../references/hero-glow-reference.png) (só o fundo) e
pelo texto idêntico a `index.html:61-69` (`grep` ou leitura do HTML servido).

### AC #2 — O brilho se move devagar e continuamente

Com movimento normal, o brilho "respira" (escala/opacidade) e o halo deriva em
loop de pelo menos 8 s por ciclo, sem saltos no reinício do ciclo. Verifica-se
com duas capturas a ~3 s de intervalo mostrando o brilho em estados diferentes
e com o painel _Performance_ do DevTools: só `transform`/`opacity` nas camadas
animadas, sem _Layout_ nem _Paint_ por quadro.

### AC #3 — Legibilidade

O título e o parágrafo no estado final (branco pleno do `ScrollText`) têm
contraste ≥ 4.5:1 contra o pixel de fundo mais claro atrás deles, em 375 e
1200px. Nenhuma palavra do parágrafo fica sobre o núcleo claro do brilho.
Verifica-se com o _Contrast_ do DevTools / amostragem de cor no screenshot.

### AC #4 — Reduced motion

Com `prefers-reduced-motion: reduce`, o fundo aparece **estático** (brilho
visível, nenhuma animação CSS ou GSAP nas camadas), o texto aparece de
imediato e nada fica invisível. Verifica-se com
`--force-prefers-reduced-motion` no Chrome headless (como em
[reduced_1200.png](../references/qa/reduced_1200.png)) e conferindo
`getAnimations()` vazio nas camadas.

### AC #5 — Sem JavaScript e antes da hidratação

Sem JS, o Hero aparece com o fundo escuro, o brilho e todo o texto legível
(branco pleno via `<noscript><style>`). Antes da hidratação, nada do Hero está
invisível por causa do fundo. Verifica-se com `node scripts/capture_nojs.js`.

### AC #6 — Scroll para baixo e para cima

Ao rolar, o brilho se desloca levemente (sem `pin`) e volta exatamente à
posição inicial ao rolar de volta ao topo; a leitura progressiva do parágrafo
continua funcionando nos dois sentidos. A base do Hero se funde com o About
sem linha ou degrau de cor visível. Verifica-se com `scripts/capture_scroll.js`
e rolagem manual.

### AC #7 — Responsividade e resize

Em 375, 480, 768, 1024 e 1200px o brilho fica centralizado, proporcional à
largura, sem causar scroll horizontal (`document.documentElement.scrollWidth
=== innerWidth`) e sem cortar o texto. Redimensionar a janela de 1200 → 375 → 1200
com a página rolada não deixa o brilho deslocado. Verifica-se por screenshot
nos 5 viewports e pelo teste de resize.

### AC #8 — Elementos protegidos intactos

`SocialIcons` do topo (posição `fixed` à direita, rotação 3D, links) e
`WhatsAppFloat` (posição, pulso, destino `wa.me/556192985392`) idênticos ao
baseline. Verifica-se com `git diff 94d4e2c -- src/components/ui/SocialIcons*
src/components/layout/WhatsAppFloat*` vazio e captura do topo em 1200px.

### AC #9 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes, sem warning de hidratação/SSR;
`node scripts/check_ids.js` verde (`#home` mantido); nenhum item do
[QA-CHECKLIST](../QA-CHECKLIST.md) § 9 violado; evidência em
`docs/references/qa/hero_glow_1200.png` e `hero_glow_375.png`; **SHA** citado
no Change Log.

## Plano técnico

- **[Hero/index.tsx](../../src/sections/Hero/index.tsx)** (Server Component):
  - Remover o `style.backgroundImage` com `header.webp`; a `section` passa a
    `bg-secondary overflow-hidden isolate`.
  - Acrescentar, antes do conteúdo, um contêiner `aria-hidden`
    `data-hero-glow` (`absolute inset-0 pointer-events-none -z-10`) com 3–4
    camadas: `data-hero-halo` (elipse larga e difusa), `data-hero-ring` (anel:
    `radial-gradient` com centro transparente e borda clara), `data-hero-core`
    (núcleo/horizonte, faixa horizontal brilhante) e `data-hero-reflection`
    (reflexo invertido, opacidade baixa). Base com gradiente para `secondary`
    para fundir com o About.
  - Conteúdo: `text-center mx-auto`, parágrafo com `max-w-2xl mx-auto`; `h4`,
    `h1` e `ScrollText` com os mesmos `data-*` e o mesmo texto.
  - Trocar `text-[#ad7dff]` por `text-accent-span` (token existente).
- **[globals.css](../../src/app/globals.css)**: CSS vars do brilho derivadas
  dos tokens; `@keyframes heroGlowBreathe` (scale/opacity) e `heroHaloDrift`
  (translate); classes `.hero-glow__*`; entrada no bloco
  `@media (prefers-reduced-motion: reduce)` com `animation: none`.
- **[HeroClient.tsx](../../src/sections/Hero/HeroClient.tsx)**: remover o
  tween de `backgroundPositionY`; no lugar, `gsap.to("[data-hero-glow]",
  { yPercent: 10, scrollTrigger: { scrub: true, invalidateOnRefresh: true } })`
  dentro do mesmo `gsap.context()`. Atualizar o comentário do cabeçalho (B1).
  Opcional: pausar o loop CSS fora da viewport
  (`animation-play-state` via classe) se o _Performance_ mostrar custo.
- **Docs**: [PRD.md](../PRD.md) FR-02 ganha a nota da exceção `PEND-14`;
  [AUDIT.md](../AUDIT.md) § 2 linha 02 e [CLAUDE.md](../../CLAUDE.md)
  (parallax "hoje só no background do Hero") passam a descrever o novo fundo.

**Regras que se aplicam** ([AGENTS.md](../../AGENTS.md) § 4 e § 7,
[TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 2): Server Component por padrão e
animação no `HeroClient.tsx` via `data-*`; `gsap.context()` + `ctx.revert()`;
`useReducedMotion` + `prefersReducedMotion()`; só `transform`/`opacity`/`color`;
sem `pin`; tokens do Tailwind/CSS vars (sem hex solto); breakpoints
480/768/1024/1200; botões sociais e WhatsApp intocados; nenhuma dependência
nova.

## Tasks

- [x] Fundo em camadas no Server Component, sem `header.webp` (AC #1, #5)
  - [x] Camadas `data-hero-*` com `aria-hidden`
  - [x] Fusão da base com o About (AC #6)
- [x] Composição centralizada e parágrafo em largura de leitura (AC #1, #3, #7)
- [x] Keyframes do brilho em `globals.css` + parada em reduced motion (AC #2, #4)
- [x] Trocar o parallax de `backgroundPositionY` pelo deslocamento das camadas (AC #6)
- [x] Conferir contraste e ajustar posição/intensidade do brilho (AC #3)
- [x] Capturas nos 5 viewports, reduced motion e sem JS (AC #4, #5, #7, #9)
- [x] Atualizar PRD (FR-02) e CLAUDE.md (AUDIT § 2 mantido: inventaria o legado) (Plano técnico — Docs)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | sempre | `npx tsc --noEmit` |
| build | sempre | `npm run build` (exit 0, sem warning de hidratação) |
| âncoras | `#home` mantido | `npx next dev -p 3008` + `node scripts/check_ids.js` |
| visual | 375/480/768/1024/1200 | Chrome headless → `docs/references/qa/hero_glow_<vw>.png`; comparar fundo com [hero-glow-reference.png](../references/hero-glow-reference.png) |
| movimento | loop, scroll ↓↑, resize | duas capturas espaçadas; `scripts/capture_scroll.js`; DevTools _Performance_ |
| movimento | reduced motion | `--force-prefers-reduced-motion`; `getAnimations()` vazio |
| sem JS | conteúdo e brilho visíveis | `node scripts/capture_nojs.js` |
| QA-CHECKLIST | § 9 inteiro; itens de Hero, responsividade e reduced motion | leitura item a item |

## Riscos e armadilhas

- **`ScrollText` sobre o brilho.** O parágrafo começa a 22% de branco; sobre
  roxo claro fica ilegível mesmo no estado final se o núcleo subir demais.
  Sinal: AC #3 falha em 375px, onde o texto ocupa mais altura e encosta no
  horizonte. Ajuste a altura do horizonte por breakpoint, não a cor do texto.
- **Scroll horizontal no mobile.** Camadas mais largas que a viewport (o halo
  precisa ser) vazam sem `overflow-hidden` na `section`. Sinal:
  `scrollWidth > innerWidth` em 375px.
- **`overflow-hidden` x `fixed`.** O bloco `data-hero-social` é `fixed` dentro
  da `section`; `overflow-hidden` não o corta, mas `transform`/`filter` na
  própria `section` criaria um containing block e o prenderia ao Hero. Anime
  só o contêiner `data-hero-glow`, nunca a `section`.
- **`-z-10` some atrás do `body`.** Sem `isolate` (ou `relative z-0`) na
  `section`, as camadas com z-index negativo vão para trás do fundo do `body`.
- **Banding.** Gradientes roxos largos sobre fundo quase preto mostram faixas
  em telas de 8 bits. Mitigar com mais stops ou um ruído leve em
  `opacity` baixa; não usar imagem pesada.
- **Captura antes da animação.** O script headless pode fotografar o loop em
  qualquer fase; para comparação use reduced motion (estado estático
  determinístico) e deixe a captura com movimento só como evidência do AC #2.
- **Preservar:** o comentário "FR-07 inviolável" e o `data-hero-social`;
  o `ctx.revert()` no cleanup; a guarda `reduced || prefersReducedMotion()`
  da [4.3](4-3-reduced-motion.md); o seletor `[data-word]` do `<noscript>`
  da [4.4](4-4-conteudo-sem-javascript.md).

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência. (Falta o painel _Performance_ do AC #2 em navegador real; ver Change Log.)
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [x] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-14` já `RESOLVED`; nada mais a consumir.
- [x] Docs afetados (PRD FR-02, CLAUDE.md; AUDIT § 2 descreve o legado e não muda) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:**
- [src/sections/Hero/index.tsx](../../src/sections/Hero/index.tsx): sai o `backgroundImage`; a `section` passa a `relative overflow-hidden flex flex-col bg-secondary`, com o texto centralizado (`relative z-10`) e, abaixo dele, o palco `aria-hidden` `[data-hero-glow]` com 6 camadas (halo, bloom, reflexo, anel, núcleo, horizonte) mais o degradê de fusão com o About. `text-[#ad7dff]` virou `text-accent-span`.
- [src/app/globals.css](../../src/app/globals.css): bloco "Hero — brilho roxo animado" (`.hero-glow`, `.hero-glow__*`, `@keyframes heroGlowBreathe`/`heroHaloDrift`/`heroHorizonPulse`) e as camadas animadas no bloco `prefers-reduced-motion: reduce`.
- [src/sections/Hero/HeroClient.tsx](../../src/sections/Hero/HeroClient.tsx): o tween de `backgroundPositionY` virou `yPercent: 12` no `[data-hero-glow]`, no mesmo `gsap.context()`.
- Docs: [PRD.md](../PRD.md) (nota de exceção no FR-02), [CLAUDE.md](../../CLAUDE.md) (parallax e fundo do Hero), [QA-CHECKLIST.md](../QA-CHECKLIST.md) § 3; evidência em [hero_glow_1200.png](../references/qa/hero_glow_1200.png) e [hero_glow_375.png](../references/qa/hero_glow_375.png).

**O que divergiu do plano:**
- **O palco do brilho está no fluxo, não em `absolute inset-0 -z-10`.** Com o brilho absoluto, a altura do texto (muito maior em 375px) faria o anel passar atrás do parágrafo. No fluxo, abaixo do texto, isso não acontece em nenhuma altura de viewport.
- **Sem `isolate` na `section`.** Ele criaria um contexto de empilhamento e as seções seguintes passariam por cima do bloco social `fixed` (FR-07). O texto fica acima do halo com `relative z-10`.
- **Duas camadas a mais (bloom e núcleo)** do que as 4 planejadas. Sem elas, a primeira captura mostrou um arco branco duro, longe da referência.
- **AUDIT.md § 2 não mudou.** Ele inventaria o legado, que continua igual; a mudança do rebuild está no PRD (FR-02) e no CLAUDE.md.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-03 | TODO | Story criada sobre `94d4e2c`, a pedido do responsável (referência visual em [hero-glow-reference.png](../references/hero-glow-reference.png)); exceção ao FR-02 registrada como `PEND-14`. |
| 2026-11-03 | IN_PROGRESS | Iniciada sobre `94d4e2c`, com o aval do responsável ("continue"). O responsável confirmou que o nome é "Nexus Agency": o texto do legado fica como está. |
| 2026-11-03 | IN_PROGRESS | Implementada; validação na árvore de trabalho sobre `94d4e2c`. `npx tsc --noEmit` → OK. `npm run build` → exit 0, `/` 13.6 kB / 178 kB, sem warning. `npx next start -p 3008` + `node scripts/check_ids.js` → 6 IDs presentes. Sonda CDP temporária (fora do repositório) em 375/480/768/1024/1200: sem a foto `header.webp`, `h1` com opacidade 1, `scrollWidth === innerWidth` no Hero, 5 animações CSS com movimento e 0 com `reduce` (AC #2, #4); `yPercent` do brilho 22–30 px depois de rolar 600 px e `0` de volta ao topo e depois de resize 1200 → 375 → 1200 (AC #6, #7); fim do parágrafo acima do topo do anel em todas as larguras. Contraste (AC #3), com o texto oculto e o brilho forçado ao pico: pior fundo atrás do parágrafo `rgb(36,25,73)` em 480px, 16:1 contra o branco; `h1` 19.8:1. Sem JS (`OUT_DIR=<temp> node scripts/capture_nojs.js`): os 5 `[data-word]` em `rgb(255,255,255)` e o Hero com brilho e texto (AC #5). Emenda com o About sem linha visível, e bloco social `fixed` acima do About (captura rolada). `git diff 94d4e2c -- SocialIcons* WhatsAppFloat* constants.ts` vazio (AC #8). **Não verificado:** o painel _Performance_ do AC #2 (Layout/Paint por quadro) em navegador real; as camadas animam só `transform`/`opacity` pelo código. **Achado fora do escopo:** em 480px o documento tem 497 px de largura por causa de um card fora do Hero (`h4.text-lg.font-semibold` + `p.text-white/70 text-xs`); com o brilho escondido continua 497, então não vem desta story. Candidato à 4.1. |
| 2026-11-03 | IN_PROGRESS | Pedido do responsável depois do commit `d9b5a48`: "background se mexendo um pouco mais". Ciclos de 7–16 s para 5–12 s; anel com escala até 1.07 e opacidade de 0.78 a 1; bloom em keyframe próprio (`heroBloomPulse`, escala de 0.92 a 1.14); halo derivando também na vertical (±7% x, ±4% y, escala de 0.95 a 1.12); horizonte com `scaleX` de 0.86 a 1.1; reflexo passa a oscilar a opacidade (`heroReflectionFlicker`) e entrou no bloco de reduced motion. Revalidação sobre `d9b5a48` + árvore de trabalho: `tsc` OK, `build` exit 0; sonda CDP com 6 animações com movimento e 0 com `reduce` nos 5 viewports, parallax volta a `0` ao subir e depois de resize; contraste com o brilho no novo pico: pior fundo do parágrafo `rgb(42,29,81)` em 480px, 15:1. |
