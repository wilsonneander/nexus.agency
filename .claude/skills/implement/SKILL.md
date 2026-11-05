---
name: implement
description: Implementa uma story ou qualquer mudança no site Nexus Agency já no padrão do projeto — reaproveitando a seção Server + wrapper Client, os componentes de motion (ScrollText, scrubReveal), os botões Fluid, os presets e os dados em src/data, preservando a fidelidade ao site legado e as restrições do AGENTS.md, e escrevendo desde a primeira linha o que o review-mr vai cobrar. Decide sozinho pelo precedente e só pergunta o que é decisão de negócio, conteúdo, identidade ou escopo. Use SEMPRE que for pedido para implementar, desenvolver, construir, codar, fazer ou corrigir algo. Gatilhos - "implementa a 4.1", "pode implementar essa story", "faz a seção X", "anima o bloco Y", "ajusta o mobile do Hero", "corrige esse bug", "começa a tarefa", "faz isso funcionar".
---

# Implementar no padrão do projeto

A pergunta que guia cada arquivo: **"isso já foi feito aqui antes? então faça
igual."** O site já tem seção com wrapper de animação, leitura progressiva,
reveal com stagger, parallax, filtro com Flip, botão fluido, ícones sociais e
WhatsApp flutuante. Mecânica nova para problema resolvido é retrabalho e
inconsistência visual.

Três regras de postura:

1. **Fidelidade vence criatividade.** O site legado é a fonte de verdade
   (AGENTS.md § 3). Nada de redesenhar, reordenar, trocar cor/fonte/texto ou
   "melhorar" o que não foi pedido.
2. **Precedente vence invenção.** Copie a forma do vizinho mais parecido; só
   invente quando nenhum resolve — e o que nasce reutilizável vai para
   `src/components/{ui,motion}` ou `src/lib`, não fica preso na seção.
3. **O review é o piso.** Leia o
   [CHECKLIST.md do review-mr](../review-mr/CHECKLIST.md) **antes** de escrever.

## Quando perguntar — só nestes casos

Use `AskUserQuestion` **somente** quando a resposta muda o que vai ser feito e
nenhuma fonte decide (AGENTS.md § 11):

- Conteúdo, número, link, telefone, cor, imagem ou texto que **não existe** no
  legado, no `client-content.pdf` nem num `PEND-xx` resolvido — **nunca
  invente**.
- A tarefa esbarra num `PEND-xx` ainda aberto (WhatsApp definitivo, Instagram,
  formulário, LGPD, placeholders `[número]`…).
- Mudança em **botões sociais** (FR-07) ou **WhatsApp** (FR-06), remoção de
  funcionalidade existente, ou alteração de ordem de seções.
- **Dependência nova**, back-end, rota de API, CMS ou integração externa.
- Conflito entre legado, PRD e TECHNICAL-SPEC.

Todo o resto — nome de componente, onde colocar o arquivo, timing de animação
dentro dos presets, qual variante de botão — decida pelo precedente e registre
no Change Log da story.

## 1. Estado e story

```bash
git rev-parse --abbrev-ref HEAD
git status --short
```

- Ache a story (`ls docs/stories/ | grep <id>`) e leia **inteira**. Sem story?
  Invoque a skill `story` antes do código.
- Status para `IN_PROGRESS` (story + `TASKS.md` + Change Log).
- Mudança não commitada que não é sua: não a misture com a sua — mostre e
  pergunte se ela atrapalhar.

## 2. Ache o precedente antes de escrever

Confira que o arquivo ainda existe — o mapa envelhece.

