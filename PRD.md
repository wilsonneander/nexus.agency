# PRD — Product Requirements Document

## 1. Visão do produto

Um site institucional de agência reconstruído sobre uma base moderna, mantendo a experiência visual já existente e adicionando uma camada de movimento cuidadosamente coreografada. O scroll deve funcionar como mecanismo de progressão narrativa, não como uma sequência de efeitos desconectados.

## 2. Princípios de experiência

1. **Fidelidade antes de criatividade:** a interface existente é a referência visual.
2. **Movimento com propósito:** cada animação deve orientar, revelar ou reforçar conteúdo.
3. **Scroll sob controle do utilizador:** não bloquear, sequestrar ou tornar a rolagem desconfortável.
4. **Leitura em primeiro lugar:** animações de texto nunca podem reduzir a legibilidade.
5. **Reversibilidade:** animações ligadas ao progresso do scroll devem responder naturalmente à rolagem para cima e para baixo.
6. **Mobile como experiência própria:** não apenas reduzir os efeitos desktop.
7. **Acessibilidade:** conteúdo disponível mesmo sem animações.

## 3. Inventário obrigatório antes do desenvolvimento

O agente de auditoria deve produzir uma tabela com:
- rota/URL;
- ordem e nome de cada seção;
- conteúdo textual;
- imagens, vídeos, ícones e fontes utilizados;
- botões e links;
- destino de cada link;
- comportamento atual;
- comportamento responsivo;
- observações e dependências.

Não assumir nomes ou quantidades de seções. Usar os nomes reais encontrados no projeto.

## 4. Requisitos funcionais

### FR-01 — Preservação de conteúdo e estrutura
- Todas as rotas, seções, textos, imagens, links e funcionalidades existentes devem ser reproduzidos.
- A ordem das seções deve ser preservada.
- Nenhum conteúdo deve ser inventado, removido ou reescrito sem aprovação.
- Os estados responsivos existentes devem ser identificados e mantidos ou aprimorados sem alterar a identidade.

**Aceite:** comparação entre inventário original e rebuild sem itens ausentes ou alterações não aprovadas.

### FR-02 — Hero e entrada inicial
- Reproduzir fielmente o hero existente.
- Aplicar animações de entrada discretas aos elementos já presentes.
- Usar sequenciamento de timeline quando houver múltiplos elementos.
- Não atrasar a disponibilização do conteúdo principal com uma intro longa.

**Aceite:** o primeiro viewport mantém a composição original e a animação não impede interação ou leitura.

### FR-03 — Leitura progressiva de textos
- Textos elegíveis devem começar com o estado visual secundário definido a partir da identidade existente.
- À medida que o scroll progride, palavras ou segmentos recebem destaque progressivo.
- O destaque deve estar vinculado ao progresso real do scroll, preferencialmente via ScrollTrigger com `scrub`.
- Ao rolar para cima, o destaque deve retroceder de forma contínua.
- A segmentação deve preservar espaços, pontuação, semântica e leitura por tecnologias assistivas.
- Não aplicar o efeito indiscriminadamente a textos pequenos, legais, navegação, botões ou conteúdo cuja leitura possa ser prejudicada.
- Definir uma área de leitura coerente e consistente, ajustada por viewport.

**Aceite:** ao avançar e retroceder o scroll, o destaque progride e regride sem saltos, flicker ou perda de conteúdo. Sem JavaScript/animação, o texto continua legível.

### FR-04 — Revelação de elementos e transições
- Aplicar entradas e saídas suaves a títulos, textos, imagens e elementos existentes.
- Usar `transform`, `opacity` e, quando adequado, `clip-path`.
- Respeitar hierarquia visual e ritmo de cada seção.
- Evitar aplicar o mesmo preset de animação a todos os elementos.

**Aceite:** as transições não causam sobreposição, corte de conteúdo ou mudanças inesperadas de layout.

