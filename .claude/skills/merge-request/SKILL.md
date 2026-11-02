---
name: merge-request
description: Abre o pull request (GitHub, via gh) ou merge request (GitLab, via glab) da branch atual do site Nexus — título com o ID da tarefa seguido de um resumo no imperativo, e descrição com sumário, link para a story, validação medida com o SHA, evidências visuais e o passo a passo para conferir na mão. Sem remoto configurado, prepara a mesma descrição como relatório de entrega. Use SEMPRE que um PR, MR ou pedido de merge for aberto, reaberto ou tiver a descrição refeita. Gatilhos - "abre o PR", "abre a MR", "sobe essa branch pra revisão", "manda pro review", "atualiza a descrição do PR", "prepara a entrega".
---

# Abrir o PR/MR de uma tarefa do Nexus

O PR é o lugar onde quem revisa descobre **o que mudou**, **por que está
seguro** e **como conferir na mão** sem reler o diff. A story explica a
decisão; o PR explica a entrega.

## 0. Para onde vai

```bash
git remote -v
git rev-parse --abbrev-ref HEAD
```

| Situação | Ferramenta |
| --- | --- |
| remoto `github.com` | `gh` |
| remoto `gitlab.com` | `glab` |
| **sem remoto** (o estado atual do repositório) | não há PR: escreva a descrição como **relatório de entrega** na conversa (ou num arquivo, se o usuário pedir) e pare. Não crie remoto nem repositório por conta própria. |

Se a CLI não estiver instalada ou autenticada, pare e peça ao usuário
(`gh auth login` / `glab auth login`) — não contorne por API nem token.

## 1. Antes de abrir — o que confirmar

1. **Autorização.** Abrir PR faz `git push` e publica fora da máquina. O pedido
   de abrir o PR autoriza o push **desta** branch, e só ele.
2. **Não está na `main`.** PR precisa de branch (`task/<id>-<slug>`). Se o
   trabalho foi feito na `main`, pergunte antes de criar a branch e mover
   commits.
3. **Árvore limpa** (`git status --short`). Arquivo fora do commit não entra —
   mostre e pergunte.
4. **Validação verde, medida por você nesta sessão**: `npx tsc --noEmit`,
   `npm run build`, e a validação visual/movimento que a story exige. Anote o
   **SHA**. Afirmar sem ter rodado é mentir no PR.
5. **A tarefa está fechada**: status na story, no `TASKS.md` e no
   `QA-CHECKLIST.md`, `PEND-xx` resolvido marcado — já commitado. Se faltar, a
   skill `close-story` resolve antes.

## 2. O título

```
<ID da tarefa> — <verbo no imperativo> <o que entrega>
```

- ID primeiro, no formato do `TASKS.md` (`4.1`, `5.6`). Sem ID não se abre PR:
  a story é escrita antes.
- Imperativo, curto (até ~70 caracteres), descrevendo o efeito, não a
  implementação: `4.3 — respeita reduced motion em todas as seções`, não
  `4.3 — adiciona early return no useEffect`.
- Um PR, uma tarefa.

## 3. A descrição

Preencha [TEMPLATE.md](TEMPLATE.md) na ordem, sem pular seção — seção que não
se aplica leva "Nada.".

- **Sumário** — o que mudou por área (seções, `components/`, `data/`,
  estilos, docs) e **por quê**.
- **Story** — link para `docs/stories/<id>-<slug>.md`.
- **Fidelidade** — o que foi comparado com o legado e como; e afirmação
  explícita de que botões sociais e WhatsApp **não** foram alterados (ou o
  `PEND-xx` que autorizou).
- **Decisões e pendências** — `PEND-xx` resolvidos/criados, decisão técnica
  registrada na TECHNICAL-SPEC/ARCHITECTURE.
- **Validação** — saída real dos comandos e o SHA; viewports conferidos;
  reduced motion; scroll nos dois sentidos. O que não foi verificado é dito.
- **Evidências** — caminhos dos screenshots em `docs/references/qa/`.
- **Como conferir na mão** — passos numerados do zero, cada um com resultado
  observável, incluindo ao menos um caminho infeliz (reduced motion, 375px,
  rolar para cima).
- **Riscos e o que ficou de fora**.

## 4. Os comandos

A descrição vive num arquivo no **scratchpad da sessão**, nunca no repositório.

```bash
git push -u origin "$(git rev-parse --abbrev-ref HEAD)"

# GitHub
gh pr create --base main --title "<título>" --body-file "<scratchpad>/pr-<id>.md"
gh pr view --web

# GitLab
glab mr create --target-branch main --title "<título>" \
  --description "$(cat "<scratchpad>/pr-<id>.md")" --remove-source-branch --yes
glab mr view --web
```

- Sem `--draft` por padrão — só se o usuário pedir ou houver validação
  vermelha declarada na descrição.
- PR já existe? Não abra outro: `gh pr edit <n> --body-file …` /
  `glab mr update <n> --description …`.
- Termine o corpo do PR com a linha de atribuição que o ambiente indicar.

## 5. Depois de abrir

Devolva a **URL** e, em duas ou três linhas, o título, a story e o que depende
do usuário (revisar, decidir um risco, conferir no browser). Não faça merge.

## Idioma

Título, descrição e comentários em português do Brasil. Nomes de arquivo,
componente e comando em inglês quando citados.
