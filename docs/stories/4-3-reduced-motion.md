---
baseline_commit: b9eea514b99527d5eca2a182359b88c4c5d4f186
---

# Story 4.3 — Implementar reduced motion

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 4 — Responsividade e acessibilidade                                                |
| **Área**        | a11y, motion                                                                            |
| **Seções**      | Hero, About, Services (leitura progressiva); global (hook, `globals.css`); verificação em todas |
| **Tamanho**     | M — corrige a primitiva compartilhada `useReducedMotion` e o `ScrollText`, toca os 12 efeitos com GSAP (uma linha cada) e o `globals.css`. Não muda o `layout.tsx` nem acrescenta dependência. |
| **Depende de**  | [4.4](4-4-conteudo-sem-javascript.md) (`DONE` — padrão de fallback por CSS selecionando `[data-word]`); `PEND-13` (`PENDING_APPROVAL` — só o pulso do WhatsApp, fora desta entrega) |
| **Requisitos**  | FR-11 (movimento reduzido), FR-03 (aceite: texto legível), QA-CHECKLIST § 5 e § 9       |
| **Baseline**    | `b9eea51` — todo "hoje" desta story vale nesse commit                                    |

## Contexto

O QA-CHECKLIST § 5 marca "`prefers-reduced-motion` é respeitado" e "Conteúdo
continua visível com movimento reduzido" como validados, lendo só o código.
**A medição não confirma.** Medido com `npm run start` (build de produção) e o
Chrome headless dirigido por CDP, com `Emulation.setEmulatedMedia`
(`prefers-reduced-motion: reduce`), em 1200 e 375px, rolando a página inteira
para baixo e para cima:

1. **O Hero some com reduced motion.** O h4 "Nexus Agency", o h1 "Somos Nexus
   Agency." e os ícones sociais do topo ficam em `opacity: 0` **para sempre**,
   nos dois viewports, inclusive depois de rolar. Causa:
   - `useReducedMotion()` (`src/hooks/useReducedMotion.ts:6`) começa em `false`
     e só lê o `matchMedia` no próprio `useEffect`. Então a primeira passada de
     efeitos de todo wrapper roda **com animação**, e só um segundo render traz
     `true`.
   - Nessa primeira passada, `HeroClient.tsx:37-42` faz `gsap.set(opacity: 0)`
     **fora** do `gsap.context()`.
   - No segundo render, o `ctx.revert()` desfaz a timeline de volta para o
     estado anterior a ela, que é justamente o `opacity: 0` do `set`. Depois disso
     o efeito retorna cedo (`reduced`), e nada mais mostra o Hero.
2. **O parágrafo do Hero fica em 22% com reduced motion**, para sempre, nos dois
   viewports. Os outros 4 textos `ScrollText` vão para branco. Causa: na mesma
   primeira passada, `ScrollText.tsx:66` faz `gsap.set(color: startColor)` e
   cria a timeline com `scrub`. A limpeza (`ScrollText.tsx:84-87`) faz `kill()`,
   que não reverte. O parágrafo do Hero, acima da dobra, já tinha progresso e
   volta a ser escrito em 22% depois que o React pinta o `endColor`: em 375px, a
   1ª palavra fica branca no quadro 5 e volta a 0,22.
3. **O contador do About mostra "+0" com reduced motion**, para sempre, quando o
   HTML do servidor e o conteúdo aprovado dizem "+50". Causa: `AboutClient.tsx:101-118`
   escreve `textContent` no `onUpdate`, e o `revert` não desfaz essa escrita.
4. **A rolagem suave continua com reduced motion.** `globals.css:24` aplica
   `scroll-behavior: smooth` em `html, body` sem exceção, e o FR-11 pede
   "desativar ou simplificar animações decorativas **e suavização**". Medido:
   `scrollBehavior: smooth` com `reduce`.
5. **Antes da hidratação, com reduced motion,** os 5 `ScrollText` saem em 22%
   (≈ 1,9:1). O servidor não sabe a preferência, e a 4.4 só cobriu o caso sem JS.

O que já funciona com reduced motion (medido, sem `opacity`/`transform` inline
residual depois de rolar a página inteira): About (parágrafos, destaque,
Missão/Visão, Valores, ilustração), Banners, Projects (o filtro troca sem `Flip`,
`Projects/index.tsx:78`), Services, Blog, Contact, Footer e a microinteração GSAP
do `WhatsAppFloat`. Os `.fluid-btn` já têm a regra `@media (prefers-reduced-motion: reduce)`
em `globals.css:316`.

