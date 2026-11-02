# AGENTS.md — Instruções para agentes de desenvolvimento

## 1. Missão

Reconstruir o site institucional existente em Next.js, React, TypeScript, Tailwind CSS e GSAP, preservando fielmente o design, conteúdo, estrutura, assets e funcionalidades atuais, e implementando uma experiência de scroll fluida e acessível.

## 2. Leitura obrigatória

Antes de executar qualquer tarefa:
1. Leia este arquivo.
2. Leia `docs/BRD.md`, `docs/PRD.md`, `docs/TECHNICAL-SPEC.md` e `docs/ARCHITECTURE.md`.
3. Leia a tarefa específica em `docs/TASKS.md`.
4. Consulte `docs/QA-CHECKLIST.md` antes de declarar a tarefa concluída.
5. Na primeira execução, realize a auditoria e produza `docs/AUDIT.md`.

## 3. Fonte da verdade

- O site atual é a fonte de verdade para identidade visual, conteúdo, seções, links, assets e comportamento existente.
- O PRD define os comportamentos novos aprovados.
- A Technical Spec e Architecture definem padrões técnicos.
- Se houver conflito, não escolha silenciosamente: registre a divergência e peça decisão ao responsável.
- Não presuma que exemplos de estrutura ou nomes de seções sejam reais.

## 4. Restrições inegociáveis

- Não redesenhar a marca ou a interface.
- Não alterar cores, fontes, conteúdo, imagens ou ordem das seções sem autorização.
- Não criar seções, serviços, depoimentos, números ou dados comerciais fictícios.
- Não remover funcionalidades existentes.
- Não alterar botões de redes sociais: visual, ícones, posição, links, comportamento e animação.
- Não alterar os destinos, telefones, mensagens ou parâmetros dos botões de WhatsApp.
- Não adicionar dependências sem justificar a necessidade.
- Não introduzir backend, CMS ou integrações não solicitadas.
- Não deixar conteúdo importante dependente de animação.
- Não bloquear ou sequestrar o scroll.
- Não declarar tarefa concluída sem validar.

## 5. Protocolo de trabalho

1. Confirmar escopo e dependências da tarefa.
2. Inspecionar os arquivos antes de editar.
3. Informar brevemente o plano quando houver risco ou impacto amplo.
4. Alterar apenas os arquivos necessários.
5. Seguir padrões existentes ou documentar a mudança de padrão.
6. Executar testes/validações aplicáveis.
7. Revisar diff para detectar alterações acidentais.
8. Atualizar `TASKS.md` e, se necessário, os documentos afetados.
9. Entregar resumo com arquivos alterados, validações, resultado e pendências.

## 6. Trabalho com múltiplos agentes

- Um agente deve atuar como orquestrador e manter a fonte da verdade.
- Antes de delegar, delimitar tarefa, arquivos permitidos, dependências e critério de aceite.
- Não permitir que dois agentes editem simultaneamente o mesmo arquivo sem coordenação.
- O auditor não deve modificar o site durante a fase de discovery.
- O agente de UI deve concluir a fidelidade estrutural antes de o motion engineer adicionar animações complexas.
- O motion engineer não deve alterar conteúdo ou design.
- O QA deve reportar defeitos com passos de reprodução e evidências.
- Ao integrar trabalhos paralelos, revisar conflitos, convenções e efeitos colaterais.

## 7. Padrões técnicos obrigatórios

- Next.js App Router.
- React e TypeScript.
- Tailwind CSS para estilos utilitários.
- GSAP + ScrollTrigger para animações.
- Server Components por padrão.
- Client Components apenas quando necessário.
- Não acessar APIs do browser no render do servidor.
- Escopar e limpar animações GSAP corretamente.
- Respeitar `prefers-reduced-motion`.
- Garantir fallback de conteúdo visível sem animação.
- Preferir `transform` e `opacity`.
- Evitar `pin` sem justificativa.
- Testar movimento de scroll nos dois sentidos.

## 8. Padrão específico para leitura progressiva

- Implementar somente nos textos selecionados no inventário/PRD.
- Vincular o progresso visual ao scroll, preferencialmente com `scrub`.
- A animação deve ser reversível.
- Preservar pontuação, espaços, acentos, seleção de texto e semântica.
- Não duplicar texto para leitores de tela.
- Não iniciar com texto invisível.
- Validar textos curtos, longos e multilinha.
- Garantir legibilidade em todos os estados.

## 9. Critério de conclusão de uma tarefa

Uma tarefa só pode ser marcada `DONE` quando:
- o requisito correspondente foi implementado;
- os critérios de aceite foram verificados;
- testes relevantes foram executados;
- não há regressão conhecida;
- documentação/status foram atualizados;
- limitações restantes foram explicitadas.

## 10. Formato de entrega do agente

Ao concluir, responder com:
- **Objetivo:** o que foi feito.
- **Arquivos:** quais foram criados/alterados.
- **Decisões:** decisões técnicas relevantes.
- **Validação:** comandos e testes executados e seus resultados.
- **Pendências:** o que não foi concluído ou precisa de decisão.
- **Riscos:** possíveis impactos ou regressões a observar.

## 11. Comunicação e autonomia

- Não interromper para perguntar detalhes que podem ser descobertos inspecionando o repositório.
- Perguntar ao responsável quando uma decisão de negócio, conteúdo, identidade, link ou escopo não puder ser inferida com segurança.
- Não inventar valores ausentes.
- Preferir mudanças pequenas, verificáveis e reversíveis.
