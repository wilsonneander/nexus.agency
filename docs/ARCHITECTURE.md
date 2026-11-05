# Architecture — Arquitetura da aplicação

## 1. Princípios

- Organização por responsabilidade e por seção.
- Server Components por padrão; interatividade isolada em Client Components.
- Conteúdo e dados separados da lógica de animação.
- GSAP isolado em módulos/hooks e escopado ao componente.
- Reutilização com parcimônia: abstrair padrões repetidos, não diferenças visuais relevantes.
- A arquitetura final deve refletir o inventário real do site, não uma lista hipotética de seções.

## 2. Estrutura de referência (Aplicada ao Nexus Agency)

```text
nexus/
├── public/
│   ├── assets/                   # 20 assets visuais originais (imagens, logo, favicon)
│   │   ├── logo.png
│   │   ├── icon2.png (favicon)
│   │   ├── header.webp
│   │   ├── grafic.png
│   │   └── ...
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # RootLayout (metadados OpenGraph/Twitter, fonte Poppins, links sociais)
│   │   ├── page.tsx              # Rota única '/' compondo as seções na ordem original
│   │   ├── globals.css           # Variáveis CSS e tokens de estilo legados
│   │   ├── robots.ts             # Geração dinâmica de robots.txt
│   │   └── sitemap.ts            # Geração dinâmica de sitemap.xml
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Navegação com âncoras e menu mobile
│   │   │   ├── Footer.tsx        # Rodapé com 3 colunas e links institucionais
│   │   │   └── FooterClient.tsx  # Wrapper animado do rodapé
│   │   ├── ui/
│   │   │   ├── Button.tsx        # Botão com gradiente roxo padrão
│   │   │   ├── SocialIcons.tsx   # Ícones com rotação 3D inalterável (Header, About, Footer)
│   │   │   └── WhatsAppFloat.tsx # Botão flutuante WhatsApp (WaveWhatsApp + GSAP spring)
│   │   └── motion/
│   │       ├── ScrollText.tsx    # Leitura progressiva bidirecional (GSAP scrub)
│   │       ├── ScrollReveal.tsx  # Revelações e transições escalonadas
│   │       └── ParallaxImage.tsx # Paralaxe suave vertical com next/image
│   │
│   ├── sections/
│   │   ├── Hero/                 # Dobra de entrada (#home) com HeroClient e ScrollText
│   │   ├── About/                # Seção Sobre nós (#about) com AboutClient, Parallax e Métrica
│   │   ├── Banners/              # Banner horizontal de diferenciais (BannersClient)
│   │   ├── Projects/             # Grid de portfólio (#project) com GSAP Flip
│   │   ├── Services/             # Grid de 6 serviços (#service) + 3 Pacotes com ServicesClient
│   │   └── Contact/              # Formulário (#contact) com validação e animações
│   │
│   ├── animations/
│   │   ├── gsap.client.ts        # Registro e configuração do GSAP e ScrollTrigger
│   │   ├── presets.ts            # Presets de stagger, timelines e easing; MOTION_MEDIA
│   │   └── scrubReveal.ts        # Entrada por elemento atrelada ao scroll (story 4.2)
│   │
│   ├── hooks/
│   │   ├── useReducedMotion.ts   # Detecção e respeito a prefers-reduced-motion
│   │   └── useScrollProgress.ts  # Utilitário para progresso de leitura
│   │
│   ├── lib/
│   │   ├── utils.ts              # Helpers de classes Tailwind e formatação
│   │   └── constants.ts          # SITE_CONFIG: WhatsApp (+556192985392), redes sociais, navegação e metadados
│   │
│   ├── data/
│   │   ├── projects.ts           # 6 projetos e suas categorias (Fast Food, Tecnologia, Viagens)
│   │   └── services.ts           # 6 serviços originais
│   │
│   └── types/
│       └── index.ts              # Tipagens de dados, filtros e props
│
├── docs/                         # toda a documentação — índice em docs/README.md
│   ├── BRD.md, PRD.md            # negócio e requisitos (FR-xx)
│   ├── TECHNICAL-SPEC.md         # stack e regras técnicas
│   ├── ARCHITECTURE.md           # este documento
│   ├── TASKS.md                  # quadro de status + pendências PEND-xx
│   ├── QA-CHECKLIST.md           # critérios de aceite e liberação
│   ├── AUDIT.md                  # inventário do legado + auditoria de funcionalidades
│   ├── CONTENT-MAPPING.md        # conteúdo do cliente vs. legado
│   ├── stories/                  # uma story por tarefa (skill `story`)
│   ├── tdds/                     # um TDD por fluxo (skill `tdd`)
│   └── references/               # screenshot.png, client-content.pdf, qa/
│
├── AGENTS.md, CLAUDE.md, README.md  # ficam na raiz: lidos automaticamente por agentes e pelo GitHub
├── package.json
└── ...
```

A estrutura é uma referência, não uma obrigação de criar todos os diretórios. Criar somente o que tiver uso real. Se o site tiver várias rotas, refletir a estrutura real no App Router.

## 3. Responsabilidades

### `app/`
Rotas, layout raiz, metadados e composição de páginas. Evitar colocar lógica detalhada de animação aqui.

### `components/layout/`
Elementos compartilhados de estrutura, como cabeçalho e rodapé, se existirem no site atual.

### `components/ui/`
Elementos de interface reutilizáveis. `WhatsAppButton` só deve ser abstraído se houver mais de uma ocorrência ou benefício claro.

### `components/motion/`
Componentes reutilizáveis para padrões de movimento. Devem ser opt-in, com fallback acessível e sem impor animação a todo conteúdo.

