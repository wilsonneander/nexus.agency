# TASKS — Plano de execução

## ▶ Ordem de implementação

> **Atualizada em:** 2026-11-05, no fechamento da story 4.2 (sobre `272cf45` + commit da entrega). Esta seção é mantida a cada mudança de status (story criada, iniciada, bloqueada, concluída), tarefa nova ou `PEND-xx` resolvido. A ordem é por **dependência** primeiro e **prioridade** (risco ao [critério de liberação](QA-CHECKLIST.md) § 9) depois.

**Próxima tarefa: 4.5 — Testar teclado, foco e semântica** (`TODO`, sem story: começa pela skill `story`)
Por quê agora: independe das animações e é o maior risco restante da Fase 4; a 4.6 (contraste) já pode correr em seguida, porque a [4.2](stories/4-2-distancias-intensidades-por-breakpoint.md) fixou os estados animados (entrada atrelada ao scroll).

| # | Tarefa | Depende de | Status | Por que nesta posição |
|---|---|---|---|---|
| 1 | **4.5** Teclado, foco e semântica | — | `TODO` | Independente das animações. |
| 2 | **4.6** Contraste em todos os estados animados | 4.2 (`DONE`) | `TODO` | Só faz sentido medir sobre os estados finais; fecha a Fase 4 (Lighthouse a11y hoje 94). Os cards de vidro já foram medidos na [7.2](stories/7-2-cards-glassmorphism.md) (`#a15cf5` ≥ 4,60:1). |
| 3 | **4.8** Piscar do Hero na hidratação | — | `TODO` | Sem story. Só o 1º quadro depois da hidratação; separada da 4.1 por não depender de largura. |
| 4 | **6.9** Remover código de motion/About não usado | — | `TODO` | Limpeza sem risco ao QA § 9; encaixa em qualquer folga. Inclui o import morto de `ParallaxImage` no About ([story 4.1](stories/4-1-comportamento-por-breakpoint.md)); os `gsap.from` do rodapé e do Contato já saíram na [4.2](stories/4-2-distancias-intensidades-por-breakpoint.md). |

**Fora da fila (aguardam decisão do responsável, não implementar):** `PEND-13` pulso do WhatsApp e rotação dos ícones sociais com reduced motion, `PEND-06` deploy, `PEND-09` colchetes restantes, `PEND-10` backend do formulário, `PEND-12` LGPD. ESLint (1.8) depende de aprovação de dependências novas. Quando um desses for resolvido, a tarefa resultante entra na tabela acima na posição devida.

## Regras de execução
- Trabalhar em fases sequenciais.
- Não iniciar a fase seguinte enquanto os critérios de conclusão da fase atual não forem atendidos.
- Agentes podem trabalhar em paralelo apenas em tarefas independentes e com arquivos/áreas claramente delimitados.
- Antes de editar, cada agente deve ler `AGENTS.md` e os documentos relevantes.
- Atualizar este arquivo com status, responsável/agente e evidências.
- Não marcar como concluído apenas porque o código foi escrito: validar o comportamento.
- **Manter a § _Ordem de implementação_ atualizada** no mesmo passo de qualquer mudança de status, tarefa nova ou `PEND-xx` resolvido: status na tabela, "Próxima tarefa", data e SHA do cabeçalho. Tarefa `DONE` sai da tabela; `BLOCKED` desce e cita o motivo.

Status permitidos: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.

**Este arquivo é a fonte única** do status das tarefas e das pendências de decisão (`PEND-xx`). Os demais documentos citam o ID; não replicam a lista. O detalhe de cada tarefa mora na story em [`docs/stories/`](stories/README.md), e a linha da tarefa carrega o link: `(Status: TODO | Story: docs/stories/<id>-<slug>.md)`.

## Fase 0 — Discovery e auditoria

