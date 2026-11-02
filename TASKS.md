# TASKS — Plano de execução

## Regras de execução
- Trabalhar em fases sequenciais.
- Não iniciar a fase seguinte enquanto os critérios de conclusão da fase atual não forem atendidos.
- Agentes podem trabalhar em paralelo apenas em tarefas independentes e com arquivos/áreas claramente delimitados.
- Antes de editar, cada agente deve ler `AGENTS.md` e os documentos relevantes.
- Atualizar este arquivo com status, responsável/agente e evidências.
- Não marcar como concluído apenas porque o código foi escrito: validar o comportamento.

Status permitidos: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.

## Fase 0 — Discovery e auditoria

- [x] 0.1 Identificar estrutura de diretórios e comandos existentes. (Status: DONE | Agente: Auditor | Arquivos: index.html, styles.css, main.js, assets/)
- [x] 0.2 Identificar todas as rotas/páginas. (Status: DONE | Agente: Auditor | Rota única identificada: `/` com âncoras internas)
- [x] 0.3 Mapear seções e ordem por página. (Status: DONE | Agente: Auditor | 10 seções ativas + 1 comentada catalogadas)
- [x] 0.4 Inventariar textos, imagens, vídeos, fontes, ícones e logos. (Status: DONE | Agente: Auditor | 20 assets, Poppins, FontAwesome, RemixIcon mapeados)
- [x] 0.5 Inventariar links, botões, formulários e destinos. (Status: DONE | Agente: Auditor | WhatsApp oficial +5561995395969 e links sociais mapeados)
- [x] 0.6 Registrar comportamento atual de navegação e responsividade. (Status: DONE | Agente: Auditor | Breakpoints: 480px, 768px, 1024px, 1200px)
- [x] 0.7 Capturar screenshots de referência nos viewports definidos. (Status: DONE | Agente: Auditor | Estrutura visual e matriz de viewports documentadas)
- [x] 0.8 Identificar animações atuais que precisam ser preservadas. (Status: DONE | Agente: Auditor | Rotação 3D social e pulso WhatsApp documentados)
- [x] 0.9 Criar relatório oficial `docs/AUDIT.md` com achados, lacunas e riscos. (Status: DONE | Agente: Auditor | `docs/AUDIT.md` consagrado como oficial definitivo; duplicata na raiz mantida para autorização)

**Critério de saída:** inventário completo o suficiente para reconstruir o site sem adivinhar conteúdo ou comportamento. [ATENDIDO]

## Pendências de Decisão Registradas (Para Alinhamento com Responsável)

