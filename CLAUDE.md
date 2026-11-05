# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexto

Reconstrução do site institucional one-page da **Nexus Agency** (pt-BR) em Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 3 + GSAP (ScrollTrigger, Flip). Objetivo: reproduzir fielmente o site atual e acrescentar movimento ligado ao scroll (leitura progressiva, reveals, microinterações) — **sem redesign**.

**Fontes da verdade, nesta ordem:**
1. **Site legado** (`index.html`, `styles.css`, `main.js`, `assets/` na raiz) — design, links e comportamento. Mantenha esses arquivos intactos.
2. **Conteúdo aprovado do cliente** (`docs/references/client-content.pdf`, mapeado em [docs/CONTENT-MAPPING.md](docs/CONTENT-MAPPING.md)) — substitui o texto legado onde a matriz marca `SUBSTITUIR`/`ADICIONAR` (About + Missão/Visão/Valores, Services + Pacotes, Contact). Hero, Banners e Projects seguem o legado (o Blog foi removido — `PEND-02`). Valores entre colchetes (`[número]`, `[24 horas úteis]`) **não** se preenchem (`PEND-09`) — exceto horário e área de atendimento, aprovados para a coluna Canais do rodapé ([story 7.5](docs/stories/7-5-coluna-canais-rodape.md)).
3. **[AGENTS.md](AGENTS.md)** — leia antes de qualquer tarefa. Restrições inegociáveis (não redesenhar, não inventar conteúdo/dados, não tocar nos botões sociais nem nos parâmetros do WhatsApp, não adicionar dependências sem justificar, não sequestrar o scroll), critério de `DONE` (§ 9) e formato de entrega (Objetivo / Arquivos / Decisões / Validação / Pendências / Riscos).
4. **[docs/PRD.md](docs/PRD.md)** (FR-xx aprovados) e **[docs/TECHNICAL-SPEC.md](docs/TECHNICAL-SPEC.md) / [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** (padrões técnicos). Conflito entre fontes não se resolve sozinho: vira `PEND-xx` e pergunta ao responsável.

## Documentação

Toda a documentação mora em `docs/` — o [docs/README.md](docs/README.md) diz qual arquivo é a **fonte única** de cada assunto. Só `AGENTS.md`, `CLAUDE.md` e `README.md` ficam na raiz. Se uma informação aparecer em dois lugares, mantenha a fonte e troque a cópia por link.

- `docs/TASKS.md` — abre com a **Ordem de implementação** (próxima tarefa + fila por dependência/prioridade), que deve ser atualizada a cada mudança de status, tarefa nova ou pendência resolvida; depois o quadro de status (`TODO`/`IN_PROGRESS`/`BLOCKED`/`DONE`) e a tabela **PEND-xx**, única fonte das decisões pendentes (formulário sem backend `PEND-10`, colchetes `PEND-09`, LGPD `PEND-12`, deploy `PEND-06`…). Outros docs só citam o ID. Não resolva pendência silenciosamente. Estado hoje: Fases 0–3, 5 e 6 `DONE`; **Fase 4 (responsividade e a11y)**: 4.4 `DONE` ([story](docs/stories/4-4-conteudo-sem-javascript.md)); 4.3 `DONE` ([story](docs/stories/4-3-reduced-motion.md)); 4.7 `DONE` ([story](docs/stories/4-7-card-design-banner-invisivel.md)); 4.1, 4.2, 4.5 e 4.6 `TODO`, sem stories. 6.9 (limpeza de código não usado) `TODO`. **Fase 7 (evolução visual pós-entrega)**: 7.1 Hero com brilho roxo animado `DONE` ([story](docs/stories/7-1-hero-background-animado.md), `PEND-14`); 7.3 links do rodapé + remoção do Blog `DONE` ([story](docs/stories/7-3-links-rodape-remover-blog.md), `PEND-02`); 7.4 e-mail institucional no rodapé `DONE` ([story](docs/stories/7-4-email-institucional-rodape.md), `PEND-11`); 7.5 coluna Canais + remoção do texto da logo no rodapé `DONE` ([story](docs/stories/7-5-coluna-canais-rodape.md)).
- `docs/AUDIT.md` — inventário do legado (§§ 1–11: seções, textos, links, tokens, breakpoints, animações, bugs do legado) e auditoria de funcionalidades/conversão do rebuild (§ 12).
- `docs/QA-CHECKLIST.md` — critérios de aceite; § 9 é o critério de liberação que nenhuma tarefa pode violar.
- `docs/stories/` e `docs/tdds/` — uma story por tarefa, um TDD por fluxo; cada pasta tem um `README.md` de índice para manter atualizado.
- `docs/references/` — `screenshot.png` (referência visual do legado), `client-content.pdf`, `qa/` (capturas de validação).

**Fluxo por skills** (`.claude/skills/`): `story` (`docs/stories/<id>-<slug>.md`, status espelhado no `TASKS.md`) → `validate-story` → `implement` → `review-mr` → `close-story` → `merge-request` (só com remoto; hoje não há). `tdd` documenta fluxos em `docs/tdds/`. O ID da tarefa vem do `TASKS.md` e nunca se reaproveita.

**Regras de documentação e higiene do repositório:**
- Em todo arquivo de documentação, a menção a outro arquivo é sempre um link Markdown para ele, nunca um caminho solto.
- Screenshots e scripts que só servem para executar uma story (capturas "antes", sondas, scripts de captura pontuais) ficam numa pasta temporária fora do repositório — nunca em `scripts/` ou `docs/references/qa/` e nunca commitados. No repositório só entram evidências úteis (ex.: a captura final de validação citada pela story/QA).

**Git:** trabalho direto na `main`, sem remoto; Conventional Commits em inglês (`feat:`, `fix:`, `docs:`). Commit só quando pedido.

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção — principal validação (inclui type-check)
npm run start        # serve o build
npx tsc --noEmit     # type-check isolado
```

- Não há framework de testes nem config de ESLint (`npm run lint` → `next lint` pedirá configuração interativa).
- Validação visual: scripts em `scripts/` chamam o Chrome headless (caminhos absolutos do Windows) e salvam em `docs/references/qa/`. Todos esperam o dev server na porta **3008** (sobrescreva com a variável `PORT`): `npx next dev -p 3008`, depois `node scripts/capture_sections.js`. `scripts/check_ids.js` verifica âncoras/IDs.
- Viewports de validação: 375, 480, 768, 1024 e 1200px. Movimento: scroll para baixo **e** para cima, `prefers-reduced-motion`, resize.

## Arquitetura

- **Página única**: [src/app/page.tsx](src/app/page.tsx) compõe as seções em ordem fixa (Hero → About → Banners → Projects → Services → Contact; o Blog do legado foi removido no `PEND-02`, [story 7.3](docs/stories/7-3-links-rodape-remover-blog.md)). [src/app/layout.tsx](src/app/layout.tsx) monta Navbar, Footer e `WhatsAppFloat`, carrega Poppins via `next/font` e RemixIcon/FontAwesome via CDN (ícones originais usam essas classes). A navegação é por âncoras (`#home`, `#about`, `#project`, `#service`; mais `#contact` para os CTAs e, no rodapé, `#<id>` de cada card de serviço — `SERVICES_DATA[].id`, não renomeie) — os IDs precisam bater com `SITE_CONFIG.navLinks`. A seção de depoimentos (`#client`) está comentada no legado e não é reconstruída.
- **Padrão Server + Client por seção** (`src/sections/<Nome>/`): `index.tsx` é Server Component com o markup e conteúdo; `<Nome>Client.tsx` (`"use client"`) envolve o markup e aplica as animações GSAP selecionando elementos por atributos `data-*` (ex.: `data-hero-sub`, `data-hero-social`). Para adicionar animação, marque o elemento com `data-*` no server component e anime no client wrapper — não mova o markup para o cliente. **Exceções existentes:** `Projects/index.tsx` (filtro por categoria com estado React + GSAP Flip) e `Contact/index.tsx` (formulário) são Client Components inteiros. O Footer segue o padrão via `components/layout/FooterClient.tsx`.
- **Conteúdo** em `src/data/*.ts` (`about`, `packages`, `projects`, `services`), tipado por `src/types/index.ts`. Contatos, WhatsApp, redes sociais e metadados em [src/lib/constants.ts](src/lib/constants.ts) (`SITE_CONFIG`) — não altere sem autorização.
  - Canais **oficiais são os do cliente**, não os do legado (`PEND-07`/`PEND-08` RESOLVED em 2026-11-02): WhatsApp `+55 (61) 9298-5392` (`wa.me/556192985392`), Instagram `@nexusagencybr`, LinkedIn `company/nexus-ag-br`; Facebook igual ao legado. E-mail `contato@nexusagencybr.com.br` (`SITE_CONFIG.email`) só no rodapé (`PEND-11` RESOLVED em 2026-11-03). Ao comparar com o `index.html`, essa diferença é esperada. O número com DDD 81 do `main.js` legado é código morto — nunca usar.
- **Formulário de contato** (`#contact`): 4 campos do cliente, `onSubmit` com `preventDefault` — nada é enviado. Backend/integração depende do `PEND-10`; não introduza um.
- **Motion** (`src/components/motion/`):
  - `ScrollText` — "leitura progressiva" (FR-03): divide o texto em palavras preservando espaços/pontuação e anima a cor de muted (`rgba(255,255,255,0.22)`) → branco com `scrub`, reversível. Só usar nos textos aprovados (Hero parágrafo, About título + 1º parágrafo, Services título + subtítulo). Nunca iniciar invisível, nunca duplicar texto para leitor de tela.
  - `ScrollReveal`, `ParallaxImage` — reveals e parallax genéricos (parallax hoje só no brilho do Hero, `[data-hero-glow]`, e na ilustração `grafic.png` do About).
  - Fundo do Hero: brilho roxo em camadas CSS (`.hero-glow__*` + keyframes em `globals.css`), loop só em CSS e parado com reduced motion. Exceção ao legado autorizada no `PEND-14` ([story 7.1](docs/stories/7-1-hero-background-animado.md)).
  - Timings/easings compartilhados em [src/animations/presets.ts](src/animations/presets.ts); registro de plugins em `src/animations/gsap.client.ts`; preferência de movimento em `src/hooks/useReducedMotion.ts`.
  - Toda animação deve: respeitar reduced motion com `if (reduced || prefersReducedMotion()) return;` no início do efeito (o hook começa em `false`; sem o leitor síncrono a 1ª passada anima mesmo com `reduce` — story 4.3), deixar todo `gsap.set` dentro do contexto, ser escopada com `gsap.context()` e limpa com `ctx.revert()` no cleanup, animar só `transform`/`opacity`/`color`, funcionar nos dois sentidos do scroll e usar `invalidateOnRefresh` quando depender de dimensões. Sem `pin`. Lenis foi avaliado e **descartado** (scroll nativo).
  - Armadilha: `gsap.from({ opacity: 0 })` deixa conteúdo invisível antes da hidratação/sem JS — o estado inicial do HTML do servidor deve ser o final, visível. E o `from` lê o destino do DOM: com stagger + ScrollTrigger, o refresh gravou o estado inicial do 1º card dos Banners como destino (story 4.7). Onde o conteúdo precisa terminar visível, use `fromTo` com destino explícito.
  - Exceção: quando o estado inicial precisa sair do servidor para não piscar (o `ScrollText` grava 22% inline), o estado final sem JS vem do `<noscript><style>` no `<head>` do [layout.tsx](src/app/layout.tsx), selecionando `data-*` (hoje `[data-word]` — não renomeie). Regra em [docs/TECHNICAL-SPEC.md](docs/TECHNICAL-SPEC.md#nextjs--react). Auditoria sem JS: `node scripts/capture_nojs.js`.
- **Elementos protegidos (FR-07)**: `SocialIcons` (rotação 3D `rotateY(360deg)` + preenchimento por marca, nos 3 locais: topo/Hero, About e Footer) e o pulso CSS `WaveWhatsApp` do `WhatsAppFloat` replicam o legado e não devem mudar visual, posição, links ou animação. O `WhatsAppFloat` pode ter microinteração GSAP (hover/clique), sem tocar no destino.
- **UI**: botões em `src/components/ui/` (`Button`, `FluidButton` — padrão dos CTAs de contato e filtros —, `RollingText`); reaproveite antes de criar outro.
- **Estilo**: tokens de cor como CSS vars em `src/app/globals.css`, expostos no [tailwind.config.ts](tailwind.config.ts) (`primary`, `secondary`, `accent-span`, `whatsapp`) — sem hex solto. Fundo escuro `#04091d`/`#0f1221`, roxo `#a15cf5`, lilás `#ad7dff`. Breakpoints são os do legado, não os padrões do Tailwind: `sm 480`, `md 768`, `lg 1024`, `xl 1200`; container máx. 1200px. Use `cn()` de `src/lib/utils.ts` para mesclar classes.
  - **Cards**: padrão único de vidro em `globals.css` (story [7.2](docs/stories/7-2-cards-glassmorphism.md), `PEND-15`): `glass-card` no card (`glass-card--featured` no pacote destacado), `glass-icon` no recipiente do ícone, `glass-ambient` na grade. Card novo usa essas classes, não `bg-[#0f1221]`. A borda é um anel no `::after` (não `border`, que alargaria o card dos Banners em 480px) e o card não leva `transition-all` (conflita com a opacidade do GSAP). Exceção: o formulário e os canais do Contact seguem o estilo antigo.
- Assets servidos de `public/assets/` (cópia dos `assets/` legados, via `next/image` com dimensões definidas); metadados (OpenGraph/Twitter/canonical) em `layout.tsx`; `robots.ts` e `sitemap.ts` em `src/app/`.
