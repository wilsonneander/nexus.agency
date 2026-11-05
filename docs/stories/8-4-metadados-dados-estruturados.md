---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 8.4 — Completar metadados de compartilhamento e dados estruturados

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | TODO                                                                                    |
| **Fase**        | Fase 8 — Leveza, SEO e deploy no Cloudflare Pages                                       |
| **Área**        | performance/SEO                                                                         |
| **Seções**      | global                                                                                  |
| **Tamanho**     | M — `app/layout.tsx`, `SITE_CONFIG` e assets de metadados, sem mudança visual na página |
| **Depende de**  | [8.1](8-1-dominio-oficial.md) (`DONE` — URLs absolutos no domínio oficial); [8.2](8-2-deploy-estatico-cloudflare-pages.md) (`DONE` — export estático) |
| **Requisitos**  | QA-CHECKLIST § 7, TECHNICAL-SPEC § 6                                                    |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit (revalidado em `d7214b1`: `layout.tsx` sem mudança; `constants.ts` só ganhou o `url` da 8.1) |

## Contexto

Achados 1.5–1.7 de [CODE-REVIEW-2026-11-05.md](../CODE-REVIEW-2026-11-05.md). Em `3a87d86`, em [layout.tsx](../../src/app/layout.tsx):

- `openGraph.images` declara `/assets/header.webp` com `width: 1200, height: 630`, mas o arquivo tem **1792×1024** (`sips -g pixelWidth -g pixelHeight public/assets/header.webp`). A imagem é a foto do Hero legado, que o Hero do rebuild nem usa mais (`PEND-14`); hoje só o OG a referencia. WebP não é aceito por todos os leitores de OG — e o WhatsApp é o canal principal do cliente.
- O título é `"Nexus | Agency"` (sem termo de busca) e a descrição tem ~190 caracteres (o Google corta por volta de 155–160). Os dois vêm de `SITE_CONFIG` e repetem o legado. Ficam para a 8.8 (`PEND-19`).
- Não há JSON-LD. Os dados para um `Organization` já estão aprovados em `SITE_CONFIG`: nome, e-mail (`PEND-11`), WhatsApp (`PEND-07`), redes (`PEND-08`), área de atendimento (`PEND-09` parcial). O logo (`/assets/logo.png`, 500×170) está escrito à mão em [Navbar.tsx](../../src/components/layout/Navbar.tsx) e [Footer.tsx](../../src/components/layout/Footer.tsx), não em `SITE_CONFIG`.
- Favicon: `icon2.png` 500×500 serve como `icon`, `shortcut` e `apple`, e não é usado em mais nada. Não há `favicon.ico` nem `theme-color`.

Resultado pretendido: o link compartilhado mostra uma prévia correta (inclusive no WhatsApp), e o Google recebe dados estruturados da organização.

## Escopo

- JSON-LD `Organization` em `layout.tsx`, só com dados de `SITE_CONFIG`.
- Imagem OG em JPG, convertida da foto atual sem recorte, com metadados OG/Twitter coerentes (dimensões e tipo reais).
- Ícones pela convenção do App Router (`src/app/icon.png`, `apple-icon.png`) gerados do `icon2.png`; `viewport.themeColor` = fundo do site.
- Remover de `public/assets/` o que deixar de ser usado (`icon2.png`, `header.webp`).

## Fora de escopo

- **Título, descrição e arte de OG 1200×630 aprovados** → tarefa **8.8**, aguardando o `PEND-19` (desmembrado em 2026-11-05 na validação). Conteúdo e identidade são do responsável (AGENTS.md § 4).
- **Não adiciona `aggregateRating`, endereço, horário estruturado nem qualquer dado fora de `SITE_CONFIG`.** Seria inventar dado.
- **Não muda a URL do LinkedIn em `SITE_CONFIG.socials`** (hoje `.../nexus-ag-br/posts/?feedView=all`): o `sameAs` usa o valor como está. Limpar a URL mudaria o link de um botão social protegido (FR-07).

## Decisões

