---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 7.7 — Animar a abertura do menu mobile e a troca de filtro dos Projetos

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 7 — Evolução visual (pós-entrega)                                                  |
| **Área**        | motion, a11y                                                                            |
| **Seções**      | Navbar (gaveta mobile), Projects                                                        |
| **Tamanho**     | S — dois componentes cliente e os presets; nenhum markup visível muda                   |
| **Depende de**  | nada                                                                                    |
| **Requisitos**  | FR-04, FR-09, FR-11                                                                     |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Pedido do responsável (2026-11-05): "animação fluida ao abrir e fechar" o menu mobile e "ao selecionar o botão de filtro" em Criação e Desenvolvimento.

- **Menu:** em [Navbar.tsx](../../src/components/layout/Navbar.tsx) a gaveta era renderizada com `{isOpen && …}` — aparecia e sumia num quadro. O legado desliza a gaveta de trás da barra (`.nav__links { transform: translateY(-100%); transition: 0.5s }` → `.open { transform: translateY(0) }`, `styles.css:177-197`). A animação devolve o comportamento do legado; não é exceção ao FR-01, por isso não depende de `PEND-xx`.
- **Filtro:** em [Projects/index.tsx](../../src/sections/Projects/index.tsx) o `flushSync` removia os cards de outras categorias antes do `Flip.from`, então o `onLeave` não tinha elemento para animar e os cards sumiam de uma vez; os que ficavam deslizavam e os novos entravam todos juntos.

Não cobre o visual dos botões de filtro (a troca de cor do ativo já tem `transition` de 0,35 s no `.fluid-btn`) nem o menu desktop.

## Escopo

- Gaveta mobile sempre no DOM, descendo de trás da barra (0,5 s, como o legado) com os itens entrando em sequência; fechar toca a mesma timeline ao contrário, 1,4× mais rápido. Ícone hambúrguer/fechar gira ao trocar.
- `aria-expanded`/`aria-controls` no botão e `inert` na gaveta fechada (agora que ela fica no DOM).
- Troca de filtro em três tempos: saída (desbota e encolhe) dos cards que vão sair, Flip dos que ficam e entrada em sequência dos novos. Clique no meio da troca termina a anterior e começa a nova.
- Timings em `MOTION_PRESETS.menu` e `MOTION_PRESETS.filter`.

**Se for preciso cortar:** o giro do ícone sai primeiro.

## Fora de escopo

- **Não fecha o menu com Esc nem ao clicar fora.** Não pedido; vai para a 4.5 (teclado, foco e semântica) se fizer falta.
- **Não muda cor, texto, ordem ou links** do menu e dos filtros.

## Decisões

- **Decidido** uma timeline GSAP pausada com `play()`/`reverse()`, **descartado** só `transition` CSS, **porque** a entrada em sequência dos itens e a reversão no meio do caminho saem de graça da timeline.
- **Decidido** o recorte (`overflow-hidden` no invólucro `absolute top-full`) para a gaveta nascer da borda da barra, **descartado** `z-index: -1` do legado, **porque** a barra do rebuild tem `backdrop-blur` e a gaveta ficaria borrada atrás dela.
- **Decidido** o `Contato` da gaveta dentro de um `div[data-nav-item]`, **porque** o `.fluid-btn` tem `transition: transform` próprio e brigaria com o `y` do GSAP.
- **Decidido** desbotar os cards que saem **antes** do `setState`, **descartado** `absolute: true` + `onLeave`, **porque** o React remove os nós no `flushSync` e o `onLeave` nunca animou nada.
- **Decidido** com reduced motion: a gaveta pula para o estado final (`tl.progress(0|1)`) e o filtro troca sem animação, como antes.

## Critérios de aceite

### AC #1 — Menu abre e fecha deslizando

Em ≤ 768px, abrir faz a gaveta descer de trás da barra em ~0,5 s com os itens entrando em sequência; fechar (botão ou clique num link) recolhe ao contrário e termina com `visibility: hidden`. Sonda CDP medindo `getBoundingClientRect`, opacidade e visibilidade a cada 100 ms.

### AC #2 — Gaveta fechada fora do teclado e do leitor de tela

Fechada: `inert`, `aria-expanded="false"`, `visibility: hidden`. Aberta: sem `inert`, `aria-expanded="true"`. Sem JS e antes da hidratação a gaveta fica fechada (`invisible` no HTML do servidor), como o estado inicial do legado.

### AC #3 — Filtro troca em três tempos, sem card preso

