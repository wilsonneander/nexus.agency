# Technical Specification — Especificação técnica

## 1. Stack alvo (Versões efetivas instaladas na Fase 1)

- Next.js: `15.5.28` (App Router)
- React: `19.3.1`
- React DOM: `19.3.1`
- TypeScript: `5.9.3`
- Tailwind CSS: `3.4.19` (com PostCSS `8.5.32` e Autoprefixer `10.6.2`)
- GSAP: `3.12.7` (com ScrollTrigger e Flip)
- `@gsap/react`: `2.1.2` (totalmente compatível com React 19)
- SEO & Metadata: Next.js Metadata API com OpenGraph, Twitter, canonical, `robots.ts` e `sitemap.ts`.
- Lenis: Avaliado e descartado para a versão inicial (mantido `scroll-behavior: smooth` nativo).

Registradas no `package.json` e `package-lock.json` com sucesso na Fase 1. Build inicial compilado sem erros.

## 2. Regras de implementação

### Next.js / React
- Usar Server Components por padrão.
- Marcar como `"use client"` apenas componentes que precisam de APIs do browser, estado, eventos ou GSAP.
- Nunca acessar `window`, `document` ou `matchMedia` durante renderização no servidor.
- Evitar transformar `app/page.tsx` ou `app/layout.tsx` em Client Component sem justificativa.
- Manter metadados e conteúdo estrutural no servidor sempre que possível.
- Garantir que componentes animados tenham fallback visível sem JavaScript.
- **Fallback sem JS (padrão, story [4.4](stories/4-4-conteudo-sem-javascript.md)):** quando o estado inicial de uma animação precisa estar no HTML do servidor (para não piscar na hidratação) e esse estado é ilegível, o estado final sem JS vem de um único `<noscript><style>` no `<head>` de [layout.tsx](../src/app/layout.tsx), que seleciona o elemento por atributo `data-*`. Ele só vale com JS desligado, então não altera nada com JS. `!important` só onde a regra disputa com `style=""` inline. Hoje cobre `[data-word]` do `ScrollText`. Renderizado com `dangerouslySetInnerHTML` no `<noscript>`, para o React não escapar o CSS. Evidência: [scripts/capture_nojs.js](../scripts/capture_nojs.js).

### GSAP
- Registrar plugins uma única vez em módulo client-side apropriado.
- Usar `useGSAP`/context para escopo e limpeza.
- Usar seletores escopados ao componente, preferencialmente refs.
- Não criar animações globais que capturem elementos de outras seções.
- Limpar ScrollTriggers, timelines e listeners no unmount.
- Evitar `ScrollTrigger` duplicado após navegação ou hot reload.
- Usar `gsap.matchMedia()` para variantes responsivas.
- Usar `invalidateOnRefresh: true` quando valores dependerem de dimensões.
- Usar `gsap.utils.toArray()` somente dentro do escopo correto.
- Preferir `scrub` para animações que devem acompanhar e reverter com o scroll.
- Evitar `pin` salvo necessidade narrativa demonstrada.
- **Reduced motion (story [4.3](stories/4-3-reduced-motion.md)):**
  - Todo efeito de animação começa com `if (reduced || prefersReducedMotion()) return;`. `useReducedMotion()` começa em `false` (o servidor não conhece a preferência), então só o leitor síncrono `prefersReducedMotion()`, de [useReducedMotion.ts](../src/hooks/useReducedMotion.ts), impede a 1ª passada animada. Não use esse leitor no render (quebra a hidratação).
  - A limpeza devolve **tudo** ao estado do servidor. Todo `gsap.set` fica dentro do `gsap.context()`, e a limpeza é `ctx.revert()`, nunca `kill()`, que deixa valores inline no meio do caminho. O que o GSAP não reverte (ex.: `textContent` escrito num `onUpdate`) é guardado e restaurado à mão.
  - Estado inicial gravado no servidor, como os 22% do `ScrollText`, ganha fallback por CSS em `@media (prefers-reduced-motion: reduce)` no [globals.css](../src/app/globals.css), além do `<noscript>` da 4.4.