- [x] 0.1 Identificar estrutura de diretórios e comandos existentes. (Status: DONE | Agente: Auditor | Arquivos: index.html, styles.css, main.js, assets/)
- [x] 0.2 Identificar todas as rotas/páginas. (Status: DONE | Agente: Auditor | Rota única identificada: `/` com âncoras internas)
- [x] 0.3 Mapear seções e ordem por página. (Status: DONE | Agente: Auditor | 10 seções ativas + 1 comentada catalogadas)
- [x] 0.4 Inventariar textos, imagens, vídeos, fontes, ícones e logos. (Status: DONE | Agente: Auditor | 20 assets, Poppins, FontAwesome, RemixIcon mapeados)
- [x] 0.5 Inventariar links, botões, formulários e destinos. (Status: DONE | Agente: Auditor | WhatsApp do legado +5561995395969 e links sociais mapeados; o rebuild usa os canais do cliente — ver `PEND-07`/`PEND-08`)
- [x] 0.6 Registrar comportamento atual de navegação e responsividade. (Status: DONE | Agente: Auditor | Breakpoints: 480px, 768px, 1024px, 1200px)
- [x] 0.7 Capturar screenshots de referência nos viewports definidos. (Status: DONE | Agente: Auditor | Estrutura visual e matriz de viewports documentadas)
- [x] 0.8 Identificar animações atuais que precisam ser preservadas. (Status: DONE | Agente: Auditor | Rotação 3D social e pulso WhatsApp documentados)
- [x] 0.9 Criar relatório oficial `docs/AUDIT.md` com achados, lacunas e riscos. (Status: DONE | Agente: Auditor | `docs/AUDIT.md` consagrado como oficial definitivo; duplicata da raiz excluída — ver `PEND-05`)

**Critério de saída:** inventário completo o suficiente para reconstruir o site sem adivinhar conteúdo ou comportamento. [ATENDIDO]

## Pendências de Decisão Registradas (Para Alinhamento com Responsável)

