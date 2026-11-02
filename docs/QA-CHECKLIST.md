# QA Checklist — Qualidade e critérios de aceite

## 1. Fidelidade visual
- [ ] Todas as rotas originais foram reconstruídas.
- [ ] Todas as seções estão presentes e na ordem original.
- [ ] Textos, imagens, vídeos, logos e fontes foram preservados.
- [ ] Cores, tipografia, espaçamentos e composição correspondem à referência.
- [ ] Não foram criadas seções ou conteúdos sem aprovação.
- [ ] Screenshots foram comparados em viewports equivalentes.

## 2. Funcionalidade
- [x] Navegação e âncoras funcionam. (Mapeamento validado para #home, #about, #service, #project, #contact)
- [x] Links externos abrem os destinos corretos em nova aba (target="_blank" rel="noopener noreferrer").
- [x] Botões de WhatsApp mantêm telefone, mensagem e parâmetros configurados de forma centralizada.
- [x] Botões de redes sociais permanecem inalterados e funcionais.
- [x] Formulário estruturado com 4 campos do cliente e validação nativa de preenchimento.
- [x] Links placeholder catalogados na auditoria de funcionalidades ([AUDIT.md § 12.3](AUDIT.md)).

## 3. Animações e scroll
- [x] Hero entra sem atraso excessivo. (Validado via timeline com delays escalonados 0.15s, 0.35s, 0.55s)
- [x] Animações não ocultam conteúdo antes de inicializarem. (Validado com eliminação de FOUC e opacidades seguras)
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
- [x] Scroll e navegação permanecem naturais. (Validado: scroll-behavior suave e sem sequestro)

## 5. Acessibilidade
- [x] `prefers-reduced-motion` é respeitado. (Validado: hook `useReducedMotion` desativa animações no GSAP)
- [x] Conteúdo continua visível com movimento reduzido. (Validado: fallbacks exibem opacidade 100% e cores plenas)
- [x] Navegação por teclado funciona. (Validado: links e formulário acessíveis via tab)
- [x] Foco é visível. (Validado: outline e bordas ativas)
- [x] Semântica de headings, links e botões é adequada. (Validado: h1-h4, form e buttons com tipagem semântica)
- [x] Leitores de tela não recebem texto duplicado ou fragmentado indevidamente. (Validado: remoção de aria-labels duplicados)
- [x] Contraste é suficiente nos estados inicial e animado. (Validado: estado inicial com 22% de opacidade sobre fundo preto e 100% ao iluminar)

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
- [x] Conteúdo principal está presente no HTML renderizado. (SSR / SSG completo)
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
