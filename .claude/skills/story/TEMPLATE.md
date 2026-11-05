---
baseline_commit: <SHA completo do commit contra o qual esta story foi medida>
---

# Story <id> — <Título no imperativo, curto; o mesmo do TASKS.md>

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | TODO \| IN_PROGRESS \| BLOCKED \| DONE                                                  |
| **Fase**        | <Fase N — nome, como no TASKS.md>                                                       |
| **Área**        | conteúdo \| layout/UI \| motion \| a11y \| performance/SEO \| conversão (uma ou mais)   |
| **Seções**      | <Hero, About, … ou "global">                                                            |
| **Tamanho**     | S \| M \| L — <a frase que justifica: que superfície ela toca>                          |
| **Depende de**  | [<id>](<id>-<slug>.md) (`<status>` — <o que sai de lá>), `PEND-xx` (`<status>`), ou "nada" |
| **Requisitos**  | <FR-xx do PRD que esta story atende>                                                    |
| **Baseline**    | `<SHA curto>` — todo "hoje" desta story vale nesse commit                               |

## Contexto

O que está errado ou faltando **hoje**, com **arquivo, linha e como se prova**
(comando, screenshot, trecho do legado `index.html:<linha>` / `styles.css:<linha>`).
O resultado pretendido, em uma frase. Diga também o que este contexto **não**
cobre.

## Escopo

O que esta story entrega, em itens curtos.

**Se for preciso cortar:** <o que sai primeiro — ou "Nada, é atômica.">

## Fora de escopo

- **Não <faz X>.** <Por quê, e para onde foi: outra story, PEND-xx, ou "não vamos fazer, porque…".>

## Decisões

**Decidido** X, **descartado** Y, **porque** Z — uma por item.

⚠️ Decisão de negócio, conteúdo, identidade, link ou escopo não é decidida
aqui: vira `PEND-xx` no TASKS.md, e esta story cita.

## Critérios de aceite

Numerados, verificáveis, sobre comportamento observável. Cada um diz **como se
verifica**. Inclua os caminhos infelizes: reduced motion, sem JS/antes da
hidratação, scroll para cima, resize, 375px.

### AC #1 — <título curto>

<O comportamento. Como se verifica. Contra o que se compara (legado/referência).>

### AC #N — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; nenhum item do QA-CHECKLIST § 9
violado; validação visual nos viewports afetados (capturas numa pasta temporária
fora do repositório, nunca commitadas); **SHA** citado no Change Log.

## Plano técnico

Arquivos a criar/alterar, props/tipos novos, dados em `src/data/`. O suficiente
para alguém executar sem refazer a investigação; **não é o diff**.

**Regras que se aplicam** ([AGENTS.md](../../AGENTS.md) § 4 e § 7,
[TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 2): Server Component por padrão e
animação no `*Client.tsx` via `data-*`; `gsap.context()` + `ctx.revert()`;
`useReducedMotion`; só `transform`/`opacity`/`color`; sem `pin`; tokens do
Tailwind (sem hex solto); breakpoints 480/768/1024/1200; botões sociais e
WhatsApp intocados; nenhuma dependência nova sem justificativa. — "Nada se
aplica." quando for o caso.

## Tasks

- [ ] <Tarefa> (AC #1)
  - [ ] <subtarefa>

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| <tipos \| build \| âncoras \| visual \| movimento \| QA-CHECKLIST> | <o caso> | <comando / script / viewport> |

## Riscos e armadilhas

O não-óbvio que a investigação encontrou, e o sinal de que está acontecendo.
Cite também o que **preservar** nos arquivos tocados (comentário "FR-07
inviolável", keyframes do legado, etc.).

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência.
- [ ] `npx tsc --noEmit` verde.
- [ ] `npm run build` verde, sem warning de hidratação/SSR.
- [ ] Validação visual/movimento feita nos viewports afetados (capturas conferidas numa pasta temporária fora do repositório, sem commitar).
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [ ] `PEND-xx` consumido marcado `RESOLVED`, se houver.
- [ ] Docs afetados (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao implementar.>

**O que divergiu do plano:** <e para onde foi. "Nada." quando não divergiu.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| AAAA-MM-DD | TODO | Story criada sobre `<SHA curto>`. |