| Preciso de… | Faça como |
| --- | --- |
| Seção nova ou alterada | `src/sections/<Nome>/index.tsx` (Server Component, markup + conteúdo) + `<Nome>Client.tsx` (`"use client"`, recebe `children`, anima por `data-*`). Vizinhos: `Hero/`, `About/`, `Services/`. Registre em `src/app/page.tsx` **na ordem do legado**. |
| Animação de elementos da seção | no wrapper client: `useEffect` → `if (reduced) return` → `gsap.registerPlugin(ScrollTrigger)` → `gsap.context(() => …, ref)` → `return () => ctx.revert()`. Selecione por `data-<secao>-<parte>` dentro do `ref`. Ver `AboutClient.tsx`. |
| Entrada que não pode piscar | `gsap.fromTo(el, {from}, {to, immediateRender: false, scrollTrigger: {…, invalidateOnRefresh: true}})` — é a correção do "bug do 1º card" em `AboutClient.tsx`. |
| Leitura progressiva (FR-03) | `ScrollText` (`components/motion/ScrollText.tsx`), passando a string; **só** nos textos aprovados no PRD/TASKS. |
| Reveal de entrada | `scrubReveal` de `src/animations/scrubReveal.ts`, um trigger por elemento, dentro de `gsap.matchMedia()` com `REVEAL_MEDIA` + `revealY` (ver `AboutClient.tsx`). Sem `stagger` em grupo. |
| Parallax leve | só o do brilho do Hero (`[data-hero-glow]`, `MOTION_MEDIA.desktop`) — parallax novo precisa de aprovação. |
| Reordenar/filtrar cards | GSAP `Flip` como em `sections/Projects/index.tsx` (`flushSync` antes do `Flip.from`). |
| Timings e easings | `MOTION_PRESETS` de `src/animations/presets.ts`. Valor novo entra lá se for reutilizado. |
| Reduced motion | `useReducedMotion()` de `src/hooks/useReducedMotion.ts` — retorna cedo e o conteúdo fica no estado final visível. |
| Botão / CTA | `FluidButton` / `FluidLink` (`components/ui/FluidButton.tsx`, variantes `primary`/`secondary`/`filter`); link de texto com `RollingLink`. |
| Redes sociais | `SocialIcons` — **reutilizar, nunca alterar** (FR-07). |
| WhatsApp | `SITE_CONFIG.whatsapp` (`src/lib/constants.ts`) e `WhatsAppFloat` — nunca hardcode de número/mensagem. |
| Conteúdo (textos, cards, listas) | arquivo em `src/data/*.ts`, tipado em `src/types/index.ts`; a seção só renderiza. |
| Contatos, links, nav, metadados | `SITE_CONFIG`; âncora nova entra em `navLinks` **e** no `id` da seção. |
| Imagem | `next/image` com `width`/`height` (ou `fill` + container com proporção), asset em `public/assets/`. |
| Classes condicionais | `cn()` de `src/lib/utils.ts`. |
| Ícone | classes RemixIcon (`ri-*`) ou FontAwesome já carregadas no `layout.tsx` — as mesmas do legado. |

Quando o mapa não cobre: `grep -rln "<mecânica>" src`. Duas formas diferentes da
mesma mecânica? Siga a mais recente (`git log -1 --format=%cs -- <arquivo>`) e
anote.

Extraia para o lugar compartilhado só o que **esta** tarefa precisa usar em dois
lugares. Refatorar o que a story não toca é escopo extra.

## 3. Fidelidade antes do JSX

Antes de escrever markup ou estilo, abra o trecho correspondente do legado
(`grep -n "<classe-ou-texto>" index.html styles.css`) e a referência
(o legado aberto no navegador, `docs/CONTENT-MAPPING.md`).

O que reprova, e você não escreve:

- texto diferente do legado/aprovado (inclusive pontuação e acentos), seção
  criada, removida ou reordenada, número ou depoimento inventado;
- cor fora dos tokens (`primary`, `secondary`, `accent-span`, `whatsapp` no
  `tailwind.config.ts`; vars em `globals.css`). Os hex literais que existem em
  `Navbar.tsx`/`FooterClient.tsx` são legado da migração — não espalhe o padrão;