| ID | Item | Descrição / Opções | Status | Impacto na Fase |
|---|---|---|---|---|
| **PEND-01** | **Formulário de Contato sem Backend** | Mesma decisão de `PEND-10` — acompanhar lá (ID mantido para histórico; não reaproveitar). | `CONSOLIDADA em PEND-10` | — |
| **PEND-02** | **Links Placeholder** | 3 botões "Saiba Mais" do Blog e 8 links do rodapé apontavam para `#`. **Decisão do responsável (2026-11-03):** coluna Serviços do rodapé com 5 rótulos novos (Planejamento estratégico, Gestão de tráfego pago, Criação e Desenvolvimento, Chatbots e automação de atendimento, Relatórios e análise de resultados), cada um levando ao card do serviço na LP; Suporte com Contato (`#contact`) e Política e privacidade mantida em `href="#"` até o `PEND-12`; seção Blog removida junto com o link "Blog" da navbar e "Blogs" do rodapé. Implementado na [story 7.3](stories/7-3-links-rodape-remover-blog.md). | `RESOLVED` | Fase 7 (Evolução pós-entrega) |
| **PEND-03** | **Inconsistências Textuais** | Cards 5 e 6 de serviços em inglês; Card 4 de serviços com texto duplicado. Superada pelo conteúdo aprovado do cliente: a seção Serviços é `SUBSTITUIR`/`APPROVED` no [CONTENT-MAPPING.md](CONTENT-MAPPING.md) (linha 06, "resolve inconsistências de inglês e repetições") e os 6 serviços novos, em PT, estão em `src/data/services.ts` (tarefa 2.4). Resolvida em 2026-11-02. | `RESOLVED` | — |
| **PEND-04** | **Sintaxe da URL do Instagram** | O HTML original possui aspas extras no `href` (`igsh=ZDNlZDc0MzIxNw==""`). Superada pelo `PEND-08`: o rebuild usa a URL nova `https://www.instagram.com/nexusagencybr/`, sem as aspas. | `RESOLVED` | — |
| **PEND-05** | **Duplicata AUDIT.md na raiz** | `docs/AUDIT.md` definido como canônico oficial. Duplicata `AUDIT.md` da raiz excluída com autorização formal. | `RESOLVED` | Fase 1 (Consolidação) |
| **PEND-06** | **Hospedagem / Deploy** | Confirmar provedor de deploy (Vercel, Node server ou estático). | `PENDING_DECISION` | Fase 6 (Entrega) |
| **PEND-07** | **Número do WhatsApp (Legado vs. Cliente)** | Site legado usa `+55 (61) 99539-5969`; relatório do cliente cita `+55 (61) 9298-5392`. **Decisão (2026-11-02, responsável):** vale o número do cliente, `+55 (61) 9298-5392` (`https://wa.me/556192985392`), já em `SITE_CONFIG.whatsapp`. | `RESOLVED` | — |
| **PEND-08** | **Perfil do Instagram (Legado vs. Cliente)** | Site legado usa `@nexus.ag.contato`; relatório do cliente indica `@nexusagencybr`. **Decisão (2026-11-02, responsável):** valem os perfis do cliente — Instagram `https://www.instagram.com/nexusagencybr/` e LinkedIn `https://www.linkedin.com/company/nexus-ag-br/` (legado: `linkedin.com/in/nexusagency`), já em `SITE_CONFIG.socials`. Facebook inalterado. | `RESOLVED` | — |
| **PEND-09** | **Informações entre colchetes do Cliente** | Preenchimento dos números em falta (`[número]` milhões de pessoas, conversas, anos) e prazos (`[24 horas úteis]`). **Parcial (2026-11-03, responsável):** área de atendimento ("Atendimento em todo o Brasil, 100% online") e horário ("segunda a sexta, das 9h às 18h") aprovados e exibidos na coluna Canais do rodapé ([story 7.5](stories/7-5-coluna-canais-rodape.md)); `[ano]`, `[número]` e `[24 horas úteis]` seguem abertos. | `PENDING_APPROVAL` | Conversão (fora das Fases 0–6) |
| **PEND-10** | **Formulário de Contato (sem backend)** | Hoje `action="/"` + `preventDefault`, nada é enviado. Opções: (A) Route Handler/Server Action com e-mail (Resend); (B) Redirecionamento com mensagem para o WhatsApp; (C) CRM/plataforma externa; (D) Mock front-end com feedback. Comparação em [AUDIT.md § 12.2](AUDIT.md). **Sem JS** (medido na [4.4](stories/4-4-conteudo-sem-javascript.md), `npm run start`, 2026-11-02): o `preventDefault` não roda, o navegador faz `POST /` com os 4 campos e recebe `200` com a home pré-renderizada (`x-nextjs-cache: HIT`). Os dados são descartados e a página volta ao topo, sem aviso. | `PENDING_APPROVAL` | Conversão (fora das Fases 0–6) |
| **PEND-11** | **E-mail Institucional** | Inclusão de `contato@nexusagencybr.com.br` no Footer e canais de contato. **Decisão do responsável (2026-11-03):** incluir o e-mail nos canais de contato do rodapé (coluna Suporte, `mailto:`), fonte única em `SITE_CONFIG.email`. Seção Contato, navbar e Hero ficam sem o e-mail. Implementado na [story 7.4](stories/7-4-email-institucional-rodape.md). | `RESOLVED` | Fase 7 (Evolução pós-entrega) |
| **PEND-12** | **Política de Privacidade e LGPD** | Criação de rota/modal `/politica-de-privacidade` e termo de consentimento no form. | `PENDING_APPROVAL` | Conversão (fora das Fases 0–6) |
| **PEND-13** | **Animações protegidas com reduced motion (FR-11 × FR-07)** | O FR-11 pede desativar animações decorativas com `prefers-reduced-motion: reduce`. O FR-07 protege o pulso infinito `WaveWhatsApp` do botão flutuante e a rotação 3D `rotateY(360deg)` dos `SocialIcons` no hover ("não devem mudar visual, posição, links ou animação"). Hoje os dois animam com reduced motion. Opções: (A) manter como no legado; (B) desligar só o pulso com `reduce` (é infinito e automático; a rotação depende de hover); (C) desligar os dois com `reduce`. Levantado na [4.3](stories/4-3-reduced-motion.md). | `PENDING_DECISION` | Fase 4 (Acessibilidade) |
| **PEND-14** | **Redesign do Hero (exceção ao FR-02 e ao AGENTS.md § 4)** | O FR-02 pede reproduzir fielmente o Hero legado (foto `header.webp` + overlay, texto à esquerda no desktop). **Decisão (2026-11-03, responsável):** autorizado trocar o fundo por um brilho roxo animado no estilo de [hero-glow-reference.png](references/hero-glow-reference.png), com composição centralizada, "limpo e profissional", sem a interface de produto da referência. Vale só para fundo e composição do Hero; o texto continua o do legado. Executado na [7.1](stories/7-1-hero-background-animado.md). | `RESOLVED` | Fase 7 (Evolução visual) |
| **PEND-15** | **Cards com visual de vidro (exceção ao FR-01 e ao AGENTS.md § 4)** | O legado usa cards opacos `#0f1221`, com `border-bottom` roxa no hover e ícones que só ganham gradiente no hover (`styles.css:486-512`, `:567-597`). **Decisão (2026-11-03, responsável):** autorizado um padrão único de card de vidro (blur, borda iluminada, halo roxo), com ícones em cores vivas, no estilo de [cards-glass-reference.png](references/cards-glass-reference.png), em todos os cards de About, Banners, Serviços, Pacotes, Blog e Projetos. Vale só para o estilo dos cards; texto, ordem, imagens e links continuam os do legado/cliente. Executado na [7.2](stories/7-2-cards-glassmorphism.md). | `RESOLVED` | Fase 7 (Evolução visual) |
| **PEND-16** | **Breakpoints e transbordo dos Banners (rebuild × legado)** | O Tailwind (`sm: 480px`, `md: 768px`, `lg: 1024px`, `min-width`) vira o layout 1 px antes do legado (`@media (width > N)`, `styles.css:841`, `:874`, `:954`); em 480 e 768 exatos o rebuild diverge do legado e das capturas aprovadas nas 7.x. Entre ~481 e ~550 px os Banners em 2 colunas transbordam no legado também. **Decisão (2026-11-05, responsável):** igualar os breakpoints ao legado (`> 480/768/1024`), aceitando a mudança visual em 480 e 768 exatos; na faixa de 2 colunas, encolher o card dos Banners mantendo 2 colunas. **Revisto na implementação (mesmo dia, responsável):** só diminuir o título não cabia (88 px livres, a palavra precisa de 125 px), então entre 481 e 768 px o ícone fica acima do texto, com título e texto no tamanho de hoje. **Revisto no review (mesmo dia, responsável):** a troca global das telas do Tailwind piorava Projetos e Serviços em 1024 (3 → 2 colunas) e Serviços, Pacotes e rodapé em 768; vale o ponto do legado só onde a classe corresponde (menu, ícones sociais fixos, Banners), e o resto do site fica como antes. Executado na [4.1](stories/4-1-comportamento-por-breakpoint.md). | `RESOLVED` | Fase 4 (Responsividade) |

