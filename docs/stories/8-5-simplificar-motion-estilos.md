---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 8.5 — Simplificar o sistema de motion e os estilos

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 8 — Leveza, SEO e deploy no Cloudflare Pages                                       |
| **Área**        | motion, performance/SEO                                                                 |
| **Seções**      | About, Banners, Services, Contact, Footer, Projects, Hero (só `ScrollText`)             |
| **Tamanho**     | L — primitivas compartilhadas (`components/motion`, `animations/`, `hooks/`, `globals.css`) e várias seções |
| **Depende de**  | [6.9](6-9-remover-codigo-nao-usado.md) (`DONE`, `fca5e37`); [4.8](4-8-piscar-hero-hidratacao.md) (`TODO` — dispensada pelo responsável em 2026-11-05: a 8.5 foi antes, e no Hero só a guarda de reduced motion mudou); [8.4](8-4-metadados-dados-estruturados.md) (`DONE`, `ad2aa8c` — tocou `layout.tsx`, `constants.ts`, `Footer.tsx`, `Navbar.tsx`) |
| **Requisitos**  | FR-03, FR-04, FR-11, QA-CHECKLIST § 3 e § 6                                             |
| **Baseline**    | `3a87d86` — o "hoje" do Contexto vale nesse commit; os números foram reconferidos em `fca5e37`. As medidas de antes (sonda, First Load JS, capturas) são tomadas no HEAD do início da implementação |

## Contexto

§ 4 de [CODE-REVIEW-2026-11-05.md](../CODE-REVIEW-2026-11-05.md). Em `3a87d86` (`/` com 187 kB de First Load JS no `npm run build`):

- **Cinco wrappers client repetem o mesmo efeito.** [AboutClient](../../src/sections/About/AboutClient.tsx), [BannersClient](../../src/sections/Banners/BannersClient.tsx), [ServicesClient](../../src/sections/Services/ServicesClient.tsx), [FooterClient](../../src/components/layout/FooterClient.tsx) e o `useEffect` de [Contact](../../src/sections/Contact/index.tsx) fazem: `useReducedMotion()` + `prefersReducedMotion()` + `gsap.matchMedia(REVEAL_MEDIA)` + `scrubReveal(querySelectorAll("[data-x]"), { y: revealY(conditions, N) })`. Só mudam o seletor, o `y` e o `extra`.
- **Reduced motion em duas camadas.** Cada efeito lê o hook ([useReducedMotion.ts](../../src/hooks/useReducedMotion.ts)) e o leitor síncrono (story [4.3](4-3-reduced-motion.md)), com um listener de `matchMedia` por componente. O `gsap.matchMedia()` aceita `(prefers-reduced-motion: no-preference)` como condição e reverte tudo sozinho quando a preferência muda. Além dos cinco reveals, usam o hook em `fca5e37`: [HeroClient](../../src/sections/Hero/HeroClient.tsx), [ScrollText](../../src/components/motion/ScrollText.tsx), [Projects](../../src/sections/Projects/index.tsx) (efeito de reveal e handler do filtro), [WhatsAppFloat](../../src/components/ui/WhatsAppFloat.tsx) e [Navbar](../../src/components/layout/Navbar.tsx) (dentro do clique do menu, fora de qualquer efeito).
- **`ScrollText` grava a cor inicial inline em cada palavra** (`style="color:rgba(255,255,255,0.22);display:inline"`, ~75 vezes só no parágrafo do Hero). Por isso o `<noscript>` de [layout.tsx](../../src/app/layout.tsx) e a regra de reduced motion de [globals.css](../../src/app/globals.css) precisam de `!important`.
- **[FluidButton.tsx](../../src/components/ui/FluidButton.tsx)** monta a mesma string de classes três vezes; para âncora `#` usa `next/link`, que não traz nada a um `<a>`.
- **`SITE_CONFIG.formspree`** guarda `formId` e `endpoint`, que é `formId` com prefixo.
- **[globals.css](../../src/app/globals.css):** `html, body` repete `font-family`/`background` que o Tailwind e o `<body>` já dão; `--gradient`, `--max-width`, `--text-light` sem uso; `.whatsapp-link` tem `transition: transform 0.4s` no mesmo nó que o GSAP anima (`scale`), o que amolece a mola (achado 2.6; o pulso `WaveWhatsApp` anima `box-shadow` e não é afetado). `.icon` e `.fa-whatsapp` são seletores genéricos, mas são as classes dos botões sociais ([SocialIcons](../../src/components/ui/SocialIcons.tsx), FR-07) e do ícone do WhatsApp (FR-06) — ficam como estão.
- **Hex solto:** 51 ocorrências de `#a15cf5`, `#04091d`, `#0f1221`, `#ad7dff`, `#03060f` em `src/` em `fca5e37` (14 no `globals.css`, parte delas as próprias definições dos tokens), contra a regra do [CLAUDE.md](../../CLAUDE.md). Nos `.tsx`, 6 usos têm alfa (`bg-[#0f1221]/50`, `bg-[#04091d]/85`, `shadow-[#a15cf5]/20`, `border-[#a15cf5]/20`, `hover:border-[#a15cf5]/40`, `bg-[#a15cf5]/20`) e só migram se os tokens do [tailwind.config.ts](../../tailwind.config.ts) aceitarem alfa — hoje são `var(--x)` em hex, que não aceitam.
- **Custo do vidro no celular:** ~27 elementos com `backdrop-filter: blur(14px)` com opacidade/transform atrelados ao scroll, mais 6 camadas `will-change` em loop no Hero. Nunca foi medido em aparelho de entrada.