### FR-05 — Imagens e mídia
- Preservar arquivos, enquadramentos e proporções existentes.
- Aplicar reveal, scale ou parallax apenas quando agregar valor e não alterar a composição.
- Utilizar otimização e carregamento adequado.
- Definir dimensões ou proporções para evitar layout shift.

**Aceite:** mídia carrega corretamente, mantém proporção e não causa deslocamentos visíveis.

### FR-06 — Botões e chamadas para ação
- Preservar rótulos, destinos, parâmetros e comportamento dos botões existentes.
- Botões de WhatsApp podem receber hover, feedback de clique e entrada vinculada ao scroll.
- Não modificar a lógica de abertura do WhatsApp nem o número/mensagem de destino.
- Garantir foco por teclado e feedback acessível.

**Aceite:** todos os destinos correspondem ao inventário original e funcionam em desktop e mobile.

### FR-07 — Botões de redes sociais
- Não alterar visual, ícone, rótulo, posição, URL, comportamento ou animação atual.
- Não substituir componentes existentes por novos padrões.
- Registrar evidência de regressão antes/depois.

**Aceite:** comparação confirma que permanecem inalterados.

### FR-08 — Rodapé
- Preservar estrutura, textos, links e dados.
- Adicionar animações discretas apenas aos elementos existentes.
- Preservar acessibilidade e funcionalidade dos links.

### FR-09 — Navegação
- Preservar o comportamento atual de navegação e âncoras.
- Se houver navegação fixa, garantir que títulos e âncoras não fiquem encobertos.
- Não adicionar menus ou controles sem necessidade identificada.

### FR-10 — Responsividade
- Testar os breakpoints encontrados e definir uma matriz de viewports.
- Ajustar distância, duração e intensidade das animações por dispositivo.
- Não depender exclusivamente de hover.
- Evitar pins longos ou efeitos pesados em telas pequenas.

### FR-11 — Movimento reduzido
- Respeitar `prefers-reduced-motion`.
- Desativar ou simplificar animações decorativas e suavização.
- Manter todos os conteúdos e funcionalidades disponíveis.
- Não esconder textos à espera de uma animação.

## 5. Requisitos não funcionais

- **Performance:** animações prioritariamente com propriedades aceleráveis (`transform` e `opacity`); evitar trabalho contínuo desnecessário.
- **Acessibilidade:** navegação por teclado, foco visível, contraste adequado e conteúdo sem dependência de movimento.
- **SEO:** metadados, títulos semânticos, estrutura HTML apropriada e conteúdo renderizado de forma indexável.
- **Compatibilidade:** browsers modernos de desktop e mobile.
- **Manutenibilidade:** animações isoladas, componentes coesos e nomes claros.
- **Confiabilidade:** sem erros de console, hidratação ou build.
- **Segurança:** não inserir scripts externos ou dependências sem justificativa.

## 6. Estados e comportamento do scroll

Para efeitos vinculados ao scroll:
- definir explicitamente `trigger`, `start` e `end`;
- preferir `scrub` para progresso contínuo e reversível;
- usar animações de entrada simples apenas quando não precisarem acompanhar a posição exata;
- evitar `toggleActions` como substituto de uma animação progressiva quando o requisito pede sincronização;
- recalcular posições após carregamento de fontes/imagens e mudanças de layout;
- garantir que o conteúdo permaneça visível em fallback.

## 7. Fora de escopo
- Redesign e rebranding.
- Reescrita de conteúdo.
- Alterações nos botões sociais.
- Funcionalidades ou integrações novas não presentes no site atual.
- Animações que bloqueiem o scroll ou impeçam acesso ao conteúdo.

## 8. Questões a resolver na auditoria
- Quantas rotas existem?
- Quais são as seções e sua ordem?
- Quais textos são adequados para leitura progressiva?
- Quais animações/interações já existem e precisam ser preservadas?
- Quais breakpoints e dispositivos precisam de suporte?
- Há formulários, mapas, vídeos, galerias ou integrações de terceiros?