### Leitura progressiva
- Criar componente ou utilitário reutilizável, por exemplo `ScrollText`.
- Segmentar texto sem destruir a semântica: manter um elemento textual acessível e evitar que leitores de tela anunciem cada palavra como fragmento isolado.
- Não aplicar `aria-hidden` ao único conteúdo textual.
- Não inserir spans de forma que quebrem links, pontuação, espaços ou seleção de texto.
- A animação deve usar uma propriedade visual compatível com o design (cor, opacidade ou ambas).
- Definir progresso de cada palavra por cálculo determinístico e reversível.
- Testar textos curtos, longos, multilinha, acentos e pontuação.
- Garantir fallback legível com reduced motion e sem JS. Sem JS: ver o padrão de fallback em [§ Next.js / React](#nextjs--react).

### Tailwind / CSS
- Tokens globais reais extraídos do projeto Nexus Agency:
  - Cores de background: `--secondary-color: #04091d`, `--secondary-color-light: #0f1221`, `--secondary-color-dark: #03060f`.
  - Cores de destaque: `--primary-color: #ffffff`, `--primary-color-dark: #a15cf5` (roxo principal), `--span: #ad7dff` (lavanda/lilás claro), `--gradient: linear-gradient(to right, #a15cf5, #ffffff)`.
  - Cores funcionais: WhatsApp `#218e49`.
  - Tipografia: Fonte `Poppins` (Google Fonts) nos pesos 400, 500, 600 e 700.
  - Breakpoints: 480px (mobile largo/phablet), 768px (tablet/desktop médio), 1024px (desktop) e max-width 1200px. As telas do [tailwind.config.ts](../tailwind.config.ts) são `min-width` (incluem o valor) e o legado vira **acima** dele (`@media (width > 480px)`). As grades do rebuild foram montadas sobre as telas atuais e não correspondem uma a uma às do legado, então as telas **não mudam**: onde a classe corresponde ao legado (menu horizontal/hambúrguer, ícones sociais fixos, grade dos Banners), o ponto exato usa `min-[481px]:`/`min-[769px]:` (story [4.1](stories/4-1-comportamento-por-breakpoint.md), `PEND-16`). Trocar as telas globalmente foi medido e descartado: piorava Projetos/Serviços em 1024 e Serviços/Pacotes/rodapé em 768.
  - Efeito que muda por faixa usa `gsap.matchMedia()` com as consultas de `MOTION_MEDIA` em [presets.ts](../src/animations/presets.ts) (`desktop` = `min-width: 769px`, o ponto do menu; `finePointer` para hover só com mouse), depois da guarda síncrona de reduced motion da 4.3. Matriz por faixa na [story 4.1](stories/4-1-comportamento-por-breakpoint.md#escopo).
  - **Entrada dos blocos das seções** (cards, parágrafos, campos, colunas do rodapé): `scrubReveal` de [scrubReveal.ts](../src/animations/scrubReveal.ts), um ScrollTrigger por elemento com `scrub`, do topo do alvo a 92% da tela até 68% (`MOTION_PRESETS.scrubReveal`), dentro de `gsap.matchMedia()` com `REVEAL_MEDIA` (`y` de 24px até 768px, o de cada seção acima). Story [4.2](stories/4-2-distancias-intensidades-por-breakpoint.md). Regras: sem trigger de grupo nem `stagger` (com a grade em 1 coluna o grupo animava fora da tela); posições calculadas pelo `offsetTop` do alvo, nunca pelo `getBoundingClientRect` do elemento que se move (a medida incluía o `y` inicial e o resize atrasava a entrada); fim limitado ao fim da página, início não; ícone dentro do card entra na timeline do card (`popInside`); onde outro efeito já move o elemento (Flip dos Projetos), o scrub vai num filho (`data-project-reveal`) e os triggers são refeitos com `ScrollTrigger.refresh()` ao fim do Flip.
- Tailwind para layout e estilo utilitário cotidiano.
- CSS Modules ou CSS escopado para animações complexas que demandem especificidade idêntica ao original (como a rotação 3D dos ícones sociais e o pulso contínuo do WhatsApp).
- Não criar estilos globais que vazem entre componentes.
- Evitar `!important` como solução estrutural.
- Não converter todos os estilos para classes arbitrariamente: preservar fidelidade e legibilidade do código.

### Botões Sociais e Animação 3D (Restrição Inegociável FR-07)
- Devem manter 100% da estrutura, ícones, classes e animações:
  - Hover com preenchimento escalonado de baixo para cima (`transform-origin: bottom; scale: 1 1`).
  - Cores de hover exclusivas por marca: Instagram (gradiente amarelo/rosa/roxo `#f9ce34, #ee2a7b, #6228d7`), LinkedIn (`#0077b5`), Facebook (`#03217c`).
  - Rotação 3D do ícone no eixo Y: `transform: rotateY(360deg)` com duração de 0.5s ease.
- Aplicar exatamente os mesmos seletores e regras nos 3 locais identificados: Header (`.ul-icons`), Sobre nós (`.about__btns .ul-icons`) e Rodapé (`.ul-icons-3`).

### WhatsApp Oficial (Restrição Inegociável FR-06)
- Destino oficial: `https://wa.me/556192985392` — `+55 (61) 9298-5392`, número do cliente (`PEND-07` RESOLVED; o legado usava `5561995395969`). Fonte única: `SITE_CONFIG.whatsapp` em `src/lib/constants.ts`.
- Presente em dois pontos de conversão:
  - Botão "Contato" no menu de navegação.
  - Botão flutuante inferior direito (`.whatsapp-link`) com ícone, label "Quero saber mais!" e animação contínua `@keyframes WaveWhatsApp`.
- O código com DDD 81 encontrado no arquivo legado `main.js` não deve ser utilizado.

### Funcionalidades pendentes de decisão
- Formulário de contato (`PEND-10`), links placeholder `href="#"` (`PEND-02`), inconsistências textuais (`PEND-03`, RESOLVED): status e opções na tabela PEND-xx do [TASKS.md](TASKS.md#pendências-de-decisão-registradas-para-alinhamento-com-responsável); comparação técnica das opções do formulário em [AUDIT.md § 12.2](AUDIT.md).
- Regra técnica enquanto abertas: placeholders não podem gerar navegação quebrada nem rota inexistente, e o conteúdo original é mantido até aprovação formal.

### Lenis (opcional)
- Não habilitar por padrão.
- Se adotado, integrar o evento de scroll com `ScrollTrigger.update` e o ticker do GSAP de acordo com a documentação da versão instalada.
- Respeitar `prefers-reduced-motion`.
- Testar âncoras, histórico, touch, trackpad, teclado e mobile.
- Não usar Lenis para mascarar problemas de layout ou de configuração do ScrollTrigger.

## 3. Performance
- Priorizar `transform` e `opacity`.
- Evitar animar `width`, `height`, `top`, `left` e propriedades que provoquem layout repetidamente.
- Não usar `will-change` permanentemente em muitos elementos.
- Não manter `requestAnimationFrame` ou ticker próprio se GSAP já controla a animação.
- Limitar quantidade de elementos animados simultaneamente.
- Usar `next/image` com dimensões definidas. O site é export estático (`output: "export"`, `images.unoptimized`, story [8.2](stories/8-2-deploy-estatico-cloudflare-pages.md)): não há otimizador, então imagem nova entra **já otimizada** em `public/assets/` (WebP, ~2× a maior largura exibida, ≤ 150 KB), convertida uma vez fora do `package.json`.
- Nada que exija servidor: rota dinâmica, API route, `headers()`/`cookies()`, ISR ou otimizador de imagem quebram o `next build`. Rotas de metadados (`robots.ts`, `sitemap.ts`) levam `export const dynamic = "force-static"`.
- Cache e cabeçalhos de segurança do Cloudflare Pages em [public/_headers](../public/_headers): `/_next/static/*` com `immutable` (nome com hash); `/assets/*` com 1 dia + `stale-while-revalidate` (nome sem hash).
- Definir dimensões de mídia para reduzir CLS.
- Lazy-load mídia abaixo da dobra.
- Evitar carregar bibliotecas de animação no bundle inicial quando não forem necessárias.
- Medir antes de otimizar prematuramente.

## 4. Responsividade
- Definir comportamento por `matchMedia` ou CSS responsivo.
- Não duplicar DOM inteiro para desktop/mobile sem motivo.
- Em mobile, reduzir distância, intensidade e complexidade; preservar a intenção do efeito.
- Garantir que conteúdo não dependa de hover.
- Evitar pinning prolongado em telas pequenas.

## 5. Acessibilidade
- Respeitar `prefers-reduced-motion: reduce`.
- Garantir que elementos não iniciem ocultos de modo que fiquem invisíveis se JS falhar.
- Garantir foco visível e ordem de tabulação lógica.
- Preservar semântica de headings, links e botões.
- Não usar botão como link ou link como botão sem razão.
- Garantir contraste do texto em todos os estados animados.
- Evitar flashes e movimentos bruscos.

## 6. SEO e metadados
- Preservar títulos, descrições, canonical e metadados encontrados no projeto, quando existentes.
- Usar um único H1 principal por página quando semanticamente adequado.
- Preservar texto no HTML renderizado.
- Definir Open Graph e favicon com os assets corretos.
- Não inventar informações estruturadas ou dados comerciais.

## 7. Qualidade de código
- TypeScript com tipos explícitos para dados e props relevantes.
- Componentes pequenos e coesos; evitar fragmentação excessiva.
- Separar dados de apresentação quando isso melhorar manutenção.
- Evitar `any`; justificar exceções.
- Não criar abstrações sem caso de uso real.
- Lint e build devem passar.
- Documentar decisões não óbvias.

## 8. Estratégia de teste
- Testes manuais visuais por viewport.
- Verificação de links e destinos.
- Testes de scroll para baixo e para cima.
- Reduced motion.
- Console e erros de hidratação.
- Build de produção.
- Se o projeto já possuir testes automatizados, preservar e ampliar o conjunto existente.
