---
name: story
description: Escreve a story de uma tarefa do site Nexus Agency em docs/stories/ — contexto medido contra o código e o site legado, escopo, fora de escopo, decisões, tamanho, critérios de aceite verificáveis, plano técnico, validações exigidas, riscos e Change Log — e mantém o status dela sincronizado com o TASKS.md (TODO → IN_PROGRESS → DONE, ou BLOCKED). Use SEMPRE que uma tarefa, story, feature, bug ou ajuste for criado, planejado ou quebrado em partes; ao começar a trabalhar numa tarefa; ao terminá-la; e ao retomá-la. Gatilhos - "cria a story", "abre uma tarefa", "quebra isso em tarefas", "qual o tamanho disso", "quais os ACs", "documenta essa feature", "vou começar a 4.1", "terminei a tarefa".
---

# Story de uma tarefa do Nexus

O código conta **o que** foi feito; a story guarda **por que** foi feito assim,
**o que foi descartado** e **como saber que acabou**. O `TASKS.md` é o quadro
(uma linha por tarefa, com status); a story é o detalhe da tarefa.

Acima da story estão, nesta ordem: o **site legado** (`index.html`,
`styles.css`, `main.js`, `assets/`) como fonte de verdade de conteúdo e visual,
o [AGENTS.md](../../../AGENTS.md) (restrições inegociáveis), o
[PRD.md](../../../docs/PRD.md) (comportamentos novos aprovados) e a
[TECHNICAL-SPEC.md](../../../docs/TECHNICAL-SPEC.md) /
[ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) (padrões técnicos). A story não
redecide o que já está decidido lá — ela cita. Conflito entre eles **não se
resolve na story**: vira pendência `PEND-xx` no `TASKS.md` e pergunta ao
responsável (AGENTS.md § 3).

## Onde as coisas moram

| Artefato | Caminho |
| --- | --- |
| A story | `docs/stories/<id>-<slug>.md` (ex.: `4.1` → `docs/stories/4-1-comportamento-por-breakpoint.md`) |
| Índice das stories | `docs/stories/README.md` — acrescente a linha da story nova |
| O quadro de status | [docs/TASKS.md](../../../docs/TASKS.md) — a linha `- [ ] <id> …` da fase |
| Pendências de decisão | `docs/TASKS.md` § _Pendências de Decisão Registradas_ (`PEND-xx`) |
| Evidência visual | pasta temporária fora do repositório — nunca commitada |
| Referência do legado | legado (`index.html`/`styles.css`), `docs/AUDIT.md`, `docs/CONTENT-MAPPING.md`, `docs/references/client-content.pdf` |

**O ID vem do `TASKS.md`.** Tarefa que já tem linha lá usa aquele ID e aquele
título. Tarefa nova entra no `TASKS.md` **primeiro**, na fase certa, com o
próximo número livre da fase — **ID nunca se reaproveita**. Trabalho que não
cabe em nenhuma fase (correção pós-entrega, por exemplo) ganha uma fase nova no
fim do arquivo, não um número enfiado numa fase fechada.

## Quando usar

- Toda tarefa que muda código, conteúdo ou comportamento do site. Ajuste de uma
  linha também — a story pode ser curta, mas existe.
- Ao quebrar um pedido grande: uma story por parte entregável sozinha, não uma
  por arquivo tocado.
- **Ao começar** — antes da primeira linha de código, o status vira
  `IN_PROGRESS`.
- **Ao terminar** — `DONE` só com o critério de conclusão do AGENTS.md § 9
  inteiro cumprido.
- Ao retomar: acrescente linha no **Change Log** em vez de reescrever.

## O que fazer

1. **Escolha o ID** (acima).
2. **Meça antes de escrever.** O cabeçalho carrega `baseline_commit:` — o SHA
   (`git rev-parse HEAD`) contra o qual você leu o código. Toda afirmação sobre
   o repositório no _Contexto_ vale **naquele** commit. Leia o código e o
   legado, não o registro: o `TASKS.md` marca como `DONE` coisas que podem ter
   regredido depois.
