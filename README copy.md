# Documentação do projeto — Refatoração do site da agência

Este pacote define a visão de negócio, requisitos de produto, arquitetura, implementação e qualidade para reconstruir o site existente em **Next.js, React, TypeScript, Tailwind CSS e GSAP**.

## Como usar

1. Coloque esta pasta na raiz do repositório ou copie seu conteúdo para uma pasta `docs/`.
2. Leia `AGENTS.md` antes de iniciar qualquer tarefa.
3. Execute primeiro a Fase 0 de `TASKS.md` (auditoria e inventário). Não implemente antes de conhecer o site atual.
4. Atualize os documentos quando decisões forem confirmadas. Não invente conteúdo ausente.
5. Use `PRD.md` como referência de comportamento, `TECHNICAL-SPEC.md` e `ARCHITECTURE.md` como referência técnica e `QA-CHECKLIST.md` para validação.

## Documentos

| Documento | Finalidade |
|---|---|
| `BRD.md` | Objetivos de negócio, contexto e resultados esperados |
| `PRD.md` | Requisitos funcionais, experiência e comportamento |
| `TECHNICAL-SPEC.md` | Stack, padrões técnicos e restrições |
| `ARCHITECTURE.md` | Organização de pastas, módulos e responsabilidades |
| `TASKS.md` | Fases, tarefas, dependências e critérios de conclusão |
| `QA-CHECKLIST.md` | Plano de testes e critérios de aceite |
| `AGENTS.md` | Instruções permanentes para agentes de IA |

## Princípio de fonte da verdade

O site atual é a fonte de verdade para marca, conteúdo, estrutura, imagens, links, contatos e funcionalidades existentes. Estes documentos definem a transformação técnica e a nova experiência de movimento. Onde a informação ainda não foi descoberta, o agente deve auditar e registrar; não deve preencher lacunas com suposições.

## Decisões já estabelecidas

- Escopo: reconstrução (rebuild) do site atual, usando-o como referência visual e funcional.
- Estratégia de execução: múltiplos agentes/ferramentas, com coordenação por documentação e tarefas.
- Stack desejada: Next.js, React, TypeScript, Tailwind CSS, GSAP e ScrollTrigger.
- Prioridade de experiência: scroll narrativo, leitura progressiva dos textos, transições e microinterações.
- Botões de WhatsApp: podem receber novas microinterações, preservando destinos e comportamento.
- Botões de redes sociais: não alterar visual, links ou comportamento.
- Design existente: preservar fielmente; não redesenhar nem inventar seções.
- A estrutura real de seções e conteúdo será descoberta na auditoria do projeto.
