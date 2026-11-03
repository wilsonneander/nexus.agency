# Checklist de corretude — onde olhar neste repositório

Não é para percorrer item a item: é o mapa de onde olhar em cada arquivo que o
diff tocou. Área que não se aplica, pule.

## Restrições inegociáveis — sempre, antes de tudo

(AGENTS.md § 4, PRD FR-06/FR-07, QA-CHECKLIST § 9)

- **`SocialIcons`, o CSS da rotação 3D e o pulso `WaveWhatsApp`** (em
  `globals.css`) tocados de qualquer forma: visual, ícone, posição, link,
  animação. Bloqueador sem autorização registrada.
- **WhatsApp**: número, mensagem ou parâmetros fora de `SITE_CONFIG.whatsapp`,
  ou valores alterados. O número aprovado é o do cliente (`PEND-07`
  RESOLVED) — trocá-lo sem nova decisão registrada é bloqueador.
- **Conteúdo**: texto, número, depoimento, serviço ou dado comercial sem fonte
  (legado `index.html`, `docs/CONTENT-MAPPING.md`, `client-content.pdf`, `PEND`
  resolvido). Placeholders `[número]` preenchidos por conta própria (`PEND-09`).
- **Estrutura**: seção removida, criada ou fora da ordem de `src/app/page.tsx`
  / ARCHITECTURE.md § 7.
- **Identidade**: cor fora dos tokens, fonte diferente de Poppins, ícone
  trocado.
- **Dependência nova** no `package.json` sem justificativa na story.
- **Back-end/integração** (rota de API, server action de envio, CMS) sem o
  `PEND` correspondente decidido (`PEND-01`/`PEND-10`).

## Verde vazio — a evidência que não prova nada

- **Screenshot da página errada**: dev server em outra porta (os scripts têm
  porta fixa — 3001, 3007, 3008…) e o Chrome grava a tela de erro; o script
  sai 0 do mesmo jeito. Abra a imagem.
- **Screenshot antes da animação**: `--virtual-time-budget` curto captura o
  estado inicial do reveal; parece "conteúdo faltando" ou, pior, parece certo
  porque a seção nem animou.
- **`scripts/check_ids.js`** contra porta sem servidor só faz `console.error` e
  sai 0.
- **Item do QA-CHECKLIST marcado `[x]`** sem evidência, ou evidência de outro
  commit.
- **"Build verde"** de um build anterior à última edição.
- **Reduced motion "validado"** só lendo o código — o hook retorna `false` no
  primeiro render (SSR), então há um frame em que a animação pode ter armado.

## Conteúdo nunca depende de animação

- Elemento com `opacity-0`, `invisible`, `translate` inicial ou `style` de
  estado inicial **no markup do servidor**: sem JS, ele nunca aparece.
- `gsap.from(...)` / `fromTo` sem `immediateRender: false` em elemento com
  ScrollTrigger: aplica o estado inicial na montagem e o conteúdo some até o
  trigger (o "bug do 1º card" de `AboutClient.tsx`).
- `ScrollText` iniciando com cor que torna o texto ilegível (o padrão é
  `rgba(255,255,255,0.22)` — mais baixo que isso reprova contraste).
- Caminho de reduced motion que retorna cedo **depois** de já ter aplicado
  `gsap.set` de estado inicial.

## GSAP e ScrollTrigger

- Animação fora de `gsap.context(…, ref)` ou sem `ctx.revert()` no cleanup →
  ScrollTrigger duplicado no hot reload / Strict Mode (o `reactStrictMode` está
  ligado: o effect roda duas vezes em dev).
- Seletor sem escopo (`document.querySelector`, `gsap.utils.toArray(".x")`
  fora do contexto) que pega elementos de outra seção.
- Timeline compartilhada entre seções.
- `pin` sem justificativa; qualquer coisa que bloqueie ou sequestre o scroll
  (`overflow: hidden` no body, `preventDefault` em wheel/touch).
- Animação não reversível: `toggleActions` que não reverte, `once: true`,
  `onEnter` sem `onLeaveBack` — subindo a página o estado fica errado.
- Propriedade animada que causa layout (`width`, `height`, `top`, `margin`,
  `backgroundPosition` em excesso) em vez de `transform`/`opacity`/`color`.
- Valor que depende de dimensão sem `invalidateOnRefresh: true`; variante por
  breakpoint sem `gsap.matchMedia()` (resize quebra).
- Plugin novo usado sem `registerPlugin` (Flip, por exemplo).

## Next.js, SSR e hidratação

- `"use client"` em `page.tsx`, `layout.tsx` ou numa seção inteira que só
  precisava de um wrapper (o `Projects/index.tsx` já é client por causa do
  filtro — não é precedente para o resto).
- `window`, `document`, `matchMedia`, `localStorage` no corpo do componente
  (fora de `useEffect`) → quebra no build ou mismatch de hidratação.
- Render que difere entre servidor e cliente (`Date.now()`, `Math.random()`,
  leitura de viewport no render).
- `<img>` cru no lugar de `next/image`; `next/image` sem `width`/`height` nem
  container com proporção → layout shift.
- Metadado alterado em `layout.tsx` sem motivo (title, OG, canonical, favicon).

## Layout, Tailwind e responsividade

- Breakpoint presumido como o padrão do Tailwind — aqui `sm`=480, `md`=768,
  `lg`=1024, `xl`=1200.
- Hex literal novo em `className`/`style` em vez de token (`primary`,
  `secondary`, `accent-span`, `whatsapp`). Os existentes em `Navbar.tsx` e
  `FooterClient.tsx` não são precedente.
- `!important`, estilo global que vaza entre seções.
- Overflow horizontal em 375px (largura fixa, `w-screen` com padding, texto
  sem quebra).
- Efeito que só existe no hover (mobile não tem hover).
- Âncora de seção (`id`) divergente de `SITE_CONFIG.navLinks`; a Navbar fixa
  cobrindo o topo da seção ao navegar por âncora.

## Acessibilidade

- `ScrollText` ou outra segmentação de texto que faz o leitor de tela anunciar
  palavra por palavra, ou duplica o texto (`sr-only` + spans visíveis lidos).
- `aria-hidden` no único conteúdo textual.
- Controle só-ícone sem `aria-label`; foco invisível; ordem de tab quebrada.
- Hierarquia de headings: mais de um `h1`, nível pulado.
- Link externo sem `target="_blank" rel="noopener noreferrer"`.

## Código

- Identificador em português — componente, função, variável, constante,
  `data-*`, chave de objeto que não é conteúdo. Comentário e texto de tela em
  pt-BR **não** são achado.
- Conteúdo hardcoded na seção que deveria estar em `src/data/*` ou
  `SITE_CONFIG`.
- `any`, `as` escondendo erro, `@ts-expect-error`, `console.log`, código morto.
- Lista sem `key`, ou `key` pelo índice em lista que o filtro reordena (Flip).
- Abstração criada sem segundo uso real.

## Documentação e processo

- Status divergente entre story e `TASKS.md`.
- `PEND-xx` consumido e não marcado `RESOLVED`; decisão de negócio tomada sem
  `PEND`.
- Padrão técnico mudado sem atualizar `TECHNICAL-SPEC.md` / `ARCHITECTURE.md` /
  `CLAUDE.md`.
- Afirmação de validação sem comando e SHA no Change Log.
- Script de captura com caminho absoluto/porta nova sem estar descrito na
  story.