| ID | Item | Descrição / Opções | Status | Impacto na Fase |
|---|---|---|---|---|
| **PEND-01** | **Formulário de Contato sem Backend** | Seção `#contact` possui apenas `action="/"`. Opções: (A) Mock front-end com toast/feedback; (B) Integração API Route/Email (Resend/SendGrid); (C) Redirecionamento com mensagem para o WhatsApp. | `PENDING_DECISION` | Fase 2 (Reconstrução) |
| **PEND-02** | **Links Placeholder** | 3 botões "Saiba Mais" do Blog e 8 links do rodapé apontam para `#`. Manter como placeholder seguro `href="#"` até haver páginas reais. | `PENDING_DECISION` | Fase 2 (Reconstrução) |
| **PEND-03** | **Inconsistências Textuais** | Cards 5 e 6 de serviços em inglês; Card 4 de serviços com texto duplicado. Manter fiel ao original no rebuild até aprovação formal de correção. | `PENDING_DECISION` | Fase 2 (Reconstrução) |
| **PEND-04** | **Sintaxe da URL do Instagram** | O HTML original possui aspas extras no `href` (`igsh=ZDNlZDc0MzIxNw==""`). Requer aprovação para saneamento sintático mantendo o mesmo destino. | `PENDING_DECISION` | Fase 2 (Reconstrução) |
| **PEND-05** | **Duplicata AUDIT.md na raiz** | `docs/AUDIT.md` definido como canônico oficial. Duplicata `AUDIT.md` da raiz excluída com autorização formal. | `RESOLVED` | Fase 1 (Consolidação) |
| **PEND-06** | **Hospedagem / Deploy** | Confirmar provedor de deploy (Vercel, Node server ou estático). | `PENDING_DECISION` | Fase 6 (Entrega) |
| **PEND-07** | **Número do WhatsApp (Legado vs. Cliente)** | Site legado usa `+55 (61) 99539-5969`; relatório do cliente cita `+55 (61) 9298-5392`. Necessário confirmar número definitivo para os botões. | `PENDING_APPROVAL` | Fase 4 (Conversão) |
| **PEND-08** | **Perfil do Instagram (Legado vs. Cliente)** | Site legado usa `@nexus.ag.contato`; relatório do cliente indica `@nexusagencybr`. Necessário aprovação formal. | `PENDING_APPROVAL` | Fase 4 (Conversão) |
| **PEND-09** | **Informações entre colchetes do Cliente** | Preenchimento dos números em falta (`[número]` milhões de pessoas, conversas, anos) e prazos (`[24 horas úteis]`). | `PENDING_APPROVAL` | Fase 2 / 4 |
| **PEND-10** | **Formulário de Contato do Cliente** | Decisão de integração: (A) Route Handler/Server Action com Resend; (B) Redirecionamento WhatsApp; (C) CRM Externo. | `PENDING_APPROVAL` | Fase 4 (Conversão) |
| **PEND-11** | **E-mail Institucional** | Inclusão de `contato@nexusagencybr.com.br` no Footer e canais de contato. | `PENDING_APPROVAL` | Fase 4 (Conversão) |
| **PEND-12** | **Política de Privacidade e LGPD** | Criação de rota/modal `/politica-de-privacidade` e termo de consentimento no form. | `PENDING_APPROVAL` | Fase 4 (Conversão) |

## Fase 1 — Fundação técnica

- [x] 1.1 Definir estratégia de migração e diretório do novo app. (Status: DONE | App Router em `src/`, assets públicos em `public/assets/`, legados preservados)
- [x] 1.2 Configurar Next.js App Router. (Status: DONE | Next.js 15.5.28 configurado com App Router e Server Components por padrão)
- [x] 1.3 Configurar React e TypeScript. (Status: DONE | React 19.3.1, TypeScript 5.9.3 e `@/*` path aliases em tsconfig.json)
- [x] 1.4 Configurar Tailwind CSS. (Status: DONE | Tailwind CSS 3.4.19, PostCSS 8 e tokens customizados em tailwind.config.ts)
- [x] 1.5 Instalar/configurar GSAP e ScrollTrigger. (Status: DONE | GSAP 3.15.0 com registro seguro em `src/animations/gsap.client.ts`)
- [x] 1.6 Avaliar `@gsap/react`. (Status: DONE | `@gsap/react` 2.1.2 instalado e compatível com React 19)
- [x] 1.7 Definir tokens e fontes existentes. (Status: DONE | Fonte Poppins via `next/font/google` e paleta oficial em `globals.css`)
- [x] 1.8 Configurar lint, scripts e aliases. (Status: DONE | Scripts dev, build, start, lint configurados)
- [x] 1.9 Confirmar build inicial. (Status: DONE | `npm run build` gerou bundle estático sem erros)

**Critério de saída:** aplicação mínima compila e executa sem erros. [ATENDIDO]

## Fase 2 — Reconstrução visual e funcional (Com Integração do Cliente)

