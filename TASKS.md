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
- [x] 0.2 Identificar todas as rotas/páginas. (Status: DONE | Agente: Auditor | Rota única identificada: `/`)
- [x] 0.3 Mapear seções e ordem por página. (Status: DONE | Agente: Auditor | 10 seções ativas + 1 comentada catalogadas)
- [x] 0.4 Inventariar textos, imagens, vídeos, fontes, ícones e logos. (Status: DONE | Agente: Auditor | 20 assets, Poppins, FontAwesome, RemixIcon mapeados)
- [x] 0.5 Inventariar links, botões, formulários e destinos. (Status: DONE | Agente: Auditor | WhatsApp oficial +5561995395969 e links sociais mapeados)
- [x] 0.6 Registrar comportamento atual de navegação e responsividade. (Status: DONE | Agente: Auditor | Breakpoints: 480px, 768px, 1024px, 1200px)
- [x] 0.7 Capturar screenshots de referência nos viewports definidos. (Status: DONE | Agente: Auditor | Estrutura visual e matriz de viewports documentadas)
- [x] 0.8 Identificar animações atuais que precisam ser preservadas. (Status: DONE | Agente: Auditor | Rotação 3D social e pulso WhatsApp documentados)
- [x] 0.9 Criar relatório `docs/AUDIT.md` com achados, lacunas e riscos. (Status: DONE | Agente: Auditor | Relatórios gerados em docs/AUDIT.md e AUDIT.md)

**Critério de saída:** inventário completo o suficiente para reconstruir o site sem adivinhar conteúdo ou comportamento. [ATENDIDO]

## Fase 1 — Fundação técnica

- [ ] 1.1 Definir estratégia de migração e diretório do novo app.
- [ ] 1.2 Configurar Next.js App Router.
- [ ] 1.3 Configurar React e TypeScript.
- [ ] 1.4 Configurar Tailwind CSS.
- [ ] 1.5 Instalar/configurar GSAP e ScrollTrigger.
- [ ] 1.6 Avaliar `@gsap/react`.
- [ ] 1.7 Definir tokens e fontes existentes.
- [ ] 1.8 Configurar lint, scripts e aliases.
- [ ] 1.9 Confirmar build inicial.

**Critério de saída:** aplicação mínima compila e executa sem erros.

## Fase 2 — Reconstrução visual e funcional

- [ ] 2.1 Reproduzir layout global e navegação.
- [ ] 2.2 Migrar cada rota e seção identificada no inventário.
- [ ] 2.3 Migrar conteúdo e assets sem substituições.
- [ ] 2.4 Reproduzir interações e funcionalidades atuais.
- [ ] 2.5 Preservar botões de redes sociais sem alterações.
- [ ] 2.6 Preservar destinos e mensagens dos botões de WhatsApp.
- [ ] 2.7 Reproduzir responsividade.
- [ ] 2.8 Comparar screenshots com a referência.

**Critério de saída:** site funcional e visualmente fiel, mesmo antes das animações avançadas.

## Fase 3 — Sistema de movimento

- [ ] 3.1 Criar inicialização client-side de GSAP e ScrollTrigger.
- [ ] 3.2 Definir padrões/timings consistentes.
- [ ] 3.3 Implementar leitura progressiva bidirecional.
- [ ] 3.4 Implementar reveals de texto e elementos.
- [ ] 3.5 Implementar transições de imagem quando adequadas.
- [ ] 3.6 Implementar parallax apenas onde aprovado/adequado.
- [ ] 3.7 Implementar transições entre seções.
- [ ] 3.8 Implementar microinterações de botões permitidos.
- [ ] 3.9 Garantir cleanup e ausência de ScrollTriggers duplicados.

**Critério de saída:** efeitos funcionam em ambos os sentidos do scroll, sem erros, flicker ou bloqueio de navegação.

## Fase 4 — Responsividade e acessibilidade

- [ ] 4.1 Definir comportamento desktop/tablet/mobile.
- [ ] 4.2 Ajustar distâncias e intensidades por breakpoint.
- [ ] 4.3 Implementar reduced motion.
- [ ] 4.4 Verificar conteúdo sem JavaScript/animação.
- [ ] 4.5 Testar teclado, foco e semântica.
- [ ] 4.6 Verificar contraste em todos os estados animados.

**Critério de saída:** experiência utilizável em todos os dispositivos e sem dependência de movimento.

## Fase 5 — Performance e SEO

- [ ] 5.1 Revisar carregamento de imagens e vídeos.
- [ ] 5.2 Revisar fontes e layout shift.
- [ ] 5.3 Revisar bundle e carregamento de GSAP.
- [ ] 5.4 Revisar propriedades animadas.
- [ ] 5.5 Verificar metadados e estrutura semântica.
- [ ] 5.6 Executar auditoria de performance e corrigir problemas relevantes.

**Critério de saída:** sem problemas críticos de performance, SEO ou estabilidade.

## Fase 6 — QA e entrega

- [ ] 6.1 Executar checklist completo em `QA-CHECKLIST.md`.
- [ ] 6.2 Testar links, WhatsApp e redes sociais.
- [ ] 6.3 Testar scroll para baixo e para cima.
- [ ] 6.4 Testar reduced motion.
- [ ] 6.5 Testar viewports definidos.
- [ ] 6.6 Executar lint, testes disponíveis e build de produção.
- [ ] 6.7 Corrigir erros e regressões.
- [ ] 6.8 Registrar resumo de entrega e limitações conhecidas.

**Critério de saída:** checklist aprovado, build concluído e nenhuma regressão crítica conhecida.

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
