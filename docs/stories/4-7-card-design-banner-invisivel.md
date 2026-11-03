---
baseline_commit: ff8618ee0aa54334aa17e01f48da8d953e94e5d6
---

# Story 4.7 — Corrigir o card Design do Banner invisível com movimento

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 4 — Responsividade e acessibilidade                                                |
| **Área**        | motion                                                                                  |
| **Seções**      | Banners                                                                                 |
| **Tamanho**     | P: um arquivo ([BannersClient.tsx](../../src/sections/Banners/BannersClient.tsx)), sem mudança visual nem de conteúdo |
| **Depende de**  | Nada. Nenhum `PEND-xx` envolvido.                                                       |
| **Requisitos**  | FR-04 (reveals), FR-11; [QA-CHECKLIST](../QA-CHECKLIST.md) § 9 ("animação esconder conteúdo") |
| **Baseline**    | `ff8618e`. Todo "hoje" desta story vale nesse commit.                                   |

## Contexto

Achado da [4.3](4-3-reduced-motion.md). Com movimento normal, depois de rolar até
os Banners, o 1º card ("Design") e o ícone dele ficam em `opacity: 0` e
`translateY(50px)` / `scale(0.5)`. Os outros dois cards entram normalmente.

Medido no baseline com uma sonda CDP no Chrome headless, tanto com `next dev`
quanto com `next start`, em 375 e 1200px:

| Momento | Card 1 (Design) | Cards 2 e 3 |
| --- | --- | --- |
| Carga, no topo, antes de rolar | inline `opacity: 0; transform: translate(0px, 50px)` | sem `style` |
| Depois de descer até os Banners | `opacity: 0`, `y 50` | `opacity: 1`, `y 0` |
| Depois de ir ao fim e voltar | `opacity: 0` | `opacity: 1` |
| Depois de voltar ao topo e descer de novo | `opacity: 0` | `opacity: 1` |

Uma varredura da página inteira (todos os elementos com `opacity` inline < 1
depois de rolar até o fim) só encontra esses dois elementos. Footer e Contact
usam o mesmo padrão (`gsap.from` + stagger + `invalidateOnRefresh`) e não são
afetados.

## Causa

- **Hipótese da 4.3 descartada:** `transition-all` no card disputando com o GSAP.
  Com a transição restrita a `transition-colors` no card e no ícone, o
  resultado é idêntico. A mudança foi desfeita.
- **O efeito roda uma vez só** (instrumentação temporária com `console.log` no
  `useEffect` em `next start`), e os cards estão sem `style` quando o tween é
  criado. Não é StrictMode nem uma execução dupla sem `revert`.
- **É o `gsap.from` com stagger + ScrollTrigger.** O `from` não recebe destino:
  ele lê o destino do estado atual do elemento. No refresh do ScrollTrigger
  (`invalidateOnRefresh: true`), o tween é invalidado e relê esse estado. Nesse
  momento o índice 0 do stagger já está pintado no estado inicial
  (`opacity 0`, `y 50`), e esse estado vira o destino. Sem o
  `invalidateOnRefresh` (teste descartado), os **três** cards travam, o que
  confirma que o defeito vem de o destino ser lido do DOM, e não do refresh em
  si.

## Escopo

- Trocar os dois `gsap.from` do [BannersClient.tsx](../../src/sections/Banners/BannersClient.tsx)
  (cards e ícones) por `gsap.fromTo` com o destino explícito, que é o estado do
  HTML do servidor: `opacity: 1, y: 0` nos cards e `opacity: 1, scale: 1` nos
  ícones.

## Fora de escopo

- **Não muda duração, easing, stagger, delay, `start` nem `toggleActions`.** A
  entrada continua a mesma.
- **Não muda o markup nem as classes do [Banners/index.tsx](../../src/sections/Banners/index.tsx)**
  (o `transition-all` não é a causa).
- **Não troca os outros `gsap.from` do projeto** (Footer, Contact). Medidos sem
  defeito. Se a 4.1 reescrever os efeitos com `gsap.matchMedia()`, é a hora de
  padronizar em `fromTo`.
- **Não corrige o scroll horizontal em 480px dos Banners.** É da 4.1.

## Decisões

- **Decidido** `fromTo` com destino explícito, **descartado** remover o
  `invalidateOnRefresh`, **porque** sem ele os três cards travaram (medido).
  Com o destino fixo, nenhuma releitura do DOM consegue gravar o estado inicial
  como final.
- **Decidido** manter o `invalidateOnRefresh`, **porque** a regra do projeto o
  pede nos triggers ([CLAUDE.md](../../CLAUDE.md), § Motion) e, com o `fromTo`,
  ele já não causa dano.

## Critérios de aceite

### AC #1 — Os 3 cards e ícones aparecem depois de rolar

Com movimento normal, em 375, 480, 768, 1024 e 1200px, ao descer até os Banners,
ir ao fim da página e voltar, e voltar ao topo e descer de novo, os 3 cards
terminam em `opacity: 1` / `translate 0` e os 3 ícones em `opacity: 1` /
`scale 1`.

