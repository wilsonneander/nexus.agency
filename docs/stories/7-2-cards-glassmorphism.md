---
baseline_commit: ff8618ee0aa54334aa17e01f48da8d953e94e5d6
---

# Story 7.2 — Padronizar os cards com visual de vidro e bordas iluminadas

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 7 — Evolução visual (pós-entrega)                                                  |
| **Área**        | layout/UI                                                                               |
| **Seções**      | About, Banners, Projects, Services (serviços + pacotes), Blog                           |
| **Tamanho**     | M — várias seções e uma primitiva compartilhada nova em [globals.css](../../src/app/globals.css) / [tailwind.config.ts](../../tailwind.config.ts); sem dependência nova, sem mudança de conteúdo |
| **Depende de**  | `PEND-15` (`RESOLVED` — visual de vidro nos cards autorizado pelo responsável em 2026-11-03); [4.7](4-7-card-design-banner-invisivel.md) (`DONE`; a evidência visual dos Banners só vale com ela) |
| **Requisitos**  | FR-01 (com a exceção do `PEND-15`), FR-04 (reveals intactos), FR-05, FR-07, FR-10, FR-11 |
| **Baseline**    | `ff8618e` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Hoje cada seção desenha o próprio card, com fundo **opaco**
`bg-[#0f1221]` (= `--secondary-color-light`) e borda quase invisível, e os
estilos divergem entre si:

| Card | Onde | Hoje |
| --- | --- | --- |
| Banners (3) | [Banners/index.tsx:34](../../src/sections/Banners/index.tsx#L34) | `rounded-lg`, só `border-b-2` transparente que vira roxa no hover; ícone redondo `bg-[#03060f]` branco, gradiente roxo→branco só no hover ([:38](../../src/sections/Banners/index.tsx#L38)) — espelha o legado `styles.css:486-512` |
| Serviços (6) | [Services/index.tsx:47](../../src/sections/Services/index.tsx#L47) | `rounded-xl`, `border-b-2` no hover; ícone quadrado flutuando no topo, roxo sobre `#0f1221`, gradiente só no hover ([:52](../../src/sections/Services/index.tsx#L52)) — espelha `styles.css:567-597` |
| Pacotes (3) | [Services/index.tsx:103-106](../../src/sections/Services/index.tsx#L103-L106) | `rounded-2xl`; o destacado tem `border-2` roxa + `scale-105`, os outros `border-white/5` |
| Missão / Visão (2) | [About/index.tsx:84-108](../../src/sections/About/index.tsx#L84-L108) | `rounded-xl border-white/5`; ícone `bg-[#a15cf5]/10` com glifo roxo apagado |
| Valores (6) | [About/index.tsx:118-121](../../src/sections/About/index.tsx#L118-L121) | `rounded-lg border-white/5`; número `01…06` em vez de ícone |
| Destaque + métrica "+50" | [About/index.tsx:51-73](../../src/sections/About/index.tsx#L51-L73) | destaque com `border-l-2` roxa; métrica `rounded-lg border-white/5` |
| Blog (3) | [Blog/index.tsx:23](../../src/sections/Blog/index.tsx#L23) | `rounded-xl border-white/5`, imagem no topo |
| Projetos (6) | [Projects/index.tsx:148](../../src/sections/Projects/index.tsx#L148) | `rounded-xl border-white/5`, só imagem, animado com GSAP Flip no filtro |

Prova: `grep -n "bg-\[#0f1221\]" src/sections -r` lista todos; não existe
nenhum `backdrop-filter`/`backdrop-blur` no projeto (`grep -rn "backdrop" src`
vazio).

O responsável pediu (2026-11-03, `PEND-15`) que **todos esses cards sigam um
único padrão** no estilo da imagem de referência
[cards-glass-reference.png](../references/cards-glass-reference.png): fundo
translúcido com desfoque (vidro), **borda iluminada** (contorno claro/lilás com
halo roxo suave por fora) e **ícones em cores vivas** (quadrado arredondado com
gradiente roxo→magenta saturado e glifo branco).

Resultado pretendido: um componente visual de card só, aplicado igual em todas
as seções acima, sem mudar texto, ordem, imagens, links nem animações de scroll.

Este contexto **não** cobre o formulário e os canais do Contact
([Contact/index.tsx:109](../../src/sections/Contact/index.tsx#L109),
[:161](../../src/sections/Contact/index.tsx#L161)) nem o
[MissionVisionValues.tsx](../../src/sections/About/MissionVisionValues.tsx),
que não é importado (tarefa 6.9).

## Escopo

- Uma primitiva de estilo compartilhada para o card de vidro: fundo translúcido
  em gradiente, `backdrop-filter: blur`, borda clara de 1px com brilho no topo,
  halo roxo externo suave; estado de hover que intensifica a borda/halo.
- Uma primitiva para o "ícone vivo": quadrado arredondado com gradiente
  roxo→magenta, glifo branco, brilho próprio.
- Tokens de cor novos (vidro, borda, halo, magenta do ícone) como CSS vars no
  `:root` de `globals.css`. Não entram no `tailwind.config.ts`: as seções só usam
  as classes `glass-*`, nenhum utilitário de cor novo.
- Aplicar o card de vidro a: Banners, Serviços, Pacotes, Missão/Visão, Valores,
  destaque e métrica do About, Blog e Projetos.
- Aplicar o ícone vivo onde há ícone: Banners (3), Serviços (6), Missão/Visão
  (2).
- Brilho ambiente estático atrás de cada grade de cards, para o desfoque ter o
  que desfocar (ver Decisões).

**Se for preciso cortar:** sai primeiro o brilho ambiente atrás das grades
(o card continua translúcido e iluminado, só o desfoque fica imperceptível);
depois, Projetos (o card é só imagem, o ganho visual é menor e o Flip é o maior
risco).

## Fora de escopo

- **Não muda texto, imagens, ordem, links nem quantidade de cards.** Fidelidade
  de conteúdo continua a do legado/[CONTENT-MAPPING.md](../CONTENT-MAPPING.md).
- **Não muda o código das animações GSAP de entrada/scroll dos cards**
  (`BannersClient`, `ServicesClient`, `AboutClient`, `BlogClient`, Flip dos
  Projetos): nenhum `*Client.tsx` é tocado. O que muda na tela é a remoção do
  `transition-all` dos cards, que mascarava essas entradas (ver Decisões).
- **Não corrige o card Design invisível dos Banners.** Foi corrigido na
  [4.7](4-7-card-design-banner-invisivel.md) (`DONE`).
- **Não corrige o scroll horizontal em 480px** causado pelo card dos Banners
  (achado da 7.1, registrado na 4.1). Esta story não pode piorar, mas o
  conserto é da 4.1.
- **Não toca no formulário/canais do Contact nem no Hero.** Fora do pedido; se o
  responsável quiser, vira outra tarefa da Fase 7.
- **Não toca em `SocialIcons` nem no `WhatsAppFloat`** (FR-07), inclusive os
  ícones sociais que ficam ao lado da métrica do About.
- **Não troca os glifos dos ícones** (RemixIcon/FontAwesome continuam os
  mesmos); só o recipiente e a cor mudam.
- **Não adiciona ícone onde não há** (Valores mantêm o número `01…06`; Pacotes,
  Blog e Projetos seguem sem ícone).

## Decisões

- **Decidido** um padrão único (classes `glass-card` / `glass-icon` /
  `glass-ambient` em CSS puro no `globals.css`, fora de `@layer`, como os blocos
  vizinhos `.fluid-btn` e `.hero-glow`), **descartado** repetir utilitários
  Tailwind longos em cada seção, **porque** o pedido é "deixar todos padrão": um
  lugar só para ajustar, e as seções só trocam a classe. Por virem depois dos
  utilitários, as regras `glass-*` vencem um utilitário em conflito: o card não
  pode ter `bg-*`, `shadow-*` nem `transition-*` próprios. `border-*` funciona
  (o `.glass-card` não define borda), mas soma largura — só a barra do destaque
  do About usa.
- **Decidido** borda iluminada como anel no `::after` do card (`inset 0 0 0 1px`
  + realce `inset` no topo), com o halo externo e o brilho interno no
  `box-shadow` do próprio card; hover e destaque só trocam variáveis
  (`--glass-edge`, `--glass-edge-top`, `--glass-halo`, `--glass-halo-blur`).
  **Descartados:** (a) `border: 1px`, **porque** soma 2 px à largura mínima do
  card e o card dos Banners, que já estoura em 480px (4.1), levou o documento de
  504 para 505/506 px; (b) anel `inset` no próprio card, **porque** fica debaixo
  das fotos do Blog/Projetos; (c) borda em gradiente via `mask-composite`,
  **porque** o anel com sombra já reproduz a referência e é mais simples. O
  `.glass-icon` leva `z-index: 1` para o selo dos Serviços, que cruza a aresta do
  card, ficar acima do anel.
- **Decidido** tirar o `transition-all duration-300` de todos os cards,
  **descartado** mantê-lo, **porque** ele interpolava a opacidade que o GSAP
  grava inline (medido: inline 0,11 com calculada 1,00) e mascarava a entrada
  animada; a regra do projeto é transição CSS só de sombra/cor, com
  `transform`/`opacity` só no GSAP. Efeito visível: as entradas passam a seguir
  exatamente os parâmetros dos `*Client.tsx`.
- **Decidido** vidro escuro (tom `18 12 42`, 70→50% de opacidade, brilho
  ambiente a 14%/12%), **descartado** o tom mais claro do primeiro corte
  (`34 22 68`, 62→38%, brilho a 22%), **porque** com ele a tag roxa do Blog
  (`#a15cf5`, texto pequeno) caía para ≈ 4,0:1, abaixo do AA.
- **Decidido pelo responsável (2026-11-03)** manter a barra roxa à esquerda do
  destaque do About (`border-l-2 border-primary-dark`, o mesmo `#a15cf5` do
  baseline, agora por token), **descartado** removê-la pelo padrão único (o que
  o primeiro corte fez). Como o card é `rounded-2xl`, a barra acompanha a curva
  dos cantos (no baseline era `rounded-md`).
- **Decidido pelo responsável (2026-11-03)** mais espaço entre as linhas da grade
  de Serviços: `gap-y-14` (56 px) em todos os tamanhos, mantendo o espaço entre
  colunas (`gap-x-10`, `lg:gap-x-8`). **Descartado** o `gap-10 lg:gap-8`
  anterior, **porque** o selo de cada card sobe 28 px acima da aresta e sobravam
  só 4 px (1024/1200) ou 12 px (mobile) até o card de cima; agora sobram 28 px
  em todos os tamanhos.
- **Decidido** sem `glass-ambient` atrás da coluna de texto do About (destaque e
  métrica), **porque** o brilho ficaria atrás dos parágrafos, reduzindo o
  contraste sem ganho visual.
- **Decidido** brilho ambiente **estático** (radial roxo em CSS) atrás de cada
  grade, **descartado** animá-lo, **porque** sobre o fundo liso `#04091d` o
  `backdrop-filter` não tem nada para desfocar e o vidro não aparece; animar
  seria movimento decorativo novo, fora do pedido e com custo de reduced motion.
- **Decidido** que o hover passa a intensificar borda e halo em todos os cards,
  **descartado** manter a `border-b-2` roxa do legado em Banners/Serviços,
  **porque** o pedido é um padrão só, e a borda inferior isolada contradiz a
  borda iluminada completa da referência (exceção coberta pelo `PEND-15`).
- **Decidido** ícone vivo **sempre** colorido, **descartado** o gradiente
  roxo→branco só no hover do legado (`styles.css:507-512`, `:594-597`),
  **porque** o pedido é "ícones com cores vivas"; no hover o ícone ganha só um
  brilho maior (sem mudar de cor).
- **Decidido** que o pacote destacado continua se diferenciando por borda e halo
  mais fortes e pelo `scale-105` atual, **descartado** igualá-lo aos outros,
  **porque** a distinção do "mais escolhido" é conteúdo aprovado do cliente
  (Pacotes, [CONTENT-MAPPING.md](../CONTENT-MAPPING.md)).
- **Decidido** que o magenta do gradiente do ícone sai da referência e vira
  token (`--glass-icon-to`); o tom final é aprovado pelo responsável na revisão
  visual, que é o critério de saída da Fase 7. Não é cor de marca nova fora do
  card.

## Critérios de aceite

### AC #1 — Um padrão só, em todos os cards do escopo

Em 1200px, os cards de Banners, Serviços, Pacotes, Missão/Visão, Valores,
destaque e métrica do About, Blog e Projetos têm o **mesmo** tratamento: fundo
translúcido (o brilho ambiente aparece por trás, desfocado), contorno claro de
1px mais luminoso no topo e halo roxo suave por fora, cantos arredondados
iguais entre cards do mesmo tipo. Verificação: captura de cada seção ao lado de
[cards-glass-reference.png](../references/cards-glass-reference.png); na página,
`document.querySelectorAll('.glass-card').length` é 31 (3 Banners, 6 Serviços,
3 Pacotes, 2 Missão/Visão, 6 Valores, destaque, métrica, 3 Blog, 6 Projetos);
`grep -rn "bg-\[#0f1221\]" src/sections --exclude=MissionVisionValues.tsx` só
retorna o Contact ([MissionVisionValues.tsx](../../src/sections/About/MissionVisionValues.tsx)
não é importado — tarefa 6.9).

### AC #2 — Ícones vivos

Os 11 ícones (Banners 3, Serviços 6, Missão/Visão 2) aparecem em quadrado
arredondado com gradiente roxo→magenta e glifo branco **sem hover**. O glifo de
cada um é o mesmo de hoje (`ri-pen-nib-line`, `fa-compass`, `fa-bullseye`…).
Verificação: captura em 1200px e 375px; comparação de `className` do `<i>`
antes/depois.

### AC #3 — Hover intensifica, sem deslocar layout

No hover (desktop), a borda e o halo do card ficam mais fortes e o ícone ganha
brilho; nada muda de tamanho nem empurra vizinhos (o `scale` existente das
imagens do Blog/Projetos continua); ao sair, volta ao estado anterior. Só com
`(hover: hover)`: em toque não há estado preso. Verificação: em 1200px, para um
card de cada tipo (Banners, Serviços, Pacote, Pacote destacado, Missão/Visão,
Valores, destaque, métrica, Blog, Projetos), mouse real via CDP
(`Input.dispatchMouseEvent`) no centro do card; o `box-shadow` calculado do card
e do `::after` (e do `.glass-icon`, onde há) muda, a largura/altura do card não
muda, e ao tirar o mouse os valores voltam aos de antes.

### AC #4 — Conteúdo legível e contraste mantido

Sobre o fundo translúcido, título e texto de todos os cards mantêm contraste
AA (≥ 4,5:1 para texto normal). O caso que limita é o roxo `#a15cf5` em texto
pequeno (tag do Blog); `white/60` e `white/70` têm folga. Nenhum texto muda de
cor. Verificação: captura em 1200px de cada card; cor do fundo amostrada em
pixel numa faixa vertical do padding (no Blog, abaixo da foto); contraste
calculado contra o pixel **mais claro** da faixa, comparado com o mesmo cálculo
no baseline.

### AC #5 — Entradas de scroll e Flip sem conteúdo escondido

Rolando para baixo **e** para cima em 1200px e 375px, as entradas seguem os
parâmetros dos `*Client.tsx`, sem transição CSS somada à opacidade; nenhum card
fica abaixo de opacidade 0,99 depois de 1,5 s na tela (medindo a opacidade
acumulada dos ancestrais), nos dois sentidos. O filtro de Projetos troca
categorias com o Flip sem card escondido no fim, sem halo cortado e sem vidro
"estourando" para opaco no meio da transição (captura aos 200 ms).

### AC #6 — Reduced motion e sem JavaScript

Com `prefers-reduced-motion: reduce`, os cards aparecem no estado final de
vidro, estáticos (o brilho ambiente é estático em qualquer caso). Com JS
desabilitado (`node scripts/capture_nojs.js`), todos os cards aparecem com o
visual de vidro e conteúdo visível — o estilo é CSS puro, não depende de
hidratação.

### AC #7 — Mobile e responsivo sem regressão

Em 375, 480, 768, 1024 e 1200px, os cards mantêm a grade atual; o halo não
cria scroll horizontal novo: em 480px, a largura do documento não passa da do
baseline `2544f6f` (504 px, causada pelo card dos Banners — 4.1); nos demais,
igual à largura da viewport. Verificação: `document.documentElement.scrollWidth`
depois de rolar a página inteira, em cada viewport, no novo e no baseline.

### AC #8 — Desempenho do scroll

Num trace do Chrome (`Tracing.start` via CDP, categorias
`devtools.timeline`/`disabled-by-default-devtools.timeline`), durante 8 s de
scroll de cima a baixo em 1200px com CPU 4×, a soma de `Paint`, `PrePaint`,
`Layerize` e `RasterTask` fica na faixa do baseline `2544f6f` (duas rodadas de
cada), e não aparece `RasterTask` nem `Paint` acima de 16 ms que o baseline não
tenha. Se aparecer, reduzir o raio do blur ou restringir o `backdrop-filter` aos
cards sem imagem antes de fechar. Tempo entre quadros via `requestAnimationFrame`
**não** serve de prova: mede a thread principal, não a pintura, e não reprova
nem um blur caro. Limite conhecido: no headless a rasterização é por software; o
custo em GPU de celular real não é coberto por este AC.

### AC #9 — Elementos protegidos intactos

`SocialIcons` do About (ao lado da métrica) e o `WhatsAppFloat` sem diferença
visual, de posição, link ou animação (FR-07).

### AC #10 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; `node scripts/check_ids.js` sem
âncora quebrada; nenhum item do QA-CHECKLIST § 9 violado; evidência em
`docs/references/qa/` (`cards_glass_1200.png`, `cards_glass_375.png`);
aprovação visual do responsável registrada; **SHA** citado no Change Log.

## Plano técnico

- **Referência:** copiar a imagem enviada pelo responsável para
  `docs/references/cards-glass-reference.png`.
- **Tokens** no `:root` de [globals.css](../../src/app/globals.css), como canais
  RGB para compor alfa: `--glass-tint-rgb` (`18 12 42`, preenchimento),
  `--glass-edge-rgb` (lilás claro do anel), `--glass-halo-rgb` (=
  `--primary-color-dark`), `--glass-icon-from` (`#a15cf5`), `--glass-icon-to`
  (`#d63fd1`, magenta da referência). Nada no `tailwind.config.ts`.
- **Primitivas** em CSS puro no `globals.css` (bloco "Cards de vidro", antes do
  bloco de reduced motion; fora de `@layer`, como `.fluid-btn` e `.hero-glow`):
  - `.glass-card` — variáveis de intensidade (`--glass-edge`,
    `--glass-edge-top`, `--glass-halo`, `--glass-halo-blur`);
    `background: linear-gradient(...)` translúcido (70→50%),
    `backdrop-filter: blur(14px) saturate(140%)` (com `-webkit-`), `box-shadow`
    = brilho interno + halo externo sem spread; `transition` só de `box-shadow`.
  - `.glass-card::after` — `inset: 0`, `border-radius: inherit`,
    `pointer-events: none`, anel `inset 0 0 0 1px` + realce do topo.
  - `.glass-card--featured` e `.glass-card:hover` (dentro de
    `@media (hover: hover)`) — só trocam as variáveis.
  - `.glass-icon` — `z-index: 1`, gradiente `--glass-icon-from →
    --glass-icon-to`, glifo branco, `box-shadow` de brilho;
    `.group:hover .glass-icon` aumenta o brilho.
  - `.glass-ambient` — `::before` com radial roxo estático,
    `pointer-events: none`, `z-index` atrás da grade (o container recebe
    `relative isolate`).
  - `@supports not (backdrop-filter: blur(1px))` → fundo um pouco mais opaco,
    para o card não ficar lavado.
- **Seções** (trocar só classes; markup, `data-*` e conteúdo intactos):
  [Banners/index.tsx](../../src/sections/Banners/index.tsx),
  [Services/index.tsx](../../src/sections/Services/index.tsx) (serviços: o
  ícone flutuante do topo vira `glass-icon` mantendo a posição; pacotes:
  `glass-card--featured` no destacado),
  [About/index.tsx](../../src/sections/About/index.tsx) (destaque, métrica,
  Missão/Visão, Valores),
  [Blog/index.tsx](../../src/sections/Blog/index.tsx),
  [Projects/index.tsx](../../src/sections/Projects/index.tsx).
  `.glass-ambient` no container de cada grade (7 grades; não na coluna de texto
  do About). Em cada card sai `bg-[#0f1221]`, `border*`, `shadow*` e
  `transition-all`, que conflitariam com as regras `glass-*` (exceção: a barra
  `border-l-2` do destaque do About, mantida pelo responsável). Grade de
  Serviços com `gap-y-14`, para o selo não encostar no card de cima.
- **Nada** nos `*Client.tsx`.

**Regras que se aplicam** ([AGENTS.md](../../AGENTS.md) § 4 e § 7,
[TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 2): Server Component por padrão
(Projects segue Client inteiro, como hoje); nenhuma animação nova; tokens via
CSS vars/Tailwind, sem hex solto nos componentes; breakpoints 480/768/1024/1200;
botões sociais e WhatsApp intocados; nenhuma dependência nova.

## Tasks

- [x] Salvar a referência em `docs/references/` (AC #1)
- [x] Tokens + `.glass-card`, `.glass-icon`, `.glass-ambient` e fallback `@supports` (AC #1, #2, #3)
- [x] Aplicar em Banners e Serviços/Pacotes (AC #1, #2, #3)
- [x] Aplicar no About (destaque, métrica, Missão/Visão, Valores) (AC #1, #2, #9)
- [x] Aplicar em Blog e Projetos; testar o Flip (AC #1, #5)
- [x] Contraste, reduced motion, sem JS, viewports, hover, trace (AC #3, #4, #6, #7, #8)
- [x] Capturas finais e aprovação do responsável (AC #10)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | sempre | `npx tsc --noEmit` |
| build | sempre | `npm run build` (exit 0, sem warning de hidratação/SSR) |
| âncoras | seções tocadas | `npx next start -p 3008` + `node scripts/check_ids.js` (6× `true`; contra porta sem servidor o script só loga erro e sai 0) |
| visual | 375/480/768/1024/1200 | sonda CDP (pasta temporária) sobre `next start`, captura por seção depois de a entrada terminar → evidência final em `docs/references/qa/`, contra a referência; abrir as imagens |
| movimento | scroll ↓ e ↑, filtro de Projetos, reduced motion | sonda CDP: opacidade acumulada de cada card, nos dois sentidos; Flip com captura aos 200 ms; `prefers-reduced-motion` emulado |
| hover | 1 card de cada tipo, 1200px | sonda CDP com `Input.dispatchMouseEvent` (AC #3) |
| contraste | todos os tipos de card, 1200px | amostra de pixel no padding, novo vs. baseline (AC #4) |
| largura | 5 viewports | `scrollWidth`, novo vs. baseline (AC #7) |
| sem JS | todos os cards | `OUT_DIR=<temp> node scripts/capture_nojs.js` |
| desempenho | scroll em 1200px, CPU 4× | trace via CDP, novo vs. baseline num worktree de `2544f6f` (AC #8) |
| QA-CHECKLIST | § 1 (fidelidade, com a exceção do `PEND-15`), § 3, § 4, § 5 (contraste), § 6, § 9 | itens citados |

## Riscos e armadilhas

- **Vidro sem nada atrás não aparece.** O fundo das seções é liso; sem o brilho
  ambiente, `backdrop-filter` não tem efeito visível e o card só parece
  "mais escuro". Sinal: captura idêntica com e sem `backdrop-filter`.
- **`backdrop-filter` + `opacity`/`transform` animados.** Banners, Serviços,
  About e Blog entram com GSAP mexendo em `opacity`/`transform`; no Chrome o
  desfoque é recalculado por quadro e pode aparecer serrilhado ou "piscar" para
  opaco no meio da animação. O Flip de Projetos é o caso mais sensível. Sinal:
  quadros longos no trace ou flash durante o filtro.
- **Halo cortado.** Grades/containers com `overflow-hidden` cortam o
  `box-shadow` externo. Os cards de Blog/Projetos têm `overflow-hidden`
  **neles próprios** (para a imagem) — o halo é do próprio card, então passa;
  conferir se nenhum ancestral corta.
- **Scroll horizontal em 480px (4.1).** O card dos Banners já estoura; tudo que
  soma largura ao card piora — `border`, halo com `spread` positivo, padding.
  Borda só como anel no `::after`, halo só com `blur`. Sinal: `scrollWidth` em
  480px acima de 504 px.
- **Utilitário em conflito com `glass-*`.** As regras `glass-*` vêm depois dos
  utilitários do Tailwind e vencem em empate de especificidade: um `bg-*` ou
  `shadow-*` deixado no card é ignorado sem aviso; um `border-*` funciona, mas
  soma largura (480px); um
  `transition-all` volta a mascarar a opacidade do GSAP. Sinal: card "lavado" ou
  entrada sem animação.
- **Sonda com espera fixa logo depois de `scrollIntoView`.** O `html` tem
  `scroll-behavior: smooth`: o salto leva ~1 s e o trigger dispara no meio da
  viagem. Com espera fixa de 1100 ms, o 3º card do Blog ainda está entrando e
  parece "escondido". Medir até ficar opaco (ou desligar o smooth na sonda), não
  com espera fixa.
- **Servidor velho na porta.** Rebuildar com o `next start` antigo ainda vivo
  serve HTML de um build com chunks do outro: o JS quebra, nada anima, e a sonda
  dá verde. Matar o processo da porta antes de subir o servidor de novo e
  conferir o CSS servido.
- **Contraste sobre o brilho ambiente.** O ponto mais claro do radial fica atrás
  do texto; medir ali, não no centro escuro do card.
- **Preservar:** o bloco "Botões Sociais - Preservação Inegociável… (FR-07)" e
  os keyframes do Hero em `globals.css`; os `data-*` de todos os cards
  (`data-banner-card`, `data-banner-icon`, `data-service-card`,
  `data-service-badge`, `data-package-card`, `data-about-*`, `data-blog-card`,
  `data-project-card`, `data-flip-id`) — os clients selecionam por eles.

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [x] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-15` já `RESOLVED`; nenhum outro consumido.
- [x] Docs afetados atualizados: [CLAUDE.md](../../CLAUDE.md) (§ Estilo: padrão `glass-card`/`glass-icon`) e [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) se descreverem o estilo dos cards. (a TECHNICAL-SPEC não descreve estilo de card: sem mudança)
- [x] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:**
[globals.css](../../src/app/globals.css) (tokens `--glass-*` no `:root`; bloco
"Cards de vidro" com `.glass-card`, `.glass-card::after`,
`.glass-card--featured`, `.glass-icon`, `.glass-ambient` e o fallback
`@supports`), [Banners/index.tsx](../../src/sections/Banners/index.tsx),
[Services/index.tsx](../../src/sections/Services/index.tsx),
[About/index.tsx](../../src/sections/About/index.tsx),
[Blog/index.tsx](../../src/sections/Blog/index.tsx),
[Projects/index.tsx](../../src/sections/Projects/index.tsx) (só classes;
`data-*`, markup e conteúdo intactos; nenhum `*Client.tsx` tocado);
[CLAUDE.md](../../CLAUDE.md) (§ Estilo → Cards);
[QA-CHECKLIST.md](../QA-CHECKLIST.md) (§ 3 e § 5); evidências
[cards_glass_1200.png](../references/qa/cards_glass_1200.png) e
[cards_glass_375.png](../references/qa/cards_glass_375.png).

**O que divergiu do plano:** o plano original previa `border: 1px`, regras em
`@layer components`, tokens no `tailwind.config.ts` e um vidro mais claro; a
implementação usou anel no `::after`, CSS fora de `@layer`, nenhum token no
Tailwind e um vidro mais escuro, por largura em 480px, fotos cobrindo o anel e
contraste AA. Também tirou o `transition-all` dos cards; a barra do destaque do
About saiu e voltou por decisão do responsável. Na validação da story (2026-11-03), Escopo, Decisões, Plano técnico,
AC #1/#3/#4/#5/#7/#8, Validações e Riscos foram reescritos para descrever o que
foi feito, com o porquê e o descartado nas Decisões. Mais nada divergiu.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-03 | TODO | Story criada sobre `ff8618e`. Escopo definido pelo responsável: todos os cards de About, Banners, Serviços, Pacotes, Blog e Projetos, num padrão único ("deixe eles padrão"). |
| 2026-11-03 | IN_PROGRESS | Iniciada sobre `2544f6f` (4.7 já commitada). Aval do responsável para implementar ("acredito que dá pra prosseguir, 4.7 resolvida"), registrado como validação da story. |
| 2026-11-03 | IN_PROGRESS | Implementada; aguarda `review-mr` e a aprovação visual do responsável (critério de saída da Fase 7). Validado na árvore de trabalho sobre `2544f6f`: `npx tsc --noEmit` OK; `npm run build` `✓ Compiled successfully`, sem warnings; `node scripts/check_ids.js` 6× `true`; `OUT_DIR=<temp> node scripts/capture_nojs.js` com cards de vidro e conteúdo visível; sonda CDP (pasta temporária) sobre `next start` 3008, comparada com o baseline num worktree de `2544f6f` na 3009: 31 cards / 11 ícones / 7 grades nos 5 viewports, 0 card escondido descendo e subindo, `scrollWidth` = viewport em 375/768/1024/1200 e 504 px em 480 (= baseline), reduced motion com os 31 opacos, Flip sem card escondido (a sobreposição do título no meio do Flip já existe no baseline), scroll de 8 s com CPU 4× p95 16,8 ms e 0 quadro > 50 ms com e sem `backdrop-filter`, contraste em pixel `#a15cf5` ≥ 4,60:1, `white/70` ≥ 9,14:1, 0 erro de console. Capturas abertas e conferidas. |
| 2026-11-03 | IN_PROGRESS | Validação da story (`validate-story`), ajustes aplicados a pedido do responsável. Texto alinhado à implementação: Decisões (`::after`, fora de `@layer`, `transition-all`, tom escuro, barra do destaque, sem ambiente na coluna do About), Escopo (sem tokens no Tailwind), Fora de escopo (4.7 `DONE`), Plano técnico, Validações e Riscos; ACs reescritos: #1 (grep exclui `MissionVisionValues.tsx`; contagem de 31), #3 (hover via CDP), #4 (pixel, `#a15cf5` como limite), #5 (sem transição CSS somada; opacidade ≥ 0,99 após 1,5 s), #7 (504 px do baseline `2544f6f`), #8 (trace, não rAF — o p95 de 16,8 ms da linha anterior não prova desempenho). Verificado na árvore de trabalho sobre `2544f6f`, `next start` 3008 vs. worktree do baseline na 3009: **AC #3** — 10 tipos de card, `box-shadow` do card e do `::after` mudam no hover (e do ícone nos 3 tipos com ícone), tamanho igual, estado restaurado ao sair, `(hover: hover)` verdadeiro; **AC #8** — 2 rodadas de 8 s, CPU 4×: novo `Paint` 1006/1014 ms, `PrePaint` 355/377, `Layerize` 671/676, `RasterTask` 92/87, 0 `RasterTask`/`Paint` > 16 ms; baseline `Paint` 1076/1409, `PrePaint` 389/478, `Layerize` 531/696, `RasterTask` 94/68, 1 `Paint` > 16 ms. Falta só a aprovação visual (AC #10). |
| 2026-11-03 | IN_PROGRESS | Ajustes pedidos pelo responsável na revisão visual: barra roxa do destaque do About mantida (`border-l-2 border-primary-dark`) e grade de Serviços com `gap-y-14` (selo a 28 px do card de cima, antes 4 px em 1024/1200 e 12 px no mobile). Verificado na árvore de trabalho sobre `2544f6f`: `npx tsc --noEmit` OK; `npm run build` `✓ Compiled successfully`; `next start` 3008 com o CSS novo conferido (`row-gap:3.5rem`); sonda CDP nos 5 viewports: folga do selo 28 px em todas as linhas, barra `2px rgb(161, 92, 245)`, `scrollWidth` 375/504/768/1024/1200 (igual ao anterior), 0 erro de console; capturas abertas e `cards_glass_1200.png` / `cards_glass_375.png` atualizadas. Aprovação do tom do magenta e do vidro ainda pendente (AC #10). |
| 2026-11-03 | DONE | Aprovação visual do responsável ("aprovado", tom do magenta e do vidro). Review (`review-mr`): pode seguir, sem bloqueadores; 1 ajuste menor aplicado (comentário do bloco em `globals.css` apontava o anel no `box-shadow`, hoje no `::after`). Validado na árvore de trabalho sobre `2544f6f`, no estado entregue: `npx tsc --noEmit` OK; `npm run build` `✓ Compiled successfully`, sem warnings; `node scripts/check_ids.js` 6× `true`; sonda CDP sobre `next start` 3008: 31 cards / 11 ícones / 7 grades nos 5 viewports, 0 card escondido descendo, `scrollWidth` 375/504/768/1024/1200, reduced motion 31 opacos, Flip sem card escondido; varredura de volta em 1200px com smooth desligado e 1,5 s por card: 3/3 sem card < 0,99 (AC #5); `OUT_DIR=<temp> node scripts/capture_nojs.js` 375×14735 e 1200×8019 com rodapé, capturas abertas. AC #3 (hover) e AC #8 (trace) conforme a linha da validação da story. |