- fonte diferente de Poppins, peso fora de 400/500/600/700;
- breakpoint padrão do Tailwind presumido — aqui `sm`=480, `md`=768, `lg`=1024,
  `xl`=1200, container 1200px;
- qualquer mudança visual, de posição, link ou animação em `SocialIcons` e no
  pulso `WaveWhatsApp`;
- `!important` como solução estrutural; estilo global que vaza entre seções.

## 4. Código: o que o review cobra, escrito de primeira

- **Server Component por padrão.** `"use client"` só no wrapper que anima ou
  tem estado. `page.tsx` e `layout.tsx` continuam server. Nada de `window`,
  `document` ou `matchMedia` no render.
- **Conteúdo nunca depende de animação.** Sem JS, antes da hidratação e com
  reduced motion, tudo está visível e legível. Nada começa com `opacity: 0`
  no CSS/markup do servidor.
- **GSAP escopado e limpo**: `gsap.context(…, ref)` + `ctx.revert()`; sem
  seletor global que pegue outra seção; sem timeline compartilhada entre
  seções; `invalidateOnRefresh` quando depende de dimensão; variantes por
  breakpoint com `gsap.matchMedia()`.
- **Só `transform`, `opacity` e `color`** animados. **Sem `pin`** sem
  justificativa aprovada. Scroll nunca bloqueado.
- **Reversível**: `scrub` ou `toggleActions: "play none none reverse"`; teste
  subindo a página.
- **Acessibilidade**: `ScrollText` não duplica texto para leitor de tela; foco
  visível; `aria-label` em controle só-ícone; links externos com
  `target="_blank" rel="noopener noreferrer"`.
- **Identificadores em inglês** (componente, função, variável, `data-*`);
  comentário e texto de tela em pt-BR. Comentário curto, só quando o porquê não
  é óbvio.
- **Sem atalho**: nada de `any`, `as` escondendo erro, `@ts-expect-error`,
  `eslint-disable`, `console.log`.
- **Nada além do pedido** — o que está em _Fora de escopo_ não se implementa.
- **Dependência nova** só com justificativa registrada na story (AGENTS.md § 4).

## 5. Valide junto com o código

Não há suíte de testes; a validação é esta, e roda enquanto você trabalha:

```bash
npx tsc --noEmit
npm run build
npx next dev -p <porta>            # em background, para as validações abaixo
node scripts/check_ids.js          # se mexeu em seção/âncora — ajuste a porta do script
node scripts/capture_<x>.js        # screenshots → pasta temporária fora do repo (OUT_DIR); nunca commitar
```

- **Visual**: compare os screenshots com o legado nos viewports afetados
  (375/480/768/1024/1200). Abra a imagem e olhe — screenshot gerado não é
  screenshot conferido.
- **Movimento**: scroll para baixo e para cima, resize no meio da página,
  reduced motion (DevTools → Rendering → `prefers-reduced-motion: reduce`).
  O que você não conseguir verificar daqui (ex.: interação real no browser),
  diga que **não foi verificado** — nunca afirme.
- Script de captura novo segue os existentes, mas em arquivo próprio e
  descrito na story.

## 6. Pronto é validação carimbada

- `tsc` e `build` verdes, validação visual/movimento feita nos viewports
  afetados, itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- Change Log da story com as escolhas pelo precedente e a validação com
  **comando e SHA** (sem commit: "árvore de trabalho sobre `<SHA>`").
- `TASKS.md` atualizado no formato das linhas existentes. Status `DONE` só
  depois da revisão (skill `review-mr`), pela skill `story`.
- **Não commite** sem ordem expressa. Commit, revisão e entrega são das skills
  `close-story`, `review-mr` e `merge-request`, quando pedidas.

## 7. O que dizer ao terminar

No formato do AGENTS.md § 10 — **Objetivo, Arquivos, Decisões, Validação,
Pendências, Riscos** — curto, com `arquivo:linha` por AC e o que não foi
verificado (e por quê). Nada de repetir o diff.
