---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 8.2 — Publicar o site como estático no Cloudflare Pages

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | TODO                                                                                    |
| **Fase**        | Fase 8 — Leveza, SEO e deploy no Cloudflare Pages                                       |
| **Área**        | performance/SEO                                                                         |
| **Seções**      | global, Projects                                                                        |
| **Tamanho**     | L — muda o modo de build (`next.config.ts`), os assets de imagem e acrescenta configuração de hospedagem |
| **Depende de**  | [8.1](8-1-dominio-oficial.md) (`IN_PROGRESS` — domínio oficial no canonical); `PEND-06` (`RESOLVED` em 2026-11-05: Cloudflare Pages) |
| **Requisitos**  | FR-05 (imagens), QA-CHECKLIST § 6 e § 7                                                 |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Achados 1.1 e 1.2 de [CODE-REVIEW-2026-11-05.md](../CODE-REVIEW-2026-11-05.md). Em `3a87d86`:

- [next.config.ts](../../next.config.ts) não define `output`. O build gera um app Node (`next start`), e o `next/image` depende do otimizador do servidor. O Cloudflare Pages serve arquivos estáticos; sem servidor, o otimizador não existe.
- O site não usa nada que exija servidor: `/`, `/robots.txt` e `/sitemap.xml` já saem como `○ (Static)` no `npm run build`, e o formulário posta direto no Formspree (`PEND-10`).
- As imagens dos Projetos são PNGs enormes para um card de ~500px: `hotel.png` 1,1 MB (1249×793), `wdm.png` 840 KB, `wine.png` 710 KB, `woocommerce.png` 700 KB, `burguer.png` 444 KB, `pixologia.png` 242 KB (`ls -la public/assets`). Hoje o otimizador do Next as converte; num export estático com `unoptimized` elas iriam cruas.
- Não existe `public/_headers`. O Pages serve tudo com `cache-control: public, max-age=0, must-revalidate`, inclusive os `/_next/static/*`, que têm hash no nome e poderiam ficar em cache para sempre.
- O formulário não tem o campo isca anti-spam do Formspree (`_gotcha`).

Resultado pretendido: `npm run build` gera a pasta `out/` pronta para o Pages, com imagens leves já otimizadas, cache correto e cabeçalhos de segurança.

Não cobre os CSS de ícones de CDN ([8.3](8-3-icones-svg.md)) nem metadados ([8.4](8-4-metadados-dados-estruturados.md)).

## Escopo