Ao selecionar um filtro, os cards que saem desbotam e encolhem, os que ficam deslizam e os novos entram em sequência; ao fim todo card visível tem `opacity: 1` e `transform: none`. Cliques rápidos (3 filtros em < 200 ms) terminam no último filtro, com a aba certa `aria-selected`.

### AC #4 — Reduced motion

Com `prefers-reduced-motion: reduce`, menu e filtro trocam de estado na hora, sem quadros intermediários.

### AC #5 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; sem overflow horizontal; 0 erro no console; captura em [menu_mobile_open_375.png](../references/qa/menu_mobile_open_375.png); SHA no Change Log.

## Plano técnico

- [Navbar.tsx](../../src/components/layout/Navbar.tsx): timeline em `gsap.context()` escopado na gaveta, recriada quando `reduced` muda; segundo efeito toca/reverte por `isOpen`.
- [Projects/index.tsx](../../src/sections/Projects/index.tsx): `data-category` no `[data-project-card]`; `handleFilter` com timeline de saída + `Flip.from` no `add()`; refs para completar a troca anterior.
- [presets.ts](../../src/animations/presets.ts): `menu` e `filter`.

**Regras que se aplicam:** só `transform`/`opacity`/`visibility` animados; `gsap.context()` + `ctx.revert()`; reduced motion pelo leitor síncrono; WhatsApp do botão Contato intocado (`SITE_CONFIG.whatsapp.url`).

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | — | `npx tsc --noEmit`, `npm run build` |
| movimento | menu abre/fecha, link fecha, filtro, cliques rápidos | sonda CDP em `next start`, 375×667, 768×1024, 1200×800 |
| movimento | reduced motion | mesma sonda com `prefers-reduced-motion: reduce` emulado |
| visual | gaveta aberta | captura 375 |

## Riscos e armadilhas

- A gaveta agora fica no DOM: sem `inert` os links fechados entrariam no Tab. Sem `pointer-events-none` no invólucro, a área recortada bloquearia cliques na página.
- Interromper a saída do filtro com outro clique: o tween de saída usa `overwrite: "auto"` para não brigar com uma entrada ainda em curso.
- Preservar: `aria-label` do botão, `onClick` que fecha a gaveta nos links, destino do WhatsApp.

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [x] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] Status movido na story **e** no `TASKS.md` para `DONE` depois do review.

## Execução

**Arquivos tocados:** [Navbar.tsx](../../src/components/layout/Navbar.tsx), [Projects/index.tsx](../../src/sections/Projects/index.tsx), [presets.ts](../../src/animations/presets.ts), [menu_mobile_open_375.png](../references/qa/menu_mobile_open_375.png).

**O que divergiu do plano:** nada.

**Validação (árvore de trabalho sobre `3a87d86`, `next start -p 3008`, sonda CDP fora do repositório):**

- AC #1: 375 — abrindo, fundo da gaveta em 252 → 341 → 366 → 371 px (opacidade 0,59 → 1) em 100/200/300/400 ms; fechando, 371 → 314 → 136 → 80 px e `hidden` em 600 ms; clique em "Projetos" fecha. 768 igual.
- AC #2: fechada `inert: true`, `aria-expanded="false"`, `visibility: hidden`, itens com opacidade 0; aberta `inert: false`, `"true"`.
- AC #3: em 375, 768 e 1200, "Todos" → "Fast Food": os 4 cards que saem a 0,85–0,90 de opacidade e `scale` 0,99 aos 120 ms; os 2 que ficam com `matrix` do Flip; ao fim `1.00`/`none`. Tecnologia → Todos → Viagens em < 150 ms termina com 2 cards `.design`, aba "Viagens" selecionada; volta a "Todos" com os 6 a `1.00`/`none`.
- AC #4: com reduce, gaveta em 371 px/opacidade 1 já no 1º quadro e `hidden` no 1º quadro ao fechar; filtro sem `transform`.
- AC #5: `tsc` e `build` verdes; `scrollWidth` ≤ `innerWidth` nos 3 viewports; 0 erro no console.

Não verificado: a sensação de fluidez em aparelho real (só headless) — fica para a aprovação do responsável.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | IN_PROGRESS | Story criada e implementada sobre `3a87d86`; validação acima (árvore de trabalho sobre `3a87d86`). |
| 2026-11-05 | DONE | Aprovada pelo responsável ("assim já ta bom"). Revalidada na árvore de trabalho sobre `3a87d86`: `npx tsc --noEmit` e `npm run build` verdes, `node scripts/check_ids.js` com todas as âncoras presentes; código idêntico ao da sonda CDP acima. Review sem achados bloqueadores. |
