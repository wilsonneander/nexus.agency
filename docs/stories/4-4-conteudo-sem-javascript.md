---
baseline_commit: 5012764118ea4639ac2b7c05adfcdddf5ac9936f
---

# Story 4.4 — Verificar conteúdo sem JavaScript/animação

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 4 — Responsividade e acessibilidade                                                |
| **Área**        | a11y, motion                                                                            |
| **Seções**      | Hero, About (título, 1º parágrafo, Missão/Visão/Valores), Services; verificação em todas |
| **Tamanho**     | M — corrige a primitiva compartilhada `ScrollText` (5 usos em 3 seções) e o `MissionVisionValues`, com um bloco `<noscript>` só aditivo no `<head>` do `layout.tsx`. Não muda a estrutura do layout, então não é L. |
| **Depende de**  | nada                                                                                    |
| **Requisitos**  | FR-03 (aceite: "Sem JavaScript/animação, o texto continua legível"), FR-04, FR-11; TECHNICAL-SPEC linhas 25, 48 e 109 |
| **Baseline**    | `5012764` — todo "hoje" desta story vale nesse commit                                    |

## Contexto

O `TASKS.md` (Ordem de implementação e linha 3.4) põe a 4.4 primeiro por suspeitar
que os `gsap.from()` de `FooterClient.tsx:22`, `BannersClient.tsx:30,47` e
`Contact/index.tsx:32,49,67` deixam o conteúdo invisível sem JS. **A medição não
confirma essa suspeita:** todo `gsap.from`/`gsap.set`/`gsap.fromTo` do projeto roda
dentro de `useEffect`. Sem JS, ou antes da hidratação, o HTML do servidor não tem
nenhum `opacity: 0` inline vindo do GSAP, e esses blocos aparecem no estado final.
Os problemas reais sem JS são outros:

1. **`ScrollText` deixa o texto ilegível sem JS.** `src/components/motion/ScrollText.tsx:97`
   grava `color: reducedMotion ? endColor : startColor` inline em cada palavra. Como
   `useReducedMotion()` começa em `false` no servidor (`src/hooks/useReducedMotion.ts:6`),
   o HTML sai com `rgba(255,255,255,0.22)` e só o GSAP muda isso depois. Sem JS, o texto
   fica nesse tom para sempre. O contraste calculado sobre `#04091d` dá **≈ 1,9:1**, abaixo
   de 4,5:1 (WCAG AA). Isso descumpre o aceite do FR-03 nos 5 textos aprovados: parágrafo
   do Hero (`Hero/index.tsx:49`), título e 1º parágrafo do About (`About/index.tsx:25,38`),
   título e subtítulo de Services (`Services/index.tsx:19,30`). Para confirmar: no Chrome,
   DevTools → _Disable JavaScript_ → recarregar e ver `#about`.
2. **Missão, Visão e Valores ficam inacessíveis sem JS.** `src/sections/About/MissionVisionValues.tsx:15`
   começa com `activeCard = null`. Os três painéis saem do servidor com
   `grid-rows-[0fr] opacity-0` (linhas 68, 124 e 180), e só um `onClick` do React
   consegue abri-los. Sem JS, o texto aprovado do cliente (`ABOUT_DATA.mission/vision/values`,
   `ADICIONAR` no [CONTENT-MAPPING.md](../CONTENT-MAPPING.md)) não aparece na tela.
   O QA § 9 pede "conteúdo ausente / animação esconder conteúdo".

Outros pontos que a medição levantou, só para registro:

- **`ScrollReveal` não é usado em lugar nenhum.** `grep "<ScrollReveal" src` não acha
  nada, só comentários em `Projects/index.tsx`. O `gsap.set(opacity: 0)` dele
  (`ScrollReveal.tsx:68`) não afeta a página hoje.
- **O Hero pisca na hidratação.** `HeroClient.tsx:39-41` aplica `opacity: 0` no `useEffect`,
  depois do primeiro paint. O h4, o h1 e os ícones sociais aparecem visíveis, somem e
  entram de novo. O comentário "B2 — eliminar FOUC" descreve o contrário do que acontece.
  Sem JS, os três ficam visíveis.
- **Sem JS, o formulário envia de verdade.** O `<form action="/" method="POST">`
  (`Contact/index.tsx:105-108`) só fica inerte por causa do `preventDefault`, que
  depende de JS.