## Fase 1 — Fundação técnica

- [x] 1.1 Definir estratégia de migração e diretório do novo app. (Status: DONE | App Router em `src/`, assets públicos em `public/assets/`, legados preservados)
- [x] 1.2 Configurar Next.js App Router. (Status: DONE | Next.js 15.5.28 configurado com App Router e Server Components por padrão)
- [x] 1.3 Configurar React e TypeScript. (Status: DONE | React 19.3.1, TypeScript 5.9.3 e `@/*` path aliases em tsconfig.json)
- [x] 1.4 Configurar Tailwind CSS. (Status: DONE | Tailwind CSS 3.4.19, PostCSS 8 e tokens customizados em tailwind.config.ts)
- [x] 1.5 Instalar/configurar GSAP e ScrollTrigger. (Status: DONE | GSAP 3.15.0 com registro seguro em `src/animations/gsap.client.ts`)
- [x] 1.6 Avaliar `@gsap/react`. (Status: DONE | `@gsap/react` 2.1.2 instalado e compatível com React 19)
- [x] 1.7 Definir tokens e fontes existentes. (Status: DONE | Fonte Poppins via `next/font/google` e paleta oficial em `globals.css`)
- [x] 1.8 Configurar lint, scripts e aliases. (Status: DONE | Scripts dev, build, start e lint existem; **ESLint não está configurado** — `npm run lint` (`next lint`) pede configuração interativa. Configurar exige dependências novas (`eslint`, `eslint-config-next`) e aprovação)
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

