---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 8.5 — Simplificar o sistema de motion e os estilos

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | TODO                                                                                    |
| **Fase**        | Fase 8 — Leveza, SEO e deploy no Cloudflare Pages                                       |
| **Área**        | motion, performance/SEO                                                                 |
| **Seções**      | About, Banners, Services, Contact, Footer, Projects, Hero (só `ScrollText`)             |
| **Tamanho**     | L — primitivas compartilhadas (`components/motion`, `animations/`, `hooks/`, `globals.css`) e várias seções |
| **Depende de**  | [6.9](6-9-remover-codigo-nao-usado.md) (`TODO` — tira o código morto antes, para não refatorar o que vai sair) |
| **Requisitos**  | FR-03, FR-04, FR-11, QA-CHECKLIST § 3 e § 6                                             |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

§ 4 de [CODE-REVIEW-2026-11-05.md](../CODE-REVIEW-2026-11-05.md). Em `3a87d86` (`/` com 187 kB de First Load JS no `npm run build`):

- **Cinco wrappers client repetem o mesmo efeito.** [AboutClient](../../src/sections/About/AboutClient.tsx), [BannersClient](../../src/sections/Banners/BannersClient.tsx), [ServicesClient](../../src/sections/Services/ServicesClient.tsx), [FooterClient](../../src/components/layout/FooterClient.tsx) e o `useEffect` de [Contact](../../src/sections/Contact/index.tsx) fazem: `useReducedMotion()` + `prefersReducedMotion()` + `gsap.matchMedia(REVEAL_MEDIA)` + `scrubReveal(querySelectorAll("[data-x]"), { y: revealY(conditions, N) })`. Só mudam o seletor, o `y` e o `extra`.
- **Reduced motion em duas camadas.** Cada efeito lê o hook ([useReducedMotion.ts](../../src/hooks/useReducedMotion.ts)) e o leitor síncrono (story [4.3](4-3-reduced-motion.md)), com um listener de `matchMedia` por componente. O `gsap.matchMedia()` aceita `(prefers-reduced-motion: no-preference)` como condição e reverte tudo sozinho quando a preferência muda.
- **`ScrollText` grava a cor inicial inline em cada palavra** (`style="color:rgba(255,255,255,0.22);display:inline"`, ~75 vezes só no parágrafo do Hero). Por isso o `<noscript>` de [layout.tsx](../../src/app/layout.tsx) e a regra de reduced motion de [globals.css](../../src/app/globals.css) precisam de `!important`.
- **[FluidButton.tsx](../../src/components/ui/FluidButton.tsx)** monta a mesma string de classes três vezes; para âncora `#` usa `next/link`, que não traz nada a um `<a>`.
- **`SITE_CONFIG.formspree`** guarda `formId` e `endpoint`, que é `formId` com prefixo.
- **[globals.css](../../src/app/globals.css):** `html, body` repete `font-family`/`background` que o Tailwind e o `<body>` já dão; `--gradient`, `--max-width`, `--text-light` sem uso; `.icon` e `.fa-whatsapp` são seletores globais genéricos; `.whatsapp-link` tem `transition: transform 0.4s` no mesmo nó que o GSAP anima (`scale`), o que amolece a mola (achado 2.6).
- **Hex solto:** mais de 60 ocorrências de `#a15cf5`, `#04091d`, `#0f1221`, `#ad7dff`, `#03060f` em `src/` (`grep -rc`), contra a regra do [CLAUDE.md](../../CLAUDE.md), com tokens já disponíveis.
- **Custo do vidro no celular:** ~27 elementos com `backdrop-filter: blur(14px)` com opacidade/transform atrelados ao scroll, mais 6 camadas `will-change` em loop no Hero. Nunca foi medido em aparelho de entrada.

Resultado pretendido: menos código, um só caminho de reveal e de reduced motion, mesma experiência — nenhuma mudança visual ou de movimento.

## Escopo

