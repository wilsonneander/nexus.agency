---
baseline_commit: d7214b168f7b4356c7056e1b2068743aa6e89492
---

# Story 8.6 — Conferir o primeiro deploy no Cloudflare Pages

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | TODO                                                                                    |
| **Fase**        | Fase 8 — Leveza, SEO e deploy no Cloudflare Pages                                       |
| **Área**        | performance/SEO, conversão                                                              |
| **Seções**      | global, Contact                                                                         |
| **Tamanho**     | S — nenhum arquivo de código muda; é operação no painel (responsável) e medição no ar (`curl`, navegador) |
| **Depende de**  | [8.2](8-2-deploy-estatico-cloudflare-pages.md) (`DONE` — `out/`, `public/_headers`, `_gotcha`, instruções do [README.md](../../README.md#deploy-cloudflare-pages)); projeto do Pages criado pelo responsável (Connect to Git); `PEND-06` (`RESOLVED`); `PEND-10` (`RESOLVED`); `PEND-20` (`PENDING_APPROVAL`, só para o domínio — fora desta story) |
| **Requisitos**  | QA-CHECKLIST § 6 (performance) e § 7 (build/deploy); restos dos ACs #3 e #4 da [8.2](8-2-deploy-estatico-cloudflare-pages.md) |
| **Baseline**    | `d7214b1` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

A [8.2](8-2-deploy-estatico-cloudflare-pages.md) entregou o export estático e fechou tudo o que dava para verificar localmente. Duas metades ficaram para quando houvesse um deploy no ar: o `curl -I` dos cabeçalhos do [public/_headers](../../public/_headers) (AC #3 da 8.2) e o envio real do formulário ao Formspree (AC #4 da 8.2 — enviar daqui mandaria um lead falso ao cliente).

Medido em `d7214b1` (2026-11-05):

- **Não há deploy deste repositório confirmado.** `gh api repos/wilsonneander/nexus.agency/deployments` e `.../commits/main/check-runs` voltam vazios — a integração do Pages com o GitHub, quando ligada, registra o build no commit. O nome do projeto no Pages (o `<projeto>` de `<projeto>.pages.dev`) ainda não foi informado.
- **`https://nexus-agency.pages.dev/` existe, mas não é este build.** Responde 200 com `<title>NEXUS / AGENCY</title>` (o nosso é `Nexus | Agency`, [constants.ts:3](../../src/lib/constants.ts#L3)); não manda `Permissions-Policy`; `/assets/projects/hotel.webp` e `/rota-que-nao-existe` voltam `200 text/html` (fallback de SPA), quando o nosso `out/` serviria a imagem e um 404. É outro projeto, de outra conta ou anterior — não confundir com o nosso.
- **O domínio `nexusagencybr.com.br` não resolve.** `curl` → `Could not resolve host` (apex e `www`); `whois nexusagencybr.com.br` não traz registro do domínio, só os dados do `.br`. O canonical, o OpenGraph, o `robots.txt` e o `sitemap.xml` já apontam para ele ([8.1](8-1-dominio-oficial.md)). Registro e DNS são do responsável: viraram o `PEND-20`.

Resultado pretendido: o primeiro deploy pela integração com o GitHub conferido no `<projeto>.pages.dev` — conteúdo igual ao `out/`, cabeçalhos e cache do `_headers` aplicados, formulário entregando ao Formspree — com a evidência em texto nesta story.

Não cobre o domínio próprio (`PEND-20`), a CSP ([8.7](../TASKS.md)) nem mudança de código.

## Escopo

- **Responsável:** criar o projeto no Pages pelo Connect to Git com os valores do [README.md](../../README.md#deploy-cloudflare-pages) (preset `None`, `npm run build`, saída `out`, `NODE_VERSION=22`), configurar os *build watch paths* e informar a URL `<projeto>.pages.dev`.
- **Agente (com a URL em mãos):** conferir no ar o conteúdo publicado, os cabeçalhos, o cache, o 404 e o console; registrar cada medida aqui.
- **Responsável:** um envio real do formulário com JS (e, se quiser, um sem JS), identificado como teste, e a confirmação de que chegou na caixa do Formspree.
- Registrar o resultado no [QA-CHECKLIST.md](../QA-CHECKLIST.md) § 7 e fechar as pontas da 8.2 apontadas para cá.

**Se for preciso cortar:** a conferência dos *build watch paths* (AC #6) sai primeiro — só evita builds à toa. O envio sem JS do AC #4 vem depois.

## Fora de escopo

- **Não aponta o domínio.** `nexusagencybr.com.br` não resolve hoje; registro, DNS no Cloudflare, Custom domains e o redirecionamento `www` → apex dependem do `PEND-20`. Quando ele for resolvido, a conferência no domínio entra como tarefa própria (mesmos `curl` desta story, mais o `301` do `www`).
- **Não cria CSP.** [8.7](../TASKS.md), cortada da 8.2.
- **Não muda código, `_headers` nem `next.config.ts`.** Se um cabeçalho não aparecer no ar, a correção é tarefa nova (ou reabre a 8.2), com a medida desta story como reprodução.
- **Não roda Lighthouse no ar.** O relatório de performance continua o de [docs/references/qa/lighthouse.report.json](../references/qa/lighthouse.report.json); refazê-lo no deploy é decisão à parte.

## Decisões

- **Decidido** conferir no `<projeto>.pages.dev` de produção (push na `main`), **descartado** abrir uma branch só para gerar preview, **porque** o código da 8.2 já está na `main` e o primeiro build do projeto recém-criado é de produção; o domínio não resolve, então o `pages.dev` não tem tráfego real ainda.
- **Decidido** o envio real do formulário feito **pelo responsável**, **descartado** o agente enviar, **porque** o lead cai na caixa do cliente (mesmo motivo da 8.2). O agente confere o HTML do formulário no ar (`action`, campos, `_gotcha`).
- **Decidido** a evidência em texto (comando + saída relevante + data), **descartado** captura de tela no repositório (regra do [CLAUDE.md](../../CLAUDE.md), 2026-11-05).
- O domínio é do responsável: `PEND-20`.

## Critérios de aceite

Em todos: `$B` é a URL `https://<projeto>.pages.dev` informada pelo responsável — **não** `nexus-agency.pages.dev` (ver Contexto).

### AC #1 — O build roda no Pages a partir do GitHub

No painel do projeto, o deploy de produção mais recente é de um commit da `main` com status _Success_, e as configurações são as do [README.md](../../README.md#deploy-cloudflare-pages): preset `None`, build `npm run build`, saída `out`, `NODE_VERSION=22`. O commit aparece com o status do Cloudflare Pages no GitHub: ao menos um de `gh api repos/wilsonneander/nexus.agency/commits/<sha>/check-runs`, `.../commits/<sha>/status` ou `.../deployments` não vazio (a integração pode registrar por qualquer um dos três; os três vazios com o deploy no painel = registrar e seguir, não reprova). Registrar o SHA publicado e a URL do deploy.

### AC #2 — O que está no ar é o `out/`, e só ele

- `curl -s $B/ | grep -o '<title>[^<]*</title>'` → `Nexus | Agency`; o HTML contém os 10 IDs do [check_ids.js](../../scripts/check_ids.js) (`home`, `about`, `service`, `project`, `contact` e os 5 dos cards de serviço) e não contém `id="blog"`.
- `$B/robots.txt` e `$B/sitemap.xml` → 200, apontando para `https://nexusagencybr.com.br`.
- `$B/assets/projects/hotel.webp` → 200 com `content-type: image/webp`.
- `$B/rota-que-nao-existe` → **404** (o `404.html` do export), não 200.
- `$B/AGENTS.md`, `$B/docs/PRD.md`, `$B/styles.css`, `$B/main.js`, `$B/scripts/check_ids.js` → 404. Um 200 aqui significa saída configurada errada (raiz em vez de `out`) — falha bloqueante.

### AC #3 — Cabeçalhos e cache do `_headers` aplicados

- `curl -sI $B/` mostra `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin` e `permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`.
- `curl -sI` num `.js` e num `.css` de `/_next/static/` (caminhos tirados do HTML de `$B/`) mostra `cache-control: public, max-age=31536000, immutable`.
- `curl -sI $B/assets/projects/hotel.webp` mostra `cache-control: public, max-age=86400, stale-while-revalidate=604800`.
- `$B/_headers`: registrar o código. O esperado é o Pages consumir o arquivo sem servi-lo (404); um 200 não falha o AC (o conteúdo já é público no repositório), mas fica anotado.

### AC #4 — O formulário entrega ao Formspree

- No HTML de `$B/`: o `<form>` tem `action="https://formspree.io/f/xpppnoer"` e `method="POST"`, os campos `name`, `whatsapp`, `company`, `need` e o `_gotcha` com `class="hidden"`, `tabindex="-1"`, `aria-hidden="true"`.
- **Com JS** (responsável, em `$B`): preencher os 4 campos com dados identificados como teste (ex.: nome "TESTE 8.6") e enviar → o formulário dá lugar ao bloco "Mensagem enviada!" (`role="status"`), sem erro de console, e a submissão chega na caixa do Formspree. Registrar data/hora.
- **Sem JS** (responsável, opcional — ver "Se for preciso cortar"): com JavaScript desligado, o envio leva à página de confirmação do Formspree e a submissão chega.

### AC #5 — A página funciona no ar como no `out/` local

Em `$B`, no Chrome, em 375 e 1200px: rolar até o fim e voltar ao topo, trocar o filtro dos Projetos (Fast Food → Viagens → Todos = 2/2/6 cards) — zero erro e zero warning de console, as 6 imagens dos Projetos carregadas (`naturalWidth > 0`), nenhuma requisição com falha na aba Rede (as CDNs de ícones e a Poppins incluídas), ícones sociais e botão do WhatsApp visíveis e com os links de [constants.ts](../../src/lib/constants.ts). Com `prefers-reduced-motion: reduce` emulado, todo o conteúdo visível.

### AC #6 — Commit só de documentação não publica

Depois de configurados os *build watch paths* do [README.md](../../README.md#deploy-cloudflare-pages), o **primeiro push só de documentação feito depois dessa configuração** (por exemplo, o fechamento desta story) não gera build no painel (ou aparece como _Skipped_). Push anterior à criação do projeto não conta. Se gerar, registrar e corrigir a configuração no painel — não é falha do site.

### AC #7 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes no SHA publicado; o AC #8 conferido; nenhum item do QA-CHECKLIST § 9 violado; [QA-CHECKLIST.md](../QA-CHECKLIST.md) § 7 com o item do deploy marcado e a evidência; as pontas da [8.2](8-2-deploy-estatico-cloudflare-pages.md) que vieram para cá registradas como fechadas no Change Log dela; SHA e URL no Change Log desta story.

### AC #8 — A prévia de compartilhamento aparece (vinda da 8.4)

Resto do AC #2 da [8.4](8-4-metadados-dados-estruturados.md), movido para cá em 2026-11-05 com o aval do responsável (sem projeto no Pages, não havia preview onde testar). Em `$B`, `/assets/og-image.jpg` responde 200 `image/jpeg`, e a URL `$B/` num depurador de OG (ex.: opengraph.xyz) **e** no LinkedIn Post Inspector ou numa mensagem do WhatsApp mostra a prévia com a foto, o título e a descrição. As meta tags `og:*` apontam para o domínio oficial (`metadataBase`), que ainda não resolve (`PEND-20`): se o depurador não carregar a imagem por isso, registrar como esperado e repetir a conferência da imagem no domínio — não é falha do site.

## Plano técnico

Sem código. Com `$B` em mãos:

```bash
B=https://<projeto>.pages.dev
curl -s $B/ | grep -o '<title>[^<]*</title>'
for id in home about service project contact planejamento-estrategico gestao-trafego-pago criacao-sites-landing-pages chatbots-automacao relatorios-analise; do curl -s $B/ | grep -q "id=\"$id\"" && echo "ok $id" || echo "FALTA $id"; done
for p in robots.txt sitemap.xml assets/projects/hotel.webp rota-que-nao-existe AGENTS.md docs/PRD.md styles.css main.js scripts/check_ids.js _headers; do echo "$p $(curl -s -o /dev/null -w '%{http_code} %{content_type}' $B/$p)"; done
curl -sI $B/ | grep -iE 'x-content-type|referrer-policy|permissions-policy'
JS=$(curl -s $B/ | grep -oE '/_next/static/[^"]+\.js' | head -1); CSS=$(curl -s $B/ | grep -oE '/_next/static/[^"]+\.css' | head -1)
curl -sI "$B$JS" | grep -i cache-control; curl -sI "$B$CSS" | grep -i cache-control
curl -sI $B/assets/projects/hotel.webp | grep -i cache-control
```

O AC #5 é no navegador (Chrome do responsável ou a extensão do Claude in Chrome), com o console e a aba Rede abertos. O `check_ids.js` só fala com `localhost`; no ar, o laço de `grep` acima o substitui.

Documentos ao fechar: [QA-CHECKLIST.md](../QA-CHECKLIST.md) § 7, [TASKS.md](../TASKS.md) (8.6 e Ordem de implementação), Change Log da [8.2](8-2-deploy-estatico-cloudflare-pages.md), e o nome do projeto no [README.md](../../README.md#deploy-cloudflare-pages) (troca o `<projeto>` dos exemplos pelo real).

**Regras que se aplicam:** nenhum envio de formulário pelo agente; nenhum push sem `npm run build` verde (push na `main` publica); `SITE_CONFIG`, WhatsApp e botões sociais intocados.

## Tasks

- [ ] Responsável: criar o projeto no Pages (Connect to Git) e os *build watch paths*; informar `$B` (AC #1, AC #6)
- [ ] Conferir build no painel e check no GitHub (AC #1)
- [ ] `curl` do conteúdo, 404 e arquivos que não devem estar no ar (AC #2)
- [ ] `curl -I` de cabeçalhos e cache (AC #3)
- [ ] HTML do formulário no ar; responsável envia o teste (AC #4)
- [ ] Navegador em 375/1200, console, rede, reduced motion (AC #5)
- [ ] Push só de docs não gera build (AC #6)
- [ ] Prévia de OG num depurador e no WhatsApp/LinkedIn (AC #8)
- [ ] QA-CHECKLIST, TASKS, Change Log da 8.2, README (AC #7)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos | SHA publicado | `npx tsc --noEmit` |
| build | SHA publicado | `npm run build` |
| deploy | conteúdo e o que não deve estar no ar | `curl` do Plano técnico |
| deploy | cabeçalhos e cache | `curl -I` do Plano técnico |
| âncoras | os 10 IDs no HTML no ar | laço de `grep` do Plano técnico |
| movimento | rolagem nos dois sentidos, filtro, reduced motion | Chrome em `$B`, 375 e 1200 |
| conversão | formulário | envio real pelo responsável + HTML conferido |
| SEO | prévia de OG (AC #8) | depurador de OG + WhatsApp ou LinkedIn Post Inspector com `$B/` |
| QA-CHECKLIST | § 6, § 7, § 9 | itens de performance, build/deploy e liberação |

## Riscos e armadilhas

- **Subdomínio errado.** `nexus-agency.pages.dev` responde 200 e parece um site da Nexus, mas não é este build (título, fallback de SPA, sem `Permissions-Policy`). Conferir sempre o `<title>Nexus | Agency</title>` antes de qualquer outra medida; um projeto com nome já ocupado ganha sufixo no Pages (`nexus-agency-xyz.pages.dev`).
- **Preset "Next.js" no painel.** Ele espera o runtime de servidor; o sinal é build falhando ou saída em `.vercel/output`. O preset tem de ser `None` com saída `out`.
- **Saída na raiz.** Publica `docs/`, `scripts/`, o legado e os arquivos de agente — o AC #2 pega pelo 200 em `/AGENTS.md`.
- **Fallback de SPA mascara 404.** Sem `404.html` na saída, o Pages devolve o `index.html` com 200 para qualquer rota; com o nosso `out/` o esperado é 404. Um 200 em `/rota-que-nao-existe` indica saída errada.
- **`_headers` ignorado em silêncio.** Se o arquivo não estiver na raiz da saída, o Pages não reclama; o sinal é `cache-control: public, max-age=0, must-revalidate` nos `/_next/static/*`.
- **Cache do navegador e da borda.** Medir com `curl`, não com o DevTools aberto num navegador que já visitou o site; um deploy novo leva alguns segundos para propagar.
- **Formspree com domínios restritos.** Se o formulário `xpppnoer` estiver limitado a `nexusagencybr.com.br` no painel do Formspree, o envio a partir do `pages.dev` é recusado (erro na página, nada na caixa) — falso negativo do AC #4. O responsável confere a restrição antes do teste; com restrição, liberar o `pages.dev` temporariamente ou adiar o envio real para a conferência no domínio (`PEND-20`), registrando aqui.
- **Lead de teste.** O envio cai na caixa do cliente: identificar como teste e avisar quem lê a caixa.

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência em texto.
- [ ] `npx tsc --noEmit` verde no SHA publicado.
- [ ] `npm run build` verde no SHA publicado.
- [ ] Validação no navegador feita em 375 e 1200 (sem capturas no repositório).
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [ ] Pontas da 8.2 registradas como fechadas; `PEND-20` continua aberto (não é consumido aqui).
- [ ] [README.md](../../README.md) com o nome real do projeto.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comandos + SHA + URL) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao executar.>

**O que divergiu do plano:** <preenchido ao executar.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `d7214b1`. Medido: nenhum deploy/check-run do Pages no GitHub; `nexus-agency.pages.dev` é outro site; `nexusagencybr.com.br` não resolve (aberto o `PEND-20`). |
| 2026-11-05 | TODO | Validada sobre `d7214b1` (0 commits desde o baseline): AC #1 aceita check-run, status ou deployment do GitHub; AC #6 conta só push de docs feito depois dos *build watch paths*; risco da restrição de domínios do Formspree acrescentado. Aguarda o responsável criar o projeto e informar `<projeto>.pages.dev`. |
| 2026-11-05 | TODO | AC #8 acrescentado: a prévia de OG no ar, resto do AC #2 da [8.4](8-4-metadados-dados-estruturados.md) (fechada sem ela, com aval do responsável). |
