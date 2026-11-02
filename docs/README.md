# Documentação — Nexus Agency

Índice central. Toda a documentação do projeto mora em `docs/`, exceto três
arquivos que ficam na raiz porque ferramentas os leem de lá:
[AGENTS.md](../AGENTS.md) (regras inegociáveis para agentes — **leia primeiro**),
[CLAUDE.md](../CLAUDE.md) (guia do Claude Code) e [README.md](../README.md)
(entrada do repositório).

## Onde cada informação mora (uma fonte por assunto)

| Assunto | Fonte única | Os outros documentos… |
| --- | --- | --- |
| Objetivos de negócio, escopo, riscos | [BRD.md](BRD.md) | citam |
| Comportamento aprovado (FR-xx) | [PRD.md](PRD.md) | citam o FR |
| Stack e regras técnicas | [TECHNICAL-SPEC.md](TECHNICAL-SPEC.md) | citam a seção |
| Pastas, responsabilidades, decisões arquiteturais | [ARCHITECTURE.md](ARCHITECTURE.md) | citam a seção |
| Status das tarefas **e** pendências de decisão `PEND-xx` | [TASKS.md](TASKS.md) | citam só o ID |
| Critérios de aceite e de liberação | [QA-CHECKLIST.md](QA-CHECKLIST.md) | citam a seção |
| Inventário do site legado + auditoria de funcionalidades/conversão | [AUDIT.md](AUDIT.md) | citam a seção |
| Conteúdo do cliente vs. legado | [CONTENT-MAPPING.md](CONTENT-MAPPING.md) | citam a linha da matriz |
| Detalhe de uma tarefa (contexto, ACs, Change Log) | [stories/](stories/README.md) | — |
| Como um fluxo funciona de ponta a ponta | [tdds/](tdds/README.md) | — |
| Evidências visuais | [references/](references/) — `screenshot.png` (legado), `client-content.pdf`, `qa/` (capturas) | — |

Se uma informação aparecer em dois lugares, um deles está errado: mantenha a
fonte acima e troque a cópia por um link.

## Fluxo de trabalho (skills em `.claude/skills/`)

`story` → `validate-story` → `implement` → `review-mr` → `close-story` →
`merge-request` (só quando houver remoto). `tdd` documenta fluxos em `tdds/`.
