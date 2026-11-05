---
baseline_commit: 108825a672e7af4d1ee3e1705cc1d858aeca6865
---

# Story 7.3 — Apontar os links do rodapé para a LP e remover o Blog

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 7 — Evolução visual (pós-entrega)                                                  |
| **Área**        | conteúdo, conversão, layout/UI                                                          |
| **Seções**      | Footer, Navbar, Services, Blog (removida)                                               |
| **Tamanho**     | S — um componente de layout, um atributo nos cards de Serviços, remoção de uma seção inteira e dos seus dados/assets |
| **Depende de**  | `PEND-02` (`RESOLVED` — decisão do responsável em 2026-11-03); `PEND-12` (aberto — por isso a Política fica em `#`) |
| **Requisitos**  | FR-01 (com a exceção do `PEND-02`), FR-05, FR-07, FR-11                                  |
| **Baseline**    | `108825a` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

No baseline, os 8 links do rodapé ([Footer.tsx:32-46](../../src/components/layout/Footer.tsx)
em `108825a`) apontam para `#`, com os rótulos do legado (Inbound Marketing,
Criação e Desenvolvimento, Tráfego Pago, Business Intelligence, Marketing /
Contato, Blogs, Politica e Privacidade), e o Blog (`#blog`) segue o legado com
3 cards "Saiba Mais" também em `#` — tudo catalogado no
[AUDIT.md § 12.3](../AUDIT.md) sob o `PEND-02`.

O responsável decidiu (2026-11-03, `PEND-02` no [TASKS.md](../TASKS.md)):

- **Serviços** do rodapé passam a ser: Planejamento estratégico, Gestão de
  tráfego pago, Criação e Desenvolvimento, Chatbots e automação de atendimento,
  Relatórios e análise de resultados — cada um levando à sua seção na LP.
- **Suporte**: Contato e Politica e privacidade. A LP não tem seção de
  privacidade (`PEND-12` aberto); perguntado, o responsável escolheu **manter
  `href="#"`** por ora.
- **Blog removido**, junto com a página (seção, link "Blog" da navbar e
  "Blogs" do rodapé).

Este contexto **não** cobre a página/modal de privacidade (`PEND-12`) nem o
e-mail institucional (`PEND-11`).

## Escopo

- Rodapé com os 5 rótulos de serviço do cliente, cada um com âncora para o card
  correspondente em `#service`.
- "Contato" → `#contact`; "Politica e privacidade" em `href="#"`.
- Cards de serviço com `id` (= `SERVICES_DATA[].id`) e margem de rolagem que
  deixa o card inteiro, com o selo do ícone, abaixo da navbar fixa.
- Remoção do Blog: seção, `navLinks`, dados, tipo, imagens servidas e
  referências nos scripts de validação.

**Se for preciso cortar:** nada, é atômica.

## Fora de escopo

- **Não cria página/modal de privacidade.** Fica no `PEND-12`.
- **Não toca no legado** (`index.html`, `assets/blog-*.jpg` na raiz ficam intactos — fonte de verdade).
- **Não altera** `SocialIcons`, `WhatsAppFloat` nem os demais `SITE_CONFIG`.

## Decisões

- **Decidido** apontar cada serviço para o **card** (`#planejamento-estrategico`
  etc.), **descartado** apontar todos para `#service`, **porque** "cada link
  deve levar para a sessão da LP" — o card é o destino específico, e os `id`
  já existiam em [services.ts](../../src/data/services.ts).
- **Decidido** "Criação e Desenvolvimento" → card "Criação de sites e landing
  pages" (`#criacao-sites-landing-pages`), o único serviço de criação/desenvolvimento.
- **Decidido** rótulos exatamente como o responsável escreveu (inclusive
  "Politica e privacidade", sem acento e com "p" minúsculo).
- **Decidido** `scroll-mt-32` nos cards, **porque** a navbar fixa termina em
  81px e o selo do ícone fica 28px acima do card: com 128px de margem o selo
  aparece inteiro. As seções não precisam (o `py-24` delas já absorve a navbar).