- **Decidido** `@type: "Organization"`, **descartado** `ProfessionalService`/`LocalBusiness`, **porque** o Google exige `address` em qualquer subtipo de `LocalBusiness` (o Rich Results Test reprovaria) e não há endereço aprovado. `Organization` aceita `logo`, `email`, `telephone`, `sameAs` e `areaServed` sem campo obrigatório.
- **Decidido** `areaServed: { "@type": "Country", "name": "Brasil" }` como campo de `SITE_CONFIG`, derivado de `serviceArea` ("em todo o Brasil, 100% online"), **descartado** o literal `"BR"` no layout, **porque** todo valor do JSON-LD sai de `SITE_CONFIG`.
- **Decidido** `telephone` = `` `+${SITE_CONFIG.whatsapp.number}` `` (`+556192985392`, E.164), **descartado** um formato digitado à mão ou o URL `wa.me`, **porque** é derivado do número aprovado.
- **Decidido** `SITE_CONFIG.logo = "/assets/logo.png"`, lido também pelo `Navbar` e pelo `Footer`, **porque** o caminho hoje está repetido à mão em dois lugares e o JSON-LD seria o terceiro.
- **Decidido** (responsável, 2026-11-05), até a 8.8, converter `header.webp` para **JPG 1200×686** (mesma proporção, sem recorte) e declarar `type: "image/jpeg"` com as dimensões reais, **descartado** manter o WebP, **porque** o WebP pode não gerar prévia no WhatsApp; **descartado** recortar para 1200×630, **porque** recorte é decisão de identidade (`PEND-19`).
- **Decidido** o JSON-LD num `<script type="application/ld+json">` server-side no `layout.tsx`, **descartado** um componente client, **porque** precisa estar no HTML estático.
- **Decidido** o `themeColor` numa constante TS única comentada como espelho de `--secondary-color`, **porque** o `viewport` não lê CSS var e a regra proíbe hex solto.

## Critérios de aceite

### AC #1 — JSON-LD válido e só com dados aprovados

