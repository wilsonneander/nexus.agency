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
| **Tamanho**     | M — só `app/layout.tsx` e assets de metadados, sem mudança visual na página; parte depende de conteúdo |
| **Depende de**  | [8.1](8-1-dominio-oficial.md) (`IN_PROGRESS` — URLs absolutos no domínio oficial); `PEND-19` (`PENDING_APPROVAL` — título, descrição e imagem OG) só para o AC #4 |
| **Requisitos**  | QA-CHECKLIST § 7, TECHNICAL-SPEC § 6                                                    |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Achados 1.5–1.7 de [CODE-REVIEW-2026-11-05.md](../CODE-REVIEW-2026-11-05.md). Em `3a87d86`, em [layout.tsx](../../src/app/layout.tsx):

- `openGraph.images` declara `/assets/header.webp` com `width: 1200, height: 630`, mas o arquivo tem **1792×1024** (`sips -g pixelWidth -g pixelHeight public/assets/header.webp`). A imagem é a foto do Hero legado, que o Hero do rebuild nem usa mais (`PEND-14`). WebP não é aceito por todos os leitores de OG.
- O título é `"Nexus | Agency"` (sem termo de busca) e a descrição tem ~190 caracteres (o Google corta por volta de 155–160). Os dois vêm de `SITE_CONFIG` e repetem o legado.
- Não há JSON-LD. Os dados para um `Organization`/`ProfessionalService` já estão aprovados em `SITE_CONFIG`: nome, logo, e-mail (`PEND-11`), WhatsApp (`PEND-07`), redes (`PEND-08`), área de atendimento (`PEND-09` parcial).
- Favicon: `icon2.png` 500×500 serve como `icon`, `shortcut` e `apple`. Não há `favicon.ico` nem `theme-color`.

Resultado pretendido: o link compartilhado mostra uma prévia correta, e o Google recebe dados estruturados da organização.

## Escopo

- JSON-LD `ProfessionalService` (subtipo de `LocalBusiness`/`Organization`) em `layout.tsx`, só com dados de `SITE_CONFIG`.
- Metadados OG/Twitter coerentes com a imagem de fato usada (dimensões e tipo reais).
- Ícones pela convenção do App Router (`src/app/icon.png`, `apple-icon.png`) gerados do `icon2.png`; `viewport.themeColor` = fundo do site.
- Quando o `PEND-19` sair: título, descrição e imagem OG 1200×630 aprovados.

**Se for preciso cortar:** o AC #4 (depende do `PEND-19`) sai e a story fecha com o resto; o AC #4 vira tarefa própria.

## Fora de escopo

- **Não reescreve título, descrição nem cria arte de OG por conta própria.** Conteúdo e identidade são do responsável (AGENTS.md § 4): `PEND-19`.
- **Não adiciona `aggregateRating`, endereço, horário estruturado nem qualquer dado fora de `SITE_CONFIG`.** Seria inventar dado.

## Decisões

- **Decidido** `ProfessionalService` com `areaServed: "BR"`, **descartado** `LocalBusiness` com endereço, **porque** o atendimento é "em todo o Brasil, 100% online" (`SITE_CONFIG.serviceArea`) e não há endereço aprovado.
- **Decidido**, até o `PEND-19`, usar o `header.webp` com as dimensões reais (1792×1024) e `type: "image/webp"`, **descartado** recortar a foto por conta própria, **porque** recorte é decisão de identidade. Isso corrige a mentira das dimensões sem inventar arte.
- **Decidido** o JSON-LD num `<script type="application/ld+json">` server-side no `layout.tsx`, **descartado** um componente client, **porque** precisa estar no HTML estático.

## Critérios de aceite

### AC #1 — JSON-LD válido e só com dados aprovados

O HTML de `/` tem um `application/ld+json` com `@type: ProfessionalService`, `name`, `url`, `logo`, `email`, `telephone`, `sameAs` (as 3 redes de `SITE_CONFIG.socials`) e `areaServed`. O [Rich Results Test](https://search.google.com/test/rich-results) / validador do schema.org não aponta erro. Cada valor tem origem em `SITE_CONFIG` (nada digitado à mão).

### AC #2 — OG coerente

`og:image:width`/`height` batem com o arquivo real; `og:image:type` presente. A prévia em um depurador de OG (ex.: opengraph.xyz) mostra a imagem.

### AC #3 — Ícones

`/icon.png` (ou `/favicon.ico`) e `/apple-icon.png` respondem; `<meta name="theme-color">` presente com a cor de `--secondary-color`.

### AC #4 — Título, descrição e imagem aprovados (`PEND-19`)

Com o `PEND-19` resolvido: título e descrição aprovados aplicados em `SITE_CONFIG`; descrição ≤ 160 caracteres; imagem OG 1200×630 em JPG/PNG.

### AC #5 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes (inclusive com o export da [8.2](8-2-deploy-estatico-cloudflare-pages.md), se já estiver aplicado); Lighthouse SEO 100; nenhum item do QA-CHECKLIST § 9 violado; SHA no Change Log.

## Plano técnico

- [layout.tsx](../../src/app/layout.tsx): objeto JSON-LD montado de `SITE_CONFIG`, renderizado com `dangerouslySetInnerHTML` + `JSON.stringify`; `export const viewport = { themeColor: ... }`; OG com dimensões reais.
- `src/app/icon.png` e `src/app/apple-icon.png` (cópia/redimensionamento de `icon2.png`, 512 e 180px); remover `metadata.icons`.
- [constants.ts](../../src/lib/constants.ts): campos usados pelo JSON-LD que faltarem (ex.: `logo`) entram aqui.
- [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 6: registrar o JSON-LD.

**Regras que se aplicam:** não inventar conteúdo/dado (AGENTS.md § 4); `SITE_CONFIG` só muda com autorização — os campos novos são derivados dos aprovados.

## Tasks

- [ ] JSON-LD (AC #1)
- [ ] OG com dimensões reais (AC #2)
- [ ] Ícones e `theme-color` (AC #3)
- [ ] Aplicar `PEND-19` quando resolvido (AC #4)
- [ ] Validação (AC #5)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sempre | `npx tsc --noEmit`, `npm run build` |
| SEO | JSON-LD | validador do schema.org / Rich Results Test sobre o HTML gerado |
| SEO | OG | depurador de OG no preview do Pages |
| SEO | Lighthouse | categoria SEO = 100 |
| QA-CHECKLIST | § 7 | metadados |

## Riscos e armadilhas

- `JSON.stringify` não escapa `</script>`: os dados são constantes nossas, mas escapar `<` como `<` evita o problema por construção.
- O `telephone` no JSON-LD deve ser o número em formato internacional (`+55 61 9298-5392`), não o URL `wa.me`.
- A CSP da [8.2](8-2-deploy-estatico-cloudflare-pages.md), se entrar, precisa permitir o script inline do JSON-LD (é `application/ld+json`, que não executa, mas algumas CSPs bloqueiam igual).

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência.
- [ ] `npx tsc --noEmit` verde.
- [ ] `npm run build` verde, sem warning de hidratação/SSR.
- [ ] Validação visual: não se aplica à página; prévia de OG registrada.
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [ ] `PEND-19` marcado `RESOLVED` (ou AC #4 desmembrado).
- [ ] Docs afetados (TECHNICAL-SPEC) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao implementar.>

**O que divergiu do plano:** <preenchido ao implementar.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`, a partir da [revisão de código](../CODE-REVIEW-2026-11-05.md) §§ 1.5–1.7. AC #4 depende do `PEND-19`. |
