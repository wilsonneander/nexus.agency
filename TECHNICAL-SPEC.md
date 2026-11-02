# Technical Specification — Especificação técnica

## 1. Stack alvo

- Next.js com App Router.
- React.
- TypeScript.
- Tailwind CSS.
- GSAP com ScrollTrigger.
- `@gsap/react` para integração de ciclo de vida, quando compatível.
- Lenis é opcional; só adotar se testes demonstrarem benefício real e integração estável.

Instalar versões estáveis e compatíveis no momento do setup. Registrar versões efetivas no `package.json` e lockfile. Não inventar números de versão neste documento.

## 2. Regras de implementação

### Next.js / React
- Usar Server Components por padrão.
- Marcar como `"use client"` apenas componentes que precisam de APIs do browser, estado, eventos ou GSAP.
- Nunca acessar `window`, `document` ou `matchMedia` durante renderização no servidor.
- Evitar transformar `app/page.tsx` ou `app/layout.tsx` em Client Component sem justificativa.
- Manter metadados e conteúdo estrutural no servidor sempre que possível.
- Garantir que componentes animados tenham fallback visível sem JavaScript.

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

### Leitura progressiva
- Criar componente ou utilitário reutilizável, por exemplo `ScrollText`.
- Segmentar texto sem destruir a semântica: manter um elemento textual acessível e evitar que leitores de tela anunciem cada palavra como fragmento isolado.
- Não aplicar `aria-hidden` ao único conteúdo textual.
- Não inserir spans de forma que quebrem links, pontuação, espaços ou seleção de texto.
- A animação deve usar uma propriedade visual compatível com o design (cor, opacidade ou ambas).
- Definir progresso de cada palavra por cálculo determinístico e reversível.
- Testar textos curtos, longos, multilinha, acentos e pontuação.
- Garantir fallback legível com reduced motion e sem JS.

### Tailwind / CSS
- Tokens globais para cores, tipografia, espaçamento, raios, sombras e breakpoints quando necessário.
- Tailwind para layout e estilo cotidiano.
- CSS Modules ou CSS global bem delimitado para efeitos complexos que não sejam adequados a classes utilitárias.
- Não criar estilos globais que vazem entre componentes.
- Evitar `!important` como solução estrutural.
- Não converter todos os estilos para classes arbitrariamente: preservar fidelidade e legibilidade do código.

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
- Usar `next/image` quando apropriado e configurar dimensões/`sizes`.
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