`out/index.html` tem um `application/ld+json` com `@type: Organization`, `name`, `url`, `logo` (absoluto), `email`, `telephone` (`+556192985392`), `sameAs` (as 3 URLs de `SITE_CONFIG.socials`, iguais às de lá) e `areaServed`. O conteúdo do script, colado no [validador do schema.org](https://validator.schema.org/), não aponta erro nem aviso. No [Rich Results Test](https://search.google.com/test/rich-results) (modo código), nenhum erro — "nenhum item detectado" é aceitável. Cada valor sai de `SITE_CONFIG` (`grep` no `layout.tsx` não acha literal de e-mail, telefone, URL de rede nem `Brasil`).

### AC #2 — OG coerente e com prévia

`out/index.html` tem `og:image` apontando para um JPG em `/assets/`, com `og:image:width`/`height` iguais ao `sips` do arquivo (1200×686) e `og:image:type` = `image/jpeg`; `twitter:image` aponta para o mesmo arquivo. A imagem é a mesma foto, sem recorte (proporção 1792:1024 preservada). Num preview do Pages (branch fora da `main`), a prévia aparece num depurador de OG (ex.: opengraph.xyz) **e** no LinkedIn Post Inspector ou numa mensagem do WhatsApp.

### AC #3 — Ícones

No `out/` servido, `/icon.png` (512×512) e `/apple-icon.png` (180×180) respondem 200 e o HTML os referencia; `<meta name="theme-color" content="#04091d">` presente (= `--secondary-color` de [globals.css](../../src/app/globals.css)). `public/assets/icon2.png` e `public/assets/header.webp` não existem mais e nenhum arquivo de `src/` os cita.

### AC #4 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; `out/` servido na 3008 sem erro de console; logo do Navbar e do Footer iguais a antes (mesmo `src`); `npx lighthouse http://localhost:3008 --only-categories=seo` = 100 sobre o `out/`; nenhum item do QA-CHECKLIST § 9 violado; SHA no Change Log.

## Plano técnico

- [constants.ts](../../src/lib/constants.ts): `logo: "/assets/logo.png"` e `areaServed` (`Country` Brasil), com comentário de origem (derivados de aprovados). Constante do `themeColor` (`#04091d`, espelho de `--secondary-color`).
- [Navbar.tsx](../../src/components/layout/Navbar.tsx) e [Footer.tsx](../../src/components/layout/Footer.tsx): `src={SITE_CONFIG.logo}`.
- [layout.tsx](../../src/app/layout.tsx): objeto JSON-LD montado de `SITE_CONFIG` (`logo`/`url` absolutos via `new URL(..., SITE_CONFIG.url)`), renderizado com `dangerouslySetInnerHTML` + `JSON.stringify(...).replace(/</g, "\\u003c")`; `export const viewport: Viewport = { themeColor }`; OG/Twitter com o JPG e dimensões/tipo reais; remover `metadata.icons`.
- `public/assets/og-image.jpg`: `sips -s format jpeg -s formatOptions 80 --resampleWidth 1200 header.webp` (≤ 150 KB); depois apagar `header.webp`.
- `src/app/icon.png` (512) e `src/app/apple-icon.png` (180) com `sips --resampleWidth` a partir do `icon2.png`; depois apagar `icon2.png`.
- [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 6: registrar o JSON-LD (`Organization`, origem dos campos) e os ícones por convenção.

**Regras que se aplicam:** não inventar conteúdo/dado (AGENTS.md § 4); `SITE_CONFIG` só muda com autorização — os campos novos são derivados dos aprovados; sem hex solto; só assets usados em `public/assets/`.

## Tasks

- [ ] `SITE_CONFIG.logo`/`areaServed`/`themeColor` + Navbar/Footer lendo o logo
- [ ] JSON-LD (AC #1)
- [ ] OG em JPG com dimensões reais (AC #2)
- [ ] Ícones, `theme-color` e remoção dos assets órfãos (AC #3)
- [ ] Validação (AC #4)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sempre | `npx tsc --noEmit`, `npm run build` |
| SEO | JSON-LD | validador do schema.org + Rich Results Test (modo código) sobre o script de `out/index.html` |
| SEO | OG | `grep og: out/index.html` + `sips` do JPG; depurador de OG e WhatsApp/LinkedIn no preview do Pages (push numa branch — só com aval) |
| SEO | Lighthouse | `npx lighthouse http://localhost:3008 --only-categories=seo` sobre `out/` = 100 |
| visual | logo | Navbar e Footer em 375 e 1200px, `out/` servido na 3008 |
| QA-CHECKLIST | § 7 | metadados |

## Riscos e armadilhas

- `JSON.stringify` não escapa `</script>`: os dados são constantes nossas, mas o `.replace(/</g, "\\u003c")` evita o problema por construção.
- O `telephone` vem de `whatsapp.number` com `+`, nunca do `displayNumber` (parênteses) nem do URL `wa.me`.
- O `logo` e o `url` do JSON-LD precisam ser absolutos (`metadataBase` não se aplica a ele).
- A CSP da 8.7, quando entrar, precisa permitir o script inline do JSON-LD (é `application/ld+json`, que não executa, mas algumas CSPs bloqueiam igual).
- A prévia do WhatsApp fica em cache por URL: testar com o preview do Pages, não com o domínio oficial ainda sem DNS (`PEND-20`).

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência.
- [ ] `npx tsc --noEmit` verde.
- [ ] `npm run build` verde, sem warning de hidratação/SSR.
- [ ] Validação visual: logo do Navbar/Footer inalterado; prévia de OG descrita em texto.
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [ ] Docs afetados (TECHNICAL-SPEC) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao implementar.>

**O que divergiu do plano:** <preenchido ao implementar.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`, a partir da [revisão de código](../CODE-REVIEW-2026-11-05.md) §§ 1.5–1.7. AC #4 depende do `PEND-19`. |
| 2026-11-05 | TODO | Validada sobre `d7214b1`: `ProfessionalService` → `Organization` (o Rich Results Test exige `address` em `LocalBusiness`); `telephone`, `logo` e `areaServed` derivados de `SITE_CONFIG`; OG convertido para JPG 1200×686 sem recorte (responsável); AC #4 (`PEND-19`) desmembrado para a 8.8 e o antigo AC #5 virou AC #4; remoção de `icon2.png`/`header.webp`; comando do Lighthouse e validação sobre `out/`; dependências 8.1/8.2 atualizadas para `DONE`. |