1. `<RevealRoot>` client (ou hook `useScrubReveal(ref, specs)`) que lê `[data-reveal]` + `data-reveal-y` / `data-reveal-pop`; seções voltam a Server Component puro (o `<section>` com `id` e classes volta para o `index.tsx`).
2. Reduced motion pela condição do `gsap.matchMedia()`; `useReducedMotion`/`prefersReducedMotion` saem se ninguém mais precisar.
3. `ScrollText` com a cor inicial em classe CSS (`.scroll-word`), sem estilo inline; `<noscript>` e reduced motion sem `!important`.
4. Helper único de classes no `FluidButton`; `<a>` simples para âncoras.
5. `formspree.endpoint` derivado de `formId`.
6. Limpeza do `globals.css` e troca de hex por tokens.
7. `transition` de `transform` fora do `.whatsapp-link` (achado 2.6).
8. Medir o vidro em Android de entrada (CPU 4× + perfil de GPU); se passar do orçamento, abrir `PEND` com a proposta (ex.: sem `backdrop-filter` abaixo de 768px).

**Se for preciso cortar:** na ordem, saem 8 (vira tarefa), 6 (hex), 4, 5. Os itens 1–3 são o coração da story.

## Fora de escopo

- **Não muda nenhum timing, distância, easing ou ponto de início/fim.** Os valores da [4.2](4-2-distancias-intensidades-por-breakpoint.md) ficam iguais.
- **Não muda a cor inicial de 22% do `ScrollText`.** É o FR-03 aprovado; o contraste fica com a 4.6.
- **Não mexe na entrada do Hero.** [4.8](4-8-piscar-hero-hidratacao.md).
- **Não altera o visual do vidro.** Só mede; mudança vira `PEND`.

## Decisões

- **Decidido** um único componente de reveal guiado por `data-*`, **descartado** manter um wrapper por seção, **porque** os cinco são o mesmo código com parâmetros diferentes; o padrão "Server + Client por seção" do CLAUDE.md continua valendo para os efeitos que não são reveal (contador do About, Flip dos Projetos, parallax do Hero).
- **Decidido** reduced motion via condição do `gsap.matchMedia()`, **descartado** o hook + leitor síncrono, **porque** o GSAP já reverte e refaz ao mudar a preferência, o que elimina a armadilha da 4.3 por construção.
- **Decidido** cor inicial em classe CSS, **descartado** inline, **porque** a regra de não piscar (o servidor já sai em 22%) continua atendida, e as exceções de `!important` deixam de existir.

## Critérios de aceite

### AC #1 — Mesmo movimento, nos dois sentidos

Para cada alvo que hoje tem reveal (About, Banners, Services, Pacotes, Contact, Footer, Projetos), a opacidade e o `y` em cada posição de scroll batem com o baseline — mesma sonda da [4.2](4-2-distancias-intensidades-por-breakpoint.md) (0 desvios > 0,08) em 375 e 1200, descendo, subindo, no resize 1200 ↔ 375 e após o filtro dos Projetos.

### AC #2 — Reduced motion

Com `prefers-reduced-motion: reduce` desde o carregamento: tudo visível, nenhum reveal, `ScrollText` em branco pleno. Ligando a preferência com a página aberta no meio do scroll: tudo volta ao estado final visível sem recarregar. Desligando: o movimento volta.

### AC #3 — Sem JS / antes da hidratação

Com JS desligado, todos os blocos visíveis e o `ScrollText` em branco pleno (`node scripts/capture_nojs.js`), igual a [nojs_1200.png](../references/qa/nojs_1200.png).

### AC #4 — Menos código no cliente

`AboutClient`, `BannersClient`, `ServicesClient` e `FooterClient` não existem mais (ou não carregam GSAP); as seções About, Banners, Services e o Footer são Server Components. First Load JS de `/` igual ou menor que 187 kB. Nenhum `!important` resta para `[data-word]`.

### AC #5 — Visual idêntico

Capturas em 375/768/1200 iguais ao baseline (cores, incluindo a troca de hex por token, que deve resolver para o mesmo valor). Mola do WhatsApp sem o atraso do `transition` (hover com mouse em 1200px).

### AC #6 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes, sem warning de hidratação; `node scripts/check_ids.js` ok; nenhum item do QA-CHECKLIST § 9 violado; SHA no Change Log.

## Plano técnico