Resultado pretendido: menos código, um só caminho de reveal e de reduced motion, mesma experiência — nenhuma mudança visual ou de movimento.

## Escopo

1. `<RevealRoot>` client, montado no [layout.tsx](../../src/app/layout.tsx) (o Footer é montado lá; no `page.tsx` o rodapé perderia o reveal), que lê `[data-reveal]` com os atributos:
   - `data-reveal-y="<px desktop>"` — `y` inicial acima de 768px (até 768px vale `revealY`, 24px);
   - `data-reveal-scale="<escala>"` — escala inicial (CTA do Contact, `0.92`);
   - `data-reveal-pop="<seletor>"` + `data-reveal-pop-at="<0–1>"` — `popInside` do ícone/selo e a posição dele na timeline (Banners `0.5`, Services `0`).
   As seções voltam a Server Component puro (o `<section>` com `id` e classes volta para o `index.tsx`). Projetos e Contact mantêm o próprio efeito (Flip / formulário), mas leem os mesmos atributos pelo mesmo helper.
2. Reduced motion pela condição `(prefers-reduced-motion: no-preference)` do `gsap.matchMedia()` em **todo efeito GSAP**: reveals, `ScrollText`, Projetos (reveal), Hero (só a guarda — timings e entrada intocados), `WhatsAppFloat`. O hook `useReducedMotion` sai. O leitor síncrono `prefersReducedMotion()` fica só para handlers de evento fora de efeito (clique do menu da Navbar, troca de filtro dos Projetos), onde não há `matchMedia` para reverter.
3. `ScrollText` com a cor inicial em classe CSS (`.scroll-word`), sem estilo inline; `<noscript>` e reduced motion sem `!important`.
4. Helper único de classes no `FluidButton`; `<a>` simples para âncoras.
5. `formspree.endpoint` derivado de `formId`.
6. Limpeza do `globals.css` (`html, body` redundante, `--gradient`, `--max-width`, `--text-light`) e troca de hex por tokens. Os tokens viram canais RGB (`--primary-color-dark-rgb: 161 92 245`, exposto como `rgb(var(--…-rgb) / <alpha-value>)` no Tailwind) para cobrir os 6 usos com alfa. `.icon` e `.fa-whatsapp` não mudam (FR-07/FR-06).
7. `transition` de `transform` fora do `.whatsapp-link` (achado 2.6). Mexe só na microinteração GSAP do `WhatsAppFloat`, que o CLAUDE.md permite; visual, posição, link e pulso `WaveWhatsApp` intocados.
8. Medir o vidro em Android de entrada (CPU 4× no Chrome): rolar a página inteira em 375px. Orçamento: nenhum quadro > 50 ms. Se passar, abrir `PEND` com a proposta (ex.: sem `backdrop-filter` abaixo de 768px).

**Se for preciso cortar:** na ordem, saem 8 (vira tarefa), 6 (hex), 4, 5. Os itens 1–3 são o coração da story.

## Fora de escopo

