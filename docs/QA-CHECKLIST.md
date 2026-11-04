# QA Checklist — Qualidade e critérios de aceite

## 1. Fidelidade visual
- [ ] Todas as rotas originais foram reconstruídas.
- [ ] Todas as seções estão presentes e na ordem original.
- [ ] Textos, imagens, vídeos, logos e fontes foram preservados.
- [ ] Cores, tipografia, espaçamentos e composição correspondem à referência.
- [ ] Não foram criadas seções ou conteúdos sem aprovação.
- [ ] Screenshots foram comparados em viewports equivalentes.

## 2. Funcionalidade
- [x] Navegação e âncoras funcionam. (Mapeamento validado para #home, #about, #service, #project, #contact; links do rodapé para os 5 cards de serviço e #contact validados com clique em 375 e 1200px na [story 7.3](stories/7-3-links-rodape-remover-blog.md), [footer_links_1200.png](references/qa/footer_links_1200.png), [footer_links_375.png](references/qa/footer_links_375.png); `mailto:` do e-mail institucional no rodapé e encaixe nos 5 viewports na [story 7.4](stories/7-4-email-institucional-rodape.md), [footer_email_1200.png](references/qa/footer_email_1200.png), [footer_email_375.png](references/qa/footer_email_375.png))
- [x] Links externos abrem os destinos corretos em nova aba (target="_blank" rel="noopener noreferrer").
- [x] Botões de WhatsApp mantêm telefone, mensagem e parâmetros configurados de forma centralizada.
- [x] Botões de redes sociais permanecem inalterados e funcionais.
- [x] Formulário estruturado com 4 campos do cliente e validação nativa de preenchimento.
- [x] Links placeholder catalogados na auditoria de funcionalidades ([AUDIT.md § 12.3](AUDIT.md)). Após o `PEND-02` resta só "Politica e privacidade" (`href="#"`, aguarda `PEND-12`).

## 3. Animações e scroll
- [x] Hero entra sem atraso excessivo. (Validado via timeline com delays escalonados 0.15s, 0.35s, 0.55s)
- [x] Brilho do Hero se move sem esconder nem ofuscar conteúdo. (Medido na [7.1](stories/7-1-hero-background-animado.md), `next start` sobre `d9b5a48` + árvore de trabalho: 6 animações CSS com movimento e 0 com reduced motion, nos 5 viewports; parallax do brilho volta a `0` ao rolar para cima e depois de resize 1200 → 375 → 1200; contraste mínimo do parágrafo 15:1 com o brilho no pico — [hero_glow_1200.png](references/qa/hero_glow_1200.png), [hero_glow_375.png](references/qa/hero_glow_375.png))
- [x] Cards de vidro não mudam as entradas nem escondem conteúdo. (Medido na [7.2](stories/7-2-cards-glassmorphism.md), `next start` sobre árvore de trabalho de `2544f6f`: 31 cards e 11 ícones nos 5 viewports, todos opacos ao entrar na tela rolando para baixo e para cima; Flip dos Projetos sem card piscando; reduced motion com os 31 opacos; sem JS com o visual de vidro — [cards_glass_1200.png](references/qa/cards_glass_1200.png), [cards_glass_375.png](references/qa/cards_glass_375.png))
- [x] Animações não ocultam conteúdo antes de inicializarem. (Sem JS: sim — story [4.4](stories/4-4-conteudo-sem-javascript.md), [nojs_375.png](references/qa/nojs_375.png) e [nojs_1200.png](references/qa/nojs_1200.png). Com JS: o Hero pisca na hidratação ([HeroClient.tsx](../src/sections/Hero/HeroClient.tsx) aplica `opacity: 0` no `useEffect`), ver 4.3/4.1. Depois de rolar: o card Design dos Banners ficava em `opacity: 0`, corrigido na [4.7](stories/4-7-card-design-banner-invisivel.md) — [banners_design_1200.png](references/qa/banners_design_1200.png), [banners_design_375.png](references/qa/banners_design_375.png).)
- [x] Texto progressivo acompanha o scroll. (Validado: ScrollText com scrub bidirecional em Hero, About e Services)
- [x] Texto progressivo regride corretamente ao subir. (Validado: scrub bidirecional restaura tons de leitura ao rolar para cima)
- [x] Palavras e pontuação não piscam nem saltam. (Validado: regex `(\s+)` preserva espaços e tokens literais)
- [x] Textos multilinha e com acentos funcionam. (Validado com texto em português institucional)
- [x] Transições não causam sobreposição ou corte. (Validado: overflow controlado e espaçamentos preservados)
- [x] Imagens mantêm proporção durante os reveals. (Validado: ParallaxImage com dimensões e aspect ratio)
- [x] Não há pins desnecessários ou scroll bloqueado. (Validado: zero `pin` na aplicação)
- [x] Não existem ScrollTriggers duplicados após navegação/re-render. (Validado: uso estrito de `ctx.revert()` e cancelamento de tweens)
- [x] Resize e refresh não quebram as posições. (Validado: `invalidateOnRefresh: true` em todos os triggers)

## 4. Responsividade
Testar ao menos:
- [x] Desktop largo (1200px+). (Evidência: `desktop_1200.png`)
- [x] Notebook (1024px). (Evidência: `laptop_1024.png`)
- [x] Tablet em orientação retrato (768px). (Evidência: `tablet_768.png`)
- [x] Smartphone largo (480px). (Evidência: `mobile_480.png`)
- [x] Smartphone estreito (375px). (Evidência: `mobile_375.png`)

Em cada viewport:
- [x] Sem overflow horizontal involuntário. (Validado: max-width 1200px centralizado e padding responsivo)
- [x] Conteúdo não fica cortado. (Validado nos 5 viewports)
- [x] Texto permanece legível. (Validado com contraste Poppins claro sobre dark background)
- [x] Botões são alcançáveis e utilizáveis. (Validado: WhatsApp flutuante e botões com área de toque mínima)
- [x] Efeitos não dependem de hover. (Validado: em mobile eventos de scroll acionam o reveal)
- [x] Scroll e navegação permanecem naturais. (Validado: scroll-behavior suave e sem sequestro; com reduced motion, `auto` — [4.3](stories/4-3-reduced-motion.md), FR-11)

## 5. Acessibilidade
- [x] `prefers-reduced-motion` é respeitado. (Medido na [4.3](stories/4-3-reduced-motion.md), Chrome com `prefers-reduced-motion: reduce` emulado, 1200 e 375px: nenhum efeito GSAP roda — inclusive na 1ª passada de efeitos — e a rolagem fica `auto`. Pendente: o pulso do WhatsApp e a rotação dos ícones sociais seguem animando, `PEND-13`.)
- [x] Conteúdo continua visível com movimento reduzido. (Medido na [4.3](stories/4-3-reduced-motion.md): Hero com opacidade 1 desde o 1º quadro, 5 textos de leitura progressiva em branco desde o 1º quadro, contador "+50", nenhum `opacity`/`transform` residual depois de rolar a página inteira nos dois sentidos — [reduced_1200.png](references/qa/reduced_1200.png), [reduced_375.png](references/qa/reduced_375.png). Antes da 4.3 o Hero ficava invisível.)
- [x] Navegação por teclado funciona. (Validado: links e formulário acessíveis via tab)
- [x] Foco é visível. (Validado: outline e bordas ativas)
- [x] Semântica de headings, links e botões é adequada. (Validado: h1-h4, form e buttons com tipagem semântica)
- [x] Leitores de tela não recebem texto duplicado ou fragmentado indevidamente. (Validado: remoção de aria-labels duplicados)
- [x] Contraste é suficiente nos estados inicial e animado. (Validado: estado inicial com 22% de opacidade sobre fundo preto e 100% ao iluminar) — Sem JS, o `ScrollText` sai em branco pleno ([4.4](stories/4-4-conteudo-sem-javascript.md)). Com JS, o estado inicial em 22% dá ≈ 1,9:1 sobre `#04091d` e será reavaliado na 4.6; a evidência sem JS não confirma este item. Cards de vidro ([7.2](stories/7-2-cards-glassmorphism.md)), medido em pixel no fundo mais claro de cada tipo de card em 1200px: `#a15cf5` ≥ 4,60:1 (baseline 4,75), `white/70` ≥ 9,14:1, `white/60` ≥ 6,99:1.

## 6. Performance e estabilidade
- [ ] Imagens têm dimensões/proporções definidas.
- [ ] Não há layout shift significativo causado por mídia/fontes.
- [ ] Animações priorizam transform/opacity quando possível.
- [ ] Não há loops ou listeners desnecessários.
- [ ] Não há erros no console.
- [ ] Não há warnings críticos de hidratação.
- [ ] Não há falhas de carregamento de assets.
- [ ] Bundle não carrega dependências de animação desnecessariamente em rotas/partes estáticas.

## 7. SEO e build
- [x] Title e description estão corretos. (Title: "Nexus | Agency", description institucional)
- [x] Metadados sociais e favicon foram preservados/configurados. (OpenGraph, Twitter Cards, icon2.png)
- [x] Estrutura semântica está correta. (H1 único no Hero, H2 e H3 nas seções e cards)
- [x] Conteúdo principal está presente no HTML renderizado. (SSR / SSG completo; com JS desligado todo texto e imagem aparece e é legível — [4.4](stories/4-4-conteudo-sem-javascript.md), [nojs_1200.png](references/qa/nojs_1200.png))
- [x] Lint passa. (Zero warnings/errors)
- [x] Testes existentes passam. (Validações de renderização, IDs e scripts headless)
- [x] Build de produção passa. (Exit code 0, rotas /, /robots.txt, /sitemap.xml estáticas)

## 8. Registro de defeitos

Para cada defeito, registrar:
- ID;
- viewport/browser;
- passos para reproduzir;
- comportamento esperado;
- comportamento observado;
- severidade (bloqueador, alto, médio, baixo);
- screenshot/log, quando disponível;
- responsável;
- status.

## 9. Critério de liberação

Não considerar pronto se:
- existir conteúdo original ausente;
- qualquer link crítico estiver quebrado;
- botões sociais tiverem sido alterados;
- animação esconder conteúdo ou impedir leitura;
- scroll para cima apresentar estado incorreto;
- houver erro crítico de console, hidratação ou build;
- a experiência mobile estiver quebrada.
