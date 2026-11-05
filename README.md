![nexus](https://github.com/user-attachments/assets/f3212582-0aec-4665-a4e2-6c1c70a10caa)

# Nexus Agency — Site institucional

Reconstrução (rebuild) do site institucional one-page da **Nexus Agency** (pt-BR) em **Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3 e GSAP/ScrollTrigger**.

O objetivo é reproduzir fielmente o site atual — marca, conteúdo, estrutura, imagens, links e contatos — e acrescentar uma camada de movimento: scroll narrativo, leitura progressiva dos textos, transições e microinterações.

## Sumário

- [Início rápido](#início-rápido)
- [Fonte da verdade](#fonte-da-verdade)
- [Decisões já estabelecidas](#decisões-já-estabelecidas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [Movimento (GSAP)](#movimento-gsap)
- [Estilo](#estilo)
- [Validação e QA](#validação-e-qa)
- [Deploy (Cloudflare Pages)](#deploy-cloudflare-pages)
- [Documentação](#documentação)
- [Fluxo de trabalho](#fluxo-de-trabalho)
- [Pendências em aberto](#pendências-em-aberto)

## Início rápido

Requisitos: Node.js 22 (ver [.node-version](.node-version); mínimo 18.18) e npm.

```bash
npm install
npm run dev          # servidor de desenvolvimento (http://localhost:3000)
npm run build        # build de produção — principal validação (inclui type-check)
npm run start        # serve a pasta out/ gerada pelo build (npx serve out)
npx tsc --noEmit     # type-check isolado
```

- Não há framework de testes nem configuração de ESLint (`npm run lint` → `next lint` pede configuração interativa).
- `npm run build` é o gate obrigatório antes de qualquer entrega.

## Fonte da verdade

O **site legado na raiz** (`index.html`, `styles.css`, `main.js`, `assets/`) é a referência de design, conteúdo, links e comportamento. Esses arquivos devem permanecer **intactos**.

Onde uma informação ainda não existe, ela deve ser auditada e registrada — nunca preenchida com suposições. Valores de contato, WhatsApp e redes sociais em [src/lib/constants.ts](src/lib/constants.ts) são aprovados pelo cliente e não mudam sem autorização.

## Decisões já estabelecidas

- **Escopo:** rebuild do site atual, usando-o como referência visual e funcional. Não redesenhar nem inventar seções, conteúdo ou dados.
- **Stack:** Next.js, React, TypeScript, Tailwind CSS, GSAP e ScrollTrigger. Novas dependências só com justificativa.
- **Experiência:** scroll narrativo, leitura progressiva, transições e microinterações — sem sequestrar o scroll (evitar `pin`).
- **Botões de WhatsApp:** podem ganhar microinterações, preservando destino, parâmetros e comportamento.
- **Botões de redes sociais:** não alterar visual, links nem comportamento.
- **Execução:** múltiplos agentes/ferramentas, coordenados por documentação e pelo quadro de tarefas.

As regras completas e inegociáveis estão em [AGENTS.md](AGENTS.md) — leia antes de qualquer tarefa.

## Estrutura do projeto

```
.
├── index.html, styles.css, main.js, assets/   # site legado (referência — não editar)
├── public/                                    # vai para o deploy: assets/ (só o que o site usa) e _headers
├── src/
│   ├── app/            # layout.tsx, page.tsx, globals.css, robots.ts, sitemap.ts
│   ├── sections/       # Hero, About, Banners, Projects, Services, Contact
│   ├── components/
│   │   ├── layout/     # Navbar, Footer
│   │   ├── motion/     # ScrollText, ScrollReveal, ParallaxImage
│   │   └── ui/         # Button, FluidButton, RollingText, SocialIcons, WhatsAppFloat
│   ├── animations/     # gsap.client.ts (registro de plugins), presets.ts (timings/easings)
│   ├── data/           # conteúdo tipado (about, packages, projects, services)
│   ├── hooks/          # useReducedMotion
│   ├── lib/            # constants.ts (SITE_CONFIG), utils.ts (cn)
│   └── types/          # tipos do conteúdo
├── scripts/            # capturas headless e verificação de âncoras
├── docs/               # toda a documentação — índice em docs/README.md
└── AGENTS.md, CLAUDE.md # regras para agentes (ficam na raiz)
```

## Arquitetura

- **Página única.** [src/app/page.tsx](src/app/page.tsx) compõe as seções em ordem fixa: Hero → About → Banners → Projects → Services → Contact. [src/app/layout.tsx](src/app/layout.tsx) monta Navbar, Footer e `WhatsAppFloat`, carrega Poppins via `next/font` e RemixIcon/FontAwesome via CDN (os ícones originais usam essas classes).
- **Navegação por âncoras** (`#home`, `#about`, `#project`, `#service`; mais `#contact` para os CTAs e âncoras nos cards de serviço para o rodapé). Os IDs das seções precisam bater com `SITE_CONFIG.navLinks`.
- **Padrão Server + Client por seção** (`src/sections/<Nome>/`):
  - `index.tsx` — Server Component com markup e conteúdo.
  - `<Nome>Client.tsx` (`"use client"`) — envolve o markup e aplica as animações GSAP selecionando elementos por atributos `data-*` (ex.: `data-hero-sub`).
  - Para animar algo novo, marque o elemento com `data-*` no server component e anime no client wrapper. Não mova o markup para o cliente.
- **Conteúdo** em `src/data/*.ts`, tipado por `src/types/index.ts`. Contatos, WhatsApp, redes sociais e metadados ficam em `SITE_CONFIG` ([src/lib/constants.ts](src/lib/constants.ts)).

## Movimento (GSAP)

Componentes em `src/components/motion/`:

| Componente | Uso |
|---|---|
| `ScrollText` | Leitura progressiva (FR-03): divide o texto em palavras e anima a cor de muted → branco com `scrub`, reversível. Somente nos textos aprovados: parágrafo do Hero, título + 1º parágrafo do About, título + subtítulo de Services. Nunca inicia invisível. |
| `ScrollReveal` | Reveals genéricos de entrada. |
| `ParallaxImage` | Parallax de imagens. |

Toda animação deve:

1. Respeitar `useReducedMotion()` — retornar cedo, com o conteúdo visível.
2. Ser escopada com `gsap.context()` e limpa com `ctx.revert()` no cleanup.
3. Animar apenas `transform`, `opacity` e `color`.
4. Funcionar nos dois sentidos do scroll.
5. Usar os timings/easings de [src/animations/presets.ts](src/animations/presets.ts).

**Elementos protegidos (FR-07):** `SocialIcons` (rotação 3D) e o pulso CSS `WaveWhatsApp` do `WhatsAppFloat` replicam o legado — não alterar visual, posição, links ou animação.

## Estilo

- Tokens de cor como CSS vars em `src/app/globals.css`, expostos em [tailwind.config.ts](tailwind.config.ts): `primary`, `secondary`, `accent-span`, `whatsapp`.
- Breakpoints do legado (não os padrões do Tailwind): `sm 480`, `md 768`, `lg 1024`, `xl 1200`. Container máximo de 1200px.
- Use `cn()` de [src/lib/utils.ts](src/lib/utils.ts) para mesclar classes.

## Validação e QA

A validação visual usa scripts em `scripts/` que chamam o Chrome headless (caminhos absolutos do Windows) contra o dev server na porta **3008**:

```bash
npx next dev -p 3008
node scripts/capture_sections.js   # capturas por seção
node scripts/check_ids.js          # verifica âncoras/IDs
```

| Script | Finalidade |
|---|---|
| `capture_sections.js` | Captura cada seção |
| `capture_screenshots.js` | Capturas de página inteira |
| `capture_scroll.js` | Estados de animação ao longo do scroll |
| `capture_validation.js` | Capturas para validação de tarefas |
| `capture_fluid.js` | Botões fluidos |
| `capture_mvv.js` | Missão, Visão e Valores |
| `check_ids.js` | Âncoras e IDs vs. navegação |

As imagens vão para uma pasta temporária fora do repositório (`OUT_DIR`, padrão `<tmp>/nexus-qa`) e nunca são commitadas. O plano de testes e os critérios de aceite estão em [docs/QA-CHECKLIST.md](docs/QA-CHECKLIST.md).

## Deploy (Cloudflare Pages)

O site é um **export estático** (`output: "export"` em [next.config.ts](next.config.ts)): `npm run build` gera a pasta `out/`, que é tudo o que vai para o ar. Hospedagem decidida no `PEND-06` ([docs/TASKS.md](docs/TASKS.md)).

O deploy usa a **integração do Cloudflare Pages com o GitHub**: o Pages clona o repositório, roda o build na infraestrutura dele e publica `out/`. Não há GitHub Actions, Wrangler nem token no repositório.

| Evento no GitHub | O que o Pages faz |
|---|---|
| push na `main` | build + deploy de **produção** (`nexusagencybr.com.br` e `<projeto>.pages.dev`) |
| push em outra branch / PR | build + deploy de **preview** em `<branch>.<projeto>.pages.dev`, com o link comentado no PR |
| push que só mexe em arquivos excluídos nos *build watch paths* | nada (sem build) |

Como o trabalho é direto na `main` (ver [CLAUDE.md](CLAUDE.md)), **todo push na `main` vai para o ar**: rode `npm run build` antes de dar push. Para testar algo arriscado, suba numa branch e confira o preview.

Criar o projeto (uma vez, por quem tem acesso de admin ao repositório no GitHub): Workers & Pages → Create → Pages → **Connect to Git** → autorizar o app "Cloudflare Workers and Pages" no GitHub para o repositório `wilsonneander/nexus.agency` → preencher:

| Campo | Valor |
|---|---|
| Production branch | `main` |
| Framework preset | `None` (não use o preset "Next.js", que espera o runtime de servidor) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Variável de ambiente | `NODE_VERSION` = `22` (o [.node-version](.node-version) já pede 22; a variável só garante) |

Depois de criado, em Settings → Builds → **Build watch paths**, mantenha *Include* = `*` e ponha em *Exclude*: `docs/*`, `.claude/*`, `scripts/*`, `*.md`, `index.html`, `styles.css`, `main.js`, `assets/*`. Assim um commit só de documentação ou do legado não gera build nem deploy. (A exclusão só evita builds à toa: esses arquivos nunca entram em `out/` de qualquer jeito.)

- **Não use Direct Upload / Wrangler neste projeto.** Um projeto do Pages ligado ao Git não passa a aceitar upload manual depois (e vice-versa); o caminho de deploy é o push.

- **A pasta de saída tem de ser `out`.** Com a raiz do repositório como saída, o Pages publicaria `docs/`, `scripts/`, o legado (`index.html`, `assets/`) e os arquivos de agente. Em `out/` só entram `public/` e o que o Next compila.
- **Cabeçalhos e cache:** [public/_headers](public/_headers) é copiado para `out/_headers` e o Pages o aplica: `/_next/static/*` fica em cache por 1 ano (`immutable`, o nome tem hash); `/assets/*` por 1 dia; toda resposta leva `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`.
- **Domínio:** em Custom domains, adicione `nexusagencybr.com.br` (o domínio canônico, `SITE_CONFIG.url`) e `www.nexusagencybr.com.br`. Para o `www` redirecionar ao apex, crie em Rules → Redirect Rules a regra a partir do modelo **"Redirect from WWW to root"** (`301`, preservando caminho e query string).
- **Conferência depois do primeiro deploy** (no `<projeto>.pages.dev`, antes de apontar o domínio, ou no preview de uma branch):

  ```bash
  curl -sI https://<projeto>.pages.dev/ | grep -iE "x-content-type|referrer-policy|permissions-policy"
  curl -sI https://<projeto>.pages.dev/_next/static/css/<arquivo>.css | grep -i cache-control   # ... immutable
  ```

- **Testar o build localmente:** `npm run build && npm run start` (serve `out/`). O `next start` não funciona com export estático.
- **Imagens:** não há otimizador de imagem em produção. Imagem nova entra já em WebP, no tamanho de exibição (~2× a maior largura), em `public/assets/`.

## Documentação

Toda a documentação mora em [docs/](docs/README.md) — o índice lá diz qual é a **fonte única** de cada assunto. Na raiz ficam só [AGENTS.md](AGENTS.md) (regras inegociáveis — **leia primeiro**), [CLAUDE.md](CLAUDE.md) e este README.

| Documento | Finalidade |
|---|---|
| [docs/BRD.md](docs/BRD.md) | Objetivos de negócio, escopo e riscos |
| [docs/PRD.md](docs/PRD.md) | Requisitos funcionais (FR-xx) e comportamento |
| [docs/TECHNICAL-SPEC.md](docs/TECHNICAL-SPEC.md) | Stack, padrões técnicos e restrições |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Pastas, módulos, responsabilidades e decisões |
| [docs/TASKS.md](docs/TASKS.md) | Quadro de status e pendências de decisão (PEND-xx) |
| [docs/QA-CHECKLIST.md](docs/QA-CHECKLIST.md) | Critérios de aceite e de liberação |
| [docs/AUDIT.md](docs/AUDIT.md) | Inventário do legado + auditoria de funcionalidades e conversão |
| [docs/CONTENT-MAPPING.md](docs/CONTENT-MAPPING.md) | Conteúdo do cliente vs. site legado |
| [docs/stories/](docs/stories/README.md) | Uma story por tarefa |
| [docs/tdds/](docs/tdds/README.md) | Um TDD por fluxo técnico |
| [docs/references/](docs/references/) | PDF do cliente e relatório do Lighthouse |

## Fluxo de trabalho

1. Leia [AGENTS.md](AGENTS.md).
2. Verifique o status em [docs/TASKS.md](docs/TASKS.md) (`TODO` / `IN_PROGRESS` / `BLOCKED` / `DONE`) e se a tarefa depende de alguma pendência PEND-xx.
3. Escreva/leia a story da tarefa em [docs/stories/](docs/stories/README.md); use o [PRD](docs/PRD.md) como referência de comportamento e a [TECHNICAL-SPEC](docs/TECHNICAL-SPEC.md) / [ARCHITECTURE](docs/ARCHITECTURE.md) como referência técnica.
4. Implemente comparando com o site legado; valide com `npm run build` e os scripts de captura.
5. Entregue no formato do `AGENTS.md`: **Objetivo / Arquivos / Decisões / Validação / Pendências / Riscos**.
6. Atualize a story e o `docs/TASKS.md` ao concluir e os documentos quando decisões forem confirmadas.

## Pendências em aberto

Decisões que dependem do cliente/responsável (formulário de contato, links placeholder, número do WhatsApp, perfil do Instagram, LGPD, deploy…) — não resolver silenciosamente. A lista e o status vivem **somente** na tabela PEND-xx do [docs/TASKS.md](docs/TASKS.md#pendências-de-decisão-registradas-para-alinhamento-com-responsável).
