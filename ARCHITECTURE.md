# Architecture — Arquitetura da aplicação

## 1. Princípios

- Organização por responsabilidade e por seção.
- Server Components por padrão; interatividade isolada em Client Components.
- Conteúdo e dados separados da lógica de animação.
- GSAP isolado em módulos/hooks e escopado ao componente.
- Reutilização com parcimônia: abstrair padrões repetidos, não diferenças visuais relevantes.
- A arquitetura final deve refletir o inventário real do site, não uma lista hipotética de seções.

## 2. Estrutura de referência

```text
project/
├── public/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── videos/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── [rotas identificadas na auditoria]/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx
│   │   │   └── SiteFooter.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── WhatsAppButton.tsx
│   │   └── motion/
│   │       ├── ScrollText.tsx
│   │       ├── ScrollReveal.tsx
│   │       └── Parallax.tsx
│   │
│   ├── sections/
│   │   └── [uma pasta por seção real]/
│   │       ├── SectionName.tsx
│   │       ├── SectionName.module.css
│   │       └── index.ts
│   │
│   ├── animations/
│   │   ├── gsap.client.ts
│   │   ├── presets.ts
│   │   └── [módulos por seção quando necessário]/
│   │
│   ├── hooks/
│   │   ├── useReducedMotion.ts
│   │   └── [hooks reutilizáveis comprovados]/
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   └── links.ts
│   │
│   ├── data/
│   │   └── [dados reais separados quando necessário]/
│   │
│   └── types/
│       └── index.ts
│
├── docs/
│   ├── BRD.md
│   ├── PRD.md
│   ├── TECHNICAL-SPEC.md
│   ├── ARCHITECTURE.md
│   ├── TASKS.md
│   └── QA-CHECKLIST.md
│
├── AGENTS.md
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

## 7. Decisões arquiteturais a registrar
Durante a auditoria/setup, registrar:
- número de rotas;
- seções por rota;
- estratégia de assets e fontes;
- estratégia de animações por seção;
- necessidade ou não de Lenis;
- estratégia de testes;
- hospedagem e pipeline de deploy, se confirmados.