- **Decidido** redistribuir as colunas do rodapé (md: logo em largura total,
  Serviços/Suporte 6+6; lg: 5/4/3, antes 6/3/3) + `whitespace-nowrap` nos links
  de serviço, **descartado** mexer no `RollingText`, **porque** os rótulos do
  cliente são mais longos que os do legado ("Chatbots e automação de
  atendimento" ≈ 265px) e o `RollingText` tem altura fixa de uma linha: com
  6/3/3 o rótulo quebrava e era cortado em 1200px (medido). O `RollingText` é
  compartilhado com a navbar e não muda. Cores, fontes e ordem das colunas
  ficam iguais.
- **Decidido** remover também `src/data/blog.ts`, o tipo `BlogPostItem` e
  `public/assets/blog-{1,2,3}.jpg` (sem outro uso), **porque** a seção foi
  removida "junto com a página" e código morto vira trabalho da 6.9.

## Critérios de aceite

### AC #1 — Coluna Serviços leva aos cards

Os 5 rótulos aparecem na ordem pedida; clicar em cada um rola até o card do
serviço, com o card visível abaixo da navbar. Verifica-se clicando os links reais
do rodapé em 375 e 1200px (sonda CDP) e medindo `location.hash`, o topo do card
e a navbar.

### AC #2 — Coluna Suporte

"Contato" leva a `#contact`; "Politica e privacidade" fica em `href="#"`
(`PEND-12`); "Blogs" não existe mais.

### AC #3 — Blog removido

Não há `id="blog"` no HTML, nem "Blog" na navbar (desktop e mobile), nem
imports/dados/tipos do Blog em `src/`. `node scripts/check_ids.js` confirma.

### AC #4 — Rodapé sem corte nem vazamento

Em 375/480/768/1024/1200px, nenhum link do rodapé é cortado pelo `RollingText`
nem passa da coluna, e a página não tem rolagem horizontal.

### AC #5 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; nenhum item do QA-CHECKLIST § 9
violado; evidência em `docs/references/qa/`; SHA no Change Log.

## Plano técnico

- [Footer.tsx](../../src/components/layout/Footer.tsx): lista `FOOTER_SERVICE_LINKS` (rótulo + âncora) renderizada com `RollingLink`; Suporte com 2 links; spans das colunas.
- [Services/index.tsx](../../src/sections/Services/index.tsx): `id={service.id}` + `scroll-mt-32` no card.
- [constants.ts](../../src/lib/constants.ts): sai `{ label: "Blog", href: "#blog" }` de `navLinks`.
- [page.tsx](../../src/app/page.tsx): sai `BlogSection`. Apagados `src/sections/Blog/`, `src/data/blog.ts`, `BlogPostItem` em [types/index.ts](../../src/types/index.ts), `public/assets/blog-*.jpg`.
- [check_ids.js](../../scripts/check_ids.js) confere as 5 âncoras novas e a ausência de `#blog`; [capture_validation.js](../../scripts/capture_validation.js) perde a captura do Blog.

**Regras que se aplicam:** Server Component (o Footer continua server; a
animação segue no `FooterClient`); sem animação nova; `SocialIcons` e WhatsApp
intocados; nenhuma dependência nova.

## Tasks

- [x] Rodapé com os links novos (AC #1, AC #2)
- [x] Âncoras e margem de rolagem nos cards (AC #1)
- [x] Remover Blog de página, navbar, dados, tipos, assets e scripts (AC #3)
- [x] Ajustar colunas do rodapé ao rótulo mais longo (AC #4)
- [x] Validar e atualizar docs (AC #5)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sem erro | `npx tsc --noEmit`, `npm run build` |
| âncoras | 5 cards + seções; `#blog` ausente | `node scripts/check_ids.js` |
| navegação | clique real em cada link do rodapé | sonda CDP descartável (fora do repo), 375 e 1200px |
| visual | rodapé sem corte/vazamento | sonda CDP nos 5 viewports + capturas |

## Riscos e armadilhas

- **Renomear `SERVICES_DATA[].id` quebra o rodapé** em silêncio (o link vira
  `#` inexistente). O `check_ids.js` pega isso.
- Rótulo de serviço maior no futuro volta a estourar a coluna em 768px (o
  `whitespace-nowrap` impede o corte, mas não o vazamento) — rodar a sonda de
  encaixe.
- Preservar: o comentário/estrutura do `FooterClient` (reveal das colunas por
  `data-footer-col`) e o `SocialIcons variant="footer"` (FR-07).

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual feita nos viewports afetados (`footer_links_1200.png`, `footer_links_375.png`).
- [x] Itens tocados do [QA-CHECKLIST.md](../QA-CHECKLIST.md) atualizados com a evidência.
- [x] `PEND-02` marcado `RESOLVED`.
- [x] Docs afetados ([CLAUDE.md](../../CLAUDE.md), [README.md](../../README.md), [ARCHITECTURE.md](../ARCHITECTURE.md), [PRD.md](../PRD.md), [AUDIT.md](../AUDIT.md) § 12, [CONTENT-MAPPING.md](../CONTENT-MAPPING.md)) atualizados.
- [x] Revisão (`review-mr`) e status `DONE` na story **e** no `TASKS.md`.

## Execução

**Arquivos tocados:** [Footer.tsx](../../src/components/layout/Footer.tsx),
[Services/index.tsx](../../src/sections/Services/index.tsx),
[constants.ts](../../src/lib/constants.ts), [page.tsx](../../src/app/page.tsx),
[types/index.ts](../../src/types/index.ts), [globals.css](../../src/app/globals.css)
(comentário), [check_ids.js](../../scripts/check_ids.js),
[capture_validation.js](../../scripts/capture_validation.js); removidos
`src/sections/Blog/`, `src/data/blog.ts`, `public/assets/blog-{1,2,3}.jpg`.

**O que divergiu do plano:** o ajuste das colunas do rodapé (AC #4) não estava
previsto; apareceu na primeira captura em 1200px, onde "Chatbots e automação de
atendimento" era cortado.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-03 | IN_PROGRESS | Story criada sobre `108825a` a partir da decisão do `PEND-02`; Política de privacidade mantida em `#` por escolha do responsável. |
| 2026-11-03 | IN_PROGRESS | Implementada (árvore de trabalho sobre `108825a`). Validação: `npx tsc --noEmit` ✓, `npm run build` ✓ (`/` 13,5 kB); `node scripts/check_ids.js` → 10 âncoras presentes, `#blog` ausente; HTML com um único `href="#"` (Privacidade); clique real nos 6 links internos do rodapé em 375 e 1200px → `hash` correto, card em 128px com a navbar terminando em 81px, `opacity` 1; sonda de encaixe em 375/480/768/1024/1200 → 0 link cortado ou fora da coluna, `scrollWidth − innerWidth` = 0. Reduced motion não foi reexercitado (nenhuma animação mudou). |
| 2026-11-03 | DONE | Revisada (`review-mr`: sem bloqueadores; ajuste das colunas do rodapé aceito como necessário ao AC #4) e revalidada no build de produção limpo (`rm -rf .next && npm run build` + `next start`), na árvore de trabalho sobre `108825a`: `npx tsc --noEmit` ✓, `npm run build` ✓; `check_ids.js` 11/11; encaixe do rodapé em 375/480/768/1024/1200 → 0/7 cortados, sem scroll horizontal; clique nos 6 links internos em 375 e 1200 → destino certo, card em 122–128px (navbar até 81px), `opacity` 1. |
| 2026-11-05 | DONE | Aprovação visual do rodapé pelo responsável (vale para as stories 7.3, 7.4 e 7.5). |