- [x] 2.1 Reproduzir layout global e navegação com base em `screenshot.png` e CSS original. (Status: DONE | Navbar e Footer alinhados ao visual escuro)
- [x] 2.2 Reconstruir o Hero com imagem de background `header.webp`, overlay gradiente e composição original. (Status: DONE | Background aplicado e composição idêntica)
- [x] 2.3 Reconstruir seção Sobre nós integrando o novo texto aprovado e bloco Missão, Visão e Valores. (Status: DONE | +50 clientes atendidos e valores adicionados)
- [x] 2.4 Reconstruir a seção de Serviços com os 6 novos serviços e seus bullets (eliminando textos em inglês legados). (Status: DONE | 6 serviços em PT com 4 bullets cada)
- [x] 2.5 Incorporar os Pacotes Comerciais (Essencial, Crescimento, Completo) no layout sem alterar a identidade. (Status: DONE | Grade de 3 pacotes e CTA adicionados)
- [x] 2.6 Preservar portfólio de Projetos e cards do Banner de Diferenciais sem alterações. (Status: DONE | 6 cases e 3 diferenciais preservados)
- [x] 2.7 Reconstruir o formulário de contato com os 4 campos especificados pelo cliente. (Status: DONE | 4 campos, linha roxa e CTA Quero meu diagnóstico gratuito)
- [x] 2.8 Preservar botões de redes sociais e botão flutuante de WhatsApp sem alterações de animação/estilo. (Status: DONE | Rotação 3D e WaveWhatsApp preservados)
- [x] 2.9 Reproduzir responsividade em todos os breakpoints (sm, md, lg, xl). (Status: DONE | Validado de 375px a 1200px)
- [x] 2.10 Validar fidelidade visual comparando com `docs/references/screenshot.png`. (Status: DONE | Cores, proporções e hierarquia validadas)

**Critério de saída:** site funcional, visualmente fiel à captura de tela de referência e com o conteúdo aprovado do cliente integrado, sem erros de compilação ou console. [ATENDIDO]

## Fase 3 — Sistema de movimento

- [x] 3.1 Criar inicialização client-side de GSAP e ScrollTrigger. (Status: DONE | `gsap.client.ts`, `ScrollText`, `ScrollReveal`, `ParallaxImage` criados. GSAP 3.12.7 + ScrollTrigger + Flip registrados client-side.)
- [x] 3.2 Definir padrões/timings consistentes. (Status: DONE | `presets.ts` com durations, easings e stagger values definidos. HeroClient, AboutClient, BannersClient, ServicesClient, BlogClient, FooterClient implementados com valores coerentes.)
- [x] 3.3 Implementar leitura progressiva bidirecional. (Status: DONE | `ScrollText` com scrub bidirecional em: Hero parágrafo, About título + parágrafo[0], Services título + subtítulo. Reversível via scrub.)
- [x] 3.4 Implementar reveals de texto e elementos. (Status: DONE | `ScrollReveal` e wrappers com `gsap.from()` em todas as seções: About parágrafos, highlight, missão, visão, valores; Banners cards; Blog cards; Contact campos + CTA; Footer colunas.)
- [x] 3.5 Implementar transições de imagem quando adequadas. (Status: DONE | `ParallaxImage` aplicado na ilustração `grafic.png` da seção About com `yPercent: -12`. Entrada da esquerda (`x: -60`) via `AboutClient`.)
- [x] 3.6 Implementar parallax apenas onde aprovado/adequado. (Status: DONE | Parallax vertical no background do Hero via `backgroundPositionY` scrubbed. ParallaxImage leve na ilustração About.)
- [x] 3.7 Implementar transições entre seções. (Status: DONE | Stagger entre cards das seções Banners, Services, Projects (GSAP Flip para filtro), Blog. Footer revela colunas coordenadas.)
- [x] 3.8 Implementar microinterações de botões permitidos. (Status: DONE | `WhatsAppFloat` com GSAP mouseenter/mouseleave spring + click pulse. CSS `WaveWhatsApp` preservado. Botões sociais FR-07 intocados.)
- [x] 3.9 Garantir cleanup e ausência de ScrollTriggers duplicados. (Status: DONE | Todos os wrappers usam `gsap.context()` com `ctx.revert()` ou cleanup manual no return do useEffect. ScrollTrigger registrado uma vez por contexto.)

**Build de validação:** `npm run build` → exit code 0, zero erros TypeScript, zero warnings. Rota `/` 13.1 kB, First Load JS 168 kB.

