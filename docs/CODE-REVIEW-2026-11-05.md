# Revisão de código — 2026-11-05

Análise de `src/`, configs e scripts, comparando com o legado, com foco em **leveza, SEO e deploy no Cloudflare Pages**. O `npm run build` não foi executado (sem `node_modules` no momento da revisão), então o peso de JS é inferido do código, não medido.

Cada achado virou tarefa no [TASKS.md](TASKS.md), com story em [stories/](stories/README.md); o que depende de decisão do responsável virou `PEND-xx`:

| Achados | Tarefa |
|---|---|
| 1.3 (domínio) | [8.1](stories/8-1-dominio-oficial.md) — aplicada |
| 1.1, 1.2, `_gotcha` do formulário | [8.2](stories/8-2-deploy-estatico-cloudflare-pages.md) (`PEND-06` resolvido: Cloudflare Pages) |
| 1.4 | [8.3](stories/8-3-icones-svg.md) — bloqueada no `PEND-18` |
| 1.5–1.7 | [8.4](stories/8-4-metadados-dados-estruturados.md) (título, descrição e imagem OG no `PEND-19`) |
| 2.1–2.5, títulos e alt do § 3 | [4.5](stories/4-5-teclado-foco-semantica.md) |
| 2.6, § 4 | [8.5](stories/8-5-simplificar-motion-estilos.md) |
| 2.7, código morto e scripts do § 3 | [6.9](stories/6-9-remover-codigo-nao-usado.md) |
| 2.8 | 4.6 (sem story) |
| § 4 item 3 (entrada do Hero) | [4.8](stories/4-8-piscar-hero-hidratacao.md) |
| Ortografia, destino do "Contato", obrigatoriedade do rádio | `PEND-19` |

## 1. Críticos — Cloudflare Pages e SEO

### 1.1 O projeto não está pronto para o Pages
[next.config.ts](../next.config.ts) não tem `output: "export"` e usa o otimizador do `next/image`, que exige servidor Node.

- O site é 100% estático (formulário via Formspree, `robots`/`sitemap` sem dados dinâmicos). Caminho mais leve: `output: "export"` + `images.unoptimized: true`, deploy da pasta `out/`.
- Consequência: com `unoptimized`, os PNGs dos projetos vão crus — `hotel.png` 1,1 MB, `wdm.png` 840 KB, `wine.png` 710 KB, `woocommerce.png` 700 KB — para cards exibidos com ~500px. Convertidos para WebP/AVIF em ~1000px ficam em ~60–100 KB cada (**~3,5 MB a menos**).
- Isso decide o `PEND-06` (hoje `PENDING_DECISION` no [TASKS.md](TASKS.md)).

### 1.2 Falta `public/_headers`
O Pages serve tudo com `max-age=0, must-revalidate` por padrão. Precisa de:

- `Cache-Control: public, max-age=31536000, immutable` para `/_next/static/*`;
- `X-Content-Type-Options`, `Referrer-Policy` e, idealmente, CSP.

### 1.3 Domínio inconsistente — RESOLVIDO em 2026-11-05
`SITE_CONFIG.url` em [constants.ts](../src/lib/constants.ts) era `nexusagency.com.br`, mas o e-mail é `contato@nexusagencybr.com.br` e o Instagram é `@nexusagencybr`; canonical, OpenGraph, sitemap e robots apontavam para o domínio errado. Além disso, [robots.ts](../src/app/robots.ts) e [sitemap.ts](../src/app/sitemap.ts) repetiam a URL em vez de ler `SITE_CONFIG.url`.

**Decisão do responsável (2026-11-05):** o domínio oficial é `nexusagencybr.com.br`. `SITE_CONFIG.url` passou a `https://nexusagencybr.com.br`, e `robots.ts`/`sitemap.ts` agora leem dele (fonte única).

### 1.4 Três CSS de ícones bloqueando a renderização
[layout.tsx](../src/app/layout.tsx) carrega de CDNs de terceiros o FontAwesome 6 completo, o FontAwesome **4.5 inteiro só para `fa fa-whatsapp`** (que existe no FA6 como `fa-brands fa-whatsapp`) e o RemixIcon. São centenas de KB entre CSS e fontes, mais três conexões extras, para cerca de 20 ícones. SVG inline elimina tudo — é o maior ganho de FCP/LCP disponível. Os botões sociais são protegidos (FR-07); o glifo SVG é o mesmo desenho, mas a troca precisa de OK do responsável.