- **Não muda nenhum timing, distância, easing ou ponto de início/fim.** Os valores da [4.2](4-2-distancias-intensidades-por-breakpoint.md) ficam iguais.
- **Não muda a cor inicial de 22% do `ScrollText`.** É o FR-03 aprovado; o contraste fica com a 4.6.
- **Não mexe na entrada do Hero.** [4.8](4-8-piscar-hero-hidratacao.md).
- **Não altera o visual do vidro.** Só mede; mudança vira `PEND`.
- **Não toca `.icon` (botões sociais, FR-07) nem `.fa-whatsapp` (WhatsApp, FR-06)**, embora sejam seletores globais genéricos — mudá-los exigiria autorização que a story não tem.
- **Não troca o leitor síncrono nos handlers de clique** (Navbar, filtro dos Projetos): não há `matchMedia` que os reverta.

## Decisões

- **Decidido** um único componente de reveal guiado por `data-*`, **descartado** manter um wrapper por seção, **porque** os cinco são o mesmo código com parâmetros diferentes; o padrão "Server + Client por seção" do CLAUDE.md continua valendo para os efeitos que não são reveal (contador do About, Flip dos Projetos, parallax do Hero).
- **Decidido** reduced motion via condição do `gsap.matchMedia()`, **descartado** o hook + leitor síncrono, **porque** o GSAP já reverte e refaz ao mudar a preferência, o que elimina a armadilha da 4.3 por construção.
- **Decidido** cor inicial em classe CSS, **descartado** inline, **porque** a regra de não piscar (o servidor já sai em 22%) continua atendida, e as exceções de `!important` deixam de existir.

## Critérios de aceite

### AC #1 — Mesmo movimento, nos dois sentidos

Para cada alvo que hoje tem reveal (About, Banners com ícone, Services com selo, Pacotes, Contact incluindo o `scale` do CTA, Footer, Projetos), a opacidade, o `translateY` e a escala em cada posição de scroll batem com o baseline (0 desvios > 0,08 em opacidade/escala, 0 desvios > 1 px em `y`) em 375 e 1200, descendo, subindo, no resize 1200 ↔ 375 e após o filtro dos Projetos.

A sonda da [4.2](4-2-distancias-intensidades-por-breakpoint.md) era temporária e não está em `scripts/`: recriá-la numa pasta fora do repositório (CDP, um ponto a cada 50 px, lendo opacidade, `transform` computado e topo por `offsetTop` de cada `[data-*]` de reveal) e gravar o **antes no HEAD de início, com o mesmo script** que grava o depois. Antes × depois de scripts diferentes não vale como evidência.

### AC #2 — Reduced motion

Com `prefers-reduced-motion: reduce` desde o carregamento: tudo visível, nenhum reveal, `ScrollText` em branco pleno, sem parallax no Hero e sem mola no hover do WhatsApp. Ligando a preferência com a página aberta no meio do scroll: tudo volta ao estado final visível sem recarregar. Desligando: o movimento volta. Abrir/fechar o menu mobile e trocar o filtro dos Projetos com `reduce` continuam sem animação. `grep -rn useReducedMotion src` não retorna nada.

### AC #3 — Sem JS / antes da hidratação

Com JS desligado, todos os blocos visíveis e o `ScrollText` em branco pleno (`node scripts/capture_nojs.js`), igual à auditoria sem JS da [story 4.4](4-4-conteudo-sem-javascript.md).

### AC #4 — Menos código no cliente

`AboutClient`, `BannersClient`, `ServicesClient` e `FooterClient` não existem mais (ou não carregam GSAP; o contador do About segue num client próprio); as seções About, Banners, Services e o Footer são Server Components, e o `RevealRoot` está no `layout.tsx`. First Load JS de `/` igual ou menor que o medido no HEAD de início (187 kB em `fca5e37`). Nenhum `!important` resta para `[data-word]`.

### AC #5 — Visual idêntico

Capturas em 375/768/1200 iguais ao baseline. Para a troca de hex por token, `getComputedStyle` de cada elemento trocado (incluindo os 6 com alfa e os estados `hover`/`focus`) devolve o mesmo `rgb()`/`rgba()` de antes. Botões sociais e WhatsApp sem diferença de visual. Mola do WhatsApp sem o atraso do `transition` (hover com mouse em 1200px).

### AC #7 — Vidro medido

Trace com CPU 4× no Chrome, 375px, rolando a página inteira de cima a baixo: quadros > 50 ms contados e anotados na Execução. Se houver algum, `PEND-xx` aberto no `TASKS.md` com a proposta; nenhuma mudança visual nesta story.

### AC #6 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes, sem warning de hidratação; `node scripts/check_ids.js` ok; nenhum item do QA-CHECKLIST § 9 violado; SHA no Change Log.

## Plano técnico