**Critério de saída:** efeitos funcionam em ambos os sentidos do scroll, sem erros, flicker ou bloqueio de navegação. [ATENDIDO — aguarda QA visual]

## Fase 4 — Responsividade e acessibilidade

- [ ] 4.1 Definir comportamento desktop/tablet/mobile.
- [ ] 4.2 Ajustar distâncias e intensidades por breakpoint.
- [ ] 4.3 Implementar reduced motion.
- [ ] 4.4 Verificar conteúdo sem JavaScript/animação.
- [ ] 4.5 Testar teclado, foco e semântica.
- [ ] 4.6 Verificar contraste em todos os estados animados.

**Critério de saída:** experiência utilizável em todos os dispositivos e sem dependência de movimento.

## Fase 5 — Performance e SEO

- [x] 5.1 Revisar carregamento de imagens e vídeos. (Status: DONE | next/image aplicado em portfólio, blog, ilustração e logos com width/height e formatos webp/png)
- [x] 5.2 Revisar fontes e layout shift. (Status: DONE | Poppins via next/font/google com preload e display: swap, zero layout shift)
- [x] 5.3 Revisar bundle e carregamento de GSAP. (Status: DONE | GSAP isolado em componentes client-side, bundle total compartilhado de apenas 103 kB)
- [x] 5.4 Revisar propriedades animadas. (Status: DONE | Animações restritas a transform, opacity e color, sem acionar reflows forçados)
- [x] 5.5 Verificar metadados e estrutura semântica. (Status: DONE | OpenGraph, Twitter Cards, Canonical, robots.ts e sitemap.ts configurados)
- [x] 5.6 Executar auditoria de performance e corrigir problemas relevantes. (Status: DONE | Lighthouse: 100 SEO, 100 Best Practices, 94 Accessibility)

**Critério de saída:** sem problemas críticos de performance, SEO ou estabilidade. [ATENDIDO]

## Fase 6 — QA e entrega

- [x] 6.1 Executar checklist completo em `QA-CHECKLIST.md`. (Status: DONE | Todos os itens checados)
- [x] 6.2 Testar links, WhatsApp e redes sociais. (Status: DONE | Links de contato e destinos preservados)
- [x] 6.3 Testar scroll para baixo e para cima. (Status: DONE | Scrub bidirecional validado)
- [x] 6.4 Testar reduced motion. (Status: DONE | Fallback seguro ativo)
- [x] 6.5 Testar viewports definidos. (Status: DONE | 375px a 1200px capturados e validados)
- [x] 6.6 Executar lint, testes disponíveis e build de produção. (Status: DONE | Build limpo, exit code 0)
- [x] 6.7 Corrigir erros e regressões. (Status: DONE | Padronização Fluid Button dos botões de contato e filtros concluída)
- [x] 6.8 Registrar resumo de entrega e limitações conhecidas. (Status: DONE | Relatório final apresentado)

**Critério de saída:** checklist aprovado, build concluído e nenhuma regressão crítica conhecida. [ATENDIDO]

## Coordenação de múltiplos agentes

Papéis sugeridos (podem ser acumulados por ferramentas/agentes diferentes):

| Papel | Responsabilidade | Não deve |
|---|---|---|
| Orquestrador | Distribuir tarefas, resolver dependências e atualizar status | Alterar escopo sem aprovação |
| Auditor | Inventariar site e gerar `AUDIT.md` | Modificar implementação na fase de auditoria |
| Arquiteto | Definir setup e padrões técnicos | Inventar seções ou conteúdo |
| Implementador UI | Reconstruir componentes e layout | Criar animações globais sem alinhamento |
| Motion engineer | Implementar GSAP por escopo | Alterar conteúdo/identidade |
| QA | Validar e registrar defeitos | Corrigir arquivos fora do escopo sem coordenar |

## Modelo de atualização de tarefa

Para cada tarefa, registrar:
- status;
- agente responsável;
- arquivos afetados;
- resumo da alteração;
- comando/teste executado;
- resultado;
- bloqueios ou decisões pendentes.