- `output: "export"` e `images.unoptimized: true` em `next.config.ts`.
- Imagens dos Projetos convertidas para WebP (e/ou AVIF) no tamanho de exibição (~1000px de largura para o 2×), substituindo os PNGs referenciados em [projects.ts](../../src/data/projects.ts). Logo e ícone conferidos (já são pequenos).
- `public/_headers` com cache `immutable` para `/_next/static/*` e `/assets/*`, e `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. CSP só se não quebrar Formspree e as CDNs ainda em uso.
- Campo isca `_gotcha` escondido no formulário.
- Instruções de deploy no [README.md](../../README.md): comando de build, pasta de saída `out/`, versão do Node, redirecionamento `www` ↔ apex no painel.

**Se for preciso cortar:** a CSP sai primeiro (vira tarefa própria); depois o `_gotcha`.

## Fora de escopo

- **Não troca os ícones de CDN.** [8.3](8-3-icones-svg.md), depende do `PEND-18`.
- **Não usa Cloudflare Images nem `@opennextjs/cloudflare`.** Ver Decisões.
- **Não cria o projeto no Pages nem aponta o DNS.** É operação no painel da Cloudflare, feita pelo responsável; a story entrega o build e as instruções.

## Decisões

- **Decidido** export estático (`output: "export"`), **descartado** OpenNext/Workers, **porque** o site não tem rota dinâmica nem API; um runtime a mais seria custo e superfície sem ganho.
- **Decidido** pré-otimizar as imagens no repositório, **descartado** loader do Cloudflare Images, **porque** são 6 imagens fixas; um serviço pago e um loader customizado não se justificam.
- **Decidido** converter com uma ferramenta já disponível na máquina (`sips`/`cwebp`/`npx sharp-cli` pontual, fora do `package.json`), **descartado** adicionar `sharp` como dependência, **porque** a conversão é feita uma vez (AGENTS.md: sem dependência nova sem justificar).
- O provedor (Cloudflare Pages) é decisão do responsável: `PEND-06` resolvido em 2026-11-05.

## Critérios de aceite

### AC #1 — Build gera um site estático

`npm run build` termina com exit 0 e gera `out/index.html`, `out/robots.txt`, `out/sitemap.xml` e `out/_next/static/`. Servindo `out/` com um servidor estático (`npx serve out`), a página abre igual ao `next start` de antes nos 5 viewports.

### AC #2 — Imagens dos Projetos leves e iguais

Cada imagem dos Projetos tem ≤ 150 KB. Em 375 e 1200px, os 6 cards ficam visualmente iguais às capturas de antes (mesmo enquadramento `aspect-[4/3]`, sem borrão perceptível no 2×). Filtro e Flip continuam funcionando.

### AC #3 — Cache e cabeçalhos

`out/_headers` existe. Depois do deploy de preview, `curl -I` em um arquivo de `/_next/static/` mostra `cache-control` com `immutable`, e em `/` mostra `x-content-type-options: nosniff` e `referrer-policy`.

### AC #4 — Formulário continua enviando

Com JS: o envio pelo `@formspree/react` funciona (sem erro de console). Sem JS: o `action` posta no Formspree. O `_gotcha` não aparece na tela nem para leitor de tela e não é anunciado pelo teclado (`tabindex="-1"`, `aria-hidden`).

### AC #5 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; `node scripts/check_ids.js` sem âncora quebrada; nenhum item do QA-CHECKLIST § 9 violado; capturas em 375/1200 em `docs/references/qa/`; SHA no Change Log.

## Plano técnico

- [next.config.ts](../../next.config.ts): `output: "export"`, `images: { unoptimized: true }` (remove `formats`, que só vale com otimizador).
- `public/assets/projects/*.webp` gerados a partir dos PNGs; [projects.ts](../../src/data/projects.ts) aponta para eles. Os PNGs originais de `public/assets` saem (o legado em `assets/` na raiz continua intacto).
- [Projects/index.tsx](../../src/sections/Projects/index.tsx): `sizes` no `next/image` (sem efeito com `unoptimized`, mas documenta a largura) — opcional.
- `public/_headers` novo.
- [Contact/index.tsx](../../src/sections/Contact/index.tsx): `<input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />`.
- [README.md](../../README.md): seção "Deploy (Cloudflare Pages)".
- [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) § 3 e [ARCHITECTURE.md](../ARCHITECTURE.md) § 7: registrar export estático e imagens pré-otimizadas. [CLAUDE.md](../../CLAUDE.md): `npm run start` deixa de servir o build; trocar por `npx serve out`.

**Regras que se aplicam:** nenhuma dependência nova no `package.json`; nomes dos campos do formulário intocados (`_gotcha` é reservado do Formspree e não é campo do cliente); botões sociais e WhatsApp intocados.

## Tasks

- [ ] Export estático (AC #1)
- [ ] Converter e trocar as imagens dos Projetos (AC #2)
- [ ] `_headers` (AC #3)
- [ ] `_gotcha` no formulário (AC #4)
- [ ] README, TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md
- [ ] Validação e capturas (AC #5)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | sempre | `npx tsc --noEmit` |
| build | export | `npm run build` + `ls out/` |
| âncoras | nada mudou de ID, mas o servidor mudou | `npx serve out -l 3008` + `node scripts/check_ids.js` |
| visual | Projetos e página inteira | captura 375/1200 servindo `out/` |
| movimento | filtro dos Projetos (Flip) | trocar filtro, rolar para cima e para baixo |
| deploy | cabeçalhos | `curl -I` no preview do Pages |
| QA-CHECKLIST | § 6, § 7 | itens de performance e build |

## Riscos e armadilhas

- `output: "export"` falha o build se algo usar recurso de servidor. Hoje nada usa; o sinal é erro explícito no `next build`.
- `npm run start` deixa de funcionar com export — scripts de captura e o CLAUDE.md citam o dev server, então o fluxo de validação local continua com `next dev`, mas a validação final deve servir `out/`.
- Sem o otimizador, `next/image` passa a servir exatamente o arquivo apontado: se a conversão ficar pequena demais, o 2× borra. Converter a ~1000px.
- `_headers` com CSP restritiva pode bloquear Formspree, as CDNs de ícones e o JSON-LD inline da [8.4](8-4-metadados-dados-estruturados.md). Testar no preview antes de produção.

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência.
- [ ] `npx tsc --noEmit` verde.
- [ ] `npm run build` verde, sem warning de hidratação/SSR.
- [ ] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-06` marcado `RESOLVED` (2026-11-05).
- [ ] Docs afetados (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md, README) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao implementar.>

**O que divergiu do plano:** <preenchido ao implementar.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`, a partir da [revisão de código](../CODE-REVIEW-2026-11-05.md) §§ 1.1–1.2. `PEND-06` resolvido pelo responsável: Cloudflare Pages. |