### `sections/`
Componentes que representam seções reais do site. Cada pasta pode conter componente, estilos locais e configuração de animação, conforme a complexidade.

### `animations/`
Registro de plugins, presets e funções de animação. Não deve conter conteúdo de negócio nem markup de seção.

### `hooks/`
Hooks React genuinamente reutilizáveis. Não criar hook para lógica usada uma única vez sem benefício.

### `lib/`
Funções utilitárias puras, tratamento de links e helpers sem estado React.

### `data/`
Dados reais do site, como listas de serviços ou projetos, quando for útil separá-los do JSX. Não mover conteúdo para estruturas complexas sem necessidade.

## 4. Fluxo de composição

`app/page.tsx` deve compor as seções na ordem descoberta durante a auditoria. O componente de página deve permanecer legível e não concentrar a implementação dos efeitos.

## 5. Padrões de animação
- Cada seção controla ou inicializa suas animações dentro de seu próprio escopo.
- Reutilizar presets somente quando o comportamento e o timing forem realmente comuns.
- Não compartilhar um único timeline global entre seções independentes.
- A animação de leitura deve ser um padrão isolado e configurável.
- Destruir/reverter contextos corretamente no unmount e em mudanças de breakpoint.

## 6. Convenções
- Componentes React: PascalCase.
- Hooks: `useCamelCase`.
- Funções e variáveis: camelCase.
- Constantes: UPPER_SNAKE_CASE somente para constantes globais apropriadas.
- Arquivos de componente: nome PascalCase ou convenção consistente adotada no repositório.
- Usar aliases de importação se configurados no projeto.
- Evitar nomes genéricos como `data2`, `temp` ou `animationFinalFinal`.

## 7. Decisões arquiteturais registradas na auditoria

Com base no relatório oficial `docs/AUDIT.md`:
- **Número de rotas:** 1 rota principal (`/` - Single Page Application institucional) com navegação interna por âncoras (`#home`, `#about`, `#project`, `#service`, `#contact`; o Blog foi removido na [story 7.3](stories/7-3-links-rodape-remover-blog.md)).
- **Seções por rota (ordem exata):**
  1. Header com Topbar de Redes Sociais e Navbar
  2. Hero (`#home`)
  3. Sobre nós (`#about`)
  4. Banner de Diferenciais (Design, Desenvolvimento, Teste & QA)
  5. Projetos / Criação e Desenvolvimento (`#project`)
  6. Nossos Serviços (`#service`)
  7. *(Inativo/Comentado)* Testimonials (`#client`) — mantido fora do bundle ativo para fidelidade
  8. *(Removido na [story 7.3](stories/7-3-links-rodape-remover-blog.md), `PEND-02`)* Blog (`#blog`)
  9. Contato / Formulário (`#contact`)
  10. Rodapé (Footer) com 3 colunas e redes sociais
  11. Botão Flutuante de WhatsApp fixo
- **Estratégia de assets e fontes:**
  - Manter todos os 20 assets em `public/assets/`, servidos pelo `next/image` para otimização automática.
  - Carregar a fonte `Poppins` via `next/font/google` com pesos 400, 500, 600, 700.
- **Estratégia de animações por seção:**
  - Leitura progressiva com ScrollTrigger e `scrub` aplicada exclusivamente no Hero e Sobre nós.
  - Reveals das seções (About, Banners, Projetos, Serviços, Contato, rodapé) **atrelados ao scroll, por elemento** (story [4.2](stories/4-2-distancias-intensidades-por-breakpoint.md), decisão do responsável): descendo entra, subindo desfaz, em toda largura, com deslocamento menor até 768px. Substituiu as entradas disparadas por grupo com `stagger`, que animavam fora da tela com a grade em 1 coluna. Regra em [TECHNICAL-SPEC.md](TECHNICAL-SPEC.md#tailwind--css).
  - Botão WhatsApp com animação contínua `@keyframes WaveWhatsApp` em CSS e transição de escala (a mola de hover GSAP só com mouse, `MOTION_MEDIA.finePointer`).
  - **Por faixa** (story [4.1](stories/4-1-comportamento-por-breakpoint.md)): menu, ícones sociais fixos e Banners viram nos pontos exatos do legado (`> 480/768`, com `min-[481px]:`/`min-[769px]:`; as telas do Tailwind não mudam); parallax só acima de 768px via `gsap.matchMedia()`; todo o resto roda igual em toda largura.
  - Botões de Redes Sociais: **preservação integral** da rotação 3D (`rotateY(360deg)`) e expansão de cor de fundo sem alterações.
- **Fallback sem JS:** um único `<noscript><style>` no `<head>` de [layout.tsx](../src/app/layout.tsx), selecionando `data-*`, dá o estado final legível sem JS (story [4.4](stories/4-4-conteudo-sem-javascript.md)). Regra completa em [TECHNICAL-SPEC.md § Next.js / React](TECHNICAL-SPEC.md#nextjs--react).
- **Avaliação de Lenis:** Descartado para a versão inicial. O scroll nativo (`scroll-behavior: smooth`) e o ScrollTrigger padrão atendem perfeitamente à proposta sem os riscos de conflito em mobile/touch.
- **Estratégia de testes:** Execução do [QA-CHECKLIST.md](QA-CHECKLIST.md) nos viewports 375px, 480px, 768px, 1024px e 1200px.
- **Pendências que afetam a arquitetura** (formulário `PEND-10`, links placeholder `PEND-02`, textos `PEND-03` (RESOLVED), hospedagem `PEND-06`): status na tabela PEND-xx do [TASKS.md](TASKS.md#pendências-de-decisão-registradas-para-alinhamento-com-responsável).