- **Alguns controles dependem de JS, como no legado.** O menu mobile (`Navbar.tsx:11`)
  e o filtro de Projects (`Projects/index.tsx:26`) não funcionam sem JS. No legado também
  não (`main.js:1-17`, MixItUp).

**Resultado pretendido:** com JavaScript desabilitado, todo texto e toda imagem da
página aparecem no estado final e legível, e nada muda com JS ligado.

**O que este contexto não cobre:** reduced motion com JS (4.3), contraste dos estados
animados com JS (4.6) e o piscar do Hero com JS (fora de escopo, abaixo).

## Escopo

- Auditar a página inteira com JS desabilitado nos viewports 375 e 1200px: cada
  seção, Navbar, Footer, `WhatsAppFloat` e `SocialIcons`. O resultado vira uma tabela no
  _Execução_ (seção → visível/legível sem JS → evidência).
- Fazer os 5 textos `ScrollText` saírem legíveis sem JS (cor final), sem mudar o que
  acontece com JS.
- Fazer os painéis de Missão/Visão/Valores saírem abertos sem JS, sem mudar o accordion
  com JS.
- Criar um script de captura com JS desabilitado, que salva a evidência em `docs/references/qa/`.
- Registrar o envio do formulário sem JS como observação no `PEND-10` (sem corrigir).

**Se for preciso cortar:** a correção do `MissionVisionValues` sai primeiro e vira
story própria. A do `ScrollText` e a auditoria ficam.

## Fora de escopo

- **Não muda a entrada do Hero (piscar na hidratação).** Com JS, é comportamento aprovado
  do FR-02, e corrigir mexe no timing de entrada. Vai para avaliação na 4.3/4.1. A
  armadilha fica registrada aqui.
- **Não muda `action`/`method` do formulário.** Mexer no que o formulário faz é decisão
  do `PEND-10`, que segue aberto. A story só acrescenta a observação na tabela de
  pendências.
- **Não faz menu mobile nem filtro de Projects sem JS.** No legado eles também dependem
  de JS. Sem JS, os 6 projetos aparecem (filtro `all`), e o menu desktop e as âncoras
  funcionam.
- **Não remove o `ScrollReveal` não usado.** É limpeza, não acessibilidade. Fica anotado para
  quem mexer em `components/motion`.
- **Não trata reduced motion antes da hidratação.** Com reduced motion e JS ligado, o
  `ScrollText` fica em 22% até o `useEffect` rodar. Isso é da 4.3.
- **Não troca os `gsap.from` de Footer/Banners/Contact.** Sem JS eles não escondem
  nada (medido acima). O comportamento com JS é o reveal aprovado do FR-04.

## Decisões

- **Decidido:** a cor de fallback sem JS do `ScrollText` vem de CSS dentro de
  `<noscript><style>` no `<head>`, sobrescrevendo o inline com `!important`.
  **Descartado:** renderizar o `endColor` no HTML do servidor e deixar o GSAP aplicar o
  `startColor` na hidratação. **Porque:** o parágrafo do Hero está acima da dobra e
  piscaria de branco para 22% a cada carga, o que viola o FR-03 ("sem saltos, flicker").
  O `<noscript>` só vale quando o JS está desligado, então não altera nada com JS.
- **Decidido:** os painéis de Missão/Visão/Valores ganham `data-mvv-panel`, e o mesmo
  bloco `<noscript>` os força abertos (`grid-template-rows: 1fr; opacity: 1`, mais o
  espaçamento do estado aberto). **Descartado:** reescrever como `<details>`/`<summary>`
  com `name` (accordion exclusivo nativo). **Porque:** essa troca muda a semântica de
  teclado/leitor de tela e a transição `grid-rows` atual. Isso é escopo da 4.5 e
  mudaria o visual com JS. O `<noscript>` é aditivo.
- **Decidido:** o fallback sem JS do `ScrollText` usa o `endColor` padrão (branco
  pleno), que é o estado final com JS. Nenhum dos 5 usos sobrescreve `endColor`.
  **Descartado:** `color: inherit`. **Porque:** o 1º parágrafo do About herdaria
  `text-white/80` e ficaria diferente do estado final animado.