- [x] 3.1 Criar inicialização client-side de GSAP e ScrollTrigger. (Status: DONE | `gsap.client.ts`, `ScrollText`, `ScrollReveal`, `ParallaxImage` criados. GSAP 3.15.0 (instalado; `package.json` declara `^3.12.7`) + ScrollTrigger + Flip registrados client-side.)
- [x] 3.2 Definir padrões/timings consistentes. (Status: DONE | `presets.ts` com durations, easings e stagger values definidos. HeroClient, AboutClient, BannersClient, ServicesClient, BlogClient, FooterClient implementados com valores coerentes.)
- [x] 3.3 Implementar leitura progressiva bidirecional. (Status: DONE | `ScrollText` com scrub bidirecional em: Hero parágrafo, About título + parágrafo[0], Services título + subtítulo. Reversível via scrub.)
- [x] 3.4 Implementar reveals de texto e elementos. (Status: DONE | `ScrollReveal` e wrappers com `gsap.from()` em todas as seções: About parágrafos, highlight, missão, visão, valores; Banners cards; Blog cards; Contact campos + CTA; Footer colunas. Os reveals usam `gsap.from()` dentro de `useEffect`; a 4.4 conferiu que sem JS e antes da hidratação nada fica invisível por causa deles.)
- [x] 3.5 Implementar transições de imagem quando adequadas. (Status: DONE | `ParallaxImage` aplicado na ilustração `grafic.png` da seção About com `yPercent: -12`. Entrada da esquerda (`x: -60`) via `AboutClient`.)
- [x] 3.6 Implementar parallax apenas onde aprovado/adequado. (Status: DONE | Parallax vertical no background do Hero via `backgroundPositionY` scrubbed. ParallaxImage leve na ilustração About.)
- [x] 3.7 Implementar transições entre seções. (Status: DONE | Stagger entre cards das seções Banners, Services, Projects (GSAP Flip para filtro), Blog. Footer revela colunas coordenadas.)
- [x] 3.8 Implementar microinterações de botões permitidos. (Status: DONE | `WhatsAppFloat` com GSAP mouseenter/mouseleave spring + click pulse. CSS `WaveWhatsApp` preservado. Botões sociais FR-07 intocados.)
- [x] 3.9 Garantir cleanup e ausência de ScrollTriggers duplicados. (Status: DONE | Todos os wrappers usam `gsap.context()` com `ctx.revert()` ou cleanup manual no return do useEffect. ScrollTrigger registrado uma vez por contexto.)

**Build de validação (2026-11-02, `89ba586`):** `npm run build` → exit code 0, zero erros TypeScript. Rota `/` 13.5 kB, First Load JS 178 kB (shared 103 kB).

**Critério de saída:** efeitos funcionam em ambos os sentidos do scroll, sem erros, flicker ou bloqueio de navegação. [ATENDIDO — QA visual feito na Fase 6]

## Fase 4 — Responsividade e acessibilidade