3. **Escreva o arquivo** a partir de [TEMPLATE.md](TEMPLATE.md). Nenhuma seção é
   opcional: seção vazia vira "Nada." explícito. Story nova nasce `TODO`.
4. **Sincronize o `TASKS.md`**: a linha da tarefa ganha o link para a story e o
   status (`(Status: TODO | Story: docs/stories/<arquivo>.md)`). Quadro que
   discorda da story é quadro que mente.
5. **Não commite** — commit é pedido explícito do usuário.

## Ciclo de vida do status

O vocabulário é o do `TASKS.md` (AGENTS.md / TASKS.md § _Regras de execução_):

```
TODO  →  IN_PROGRESS  →  DONE
              ↕
           BLOCKED  (com o PEND-xx ou o motivo, no Change Log)
```

| Status | Significa | Quem move, e quando |
| --- | --- | --- |
| `TODO` | Story escrita; ainda não validada ou não iniciada. | A criação da story. |
| `IN_PROGRESS` | Alguém está trabalhando nela agora. | Você, antes da primeira linha de código. |
| `BLOCKED` | Depende de decisão do responsável (`PEND-xx`) ou de outra tarefa. | Você, ao esbarrar no bloqueio — com o motivo. |
| `DONE` | Critério de conclusão do AGENTS.md § 9 cumprido, validação carimbada. | Você, depois da revisão (skill `review-mr`). |

