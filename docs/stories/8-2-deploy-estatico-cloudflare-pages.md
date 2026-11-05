---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 8.2 — Publicar o site como estático no Cloudflare Pages

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | IN_PROGRESS                                                                             |
| **Fase**        | Fase 8 — Leveza, SEO e deploy no Cloudflare Pages                                       |
| **Área**        | performance/SEO                                                                         |
| **Seções**      | global, Projects                                                                        |
| **Tamanho**     | L — muda o modo de build (`next.config.ts`), os assets de imagem e acrescenta configuração de hospedagem |
| **Depende de**  | [8.1](8-1-dominio-oficial.md) (`DONE` — domínio oficial no canonical); `PEND-06` (`RESOLVED` em 2026-11-05: Cloudflare Pages) |
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
- Imagens dos Projetos convertidas para WebP no tamanho de exibição (700px de **altura**: o card é `aspect-[4/3]` com `object-cover` e as imagens são ~1,6:1, então quem manda é a altura; o maior card, 1 coluna a 479px, tem ~335px de altura → 2× ≈ 670px), substituindo os PNGs referenciados em [projects.ts](../../src/data/projects.ts). Logo e ícone conferidos (já são pequenos).
- `public/` só com o que o site usa: tudo em `public/` vai para `out/` e para o ar. Saem os 6 PNGs dos Projetos e os assets sem uso (`grafic.png`, `icon.png`, `project-1…6.jpg`, item da [6.9](6-9-remover-codigo-nao-usado.md) adiantado aqui). `docs/`, `scripts/`, o legado da raiz e os arquivos de agente nunca entram em `out/`; o risco é só configurar a pasta de saída errada no Pages.
- `public/_headers` com cache `immutable` para `/_next/static/*` (nome com hash) e cache curto para `/assets/*` (nome sem hash), e `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. CSP só se não quebrar Formspree e as CDNs ainda em uso.
- Campo isca `_gotcha` escondido no formulário.
- Instruções de deploy no [README.md](../../README.md): comando de build, pasta de saída `out/`, versão do Node (`.node-version`), redirecionamento `www` ↔ apex no painel. `npm run start` passa a servir `out/`.

**Se for preciso cortar:** a CSP sai primeiro (vira tarefa própria); depois o `_gotcha`.

## Fora de escopo

- **Não troca os ícones de CDN.** [8.3](8-3-icones-svg.md), depende do `PEND-18`.
- **Não usa Cloudflare Images nem `@opennextjs/cloudflare`.** Ver Decisões.
- **Não cria o projeto no Pages nem aponta o DNS.** É operação no painel da Cloudflare (conectar o GitHub, configurar build e watch paths, domínio), feita pelo responsável; a story entrega o build e as instruções no [README.md](../../README.md#deploy-cloudflare-pages).

## Decisões

- **Decidido** export estático (`output: "export"`), **descartado** OpenNext/Workers, **porque** o site não tem rota dinâmica nem API; um runtime a mais seria custo e superfície sem ganho.
- **Decidido** pré-otimizar as imagens no repositório, **descartado** loader do Cloudflare Images, **porque** são 6 imagens fixas; um serviço pago e um loader customizado não se justificam.
- **Decidido** converter com uma ferramenta já disponível na máquina (`sips`/`cwebp`/`npx sharp-cli` pontual, fora do `package.json`), **descartado** adicionar `sharp` como dependência, **porque** a conversão é feita uma vez (AGENTS.md: sem dependência nova sem justificar).
- O provedor (Cloudflare Pages) é decisão do responsável: `PEND-06` resolvido em 2026-11-05.
- **Decidido** (responsável, 2026-11-05) deploy pela **integração do Pages com o GitHub** (push na `main` = produção; outra branch = preview), **descartado** Direct Upload via Wrangler e GitHub Actions, **porque** a integração builda na Cloudflare sem token nem workflow no repositório. Consequência: todo push na `main` publica — o `npm run build` local vira gate antes do push. *Build watch paths* excluem `docs/`, `.claude/`, `scripts/`, `*.md` e o legado, para commit só de documentação não gerar deploy.

## Critérios de aceite

### AC #1 — Build gera um site estático

`npm run build` termina com exit 0 e gera `out/index.html`, `out/robots.txt`, `out/sitemap.xml`, `out/404.html` e `out/_next/static/`. Fora de `_next/`, `out/` só contém `public/` e os arquivos gerados — nenhum arquivo de `docs/`, `scripts/`, `.claude/`, do legado (`styles.css`, `main.js`, `assets/` da raiz) ou de agente (`find out -type f | grep -v _next/static`). Servindo `out/` com um servidor estático, a página abre igual ao dev server de antes em 375 e 1200px, sem erro de console.

### AC #2 — Imagens dos Projetos leves e iguais

Cada imagem dos Projetos tem ≤ 150 KB e ≥ 670px de altura. Em 375 e 1200px, os 6 cards ficam visualmente iguais às capturas de antes (mesmo enquadramento `aspect-[4/3]`, sem borrão perceptível no 2×). Filtro e Flip continuam funcionando.

### AC #3 — Cache e cabeçalhos

`out/_headers` existe com as regras de `/*`, `/_next/static/*` e `/assets/*` (verificável aqui). **Depois do primeiro deploy pela integração com o GitHub** (projeto criado pelo responsável — ver Fora de escopo; vale o `<projeto>.pages.dev` antes do DNS ou o preview de uma branch): `curl -I` em um arquivo de `/_next/static/` mostra `cache-control` com `immutable`, e em `/` mostra `x-content-type-options: nosniff` e `referrer-policy`. Essa metade só fecha com o preview no ar.

### AC #4 — Formulário continua enviando

Com JS: o formulário renderiza e hidrata sem erro de console; o envio real ao Formspree é conferido pelo responsável no preview (enviar daqui mandaria um lead falso ao cliente). Sem JS: o `action` continua apontando para o endpoint do Formspree. O `_gotcha` está no HTML com `display: none` (`class="hidden"`), `tabindex="-1"`, `aria-hidden="true"` e `autocomplete="off"` — fora da tela, da ordem de Tab e da árvore de acessibilidade.

### AC #5 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; `node scripts/check_ids.js` contra o `out/` servido na 3008 sem âncora quebrada; nenhum item do QA-CHECKLIST § 9 violado; capturas antes × depois em 375/1200 conferidas fora do repositório (não commitadas) e descritas em texto; SHA no Change Log.

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

- [x] Export estático (AC #1)
- [x] Converter e trocar as imagens dos Projetos; limpar `public/` (AC #2)
- [x] `_headers` (AC #3, metade local)
- [ ] Conferir cabeçalhos no preview do Pages (AC #3, metade do deploy — responsável)
- [x] `_gotcha` no formulário (AC #4)
- [x] README, TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md
- [x] Validação e capturas (AC #5)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | sempre | `npx tsc --noEmit` |
| build | export | `npm run build` + `ls out/` |
| âncoras | nada mudou de ID, mas o servidor mudou | `out/` servido na 3008 + `node scripts/check_ids.js` |
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
- [ ] Validação visual/movimento feita nos viewports afetados (capturas conferidas numa pasta temporária fora do repositório, sem commitar).
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-06` marcado `RESOLVED` (2026-11-05).
- [ ] Docs afetados (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md, README) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** [next.config.ts](../../next.config.ts), [robots.ts](../../src/app/robots.ts), [sitemap.ts](../../src/app/sitemap.ts), [projects.ts](../../src/data/projects.ts), [Contact/index.tsx](../../src/sections/Contact/index.tsx), [public/_headers](../../public/_headers), `public/assets/projects/*.webp` (novos), `public/assets/*.png|jpg` (14 removidos), [package.json](../../package.json) (`start`), [.node-version](../../.node-version), [README.md](../../README.md), [CLAUDE.md](../../CLAUDE.md), [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md), [ARCHITECTURE.md](../ARCHITECTURE.md), [QA-CHECKLIST.md](../QA-CHECKLIST.md), [TASKS.md](../TASKS.md), [6.9](6-9-remover-codigo-nao-usado.md).

**O que divergiu do plano:**

- `robots.ts` e `sitemap.ts` precisaram de `export const dynamic = "force-static"`: sem isso o `next build` com `output: "export"` falha em `/robots.txt`.
- Imagens a **700px de altura** (1103–1164px de largura), não a 1000px de largura: com `object-cover` num card 4:3 e imagens ~1,6:1, a largura de 1000px daria ~605px de altura, abaixo do 2× do maior card (~670px). Resultado: 43–70 KB cada (antes 242 KB–1,1 MB; −3,8 MB no total).
- Conversão com o encoder WebP do próprio Chrome headless (`canvas.toBlob("image/webp", 0.82)`), por um script descartável fora do repositório (já apagado): `sips` não grava WebP, `cwebp` não está instalado e o download do `sharp-cli` via `npx` foi bloqueado. Nenhuma dependência nova.
- `/assets/*` com `max-age=86400, stale-while-revalidate=604800`, não `immutable`: os nomes não têm hash, e `immutable` por 1 ano prenderia uma imagem trocada no navegador dos visitantes.
- **CSP cortada** (como previsto em "Se for preciso cortar"): o Next exporta scripts inline (`self.__next_f`), o `<noscript><style>` e as três folhas de CDN; uma CSP útil exigiria `'unsafe-inline'` ou hashes por build. Vira tarefa própria, de preferência depois da [8.3](8-3-icones-svg.md) (que tira as CDNs).
- Assets sem uso de `public/assets/` (`grafic.png`, `icon.png`, `project-1…6.jpg`) removidos aqui, a pedido do responsável ("verificar o que não deve ir pro build"); riscados na [6.9](6-9-remover-codigo-nao-usado.md).
- `npm run start` agora é `npx serve out` (o `next start` não funciona com export). Acrescentado `.node-version` (22) para o build do Pages.
- Parte do código (next.config, `_headers`, imagens, `projects.ts`, `_gotcha`) entrou por engano no commit `0d61b92` ("docs: remove image evidence from repo"), feito por outra sessão em paralelo com a árvore de trabalho desta story; o restante está na árvore de trabalho.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`, a partir da [revisão de código](../CODE-REVIEW-2026-11-05.md) §§ 1.1–1.2. `PEND-06` resolvido pelo responsável: Cloudflare Pages. |
| 2026-11-05 | IN_PROGRESS | Validada (8.1 já `DONE`; ACs #1/#3/#4/#5 reescritos: conteúdo de `out/`, metade do AC #3 que depende do preview, envio real do formulário pelo responsável, capturas fora do repositório) e implementada sobre `0d61b92` (árvore de trabalho). Validação: `npx tsc --noEmit` ✓; `npm run build` ✓ (exit 0, 4 rotas `○ Static`, `out/` = 2,5 MB; fora de `_next/` só `404.html`, `_headers`, `assets/{header.webp,icon2.png,logo.png,projects/*.webp}`, `index.html`, `index.txt`, `robots.txt`, `sitemap.xml`); `out/` servido na 3008 (`python3 -m http.server -d out`): `/`, `/robots.txt`, `/sitemap.xml`, `/assets/projects/hotel.webp` → 200, rota inexistente → 404; `node scripts/check_ids.js` → 10 IDs presentes, `#blog` ausente; captura CDP antes (dev server) × depois (`out/`) em 375 e 1200 com rolagem até `#project`: cards idênticos; filtro Fast Food → Viagens → Todos = 2/2/6 cards, opacidade 1, todas as imagens carregadas, zero erro de console. Não verificado aqui: cabeçalhos no Pages (precisa do preview) e envio real ao Formspree. |
| 2026-11-05 | IN_PROGRESS | Responsável decidiu o deploy pela integração do Pages com o GitHub: Decisões e AC #3 ajustados; README com o fluxo (push na `main` = produção, branch = preview), criação do projeto pelo Connect to Git e *build watch paths* excluindo docs/legado. |