### 1.5 Imagem de OpenGraph errada
[layout.tsx](../src/app/layout.tsx) declara `header.webp` como 1200×630; o arquivo tem 1792×1024. WebP não é aceito em todo lugar (LinkedIn tem histórico de falhar). Ideal: JPG/PNG próprio de 1200×630.

### 1.6 Título e descrição fracos
O título é `"Nexus | Agency"`, sem termo de busca. A descrição tem ~190 caracteres e é cortada na SERP (limite ~155–160). Alterar o texto depende do cliente (regra de não inventar conteúdo).

### 1.7 Sem dados estruturados
Falta JSON-LD `Organization`/`ProfessionalService`. Dá para montar só com dados já aprovados: nome, logo, `sameAs` (3 redes), e-mail, WhatsApp, `areaServed` Brasil.

## 2. Bugs

| # | Onde | Problema |
|---|---|---|
| 2.1 | [globals.css](../src/app/globals.css) (`.fluid-btn`) | `outline: none` e o `:focus-visible` usa `ring:`/`ring-offset:` — nomes do Tailwind que **não existem em CSS**. Nenhum CTA tem foco visível pelo teclado. |
| 2.2 | [Contact/index.tsx](../src/sections/Contact/index.tsx) | Grupo "O que você precisa?" sem `<fieldset>`/`<legend>` (a pergunta não se associa aos rádios); faltam `autoComplete` em `name` e `company` (o WhatsApp ganhou `inputMode`/`autoComplete` no commit `3a87d86`, depois desta revisão); os outros 3 campos são `required` e esse grupo não; sem campo isca anti-spam do Formspree (`_gotcha`). |
| 2.3 | [Projects/index.tsx](../src/sections/Projects/index.tsx) | `role="tablist"`/`"tab"` sem `tabpanel` e sem navegação por setas é ARIA incorreto. Para filtro, o certo é `<button aria-pressed>`. |
| 2.4 | [RollingText.tsx](../src/components/ui/RollingText.tsx) | O nome acessível depende de `aria-label` num `<span>` genérico (proibido no ARIA 1.2) com as duas cópias `aria-hidden`; alguns leitores de tela leem links vazios. Mais simples: 1ª cópia sem `aria-hidden`, só o clone escondido. |
| 2.5 | [Navbar.tsx](../src/components/layout/Navbar.tsx) | Menu mobile sem `aria-expanded`/`aria-controls` e sem fechar com Esc. |
| 2.6 | [globals.css](../src/app/globals.css) (`.whatsapp-link`) | `transition: transform 0.4s` no mesmo nó em que o GSAP anima `scale`: cada frame do GSAP ganha transição de 0,4s, deixando a mola mole e com tranco. |
| 2.7 | Fonte | `font-light` (300) aparece em 22 lugares, mas o Poppins só carrega 400–700 (igual ao legado); tudo renderiza em 400. São classes mortas que enganam quem lê. |
| 2.8 | [ScrollText.tsx](../src/components/motion/ScrollText.tsx) | Texto começa em 22% de branco; o Lighthouse reprova contraste no Hero, About e títulos de Serviços, derrubando a nota de acessibilidade do PageSpeed. |

## 3. Inconsistências

- **Código morto** (nada importa):
  - [MissionVisionValues.tsx](../src/sections/About/MissionVisionValues.tsx) — 200 linhas, acordeão não renderizado;
  - `SocialAboutIcons` em [SocialIcons.tsx](../src/components/ui/SocialIcons.tsx) — cópia literal de `SocialIcons variant="footer"`;
  - [Button.tsx](../src/components/ui/Button.tsx) e o barrel [ui/index.ts](../src/components/ui/index.ts);
  - [ScrollReveal.tsx](../src/components/motion/ScrollReveal.tsx) e [ParallaxImage.tsx](../src/components/motion/ParallaxImage.tsx) (o About ainda importa `ParallaxImage` e `SocialIcons` sem usar);
  - `initGSAP` em [gsap.client.ts](../src/animations/gsap.client.ts); `duration`/`ease`/`stagger`/`scrollTriggerDefaults` em [presets.ts](../src/animations/presets.ts);
  - tipos `NavItem` e `SocialLink`; campos `title`, `categoryLabel` e `metric.value`;
  - dependência `@gsap/react`, nunca usada.