- `src/components/motion/RevealRoot.tsx` (client), montado uma vez no [layout.tsx](../../src/app/layout.tsx) ou em [page.tsx](../../src/app/page.tsx); reaproveita [scrubReveal.ts](../../src/animations/scrubReveal.ts) e `popInside`.
- Seções: trocar `data-about-para`/`data-banner-card`/... por `data-reveal data-reveal-y="30"` (e `data-reveal-pop` para ícone/selo). Projetos mantém seu efeito próprio (Flip refaz os triggers) mas usa o mesmo helper.
- [ScrollText.tsx](../../src/components/motion/ScrollText.tsx): classe `.scroll-word` em [globals.css](../../src/app/globals.css) com `color: rgb(255 255 255 / 0.22)`; GSAP anima a partir dela.
- [FluidButton.tsx](../../src/components/ui/FluidButton.tsx): `fluidClasses({ variant, pulse, isActive, className })`.
- [constants.ts](../../src/lib/constants.ts): `endpoint` vira getter/derivado.
- Atualizar [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 2 (GSAP, Leitura progressiva), [ARCHITECTURE.md](../ARCHITECTURE.md) §§ 3, 5 e o [CLAUDE.md](../../CLAUDE.md) (padrão Server + Client, `useReducedMotion`, `<noscript>`).

**Regras que se aplicam:** `gsap.context()`/`matchMedia().revert()` no cleanup; só `transform`/`opacity`/`color`; sem `pin`; `fromTo` com destino explícito (story 4.7); posições por `offsetTop` (story 4.2); botões sociais e WhatsApp intocados no visual.

## Tasks

- [ ] Sonda de baseline da 4.2 gravada antes de mexer (AC #1)
- [ ] `RevealRoot` + migração das seções (AC #1, AC #4)
- [ ] Reduced motion por `matchMedia` (AC #2)
- [ ] `ScrollText` com classe (AC #3)
- [ ] FluidButton, Formspree, globals.css, hex → token, transição do WhatsApp (AC #5)
- [ ] Medir o vidro em CPU 4× (item 8)
- [ ] Docs (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md)
- [ ] Validação (AC #6)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sempre | `npx tsc --noEmit`, `npm run build` (comparar First Load JS) |
| movimento | reveals | sonda CDP da 4.2 antes × depois, 375/1200, nos dois sentidos, resize, filtro |
| movimento | reduced motion | emulação `prefers-reduced-motion` ligada no carregamento e no meio da página |
| sem JS | todos os blocos | `node scripts/capture_nojs.js` |
| visual | página inteira | capturas 375/768/1200 antes × depois |
| performance | vidro | trace com CPU 4× no Chrome, quadros > 50 ms |
| QA-CHECKLIST | § 3, § 6, § 9 | |

## Riscos e armadilhas

- `gsap.matchMedia()` com a condição de reduced motion: o callback roda só quando a condição é verdadeira; os `gsap.set` precisam estar dentro dele, senão ficam aplicados com `reduce`.
- Um `RevealRoot` global roda antes de as seções estarem medidas? Não — o efeito roda depois do commit do React; mas o Flip dos Projetos muda alturas e precisa chamar `ScrollTrigger.refresh()` como hoje.
- Trocar hex por token com alfa (`bg-[#a15cf5]/10` → `bg-primary-dark/10`) só funciona se o token suportar opacidade no Tailwind; `var(--x)` em hex não suporta. Pode exigir declarar os tokens como canais RGB. Conferir cor a cor.
- **Preservar** a exceção dos Projetos (scrub no filho `[data-project-reveal]`, Flip no `[data-project-card]`) e o contador do About (restaura o texto no cleanup).

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência.
- [ ] `npx tsc --noEmit` verde.
- [ ] `npm run build` verde, sem warning de hidratação/SSR.
- [ ] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [ ] `PEND-xx` consumido: nenhum (abre um se a medição do vidro pedir).
- [ ] Docs afetados (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao implementar.>

**O que divergiu do plano:** <preenchido ao implementar.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`, a partir da [revisão de código](../CODE-REVIEW-2026-11-05.md) § 4 e achado 2.6. |