**Resultado pretendido:** com `prefers-reduced-motion: reduce`, todo conteúdo
aparece no estado final desde o primeiro quadro, sem animação nem rolagem
suave. Sem a preferência, nada muda.

**O que este contexto não cobre:** o pulso `WaveWhatsApp` e a rotação 3D dos
`SocialIcons` com reduced motion (`PEND-13`), e o card Design do Banner, que fica
invisível **com** movimento normal (tarefa 4.7, abaixo).

## Escopo

- Impedir a primeira passada animada quando a preferência já é `reduce`: cada
  wrapper com GSAP passa a consultar a preferência de forma síncrona no efeito,
  além do estado do hook.
- Tornar a limpeza do Hero, do `ScrollText` e do contador do About completa: o
  que eles escrevem volta ao estado do servidor quando a preferência muda com a
  página aberta.
- Fazer os 5 `ScrollText` saírem em branco pleno com reduced motion antes da
  hidratação (CSS por media query, o mesmo seletor `[data-word]` da 4.4).
- Desligar `scroll-behavior: smooth` com reduced motion.
- Corrigir as duas anotações do QA-CHECKLIST § 5 com a evidência medida.
- Registrar `PEND-13` e a tarefa 4.7 no `TASKS.md`.

**Se for preciso cortar:** a rolagem suave (item 4) sai primeiro. Hero, contador
e `ScrollText` ficam, porque violam o QA § 9.

## Fora de escopo

- **Não mexe no pulso `WaveWhatsApp` nem na rotação 3D dos `SocialIcons`.** O
  FR-11 pede desativar animações decorativas, e o FR-07 protege as duas
  ("não devem mudar visual, posição, links ou animação"). Conflito entre fontes:
  vai para o `PEND-13`.
- **Não corrige o card Design do Banner invisível com movimento normal.** Medido:
  depois de rolar até os Banners, o 1º card fica em `opacity: 0` e os outros dois
  em `1`. Suspeita: `transition-all duration-300` no card (`Banners/index.tsx:33`)
  disputando `opacity`/`transform` com o `gsap.from` (`BannersClient.tsx:30`).
  Não é reduced motion. Vira a tarefa **4.7**, com prioridade alta (QA § 9).
- **Não muda o piscar do Hero na hidratação sem reduced motion.** É a entrada
  aprovada do FR-02; fica para a 4.1.
- **Não troca o padrão por `gsap.matchMedia()`.** Ver _Decisões_.
- **Não mexe nas transições CSS de hover** (Tailwind `transition-*`). São curtas
  e disparadas pelo usuário; o FR-11 trata animações decorativas.

## Decisões

- **Decidido:** um leitor síncrono `prefersReducedMotion()`, exportado do mesmo
  módulo do hook. Cada efeito de animação passa a retornar cedo com
  `if (reduced || prefersReducedMotion()) return;`. O hook continua existindo
  para reagir à mudança da preferência com a página aberta.
  - **Descartado:** iniciar o `useState` do hook com o `matchMedia`. **Porque:**
    o `ScrollText` usa o valor no render (`style.color`), e o HTML do servidor
    discordaria do cliente: erro de hidratação.
  - **Descartado:** `useSyncExternalStore`. **Porque:** na hidratação ele usa o
    snapshot do servidor (`false`) no mesmo commit em que os efeitos rodam, e o
    problema volta.
- **Decidido:** manter o padrão `useEffect` + `gsap.context()` dos wrappers.
  **Descartado:** migrar para `gsap.matchMedia()`. **Porque:** reescreveria os 12
  efeitos. É o caminho natural da 4.1 (comportamento por breakpoint), que pode
  adotá-lo junto com as condições de largura.
- **Decidido:** o fallback pré-hidratação do `ScrollText` é CSS em
  `globals.css`, `@media (prefers-reduced-motion: reduce) { [data-word] { color: rgb(255 255 255) !important } }`,
  o mesmo seletor e o mesmo valor do `<noscript>` da 4.4.
  - **Descartado:** renderizar `endColor` no servidor. **Porque:** o parágrafo do
    Hero piscaria de branco para 22% para quem não usa reduced motion (decisão da
    4.4).
  - **Por que funciona:** com `reduce`, o GSAP nunca toca as palavras, então o
    `!important` só disputa com o inline do servidor.