**Validação antes de implementar.** Story `TODO` que ninguém revisou pede a
skill `validate-story` ou o aval do usuário. Um pedido explícito ("pode fazer a
4.1") **é** o aval — registre no Change Log.

### Ao começar

1. Confira a branch: `git rev-parse --abbrev-ref HEAD`. O repositório hoje
   trabalha direto na `main` (remoto `origin` no GitHub); se o usuário pedir branch, use
   `task/<id>-<slug>` criada a partir da `main`.
2. Status para `IN_PROGRESS` na story **e** no `TASKS.md`.
3. Change Log: `| AAAA-MM-DD | IN_PROGRESS | iniciada sobre <SHA curto> |`.

### Ao terminar

Só com a _Definition of Done_ inteira marcada. Validação vermelha ou AC sem
verificação é `IN_PROGRESS`, não `DONE`.

1. **Carimbe a validação** no Change Log: os comandos exatos, o resultado e o
   SHA (ou "árvore de trabalho sobre `<SHA>`" quando não houve commit).
2. Status para `DONE` na story **e** no `TASKS.md` (`[x]`, com o resumo da
   evidência — o formato que as linhas existentes já usam).
3. Decisão do responsável que a tarefa consumiu: o `PEND-xx` muda para
   `RESOLVED` com a decisão em uma frase.
4. Se a tarefa mudou um padrão técnico, a `TECHNICAL-SPEC.md` /
   `ARCHITECTURE.md` (§ _Decisões arquiteturais registradas_) muda no mesmo
   passo, e o [CLAUDE.md](../../../CLAUDE.md) se ele descrever aquilo.

**Toda transição deixa linha no Change Log** — e atualiza a § _Ordem de
implementação_ no topo do `TASKS.md` (status na tabela, "Próxima tarefa",
data e SHA; `DONE` sai da tabela, `BLOCKED` desce com o motivo, tarefa nova
entra na posição pela dependência e prioridade).

## As regras que separam uma story boa de um bilhete

### Critérios de aceite são verificáveis, não desejos

Cada AC vira uma verificação que alguém repete. Comportamento observável, nunca
implementação.

- ❌ "A seção fica mais fluida." — não dá para falhar.
- ❌ "Usar `gsap.matchMedia()` no About." — isso é plano técnico.
- ✅ "Em 375px, o título do About não ultrapassa a largura da tela e o texto
  progressivo começa a iluminar quando o topo do parágrafo cruza 82% da
  viewport; ao rolar de volta, retorna ao tom inicial."

Numere (`AC #1`, `AC #2`). Inclua os **caminhos infelizes deste site**:
`prefers-reduced-motion: reduce` (conteúdo visível, sem animação), JavaScript
desabilitado / antes da hidratação (nada invisível), scroll para cima,
resize/refresh no meio da página, viewport de 375px.

**AC de não-regressão é AC.** Toda story carrega, no mínimo: "build e
type-check verdes, nenhum item do QA-CHECKLIST § 9 (_Critério de liberação_)
violado, validação carimbada com SHA".

### Fidelidade é AC também

Se a tarefa toca conteúdo, cor, fonte, imagem, ordem de seção, botão social ou
WhatsApp, o AC diz **contra o que se compara** (`index.html:<linha>`,
`docs/CONTENT-MAPPING.md`, `styles.css:<linha>`) e o que deve ser
idêntico. Conteúdo novo só entra com fonte aprovada (`client-content.pdf`,
decisão `PEND-xx` resolvida) — nunca inventado (AGENTS.md § 4).

### Tamanho é medido pelo que a story toca

| Tamanho | Como se reconhece |
| --- | --- |
| `S` | Uma seção ou um componente, sem dependência nova, sem mudança de conteúdo aprovado. |
| `M` | Primitiva compartilhada (`components/motion`, `components/ui`, `animations/presets.ts`, `globals.css`, `tailwind.config.ts`) **ou** várias seções. |
| `L` | Rota nova, dependência nova, integração externa/back-end, ou mudança no layout global (`app/layout.tsx`). Quase sempre depende de um `PEND-xx`. |

`L` é convite a quebrar. O tamanho não se reescreve depois: estimativa errada
vira linha do Change Log (`estimado S, saiu M: o preset era compartilhado`).

### "Depende de" é link, sempre

Story citada em **Depende de** entra como link para o arquivo dela, com o
status e o que sai de lá; pendência entra como `PEND-xx` com o status atual.
Sem dependência: `nada`.

### O contexto é medido, e diz o commit

Comece pelo que está errado ou faltando hoje, com **arquivo, linha e como se
prova** (comando, screenshot, trecho do legado). Sem sintoma apontável, ainda
não é hora de escrever a story.

### Toda decisão registra a alternativa descartada

**Decidido** X, **descartado** Y, **porque** Z. Decisão de negócio, conteúdo,
identidade, link ou escopo **não é sua** (AGENTS.md § 11): vira `PEND-xx` e a
story fica `BLOCKED` naquele ponto.

### Validações exigidas são listadas na story, não descobertas no fim

Não há framework de testes. As camadas de validação deste repositório são:

| Camada | Quando | Como |
| --- | --- | --- |
| Tipos | sempre | `npx tsc --noEmit` |
| Build | sempre | `npm run build` (exit 0, sem warning de hidratação/SSR) |
| Âncoras | mexeu em seção, navbar ou IDs | `node scripts/check_ids.js` contra o dev server (confira a porta no script) |
| Visual por viewport | mexeu em layout/estilo | script `scripts/capture_*.js` → pasta temporária fora do repo, comparado com o legado em 375/480/768/1024/1200 |
| Movimento | mexeu em animação | scroll para baixo **e** para cima, reduced motion, resize; sem conteúdo invisível |
| Itens do QA-CHECKLIST | sempre | os itens que a tarefa toca, citados por seção |

Correção de bug começa pela reprodução (passos + viewport + screenshot), no
formato do QA-CHECKLIST § 8.

### Armadilhas e fora de escopo são obrigatórios

**Armadilhas**: o não-óbvio que a investigação achou (ex.: `gsap.from` com
`opacity: 0` deixa o conteúdo invisível antes da hidratação; o script de
screenshot captura antes da animação terminar se o `--virtual-time-budget` for
curto). **Fora de escopo**: o que a story não faz e para onde foi, mais a linha
_"se for preciso cortar"_.

## Idioma

Story em português do Brasil. Identificadores de código, nomes de arquivo e de
componente em inglês quando citados.