- **Decidido:** a evidência sem JS vem do Chrome headless com
  `--blink-settings=scriptEnabled=false`, no mesmo padrão dos `scripts/capture_*.js`.
  **Descartado:** Playwright/Puppeteer. **Porque:** seria dependência nova (AGENTS.md § 4),
  e o padrão atual resolve.

## Critérios de aceite

### AC #1 — Sem JS, os textos de leitura progressiva aparecem em branco pleno

Com JavaScript desabilitado (DevTools → _Disable JavaScript_, ou a captura do AC #5),
o parágrafo do Hero, o título e o 1º parágrafo do About e o título e o subtítulo de
Services aparecem em `rgb(255, 255, 255)` (conferir com o _Computed_ do DevTools em
uma palavra `[data-word]` de cada um). Nenhuma palavra fica em 22%. Texto idêntico ao
de `src/data/about.ts`, `src/data/services.ts` e `Hero/index.tsx` (fonte:
[CONTENT-MAPPING.md](../CONTENT-MAPPING.md)).

### AC #2 — Com JS, a leitura progressiva não muda

Com JS ligado, cada um dos 5 textos começa em `rgba(255,255,255,0.22)`, ilumina com o
scroll para baixo, volta ao tom inicial com o scroll para cima e não pisca na
hidratação. O parágrafo do Hero, acima da dobra, em especial, não passa por branco em
nenhum frame (gravação de tela ou Performance do DevTools com recarga).

### AC #3 — Sem JS, Missão, Visão e Valores aparecem abertos

Com JS desabilitado, em 375 e 1200px, os três cards mostram o título e o texto completo
de `ABOUT_DATA.mission`, `ABOUT_DATA.vision` e `ABOUT_DATA.values`, com o espaçamento
e a borda superior do estado aberto. Nenhum texto fica cortado nem sobreposto.

### AC #4 — Com JS, o accordion não muda

O diff de `src/sections/About/MissionVisionValues.tsx` tem só o `data-mvv-panel` nos 3
divs de painel. Classes, `transition-[grid-template-rows,opacity]`, `role="button"`,
`onKeyDown` e `aria-expanded` ficam iguais. Com JS ligado, teste manual: os três cards
começam fechados e abrem um por vez com clique, `Enter` e `Espaço`, e o `aria-expanded`
acompanha o estado.

### AC #5 — Auditoria sem JS da página inteira, com evidência

Um script em `scripts/` captura a página com JS desabilitado em 375 e 1200px e salva em
`docs/references/qa/nojs_375.png` e `nojs_1200.png`. Antes de capturar, o script faz um
`http.get` na porta e sai com `exit(1)` se a resposta não for 200. As alturas da janela
ficam fixas e registradas no _Execução_ (ex.: `375x14000`, `1200x9000`), e o **Footer
aparece inteiro** nas duas capturas, o que prova que a página está completa e não é a
página de erro. O _Execução_ traz uma tabela com
cada bloco (Navbar, Hero, About, MVV, Banners, Projects, Services, Blog, Contact, Footer,
`WhatsAppFloat`) e o resultado "visível e legível sem JS: sim/não". Todos ficam **sim**.
As exceções do legado (menu mobile e filtro de Projects inertes) aparecem como
"funcional sem JS: não, igual ao legado". Os 6 projetos e os ícones sociais nos 3 locais
aparecem.

### AC #6 — Envio sem JS registrado no PEND-10

O que acontece ao enviar o formulário sem JS (medir com `npm run build && npm run start`:
destino da requisição e status da resposta) fica anotado na linha do `PEND-10` no
`TASKS.md`, sem mudar o formulário. Qualquer status vale (200, 405 ou outro): o AC pede
o registro do valor medido, não um valor específico.

### AC #7 — Botões sociais e WhatsApp intocados

`SocialIcons`, `WhatsAppFloat` e `SITE_CONFIG` ficam sem diff (`git diff --stat` não
lista `src/components/ui/SocialIcons*`, `WhatsAppFloat.tsx` nem `src/lib/constants.ts`).

### AC #8 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes, sem warning de hidratação, inclusive com o
`<noscript>` novo. `node scripts/check_ids.js`, rodado com o servidor confirmado na
porta 3008 (ou `PORT`), imprime `true` para os 6 IDs. O script sai com 0 mesmo com
erro, então quem vale é o que ele imprime. Nenhum item do QA-CHECKLIST § 9 violado.
Validação visual com JS em 375/480/768/1024/1200, sem diferença das capturas
`*_antes.png` feitas na primeira task, no baseline. **SHA** citado no Change Log.

## Plano técnico

- `src/app/layout.tsx`: dentro do `<head>` (linha 59), um único `<noscript>` com um
  `<style>`:
  - `[data-word] { color: rgb(255 255 255) !important; }`
  - `[data-mvv-panel] { grid-template-rows: 1fr !important; opacity: 1 !important; padding-top: 1.25rem; margin-top: 1rem; border-top: 1px solid rgb(255 255 255 / 0.05); }`
    (os valores de `pt-5 mt-4 border-t border-white/5`). Só `grid-template-rows` e
    `opacity` levam `!important`, porque disputam com as classes do estado fechado.
    As classes fechadas não definem `padding-top`, `margin-top` nem `border-top`, então
    esses três dispensam `!important`, e o bloco continua fácil de sobrescrever na 4.5.

  Comente no bloco que ele só vale sem JS e que existe por causa do FR-03 (aceite) e da 4.4.
  Use `dangerouslySetInnerHTML` no `<style>` (ou no `<noscript>`) se o React escapar o
  conteúdo, e confira no HTML do build.
- `src/sections/About/MissionVisionValues.tsx`: `data-mvv-panel` nos 3 divs de painel
  (linhas 63, ~119 e ~175). Nenhuma outra mudança.
- `src/components/motion/ScrollText.tsx`: nenhuma mudança de comportamento. Atualize só o
  comentário do topo, citando o fallback `<noscript>` do layout, para quem renomear
  `data-word` saber que tem um seletor dependendo dele.
- `scripts/capture_nojs.js` (novo): mesmo padrão de `capture_sections.js` (porta `PORT`
  ou 3008, Chrome em caminho absoluto), com `--blink-settings=scriptEnabled=false`,
  janela de 375 e 1200 px de largura e altura suficiente para a página inteira.
- `docs/TASKS.md`: observação do AC #6 na linha do `PEND-10`.
- `docs/TECHNICAL-SPEC.md` / `docs/ARCHITECTURE.md` (§ decisões registradas) e
  `CLAUDE.md` (bullet do `ScrollText`/armadilha): registrar o padrão "fallback sem JS
  via `<noscript>` no `<head>`, selecionando `data-*`".

**Regras que se aplicam** ([AGENTS.md](../../AGENTS.md) § 4 e § 7,
[TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 2): Server Component por padrão; nenhuma
animação nova; sem `pin`; botões sociais e WhatsApp intocados; nenhuma dependência
nova. Sem hex solto: o CSS do `<noscript>` não passa pelo Tailwind e usa `rgb()` de
branco, que não é token de marca. Se o revisor preferir, troque por
`var(--…)` de `globals.css`.

## Tasks

- [x] Auditar a página sem JS antes da correção e capturar o "antes" (AC #5, AC #8)
  - [x] Criar [scripts/capture_nojs.js](../../scripts/capture_nojs.js) (checagem de porta com `exit(1)`, teto de altura fixo)
  - [x] Capturar `nojs_375_antes.png` e `nojs_1200_antes.png` (fora do repositório, ver _Execução_)
  - [x] Capturar com JS o "antes" em 375/480/768/1024/1200 (`js_<w>_antes.png`, fora do repositório)
- [x] Prova de conceito: `<noscript><style>` no `<head>`, depois `npm run build` e conferir
      em `.next/server/app/index.html` que o CSS sai sem escape (AC #1, AC #8)
- [x] Fallback `<noscript>` completo no `<head>` do `layout.tsx` (AC #1)
- [x] ~~`data-mvv-panel` nos 3 painéis do `MissionVisionValues` (AC #3)~~ — não se aplica: o componente não é usado (ver _Execução_)
- [x] Comentário no `ScrollText` apontando o fallback (AC #1)
- [x] Conferir que com JS nada mudou: ScrollText e accordion (AC #2, AC #4) — capturas com JS idênticas antes/depois; scroll para baixo/cima e recarga com o Hero medidos por sonda CDP no fechamento (ver _Execução_); accordion sem diff (não renderiza)
- [x] Medir o envio do formulário sem JS e anotar no `PEND-10` (AC #6)
- [x] Capturar o "depois" e preencher a tabela da auditoria no _Execução_ (AC #5)
- [x] Atualizar TECHNICAL-SPEC / ARCHITECTURE / CLAUDE.md com o padrão (DoD)
- [x] Validação final e carimbo (AC #7, AC #8)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | sempre | `npx tsc --noEmit` |
| build | `<noscript>` no `<head>` renderiza sem escapar e sem warning de hidratação | `npm run build`; conferir `<noscript><style>` no HTML de `.next/server/app/index.html` |
| visual sem JS | AC #1, #3, #5 | `node scripts/capture_nojs.js` (375 e 1200) → `docs/references/qa/nojs_*.png` |
| visual com JS | não regressão | `node scripts/capture_sections.js`, `node scripts/capture_mvv.js`; comparar com as capturas anteriores |
| movimento | AC #2, #4 | scroll para baixo e para cima nos 5 `ScrollText`; recarga com o Hero visível; accordion por mouse e teclado |
| âncoras | layout tocado | `node scripts/check_ids.js` |
| QA-CHECKLIST | § 3 "Animações não ocultam conteúdo antes de inicializarem", § 5 "Contraste… estado inicial", § 7 "Conteúdo principal está presente no HTML renderizado", § 9 | atualizar com a evidência desta story. O `[x]` do § 3 (`QA-CHECKLIST.md:21`, "eliminação de FOUC") está errado com JS, porque o Hero pisca na hidratação: reescrever a anotação como "sem JS: sim (4.4); com JS: Hero pisca na hidratação, ver 4.3/4.1" |

## Riscos e armadilhas

- **`!important` contra o inline.** Só a regra com `!important` de folha de estilo vence
  o `style=""` inline das palavras. Sem `!important`, o fallback não tem efeito. Para
  saber se está acontecendo: no _Computed_, a palavra sem JS continua em 0,22.
- **`<noscript>` no React 19 / App Router.** O conteúdo do `<noscript>` pode sair escapado
  (`&lt;style&gt;`) ou ser ignorado na hidratação. Para saber se está acontecendo: o CSS
  aparece como texto no topo da página sem JS. Confira no HTML do build, não só no dev.
- **O seletor depende de `data-word`.** Se alguém renomear o atributo no `ScrollText`,
  o fallback quebra em silêncio. Por isso o comentário no componente.
- **O QA § 5 hoje marca "Contraste é suficiente nos estados inicial e animado" como
  validado** com o estado inicial em 22%, que dá ≈ 1,9:1. Esta story não reabre esse
  item com JS (é da 4.6), mas a evidência sem JS não deve ser lida como confirmação
  dele.
- **Fontes e ícones na captura sem JS.** `next/font` e as CDNs de ícones são CSS e
  carregam sem JS, mas confira que Poppins e RemixIcon/FontAwesome aparecem.
  Se não aparecerem, é limitação da captura, não do site.
- **Preservar:** o comentário "FR-07 inviolável" e o visual dos `SocialIcons`, o pulso
  `WaveWhatsApp`, o `role="button"` e o `onKeyDown` dos cards MVV, e o
  `suppressHydrationWarning` existente do `ScrollReveal`.

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência (AC #3 e #4 cumpridos pelo estado atual: o accordion não é usado, ver _Execução_).
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [x] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-xx` consumido marcado `RESOLVED`, se houver (nenhum: o `PEND-10` só recebe uma observação e segue aberto).
- [x] Docs afetados (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md) atualizados.
- [x] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** [src/app/layout.tsx](../../src/app/layout.tsx) (`<noscript>` no `<head>`), [src/components/motion/ScrollText.tsx](../../src/components/motion/ScrollText.tsx) (só comentário), [scripts/capture_nojs.js](../../scripts/capture_nojs.js) (novo), `docs/references/qa/nojs_375.png` e `nojs_1200.png` (evidência final), [TASKS.md](../TASKS.md), [QA-CHECKLIST.md](../QA-CHECKLIST.md), [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md), [ARCHITECTURE.md](../ARCHITECTURE.md), [CLAUDE.md](../../CLAUDE.md).

**Medição (AC #1).** O script lê a cor computada da 1ª `[data-word]` de cada um dos 5 textos:

| Texto | Sem JS, antes | Sem JS, depois | Com JS, depois (topo da página) |
| --- | --- | --- | --- |
| Hero, parágrafo | `rgba(255, 255, 255, 0.22)` | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` / `0.99` (scrub já em andamento acima da dobra, igual ao antes) |
| About, título | `0.22` | `rgb(255, 255, 255)` | `0.22` |
| About, 1º parágrafo | `0.22` | `rgb(255, 255, 255)` | `0.22` |
| Services, título | `0.22` | `rgb(255, 255, 255)` | `0.22` |
| Services, subtítulo | `0.22` | `rgb(255, 255, 255)` | `0.22` |

**Auditoria sem JS (AC #5).** `node scripts/capture_nojs.js` contra `npm run start` (build de produção) na porta 3008. Viewport de 900 px de altura; a captura cobre o documento inteiro, com teto fixo de 17000 px (375) e 9000 px (1200): `375x14684` e `1200x8015`. O Footer aparece inteiro nas duas.

| Bloco | Visível e legível sem JS | Evidência |
| --- | --- | --- |
| Navbar | sim (menu mobile: funcional sem JS **não**, igual ao legado; menu desktop e âncoras funcionam) | `nojs_375.png` topo (ícone do menu), `nojs_1200.png` topo |
| Hero (h4, h1, parágrafo, ícones sociais do topo) | sim | parágrafo em branco pleno, antes 22% |
| About (título, parágrafos, destaque, +50, ícones sociais) | sim | título e 1º parágrafo em branco pleno |
| Missão / Visão / Valores | sim (já era: renderização estática, ver abaixo) | cards abertos com o texto completo nos dois viewports |
| Banners (Design, Desenvolvimento, Teste & QA) | sim | os 3 cards |
| Projects | sim (filtro: funcional sem JS **não**, igual ao legado) | os 6 projetos (filtro `all`) |
| Services (título, subtítulo, 6 serviços, pacotes) | sim | título e subtítulo em branco pleno |
| Blog | sim | os 3 posts |
| Contact | sim | 4 campos e CTA |
| Footer (colunas e ícones sociais) | sim | inteiro nas duas capturas |
| `WhatsAppFloat` | sim | botão "Quero saber mais!" (fixo, aparece na 1ª dobra) |

Ícones sociais nos 3 locais (topo/Hero, About, Footer) aparecem. Poppins, RemixIcon e FontAwesome carregam sem JS.

**Formulário sem JS (AC #6).** `curl -X POST` com os 4 campos em `/` (`npm run start`): `200`, `text/html`, `x-nextjs-cache: HIT` (a home pré-renderizada). Anotado no `PEND-10`; formulário não mudou.

**O que divergiu do plano:**

- **Missão/Visão/Valores já aparecem sem JS: o problema 2 do _Contexto_ não existe na página.** [MissionVisionValues.tsx](../../src/sections/About/MissionVisionValues.tsx) não é importado em lugar nenhum, nem no baseline `5012764` (`git grep MissionVisionValues 5012764` só acha a própria definição). O About renderiza Missão, Visão e Valores como cards estáticos sempre abertos em [About/index.tsx](../../src/sections/About/index.tsx) (`data-about-mv`, `data-about-value`). Por isso não acrescentei `data-mvv-panel` nem a regra correspondente no `<noscript>`: seria CSS para um componente que não renderiza. O AC #3 está cumprido pelo estado atual (evidência nas capturas); o AC #4 fica sem diff. O componente morto e o [scripts/capture_mvv.js](../../scripts/capture_mvv.js), que o valida, ficam para limpeza (fora de escopo, como o `ScrollReveal`).
- **O script usa CDP, não `--screenshot`.** Com `--blink-settings=scriptEnabled=false` o Chrome headless sai com código 0 sem gravar o PNG. O script sobe o Chrome com `--remote-debugging-port` e o dirige pelo `WebSocket` nativo do Node 24 (`Emulation.setScriptExecutionDisabled`), sem dependência nova. Ganho: ele também mede a cor computada.
- **Altura da janela.** Uma janela de 14000 px infla o `min-h-screen` do Hero. O script usa viewport de 900 px, captura o documento inteiro e falha (`exit 1`) se o documento passar do teto fixo.
- **`JS=1` no mesmo script** captura com JS em 375/480/768/1024/1200 para a não regressão (AC #8), em vez das capturas do `capture_sections.js`, que cortam em 900 px.
- **Capturas "antes" fora do repositório**, pela regra nova do [CLAUDE.md](../../CLAUDE.md) (higiene do repositório): `nojs_*_antes.png` e `js_<w>[_antes].png` ficaram na pasta temporária da sessão. As capturas com JS antes e depois são visualmente idênticas nos 5 viewports.
- **AC #2 medido por sonda CDP, não a olho** (no fechamento, build de produção, 1200 px, script pontual fora do repositório). Desde a carga, um `requestAnimationFrame` registrou a cor da 1ª palavra do parágrafo do Hero em 224 quadros: alfa entre 0,22 e 0,99, e **nenhum quadro em branco seguido de queda** (sem flash). Rolando até `#about`, Hero e About ficam em `rgb(255, 255, 255)` e Services em 0,22. Até `#service`, Services ilumina (1ª palavra em 1, última em 0,66, ainda em andamento). De volta ao topo, About e Services voltam a 0,22. O teste de teclado do accordion (AC #4) não se aplica: o componente não renderiza.
- **Fechamento (review):** com `JS=1` ou `SUFFIX=…`, o `capture_nojs.js` agora grava na pasta temporária (ou em `OUT_DIR`), para uma rodada de não regressão não sujar `docs/references/qa/`. A sonda morta de `[data-mvv-panel]` saiu. A limpeza do código morto (`MissionVisionValues`, `capture_mvv.js`, `ScrollReveal`) virou a tarefa 6.9 do [TASKS.md](../TASKS.md).

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-02 | TODO | Story criada sobre `5012764`. A medição desfaz a suspeita da Ordem de implementação (os `gsap.from` não escondem nada sem JS) e encontra dois problemas reais: `ScrollText` a 22% e MVV fechado sem JS. |
| 2026-11-02 | TODO | Validada (`validate-story`, 0 commits após `5012764`, contexto confere). O AC #4 passa a medir o diff em vez de comparar com uma captura estática. O AC #5 ganha checagem de porta, alturas fixas e o Footer visível como prova de captura. O AC #8 passa a exigir os 6 IDs `true` e um baseline `*_antes.png` com JS. A prova de conceito do `<noscript>` no build sobe para a 2ª task. O plano limita o `!important` do MVV a `grid-template-rows`/`opacity`. Fica definido o destino do `[x]` do QA § 3. |
| 2026-11-02 | IN_PROGRESS | Implementada sobre `e79da34` (árvore de trabalho, sem commit). `<noscript><style>[data-word]{…!important}</style></noscript>` no `<head>` via `dangerouslySetInnerHTML`. MVV sem mudança: o componente accordion não é usado e a página já mostra os cards abertos. Validação: `npx tsc --noEmit` ok; `rm -rf .next && npm run build` ok, sem warning, `<noscript><style>` sem escape em `.next/server/app/index.html`; `node scripts/check_ids.js` (`npm run start`, 3008) → 6× `true`; `node scripts/capture_nojs.js` → 5 textos em `rgb(255, 255, 255)`, Footer inteiro; `JS=1 node scripts/capture_nojs.js` idêntico ao antes nos 5 viewports; `git diff --stat` sem `SocialIcons*`, `WhatsAppFloat.tsx`, `constants.ts`. Falta: teste manual de scroll/recarga no navegador (AC #2). |
| 2026-11-02 | DONE | Fechada (`close-story`). Validado na árvore de trabalho sobre `e79da34` e entregue num único commit. `npx tsc --noEmit` ok. `rm -rf .next && npm run build` ok, sem warning, `<noscript><style>[data-word]{color:rgb(255 255 255)!important}</style></noscript>` sem escape no HTML. `npm run start` na 3008, depois de encerrar um servidor antigo que ocupava a porta, para não medir build velho. `node scripts/check_ids.js` → 6× `true`. `node scripts/capture_nojs.js` → 5 textos em `rgb(255, 255, 255)`, `375x14684` e `1200x8015`, com Footer inteiro (capturas abertas). `JS=1` → pasta temporária, visual igual ao antes. Sonda CDP do AC #2: sem flash e reversível. `curl -X POST /` → `200`, `x-nextjs-cache: HIT`. Ajustes do review: destino das capturas do script, sonda MVV removida, tarefa 6.9 de limpeza. Fora de escopo, no mesmo commit: regra de higiene do repositório no `CLAUDE.md`. |