- `src/components/motion/RevealRoot.tsx` (client), montado uma vez no [layout.tsx](../../src/app/layout.tsx); reaproveita [scrubReveal.ts](../../src/animations/scrubReveal.ts) e `popInside`. Um helper em `scrubReveal.ts` lê os `data-reveal-*` de um alvo e devolve as opções; `RevealRoot`, Projetos e Contact o chamam. Condições do `matchMedia`: `REVEAL_MEDIA` combinado com `(prefers-reduced-motion: no-preference)`.
- Seções: trocar `data-about-para`/`data-banner-card`/... por `data-reveal data-reveal-y="30"` (`data-reveal-scale` no CTA do Contact, `data-reveal-pop` + `data-reveal-pop-at` para ícone/selo). Projetos mantém seu efeito próprio (Flip refaz os triggers) mas usa o mesmo helper. O contador do About fica num client pequeno próprio.
- Tokens: `--primary-color-dark-rgb`, `--secondary-color-rgb`, `--secondary-color-light-rgb`, `--secondary-color-dark-rgb`, `--span-rgb` em canais; [tailwind.config.ts](../../tailwind.config.ts) com `rgb(var(--…-rgb) / <alpha-value>)`.
- [ScrollText.tsx](../../src/components/motion/ScrollText.tsx): classe `.scroll-word` em [globals.css](../../src/app/globals.css) com `color: rgb(255 255 255 / 0.22)`; GSAP anima a partir dela.
- [FluidButton.tsx](../../src/components/ui/FluidButton.tsx): `fluidClasses({ variant, pulse, isActive, className })`.
- [constants.ts](../../src/lib/constants.ts): `endpoint` vira getter/derivado.
- Atualizar [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 2 (GSAP, Leitura progressiva), [ARCHITECTURE.md](../ARCHITECTURE.md) §§ 3, 5 e o [CLAUDE.md](../../CLAUDE.md) (padrão Server + Client, `useReducedMotion`, `<noscript>`).

**Regras que se aplicam:** `gsap.context()`/`matchMedia().revert()` no cleanup; só `transform`/`opacity`/`color`; sem `pin`; `fromTo` com destino explícito (story 4.7); posições por `offsetTop` (story 4.2); botões sociais e WhatsApp intocados no visual.

## Tasks

- [x] ~~Conferir que a 4.8 está `DONE`~~ — dependência dispensada pelo responsável; SHA de início `147aea4`
- [x] Recriar a sonda (fora do repositório) e gravar o baseline no SHA de início; anotar First Load JS e cores computadas (AC #1, AC #4, AC #5)
- [x] `RevealRoot` + migração das seções (AC #1, AC #4)
- [x] Reduced motion por `matchMedia` em todos os efeitos; hook removido (AC #2)
- [x] `ScrollText` com classe (AC #3)
- [x] FluidButton, Formspree, globals.css, tokens em canais RGB + hex → token, transição do WhatsApp (AC #5)
- [x] Medir o vidro em CPU 4× (AC #7)
- [x] Docs (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md)
- [x] Validação (AC #6)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sempre | `npx tsc --noEmit`, `npm run build` (comparar First Load JS) |
| movimento | reveals | sonda CDP recriada (mesmo script antes × depois), 375/1200, nos dois sentidos, resize, filtro |
| movimento | reduced motion | emulação `prefers-reduced-motion` ligada no carregamento e no meio da página; menu mobile e filtro com `reduce` |
| sem JS | todos os blocos | `node scripts/capture_nojs.js` (dev server na 3008 — em outra porta o script grava a página de erro e sai 0) |
| visual | página inteira | capturas 375/768/1200 antes × depois; `getComputedStyle` dos elementos com hex trocado |
| performance | vidro | trace com CPU 4× no Chrome, 375px, página inteira, quadros > 50 ms |
| QA-CHECKLIST | § 3, § 6, § 9 | |

## Riscos e armadilhas

- `gsap.matchMedia()` com a condição de reduced motion: o callback roda só quando a condição é verdadeira; os `gsap.set` precisam estar dentro dele, senão ficam aplicados com `reduce`.
- Um `RevealRoot` global roda antes de as seções estarem medidas? Não — o efeito roda depois do commit do React; mas o Flip dos Projetos muda alturas e precisa chamar `ScrollTrigger.refresh()` como hoje.
- Trocar hex por token com alfa (`bg-[#a15cf5]/10` → `bg-primary-dark/10`) só funciona se o token suportar opacidade no Tailwind; `var(--x)` em hex não suporta. Pode exigir declarar os tokens como canais RGB. Conferir cor a cor.
- **Preservar** a exceção dos Projetos (scrub no filho `[data-project-reveal]`, Flip no `[data-project-card]`) e o contador do About (restaura o texto no cleanup).

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento feita nos viewports afetados (capturas conferidas numa pasta temporária fora do repositório, sem commitar).
- [x] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-xx` consumido: nenhum; a medição do vidro não pediu um (0 quadros > 50 ms).
- [x] Docs afetados (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md) atualizados — e README, skills `implement`/`review-mr`/`story`/`tdd`, que citavam o código removido.
- [x] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** novos [RevealRoot.tsx](../../src/components/motion/RevealRoot.tsx), [reducedMotion.ts](../../src/animations/reducedMotion.ts) (`prefersReducedMotion`, `keepScrollOnMediaChange`) e [MetricCounter.tsx](../../src/sections/About/MetricCounter.tsx); removidos `AboutClient`, `BannersClient`, `ServicesClient`, `FooterClient` e `src/hooks/useReducedMotion.ts`; alterados [scrubReveal.ts](../../src/animations/scrubReveal.ts) (`revealOptions`, `revealAll`, `matchReveal`), [presets.ts](../../src/animations/presets.ts) (`MOTION_MEDIA.motionOk`), [layout.tsx](../../src/app/layout.tsx), [globals.css](../../src/app/globals.css), [tailwind.config.ts](../../tailwind.config.ts), [ScrollText.tsx](../../src/components/motion/ScrollText.tsx), [FluidButton.tsx](../../src/components/ui/FluidButton.tsx), [RollingText.tsx](../../src/components/ui/RollingText.tsx), [WhatsAppFloat.tsx](../../src/components/ui/WhatsAppFloat.tsx), [Navbar.tsx](../../src/components/layout/Navbar.tsx), [Footer.tsx](../../src/components/layout/Footer.tsx), [constants.ts](../../src/lib/constants.ts), [about.ts](../../src/data/about.ts) (comentário) e as seções About, Banners, Services, Contact, Projects e Hero; docs [CLAUDE.md](../../CLAUDE.md), [README.md](../../README.md), [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md), [ARCHITECTURE.md](../ARCHITECTURE.md) e as skills `implement`, `review-mr`, `story`, `tdd`.

**O que divergiu do plano:**

- **Ordem:** implementada antes da [4.8](4-8-piscar-hero-hidratacao.md), por decisão do responsável (2026-11-05). No Hero só a guarda de reduced motion mudou; a entrada fica para a 4.8.
- **`data-reveal-pop-scale`, não `data-reveal-pop-at`:** o 2º parâmetro do `popInside` é a escala inicial do ícone/selo (Banners `0.5`, Services `0`), não a posição na timeline (fixa em `0.4`). A story trocou os dois; o código preserva o comportamento.
- **`data-reveal-scope`:** não previsto. Projetos e Contact marcam o contêiner; o `RevealRoot` pula o que está dentro dele e o efeito da seção pega só o seu, sem trigger em dobro.
- **`keepScrollOnMediaChange`** ([reducedMotion.ts](../../src/animations/reducedMotion.ts)), não previsto, necessário para o AC #2: ao desligar reduced motion com a página aberta, os ScrollTriggers recriados zeravam a memória de scroll e a página voltava ao topo (GSAP 3.15). Guarda o `scrollY` no evento `revert` e o restaura no `matchMedia`.
- **Mola do WhatsApp:** a `transition: transform 0.4s` saiu (achado 2.6); o efeito agora é a mola `elastic` sem amortecimento — mudança de movimento intencional, prevista no escopo item 7 e no AC #5.

**Medições** (todas sobre `out/` servido estático; o baseline é o `147aea4` construído numa worktree temporária e servido em paralelo; sondas CDP numa pasta temporária fora do repositório, apagada depois):

- **AC #1** — sonda (opacidade, `translateY` e escala computados + topo por `offsetTop` de 48 alvos, um ponto a cada 50 px, relógio da página acelerado 20× igual nos dois builds para o scrub assentar), **mesmo script** antes × depois: 375 descendo e subindo (491 pontos), 1200 descendo e subindo (255), resize 1200 → 375 (246), resize 375 → 1200 (128), filtro dos Projetos em 375 (246) e 1200 (128): **0 desvios** em todas as grandezas (Δopacidade 0,000, Δy 0,0 px, Δescala 0,000, Δtopo 0 px). A sonda enxerga o movimento: 366 leituras em opacidade parcial em 375, `y` até 24 px em 375 e 55 px em 1200, escalas do CTA/ícones, alvos voltando a 0 ao subir. Repetição da mesma passada: 0 desvio (ruído da sonda nulo).
- **AC #2** — `reduce` desde o carregamento, 1200 e 375, 5 posições: 0 alvo animado (os 7–8 com `transform` são estáticos de layout — `translateY(-50%)` do bloco social, `-translate` dos selos, `scale-105` do pacote em destaque — idênticos no baseline), 142/142 palavras do `ScrollText` em branco, brilho do Hero sem `transform`, hover do WhatsApp sem escala. Ligando `reduce` em `scrollY` 2600: tudo no estado final, palavras brancas, `scrollY` 2600; desligando: movimento de volta (29–44 alvos fora do final, 31 palavras em 22%), `scrollY` 2600. Menu mobile e filtro com `reduce`: estado final 30 ms depois do clique. `grep -rn useReducedMotion src`: vazio.
- **AC #3** — `node scripts/capture_nojs.js`: 5 textos em branco pleno, rodapé presente, capturas 375/1200 **idênticas byte a byte** às do baseline.
- **AC #4** — os 4 wrappers não existem; About, Banners, Services e Footer são Server Components; `RevealRoot` no `layout.tsx`. First Load JS de `/`: **184 kB** (baseline 187 kB). Nenhum `!important` para `[data-word]`.
- **AC #5** — capturas da página inteira (reduced motion, botão do WhatsApp mascarado pelo pulso CSS) 375×13113, 768×9069, 1200×7237: **0 pixels diferentes** (uma rodada em 375 deu 11 px isolados que não se repetiram em duas novas rodadas — ruído de rasterização). `getComputedStyle` (cor, fundo, gradiente, bordas, sombra, outline, `accent-color`, ring) de 611 elementos visíveis × 2 larguras: 0 diferença; com `:hover`, `:focus` e `:focus-visible` forçados (131/95/95 elementos): 0 diferença além da serialização do gradiente do `fluid-btn__overlay` (`rgb(…), rgb(…)` × `rgb(…) 0px, rgb(…) 100%`, mesma renderização). Mola do WhatsApp com mouse em 1200: baseline `transition: transform 0.4s`, escala 1,00 → 1,08 em 360 ms; agora `all 0s`, pico 1,20 e assenta em ~1,18.
- **AC #7** — 375×812, CPU 4×, gesto de toque do topo ao fim (12 301 px, ~21 s), 3 rodadas: **0 quadros > 50 ms** pelos intervalos de rAF e pelos `BeginFrame` do trace, maior quadro 33–50 ms, p95 17 ms, 0 tarefas > 50 ms (baseline: 2 quadros > 50 ms numa das 3 rodadas). Chrome headless num Mac com CPU 4×, não um aparelho Android real. Nenhum `PEND` aberto.
- **AC #6** — `npx tsc --noEmit` e `npm run build` verdes, sem warning; `node scripts/check_ids.js` ok (5 seções + 5 âncoras de serviço); console com 0 erro/warning/exceção em 375 e 1200 rolando a página inteira nos dois sentidos e trocando 3 filtros.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`, a partir da [revisão de código](../CODE-REVIEW-2026-11-05.md) § 4 e achado 2.6. |
| 2026-11-05 | TODO | Validada sobre `fca5e37`: dependências (6.9 e 8.4 `DONE`, 4.8 antes); reduced motion via `matchMedia` em todo efeito GSAP, leitor síncrono só nos handlers de clique; `.icon`/`.fa-whatsapp` fora (FR-07/FR-06); hex recontado (51, 6 com alfa → tokens em canais RGB); atributos `data-reveal-scale`/`-pop-at`; `RevealRoot` no `layout.tsx`; sonda recriada com o mesmo script antes × depois; AC #7 do vidro com orçamento de 50 ms. |
| 2026-11-05 | IN_PROGRESS | Implementada sobre `147aea4`, antes da 4.8 por decisão do responsável. |
| 2026-11-06 | DONE | Revisada e validada na árvore de trabalho sobre `147aea4`: `tsc` e `build` verdes (First Load JS 187 → 184 kB), sonda antes × depois com 0 desvio em 375/1200, nos dois sentidos, resize e filtro; reduced motion no carregamento e alternado no meio da página; sem JS idêntico ao baseline; capturas 375/768/1200 e cores computadas sem diferença; CPU 4× sem quadro > 50 ms; `check_ids` ok; console limpo. Detalhes na Execução. |
