# QA Checklist — Qualidade e critérios de aceite

## 1. Fidelidade visual
- [ ] Todas as rotas originais foram reconstruídas.
- [ ] Todas as seções estão presentes e na ordem original.
- [ ] Textos, imagens, vídeos, logos e fontes foram preservados.
- [ ] Cores, tipografia, espaçamentos e composição correspondem à referência.
- [ ] Não foram criadas seções ou conteúdos sem aprovação.
- [ ] Screenshots foram comparados em viewports equivalentes.

## 2. Funcionalidade
- [ ] Navegação e âncoras funcionam.
- [ ] Links externos abrem os destinos corretos.
- [ ] Botões de WhatsApp mantêm telefone, mensagem e parâmetros originais.
- [ ] Botões de redes sociais permanecem inalterados.
- [ ] Formulários e demais interações existentes funcionam.
- [ ] Não há links quebrados ou placeholders de desenvolvimento.

## 3. Animações e scroll
- [ ] Hero entra sem atraso excessivo.
- [ ] Animações não ocultam conteúdo antes de inicializarem.
- [ ] Texto progressivo acompanha o scroll.
- [ ] Texto progressivo regride corretamente ao subir.
- [ ] Palavras e pontuação não piscam nem saltam.
- [ ] Textos multilinha e com acentos funcionam.
- [ ] Transições não causam sobreposição ou corte.
- [ ] Imagens mantêm proporção durante os reveals.
- [ ] Não há pins desnecessários ou scroll bloqueado.
- [ ] Não existem ScrollTriggers duplicados após navegação/re-render.
- [ ] Resize e refresh não quebram as posições.

## 4. Responsividade
Testar ao menos:
- [ ] Desktop largo.
- [ ] Notebook.
- [ ] Tablet em orientação retrato.
- [ ] Smartphone estreito.
- [ ] Smartphone largo.

Em cada viewport:
- [ ] Sem overflow horizontal involuntário.
- [ ] Conteúdo não fica cortado.
- [ ] Texto permanece legível.
- [ ] Botões são alcançáveis e utilizáveis.
- [ ] Efeitos não dependem de hover.
- [ ] Scroll e navegação permanecem naturais.

## 5. Acessibilidade
- [ ] `prefers-reduced-motion` é respeitado.
- [ ] Conteúdo continua visível com movimento reduzido.
- [ ] Navegação por teclado funciona.
- [ ] Foco é visível.
- [ ] Semântica de headings, links e botões é adequada.
- [ ] Leitores de tela não recebem texto duplicado ou fragmentado indevidamente.
- [ ] Contraste é suficiente nos estados inicial e animado.

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
- [ ] Title e description estão corretos.
- [ ] Metadados sociais e favicon foram preservados/configurados.
- [ ] Estrutura semântica está correta.
- [ ] Conteúdo principal está presente no HTML renderizado.
- [ ] Lint passa.
- [ ] Testes existentes passam.
- [ ] Build de produção passa.

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