- [x] 4.1 Definir comportamento desktop/tablet/mobile. (Status: DONE | Story: [4-1-comportamento-por-breakpoint.md](stories/4-1-comportamento-por-breakpoint.md) | Menu, ícones sociais fixos e Banners nos pontos exatos do legado (`width > 480/768`) com `min-[481px]:`/`min-[769px]:` — a troca global das telas foi medida e revertida no review (piorava 768/1024, `PEND-16`); sem scroll horizontal de 375 a 1200 (antes 504 px em 480); ícone dos Banners acima do texto em 481–768; parallax do Hero só acima de 768 e mola do WhatsApp só com mouse (`gsap.matchMedia()` + `MOTION_MEDIA`); Banners sem piscar (`gsap.set` explícito); [breakpoints_banners_480.png](references/qa/breakpoints_banners_480.png), [breakpoints_banners_481.png](references/qa/breakpoints_banners_481.png), [breakpoints_768.png](references/qa/breakpoints_768.png))
- [x] 4.2 Ajustar distâncias e intensidades por breakpoint. (Status: DONE | Story: [4-2-distancias-intensidades-por-breakpoint.md](stories/4-2-distancias-intensidades-por-breakpoint.md) | Reveals das seções atrelados ao scroll, um trigger por elemento, em toda largura, `y` 24px até 768px (decisão do responsável). Sonda CDP nos 5 viewports e em `next start`: opacidade de cada alvo = a esperada pela posição, descendo, subindo, pulando, no resize 1200 ↔ 375, na recarga e após o filtro de Projetos (0 desvios > 0,08); fim da página inteiro; CPU 4× sem quadro > 50 ms — [scrub_reveal_375.png](references/qa/scrub_reveal_375.png), [scrub_reveal_1200.png](references/qa/scrub_reveal_1200.png))
- [x] 4.3 Implementar reduced motion. (Status: DONE | Story: [4-3-reduced-motion.md](stories/4-3-reduced-motion.md) | Guarda síncrona `prefersReducedMotion()` nos 12 efeitos, limpeza completa (Hero, `ScrollText`, contador) e CSS de reduced motion; Hero, textos e "+50" visíveis com `reduce` em [reduced_1200.png](references/qa/reduced_1200.png) e [reduced_375.png](references/qa/reduced_375.png); pulso/rotação aguardam `PEND-13`)
- [x] 4.4 Verificar conteúdo sem JavaScript/animação. (Status: DONE | Story: [4-4-conteudo-sem-javascript.md](stories/4-4-conteudo-sem-javascript.md) | `<noscript><style>` no `<head>` deixa os 5 `ScrollText` em branco pleno sem JS; auditoria em [nojs_375.png](references/qa/nojs_375.png) e [nojs_1200.png](references/qa/nojs_1200.png), todos os blocos visíveis)
- [ ] 4.5 Testar teclado, foco e semântica. (Status: TODO | Story: —)
- [ ] 4.6 Verificar contraste em todos os estados animados. (Status: TODO | Story: — | Lighthouse Accessibility 94 na 5.6)
- [x] 4.7 Corrigir o card Design do Banner invisível com movimento. (Status: DONE | Story: [4-7-card-design-banner-invisivel.md](stories/4-7-card-design-banner-invisivel.md) | Achado da [4.3](stories/4-3-reduced-motion.md). Causa medida: o `gsap.from` com stagger + ScrollTrigger de [BannersClient.tsx](../src/sections/Banners/BannersClient.tsx) gravava o estado inicial do 1º card como destino; a suspeita do `transition-all` não se confirmou. Conserto: `fromTo` com destino explícito; 3 cards visíveis nos 5 viewports, nos dois sentidos do scroll e recarregando abaixo da seção; [banners_design_1200.png](references/qa/banners_design_1200.png), [banners_design_375.png](references/qa/banners_design_375.png))
- [ ] 4.8 Eliminar o piscar do Hero na hidratação. (Status: TODO | Story: — | Separada da [4.1](stories/4-1-comportamento-por-breakpoint.md): o [HeroClient.tsx](../src/sections/Hero/HeroClient.tsx) aplica `opacity: 0` no `useEffect`, depois do 1º paint do HTML visível do servidor; não depende de largura. A entrada é a aprovada do FR-02.)

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
- [x] 6.4 Testar reduced motion. (Status: DONE | Fallback seguro ativo; verificação completa por seção fica na 4.3)
- [x] 6.5 Testar viewports definidos. (Status: DONE | 375px a 1200px capturados e validados)
- [x] 6.6 Executar lint, testes disponíveis e build de produção. (Status: DONE | Build limpo, exit code 0; sem testes automatizados e sem lint configurado — ver 1.8)
- [x] 6.7 Corrigir erros e regressões. (Status: DONE | Padronização Fluid Button dos botões de contato e filtros concluída)
- [x] 6.8 Registrar resumo de entrega e limitações conhecidas. (Status: DONE | Relatório final apresentado)
- [ ] 6.9 Remover código de motion/About não usado. (Status: TODO | Story: — | Achado da [4.4](stories/4-4-conteudo-sem-javascript.md): [MissionVisionValues.tsx](../src/sections/About/MissionVisionValues.tsx) não é importado, [capture_mvv.js](../scripts/capture_mvv.js) só o valida e [ScrollReveal.tsx](../src/components/motion/ScrollReveal.tsx) não tem uso (`grep "<ScrollReveal" src` vazio). Confirmar com quem escreveu antes de apagar.)

**Critério de saída:** checklist aprovado, build concluído e nenhuma regressão crítica conhecida. [ATENDIDO]

