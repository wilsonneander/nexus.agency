---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 8.1 — Apontar canonical, OpenGraph, robots e sitemap para o domínio oficial

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | IN_PROGRESS                                                                             |
| **Fase**        | Fase 8 — Leveza, SEO e deploy no Cloudflare Pages                                       |
| **Área**        | performance/SEO                                                                         |
| **Seções**      | global                                                                                  |
| **Tamanho**     | S — uma constante e as duas rotas de metadados, sem mudança visual                      |
| **Depende de**  | nada                                                                                    |
| **Requisitos**  | FR-01 (metadados), QA-CHECKLIST § 7                                                     |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Achado 1.3 de [CODE-REVIEW-2026-11-05.md](../CODE-REVIEW-2026-11-05.md). Em `3a87d86`:

- [constants.ts](../../src/lib/constants.ts) define `SITE_CONFIG.url = "https://nexusagency.com.br"`, mas o e-mail oficial é `contato@nexusagencybr.com.br` (`PEND-11`) e o Instagram é `@nexusagencybr` (`PEND-08`). Canonical, `og:url`, `og:image` e `metadataBase` em [layout.tsx](../../src/app/layout.tsx) herdam o domínio errado.
- [robots.ts](../../src/app/robots.ts) e [sitemap.ts](../../src/app/sitemap.ts) repetem `https://nexusagency.com.br` à mão, em vez de ler `SITE_CONFIG.url`.

O responsável confirmou em 2026-11-05 que o domínio oficial é **`nexusagencybr.com.br`**. Resultado pretendido: todo URL absoluto gerado pelo build usa esse domínio, a partir de uma única fonte.

Não cobre o redirecionamento `www` ↔ apex, que é configuração do painel da Cloudflare (story [8.2](8-2-deploy-estatico-cloudflare-pages.md)).

## Escopo

- `SITE_CONFIG.url` = `https://nexusagencybr.com.br`.
- `robots.ts` e `sitemap.ts` leem `SITE_CONFIG.url`.

**Se for preciso cortar:** Nada, é atômica.

## Fora de escopo

- **Não troca título, descrição nem imagem OG.** Vão para a [8.4](8-4-metadados-dados-estruturados.md).
- **Não configura DNS/redirecionamentos.** Vai para a [8.2](8-2-deploy-estatico-cloudflare-pages.md).

## Decisões

**Decidido** usar `SITE_CONFIG.url` como fonte única de todo URL absoluto, **descartado** manter literais em `robots.ts`/`sitemap.ts`, **porque** foi justamente a duplicação que deixou o domínio errado em três lugares.

O domínio em si é decisão do responsável (2026-11-05), não desta story.

## Critérios de aceite

### AC #1 — Domínio oficial em todo URL absoluto

No HTML de `/` gerado pelo build, `link[rel=canonical]`, `og:url`, `og:image` e `twitter:image` começam com `https://nexusagencybr.com.br`. Verifica-se com `grep` em `.next/server/app/index.html`.

### AC #2 — robots e sitemap no domínio oficial

`/robots.txt` traz `Sitemap: https://nexusagencybr.com.br/sitemap.xml` e `/sitemap.xml` traz `<loc>https://nexusagencybr.com.br</loc>`.

### AC #3 — Nenhum resto do domínio antigo

`grep -rn "nexusagency\.com\.br" src` não encontra nada.

### AC #4 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; nenhum item do QA-CHECKLIST § 9 violado; SHA citado no Change Log. Não há mudança visual, então não há captura.

## Plano técnico

- [constants.ts](../../src/lib/constants.ts): trocar `url`, com comentário da decisão.
- [robots.ts](../../src/app/robots.ts) e [sitemap.ts](../../src/app/sitemap.ts): importar `SITE_CONFIG` e montar os URLs a partir de `SITE_CONFIG.url`.

**Regras que se aplicam:** o [CLAUDE.md](../../CLAUDE.md) pede autorização para alterar `SITE_CONFIG`; a autorização é a confirmação do responsável de 2026-11-05.

## Tasks

- [x] Trocar `SITE_CONFIG.url` (AC #1)
- [x] `robots.ts` e `sitemap.ts` lendo `SITE_CONFIG.url` (AC #2, AC #3)
- [x] Validar build e saída gerada (AC #4)
- [ ] Revisão (`review-mr`) e commit

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | sempre | `npx tsc --noEmit` |
| build | sempre | `npm run build` |
| SEO | URLs gerados | `grep` de `canonical`/`og:url` em `.next/server/app/index.html`; conteúdo de `robots.txt.body` e `sitemap.xml.body` |

## Riscos e armadilhas

- Enquanto o domínio não estiver publicado, o canonical aponta para um endereço que ainda não responde. Isso só pesa se o site for indexado antes do DNS. Publicar e apontar o DNS no mesmo passo ([8.2](8-2-deploy-estatico-cloudflare-pages.md)).
- O `lastModified: new Date()` do sitemap passa a ser a data do build, o que é aceitável num site estático.

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual: não se aplica (sem mudança visual).
- [ ] Itens tocados do `QA-CHECKLIST.md` (§ 7) atualizados com a evidência.
- [x] `PEND-xx` consumido: nenhum (decisão registrada aqui e na revisão).
- [x] Docs afetados: [CODE-REVIEW-2026-11-05.md](../CODE-REVIEW-2026-11-05.md) § 1.3 marcado como resolvido.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** [constants.ts](../../src/lib/constants.ts), [robots.ts](../../src/app/robots.ts), [sitemap.ts](../../src/app/sitemap.ts), [CODE-REVIEW-2026-11-05.md](../CODE-REVIEW-2026-11-05.md).

**O que divergiu do plano:** a implementação veio antes da story (aplicada na conversa da revisão). Nada mais.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | IN_PROGRESS | Story criada sobre `3a87d86`, com a mudança já aplicada na árvore de trabalho. |
| 2026-11-05 | IN_PROGRESS | Validado na árvore de trabalho sobre `3a87d86`: `npx tsc --noEmit` ok; `npm run build` ok (`/` 187 kB First Load JS); canonical e `og:url` = `https://nexusagencybr.com.br`; `robots.txt` e `sitemap.xml` no domínio novo; `grep nexusagency.com.br src` vazio. Falta review e commit. |