- **Decidido:** com reduced motion, `scroll-behavior: auto` em `html, body`. O
  FR-11 nomeia a "suavização". **Descartado:** manter a rolagem suave por ser do
  legado. **Porque:** o FR-11 é requisito aprovado e mais específico.

## Critérios de aceite

### AC #1 — Com reduced motion, o Hero aparece inteiro desde o 1º quadro

Com `prefers-reduced-motion: reduce` (DevTools → Rendering, ou a sonda CDP, cuja
saída precisa trazer `matchMedia('(prefers-reduced-motion: reduce)').matches === true`;
sem isso a medição é do modo normal e não vale para os AC #1–#6), em
1200 e 375px, o h4 "Nexus Agency", o h1 "Somos Nexus Agency." e os ícones sociais
do topo estão em `opacity: 1`, sem `transform` inline, **em todo quadro** desde a
carga (registro por `requestAnimationFrame` nos primeiros 3 s). Isso continua
verdadeiro depois de rolar até o fim e voltar.

### AC #2 — Com reduced motion, os 5 textos de leitura progressiva saem em branco pleno

Com `reduce`, a 1ª palavra `[data-word]` do parágrafo do Hero, do título e do 1º
parágrafo do About e do título e do subtítulo de Services está em
`rgb(255, 255, 255)` desde o 1º quadro registrado e depois de rolar para baixo e
para cima. Nenhum quadro em 0,22.

### AC #3 — Com reduced motion, o contador mostra "+50"

Com `reduce`, `[data-about-metric-number]` contém `50` na carga e depois de rolar
até o About e voltar. O texto é o do HTML do servidor (`About/index.tsx:63`).

### AC #4 — Com reduced motion, nada fica escondido ou deslocado

Com `reduce`, em 1200 e 375px, depois de rolar a página inteira para baixo e para
cima, nenhum elemento de `#home`, `#about`, `#project`, `#service`, `#blog`,
`#contact` ou do `footer` tem `opacity` inline abaixo de 0,99 nem `transform`
inline diferente de `none`. Captura da 1ª dobra com `reduce` em
`docs/references/qa/reduced_1200.png` e `reduced_375.png`, mostrando o Hero
completo.

### AC #5 — Com reduced motion, sem rolagem suave

Com `reduce`, `getComputedStyle(document.documentElement).scrollBehavior` é `auto`.
Sem a preferência, continua `smooth`.

### AC #6 — Trocar a preferência com a página aberta não deixa resto

Com a página aberta sem `reduce`, ligar `reduce` (CDP `setEmulatedMedia`, sem
recarregar): o Hero, o contador e os 5 textos ficam no estado do AC #1 ao #3.
Desligar de novo: a leitura progressiva volta a responder ao scroll.

### AC #7 — Sem reduced motion, nada muda

Sem a preferência, a sonda da 4.4 dá o mesmo resultado de antes:
- o parágrafo do Hero vai de 0,22 a 0,99 sem passar por branco na carga;
- os textos iluminam descendo e voltam ao tom inicial subindo;
- a entrada do Hero acontece (h1 vai de 0 a 1);
- o contador anima até 50.

As capturas com JS (`JS=1 node scripts/capture_nojs.js`) não mudam em relação ao
baseline `b9eea51`.

### AC #8 — Botões sociais e WhatsApp intocados

`git diff --stat` não lista `src/components/ui/SocialIcons*` nem
`src/lib/constants.ts`. O diff de `WhatsAppFloat.tsx` é só a guarda de reduced
motion no efeito da microinteração GSAP: nenhuma classe, link ou CSS do
`WaveWhatsApp` muda.

### AC #9 — Nada regride, e a validação é carimbada

- `npx tsc --noEmit` e `npm run build` verdes, sem warning de hidratação.
- `node scripts/check_ids.js` imprime `true` para os 6 IDs.
- `node scripts/capture_nojs.js` continua com os 5 textos em branco sem JS.
- Nenhum item do QA-CHECKLIST § 9 violado.
- **SHA** citado no Change Log.

## Plano técnico

- `src/hooks/useReducedMotion.ts`: exportar
  `prefersReducedMotion(): boolean` (`typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches`)
  e usar a mesma query no hook (constante única).
- Guarda `if (reduced || prefersReducedMotion()) return;` no início do efeito de
  animação de:
  - `HeroClient`, `AboutClient`, `BannersClient`, `ServicesClient`,
    `BlogClient`, `FooterClient`;
  - `Contact/index.tsx`, `Projects/index.tsx` (reveal e `handleFilter`);
  - `ScrollText`, `ParallaxImage`, `ScrollReveal`, `WhatsAppFloat`.
- `HeroClient.tsx`: os três `gsap.set` para dentro do `gsap.context()`, para o
  `revert` devolver o estado do servidor.
- `ScrollText.tsx`: `gsap.set` e timeline dentro de `gsap.context(…, containerRef)`;
  limpeza com `ctx.revert()`, que devolve o inline do React.
- `AboutClient.tsx`: guardar o texto original do contador e restaurá-lo na
  limpeza, porque o `revert` não desfaz `textContent`.
- `src/app/globals.css`, no bloco `@media (prefers-reduced-motion: reduce)` que já
  existe:
  - `html, body { scroll-behavior: auto; }`;
  - `[data-word] { color: rgb(255 255 255) !important; }`, com comentário
    citando a 4.3 e o `<noscript>` da 4.4.
- `ScrollText.tsx`: comentário do topo cita também a regra de reduced motion em
  `globals.css` (mais um seletor que depende de `data-word`).
- Docs:
  - `TECHNICAL-SPEC.md` (§ GSAP: guarda síncrona e limpeza completa);
  - `CLAUDE.md` (bullet de motion);
  - `QA-CHECKLIST.md` § 5;
  - `TASKS.md`: `PEND-13` e tarefa 4.7.

**Regras que se aplicam** ([AGENTS.md](../../AGENTS.md) § 4 e § 7,
[TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 2):
- `gsap.context()` + `ctx.revert()`.
- Só `transform`/`opacity`/`color`.
- Sem `pin`.
- Botões sociais e WhatsApp intocados (o CSS `WaveWhatsApp` fica como está).
- Nenhuma dependência nova.
- O `!important` repete a justificativa da 4.4: é a única forma de uma folha
  vencer o `style=""` inline.

## Tasks

- [x] Sonda de reduced motion fora do repositório (CDP, `setEmulatedMedia`) e captura "antes" (AC #1–#6)
- [x] Antes da 1ª mudança: `JS=1 SUFFIX=_antes node scripts/capture_nojs.js` (vai para a pasta temporária) e a sonda da 4.4 sem reduced motion, como baseline do AC #7
- [x] `prefersReducedMotion()` no módulo do hook (AC #1–#4)
- [x] Guarda síncrona nos 12 efeitos e no `handleFilter` (AC #1, #4)
- [x] Hero: `gsap.set` dentro do contexto (AC #1, #6)
- [x] `ScrollText`: contexto + `revert` (AC #2, #6, #7)
- [x] About: restaurar o contador na limpeza (AC #3, #6)
- [x] `globals.css`: `scroll-behavior` e `[data-word]` com reduced motion (AC #2, #5)
- [x] Sem reduced motion: sonda da 4.4 e capturas com JS iguais ao baseline (AC #7)
- [x] Capturas `reduced_1200.png` e `reduced_375.png` (AC #4)
- [x] `PEND-13` e tarefa 4.7 no `TASKS.md`; QA § 5; TECHNICAL-SPEC; CLAUDE.md
- [x] Validação final e carimbo (AC #8, #9)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | sempre | `npx tsc --noEmit` |
| build | sem warning de hidratação | `npm run build` |
| movimento, reduced | AC #1–#6 | sonda CDP com `prefers-reduced-motion: reduce` em 1200 e 375, rolando até o fim e voltando, e trocando a preferência com a página aberta |
| movimento, normal | AC #7 | sonda da 4.4 (carga do Hero quadro a quadro, scroll nos dois sentidos) e `JS=1 node scripts/capture_nojs.js` |
| sem JS | não regressão da 4.4 | `node scripts/capture_nojs.js` |
| âncoras | sempre | `node scripts/check_ids.js` (servidor confirmado na 3008) |
| QA-CHECKLIST | § 5 (2 itens de reduced motion), § 4 "Scroll e navegação permanecem naturais", § 9 | reescrever as anotações com a evidência medida |

## Riscos e armadilhas

- **O hook começa em `false`.** Todo efeito que confia só no estado do hook roda
  uma vez com animação, mesmo com `reduce`. Qualquer efeito com GSAP novo precisa
  da guarda síncrona. Por isso ela entra na TECHNICAL-SPEC.
- **`kill()` não é `revert()`.** `kill` para a animação e deixa os valores
  inline no meio do caminho; só `revert` (ou `ctx.revert`) devolve o estado
  anterior. `textContent` escrito num `onUpdate` não é desfeito por nenhum dos
  dois.
- **`gsap.set` fora do contexto não é revertido** pelo `ctx.revert()`, e a
  timeline revertida volta para o valor que o `set` deixou.
- **Sonda sem servidor mede nada.** Nesta investigação, `next start` falhou
  porque o `.next` estava sem build de produção, e a sonda rodou contra a porta
  vazia. Confirme o `200` antes de medir.
- **Preservar:** o comentário "FR-07 inviolável", o CSS `WaveWhatsApp`, o visual
  dos `SocialIcons`, o `<noscript>` da 4.4 e o seletor `data-word`.

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência (AC #6 com a limitação do `scrollBehavior` na troca em tempo de execução, ver _Execução_).
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [x] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-xx` consumido marcado `RESOLVED`, se houver (nenhum; o `PEND-13` é criado e segue aberto).
- [x] Docs afetados (TECHNICAL-SPEC, CLAUDE.md, TASKS.md) atualizados.
- [x] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:**
- [useReducedMotion.ts](../../src/hooks/useReducedMotion.ts): `prefersReducedMotion()` e a query numa constante.
- [HeroClient.tsx](../../src/sections/Hero/HeroClient.tsx): guarda; `gsap.set` dentro do contexto; o comentário "B2" deixa de prometer o que não acontece.
- [ScrollText.tsx](../../src/components/motion/ScrollText.tsx): guarda; contexto + `revert`; comentário.
- [AboutClient.tsx](../../src/sections/About/AboutClient.tsx): guarda; restauração do contador.
- Só a guarda: [BannersClient.tsx](../../src/sections/Banners/BannersClient.tsx), [ServicesClient.tsx](../../src/sections/Services/ServicesClient.tsx), [BlogClient.tsx](../../src/sections/Blog/BlogClient.tsx), [FooterClient.tsx](../../src/components/layout/FooterClient.tsx), [Contact/index.tsx](../../src/sections/Contact/index.tsx), [Projects/index.tsx](../../src/sections/Projects/index.tsx) (reveal e `handleFilter`), [ParallaxImage.tsx](../../src/components/motion/ParallaxImage.tsx), [ScrollReveal.tsx](../../src/components/motion/ScrollReveal.tsx) e [WhatsAppFloat.tsx](../../src/components/ui/WhatsAppFloat.tsx).
- [globals.css](../../src/app/globals.css): `scroll-behavior: auto` e `[data-word]` branco, no bloco de reduced motion que já existia.
- Docs: [TASKS.md](../TASKS.md), [QA-CHECKLIST.md](../QA-CHECKLIST.md), [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md), [CLAUDE.md](../../CLAUDE.md), [stories/README.md](README.md).
- Evidência: `reduced_1200.png` e `reduced_375.png`.

**Medição com reduced motion** (`npm run start`, 3008, `200` confirmado; sonda CDP com `matchMedia('(prefers-reduced-motion: reduce)').matches === true` na saída):

| Medida | Antes (`b9eea51`), 1200 / 375 | Depois, 1200 / 375 |
| --- | --- | --- |
| h1 do Hero, opacidade (quadros desde a carga) | 1 → 0, fica em 0 | 1 em todos (166 / 172 quadros) |
| h4 e ícones sociais do Hero | `opacity: 0` | sem inline residual |
| 1ª palavra do parágrafo do Hero | 0,22 (375: branca no quadro 5, volta a 0,22) | `rgb(255, 255, 255)` desde o quadro 0 |
| Os outros 4 `ScrollText` | branco | branco |
| `[data-about-metric-number]` | `0` | `50` |
| `scrollBehavior` | `smooth` | `auto` |
| Elementos com `opacity`/`transform` inline residual (topo, fim, de volta ao topo) | 3 | 0 |

Os ícones sociais do topo não aparecem em 375px por design (`hidden md:flex`, [Hero/index.tsx](../../src/sections/Hero/index.tsx)).

**Troca de preferência com a página aberta (AC #6, 1200px):**
1. Sem `reduce`, rolando até `#about` e voltando: comportamento normal.
2. Ao ligar `reduce`: 0 elementos com resto inline, 5 textos em branco, contador `50`. Igual depois de rolar a página inteira nos dois sentidos.
3. Ao desligar `reduce`: a leitura progressiva volta a responder (em `#service`, os 5 textos iluminam). O contador volta a `0` até ser rolado, que é o comportamento normal do baseline.
4. Limitação da medição: depois da troca em tempo de execução, o `scrollBehavior` computado continuou `smooth`. Na carga com `reduce` ele é `auto`. O Chrome emulado não recalculou a propriedade; não verificado num navegador real com a preferência trocada no sistema.

**Sem reduced motion (AC #7):**
- A sonda da 4.4 é igual ao baseline: Hero de 0,22 a 0,99 sem flash (233 quadros), ilumina descendo e volta subindo. A entrada do Hero acontece (h1 de 0 a 1).
- `JS=1 node scripts/capture_nojs.js` (pasta temporária), comparado ao `_antes`: mesmas dimensões nos 5 viewports e tamanhos com diferença ≤ 0,03%.
- O card Design do Banner continua invisível nos dois, que é a tarefa 4.7.

**Regressão:** `node scripts/capture_nojs.js` mantém os 5 textos em `rgb(255, 255, 255)`, e `node scripts/check_ids.js` dá 6× `true`.

**O que divergiu do plano:**
- **12 efeitos, não 11** (corrigido na validação).
- **O comentário "B2" do `HeroClient` foi reescrito.** Ele dizia que o `set` eliminava o FOUC, e a 4.4 mediu o contrário.
- **Não verificado:** um leitor de tela real e um navegador real com a preferência do sistema operacional. Tudo foi medido com emulação CDP no Chrome headless.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-02 | TODO | Story criada sobre `b9eea51`. A medição com reduced motion emulado contradiz o QA § 5: o Hero (h4, h1, ícones) fica invisível, o parágrafo do Hero fica em 22% e o contador mostra "+0". A rolagem suave continua. Achado com movimento normal: card Design do Banner invisível → tarefa 4.7. Conflito FR-11 × FR-07 no pulso do WhatsApp → `PEND-13`. |
| 2026-11-02 | TODO | Validada (`validate-story`, 0 commits após `b9eea51`, todas as linhas citadas conferem). Ajustes: 12 efeitos (não 11); a sonda precisa imprimir `matchMedia(...).matches === true`; captura "antes" com JS vira task explícita. |
| 2026-11-02 | IN_PROGRESS | Iniciada sobre `b9eea51` (aval do usuário: "valide, e implemente"). Implementada na árvore de trabalho. `npx tsc --noEmit` ok; `rm -rf .next && npm run build` ok, sem warning. Sondas com e sem reduced motion, troca de preferência, capturas e `check_ids` conforme a _Execução_. Falta: revisão (`review-mr`) e carimbo com SHA no fechamento. |
| 2026-11-03 | DONE | Fechada (`close-story`). Revisão: ACs #1–#8 entregues; AC #6 com a limitação do `scrollBehavior` emulado. Ajuste: o comentário da regra `[data-word]` no `globals.css` agora diz que ela também segura o branco quando a preferência é ligada com a página aberta. Validado sobre `b9eea51` com exatamente o conteúdo do commit; as mudanças do usuário no botão de filtro (`globals.css`) ficaram guardadas no stash durante a medição e fora do commit. Comandos: `npx tsc --noEmit` ok; `rm -rf .next && npm run build` ok, sem warning; `npm run start` (3008, `200`); sonda de reduced motion em 1200 e 375 (Hero opacidade 1, 5 textos brancos, contador `50`, `scrollBehavior: auto`, 0 resto inline); `node scripts/check_ids.js` → 6× `true`; `node scripts/capture_nojs.js` → 5 textos brancos sem JS. |