- **Assets não usados** em `public/assets`: `grafic.png`, `icon.png`, `project-1…6.jpg` (~400 KB no deploy).
- **Métrica "+50" com duas fontes**: fixa no JSX e no contador (`val: 50`) de [About](../src/sections/About/index.tsx), enquanto `ABOUT_DATA.metric.value` fica sem uso.
- **Alt dos projetos** (`"project wine"`) em inglês e sem descrever nada, com `title` e `categoryLabel` disponíveis em [projects.ts](../src/data/projects.ts).
- **Chaves dos filtros** `.web` = "Fast Food", `.game` = "Tecnologia" — herança do legado que só confunde.
- **Hierarquia de títulos**: Hero abre com `<h4>` antes do `<h1>`; Banners usam `<h4>` sem `h2`/`h3` acima; rodapé também usa `<h4>`. Trocar por `<p>`/`<h3>` não muda nada visualmente.
- **"Contato"** leva ao WhatsApp no menu e a `#contact` no rodapé (o legado fazia igual) — confirmar se é intencional.
- **Texto**: "Inicio" (sem acento), "Politica e privacidade" (→ "Política de privacidade"), "sua performer de presença digital" (legado). Link de privacidade em `href="#"` é link morto até o `PEND-12`.
- **Hex solto**: mais de 60 ocorrências de `#a15cf5`, `#04091d`, `#0f1221`, `#ad7dff`, `#03060f`, contra a regra do [CLAUDE.md](../CLAUDE.md), com os tokens `primary-dark`, `secondary` e `accent-span` já disponíveis.
- [HeroClient.tsx](../src/sections/Hero/HeroClient.tsx): prop `sectionRef` declarada e nunca usada; comentário "B1 callback ref" desatualizado. `sectionRef` também sem uso em [Projects](../src/sections/Projects/index.tsx).
- [tailwind.config.ts](../tailwind.config.ts) varre `src/pages`, que não existe. `.claude/settings.json` traz plugin do Nx e Google Analytics no sandbox, sem relação com o projeto.
- [scripts/](../scripts/) tem caminhos fixos do Windows (`C:\Users\wilso\...`) e não roda em outra máquina; vários são capturas pontuais que, pelo [CLAUDE.md](../CLAUDE.md), não deveriam estar no repositório.

## 4. Simplificação

1. **`gsap.matchMedia` no lugar de `useReducedMotion` + `prefersReducedMotion()`**: aceita `(prefers-reduced-motion: no-preference)` como condição e desfaz tudo sozinho quando a preferência muda. Elimina o hook, o leitor síncrono, as dependências `[reduced]` e ~10 listeners de `matchMedia` — e a armadilha da story 4.3.
2. **Um reveal só no lugar de 5 wrappers**: `AboutClient`, `BannersClient`, `ServicesClient`, `FooterClient` e o efeito do `Contact` repetem o mesmo padrão. Um `<RevealRoot>` no layout que lê `[data-reveal]` + `data-reveal-y` substitui todos; as seções voltam a ser Server Components puros.
3. **Entrada do Hero em CSS** (keyframes no HTML do servidor + `@media (prefers-reduced-motion)`) no lugar do `gsap.set` no `useEffect`: resolve o piscar da hidratação (tarefa 4.8) sem JS.
4. **Cor inicial do `ScrollText` em classe CSS**, não inline (hoje ~75 `style="color:…;display:inline"` só no Hero): o `<noscript>` e a regra de reduced motion deixam de precisar de `!important` e o HTML encolhe.
5. **Helper único de classes para `FluidButton`/`FluidLink`** (hoje triplicado); para âncoras `#`, `<a>` simples basta, sem `next/link`.
6. **Derivar `formspree.endpoint` do `formId`** em vez de duplicar.
7. **Limpar o [globals.css](../src/app/globals.css)**: `font-family` e `background` repetem o Tailwind/`<body>`; `--gradient`, `--max-width` e `--text-light` não são usados; seletores globais genéricos `.icon` e `.fa-whatsapp` vazam para qualquer elemento.
8. **Custo do vidro no celular**: ~27 elementos com `backdrop-filter: blur(14px)`, todos com opacidade/transform ligados ao scroll, mais 6 camadas `will-change` em loop infinito no Hero. Medir em Android de entrada; se pesar, cortar o blur abaixo de 768px ou pausar o brilho fora da tela.

## 5. Ordem sugerida

1. ~~Confirmar o domínio (1.3)~~ — feito em 2026-11-05.
2. Export estático + imagens otimizadas + `_headers` (1.1, 1.2) — fecha o `PEND-06`.
3. Ícones em SVG (1.4).
4. Foco visível nos CTAs e acessibilidade do formulário (2.1, 2.2).
5. Metadados, OG e JSON-LD (1.5–1.7).
6. Remover código morto (tarefa 6.9).
7. Refactors de simplificação (§4).