### AC #2 — A entrada continua animada e reversível

Ao voltar para acima do trigger, os cards voltam ao estado inicial (reverse). Ao
entrar de novo, animam em stagger, com o card 1 à frente, e terminam em 1.

### AC #3 — Nenhum conteúdo preso na página

Depois de rolar a página inteira, nenhum elemento fica com `opacity` inline < 1.

### AC #4 — Reduced motion e sem JS inalterados

Com `prefers-reduced-motion: reduce`, os cards ficam sem `style` inline. Sem JS,
os 5 textos de leitura progressiva continuam em `rgb(255, 255, 255)`.

### AC #5 — Nada regride

`npx tsc --noEmit` e `npm run build` verdes, e `node scripts/check_ids.js` com 6× `true`.

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sempre | `npx tsc --noEmit`, `npm run build` |
| movimento | 5 viewports, scroll ↓ ↑, reverse | sonda CDP (pasta temporária) sobre `next start` |
| reduced motion | Banners | sonda CDP com `prefers-reduced-motion: reduce` emulado |
| sem JS | página | `OUT_DIR=<temp> node scripts/capture_nojs.js` |
| âncoras | página | `node scripts/check_ids.js` |
| visual | 1200 / 375 | [banners_design_1200.png](../references/qa/banners_design_1200.png), [banners_design_375.png](../references/qa/banners_design_375.png) |

## Riscos e armadilhas

- **`gsap.from` lê o destino do DOM.** Qualquer releitura (refresh,
  `invalidate`, um tween anterior não revertido) pode gravar um estado
  intermediário ou inicial como final. Onde o conteúdo tem de terminar
  visível, prefira `fromTo` com o destino explícito.
- **Preservar** os `data-banner-card` / `data-banner-icon`; o client seleciona por eles.

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento nos viewports afetados (evidência em `docs/references/qa/`).
- [x] Item tocado do `QA-CHECKLIST.md` atualizado com a evidência.
- [x] Nenhum `PEND-xx` consumido.
- [x] Review (`review-mr`) e fechamento (`close-story`): status `DONE` e SHA no Change Log.

## Execução

**Arquivos tocados:**
- [BannersClient.tsx](../../src/sections/Banners/BannersClient.tsx): `from` → `fromTo` nos cards e ícones, com um comentário explicando o porquê.
- Docs: [TASKS.md](../TASKS.md), [QA-CHECKLIST.md](../QA-CHECKLIST.md), [README.md](README.md), [CLAUDE.md](../../CLAUDE.md).
- Evidência: [banners_design_1200.png](../references/qa/banners_design_1200.png), [banners_design_375.png](../references/qa/banners_design_375.png).

**Medição depois** (`next start`, 3008, sobre `ff8618e` + árvore de trabalho):

| AC | Resultado |
| --- | --- |
| #1 | 375/480/768/1024/1200: os 3 cards `opacity 1`, `matrix(1,0,0,1,0,0)`, e os 3 ícones `opacity 1` nos três cenários. No review, em 1200 e 375: recarregando a página já no fim (scroll restaurado) e saltando de uma vez até os Banners, os 3 em 1. |
| #2 | De volta ao topo: os 3 em `opacity 0`, `y 50` (reverse). 200 ms depois de entrar: card 1 em 0,04 / `y 47,99`, card 2 em 0 / `y 49,79`, card 3 em 0 / `y 50` (stagger). Ao fim: os 3 em 1. |
| #3 | Varredura da página em 1200 e 375: `[]`. |
| #4 | Reduced motion: `style` `null` nos 3 cards e ícones, em todos os momentos. Sem JS: 5× `rgb(255, 255, 255)`, footer presente. |
| #5 | `tsc` OK; build `✓ Compiled successfully`; `check_ids` 6× `true`. |

**O que divergiu do plano:** a causa suspeitada na 4.3 (`transition-all`) não se
confirmou. O conserto foi no client, não no markup.

**Achado do review fora desta entrega:** já no baseline, antes de o trigger
disparar, só o 1º card recebe o estado inicial do stagger; o 2º e o 3º ficam
visíveis até a seção entrar a 88% da tela e então somem e entram animados.
Registrado como nota na 4.1 do [TASKS.md](../TASKS.md).

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-03 | IN_PROGRESS | Story criada sobre `ff8618e`, já com a causa medida e o conserto (`fromTo`) implementado e validado. Falta review e fechamento. |
| 2026-11-03 | DONE | Review (`review-mr`): pode seguir, sem bloqueadores. Validado na árvore de trabalho sobre `ff8618e`: `npx tsc --noEmit` OK; `npm run build` `✓ Compiled successfully`, sem warnings; `node scripts/check_ids.js` 6× `true`; sondas CDP sobre `next start` (3008) nos 5 viewports, reduced motion emulado e varredura da página `[]`; capturas abertas. |