## Fase 7 — Evolução visual (pós-entrega)

Mudanças de design pedidas pelo responsável depois da entrega. Cada uma depende de um `PEND-xx` que autorize a exceção à fidelidade ao legado.

- [x] 7.1 Redesenhar o Hero com background roxo animado. (Status: DONE | Story: [7-1-hero-background-animado.md](stories/7-1-hero-background-animado.md) | Exceção autorizada no `PEND-14`; brilho em camadas CSS, parado com reduced motion, contraste mínimo de 15:1, 0 Layout/Paint extra no trace; [hero_glow_1200.png](references/qa/hero_glow_1200.png), [hero_glow_375.png](references/qa/hero_glow_375.png); aprovado pelo responsável)
- [x] 7.2 Padronizar os cards com visual de vidro e bordas iluminadas. (Status: DONE | Story: [7-2-cards-glassmorphism.md](stories/7-2-cards-glassmorphism.md) | Exceção autorizada no `PEND-15`; padrão único `glass-card`/`glass-icon`/`glass-ambient` em 31 cards de About, Banners, Serviços, Pacotes, Blog e Projetos; borda no `::after` (480px igual ao baseline), contraste ≥ 4,60:1, 0 card escondido nos 5 viewports e com reduced motion, trace na faixa do baseline; barra do destaque do About e espaço entre linhas dos Serviços ajustados a pedido; [cards_glass_1200.png](references/qa/cards_glass_1200.png), [cards_glass_375.png](references/qa/cards_glass_375.png); aprovado pelo responsável)
- [x] 7.3 Apontar os links do rodapé para a LP e remover o Blog. (Status: DONE | Story: [7-3-links-rodape-remover-blog.md](stories/7-3-links-rodape-remover-blog.md) | `PEND-02` RESOLVED; 5 serviços → cards (`#<SERVICES_DATA.id>`, `scroll-mt-32`), Contato → `#contact`, Privacidade em `#` até o `PEND-12`; Blog, `blog.ts`, `BlogPostItem` e `public/assets/blog-*.jpg` removidos; colunas do rodapé redistribuídas para o rótulo mais longo caber em 768–1200px; [footer_links_1200.png](references/qa/footer_links_1200.png), [footer_links_375.png](references/qa/footer_links_375.png); aprovado visualmente pelo responsável em 2026-11-05)
- [x] 7.4 Incluir o e-mail institucional no rodapé. (Status: DONE | Story: [7-4-email-institucional-rodape.md](stories/7-4-email-institucional-rodape.md) | `PEND-11` RESOLVED; `mailto:contato@nexusagencybr.com.br` na coluna Suporte, via `SITE_CONFIG.email`; colunas 4/4/4 entre 1024 e 1199px para o endereço caber; 0 link cortado nos 5 viewports; [footer_email_1200.png](references/qa/footer_email_1200.png), [footer_email_375.png](references/qa/footer_email_375.png); revisada e revalidada no build de produção; aprovado visualmente pelo responsável em 2026-11-05)
- [x] 7.5 Adicionar a coluna Canais ao rodapé e remover o texto debaixo da logo. (Status: DONE | Story: [7-5-coluna-canais-rodape.md](stories/7-5-coluna-canais-rodape.md) | `PEND-09` parcial (horário e área de atendimento); parágrafo institucional removido a pedido; grade 2/4/3/3 em ≥ 1200px e logo em linha própria abaixo disso; 0 link cortado nos 5 viewports; [footer_canais_1200.png](references/qa/footer_canais_1200.png), [footer_canais_1024.png](references/qa/footer_canais_1024.png), [footer_canais_375.png](references/qa/footer_canais_375.png); revisada e revalidada no build de produção, 4 colunas com `opacity` 1 nos dois sentidos do scroll; aprovado visualmente pelo responsável em 2026-11-05)

**Critério de saída:** cada mudança aprovada visualmente pelo responsável, sem violar o [QA-CHECKLIST](QA-CHECKLIST.md) § 9. [ATENDIDO — 7.1 a 7.5 aprovadas pelo responsável; rodapé (7.3–7.5) aprovado em 2026-11-05]

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
