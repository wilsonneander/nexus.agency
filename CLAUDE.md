# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexto

Reconstrução do site institucional one-page da **Nexus Agency** (pt-BR) em Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 3 + GSAP/ScrollTrigger. O site legado (`index.html`, `styles.css`, `main.js`, `assets/` na raiz) é a **fonte de verdade** de design, conteúdo, links e comportamento — mantenha esses arquivos intactos e use-os como referência.

**Leia `AGENTS.md` antes de qualquer tarefa.** Ele define restrições inegociáveis (não redesenhar, não inventar conteúdo/dados, não tocar nos botões sociais nem nos parâmetros do WhatsApp, não adicionar dependências sem justificar, não sequestrar o scroll) e o formato de entrega (Objetivo / Arquivos / Decisões / Validação / Pendências / Riscos).

Documentos de planejamento ficam na **raiz** (`BRD.md`, `PRD.md`, `TECHNICAL-SPEC.md`, `ARCHITECTURE.md`, `TASKS.md`, `QA-CHECKLIST.md`), embora o `AGENTS.md` os cite como `docs/…`. Em `docs/` ficam os relatórios produzidos: `AUDIT.md` (canônico), `CONTENT-MAPPING.md`, `FUNCTIONALITY-AUDIT.md` e `references/` (screenshots de referência e QA).

`TASKS.md` é o quadro de status (`TODO`/`IN_PROGRESS`/`BLOCKED`/`DONE`) e contém a tabela **PEND-xx** de decisões pendentes com o responsável (formulário sem backend, número de WhatsApp legado vs. cliente, perfil do Instagram, placeholders `[número]`, LGPD etc.). Antes de mexer nesses pontos, verifique o status — não resolva silenciosamente; atualize `TASKS.md` ao concluir uma tarefa.

Fluxo de trabalho por skills em `.claude/skills/`: `story` (detalhe da tarefa em `docs/stories/<id>-<slug>.md`, status espelhado no `TASKS.md`) → `validate-story` → `implement` → `review-mr` → `close-story` → `merge-request` (só quando houver remoto; hoje o repositório não tem). `tdd` documenta fluxos em `docs/tdds/`.

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção — principal validação (inclui type-check)
npm run start        # serve o build
npx tsc --noEmit     # type-check isolado
```

- Não há framework de testes nem config de ESLint (`npm run lint` → `next lint` pedirá configuração interativa).
- Validação visual é feita com scripts em `scripts/` (`capture_*.js`) que chamam o Chrome headless com caminhos absolutos do Windows e esperam o dev server em `http://localhost:3008` (ex.: `npx next dev -p 3008`, depois `node scripts/capture_sections.js`). As imagens vão para `docs/references/qa/`. `scripts/check_ids.js` verifica âncoras/IDs.

## Arquitetura

- **Página única**: [src/app/page.tsx](src/app/page.tsx) compõe as seções em ordem fixa (Hero → About → Banners → Projects → Services → Blog → Contact). [src/app/layout.tsx](src/app/layout.tsx) monta Navbar, Footer e `WhatsAppFloat`, carrega Poppins via `next/font` e RemixIcon/FontAwesome via CDN (ícones originais usam essas classes). A navegação é por âncoras (`#home`, `#about`, `#project`, `#service`, `#blog`) — os IDs precisam bater com `SITE_CONFIG.navLinks`.
- **Padrão Server + Client por seção** (`src/sections/<Nome>/`): `index.tsx` é Server Component com o markup e conteúdo; `<Nome>Client.tsx` (`"use client"`) envolve o markup e aplica as animações GSAP selecionando elementos por atributos `data-*` (ex.: `data-hero-sub`, `data-hero-social`). Para adicionar animação, marque o elemento com `data-*` no server component e anime no client wrapper — não mova o markup para o cliente.
- **Conteúdo** em `src/data/*.ts` (tipado por `src/types/index.ts`); contatos, WhatsApp, redes sociais e metadados em [src/lib/constants.ts](src/lib/constants.ts) (`SITE_CONFIG`). Esses valores são aprovados pelo cliente — não altere sem autorização.
- **Motion** (`src/components/motion/`):
  - `ScrollText` — "leitura progressiva" (FR-03): divide o texto em palavras preservando espaços/pontuação e anima a cor de muted → branco com `scrub`, reversível. Só usar nos textos aprovados no PRD/TASKS (Hero parágrafo, About título + 1º parágrafo, Services título + subtítulo). Nunca iniciar invisível.
  - `ScrollReveal`, `ParallaxImage` — reveals e parallax genéricos.
  - Timings/easings compartilhados em [src/animations/presets.ts](src/animations/presets.ts); registro de plugins em `src/animations/gsap.client.ts`.
  - Toda animação deve: respeitar `useReducedMotion()` (retornar cedo, conteúdo visível), ser escopada com `gsap.context()` e limpa com `ctx.revert()` no cleanup, animar só `transform`/`opacity`/`color`, e funcionar nos dois sentidos do scroll. Evitar `pin`.
- **Elementos protegidos (FR-07)**: `SocialIcons` (rotação 3D) e o pulso CSS `WaveWhatsApp` do `WhatsAppFloat` replicam o legado e não devem mudar visual, posição, links ou animação.
- **Estilo**: tokens de cor como CSS vars em `src/app/globals.css`, expostos no [tailwind.config.ts](tailwind.config.ts) (`primary`, `secondary`, `accent-span`, `whatsapp`). Breakpoints são os do legado, não os padrões do Tailwind: `sm 480`, `md 768`, `lg 1024`, `xl 1200`; container máx. 1200px. Use `cn()` de `src/lib/utils.ts` para mesclar classes.
- Assets servidos de `public/assets/` (cópia dos `assets/` legados); `robots.ts` e `sitemap.ts` em `src/app/`.
