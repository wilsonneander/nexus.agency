---
name: close-story
description: Fecha uma tarefa do site Nexus de ponta a ponta — mede a validação, revisa o código contra a story, aplica os ajustes que o review achou, move o status para DONE na story, no TASKS.md e no QA-CHECKLIST, carimba a validação com o SHA no Change Log, commita e (se houver remoto) abre o PR/MR. Use quando uma tarefa implementada precisar ir para revisão e entrega numa tacada. Gatilhos - "revisa e fecha", "fecha a story", "termina a 4.3", "revisa, aplica os ajustes e commita", "pode fechar? então fecha", "conclui a tarefa".
---

# Fechar uma tarefa: da validação ao commit

Esta skill é a **ordem** em que as outras rodam e o que não pode ser pulado
entre elas. Ela invoca `review-mr` e, se houver remoto, `merge-request`. O que
ela acrescenta é a costura: o que fazer com os achados, onde o status mora, e o
que precisa ser medido **de novo** depois de cada ajuste.

A regra que organiza tudo: **uma tarefa só fecha com a validação medida no
estado que vai ser entregue** — não antes do último ajuste (AGENTS.md § 9: não
declarar concluída sem validar).

## 0. O estado

```bash
git rev-parse --abbrev-ref HEAD
git status --short
git log --oneline -5
```

Param a skill aqui:

- **Mesmo arquivo staged e não staged** — mostre e pergunte.
- **Arquivo não rastreado (`??`) que parece parte da entrega** (componente novo,
  script de captura, screenshot de evidência) — liste e pergunte se entra.
- **Mudança não commitada que não é desta tarefa** — não a arraste para o
  commit; pergunte.

## 1. Valide ANTES do review

Não comece revisando. Meça primeiro — validação vermelha encerra a revisão e
muda o que há para fazer:

```bash
npx tsc --noEmit
npm run build
```

E, se a tarefa toca layout/seção/âncora/animação, com o dev server de pé:
`node scripts/check_ids.js` (porta do script!) e as capturas dos viewports
afetados — **abrindo as imagens**.

⚠️ **Não acredite no Change Log nem no `TASKS.md`.** Eles dizem o que a última
rodada mediu; entre aquela medição e agora houve ajustes.

## 2. A revisão

Invoque a skill `review-mr` com o alvo certo (staged, árvore de trabalho, ou o
intervalo de commits da tarefa). Ela devolve o relatório AC por AC.

## 3. O que fazer com cada achado

Um por vez, citando o achado que cada mudança fecha.

| Achado | O que fazer |
| --- | --- |
| Violação de restrição (AGENTS.md § 4) | Reverta agora. A tarefa não fecha com ela. |
| Bloqueador (AC não entregue, conteúdo escondido por animação, bug) | Conserte agora. |
| Depende de decisão do responsável | A parte afetada sai da entrega; `PEND-xx` novo ou existente, tarefa `BLOCKED` naquele ponto — não decida por ele. |
| Escopo além do pedido, inofensivo | Fica, e é **dito** no commit/entrega. Não remova código que funciona sem falar com quem escreveu. |
| Escopo além do pedido, arriscado | Remova, ou pergunte. Mudança visual/conteúdo não pedida é sempre arriscada aqui. |
| Ajuste menor de uma linha | Conserte. |
| Achado real que não entra nesta entrega | Tarefa nova no `TASKS.md`, com destino explícito. |
| "Eu teria feito diferente" | Nada. |

## 4. Meça de novo o que você mexeu

Cada conserto reabre a pergunta. Rode o alvo estreito primeiro (o viewport, a
seção) e a validação inteira (`tsc` + `build` + visual afetado) uma vez ao
final, **antes** do commit.

## 5. O status mora em TRÊS lugares

Mover só um é o erro mais comum:

1. **A story** — `| **Status** | DONE |`, _Definition of Done_ marcada (o que
   não foi cumprido fica `[ ]` com a razão), Change Log com a validação
   (comandos, resultado, SHA).
2. **`TASKS.md`** — `[x]` na linha da tarefa, no formato das existentes
   (`(Status: DONE | <evidência curta>)`); `PEND-xx` consumido como
   `RESOLVED`; critério de saída da fase marcado se a fase fechou.
3. **`QA-CHECKLIST.md`** — os itens que a tarefa validou, com a evidência
   (`docs/references/qa/<arquivo>.png`, comando).

Mais os docs que a tarefa mudou de padrão (`TECHNICAL-SPEC.md`,
`ARCHITECTURE.md`, `CLAUDE.md`).

## 6. O commit

**Só com ordem expressa do usuário** — pedir para "fechar" a tarefa é essa
ordem para o commit local; push é outra coisa (skill `merge-request`).

O repositório usa Conventional Commits em inglês (`feat:`, `fix:`, `docs:`,
`chore:`, `test:`, `refactor:`), um assunto curto no imperativo, e o ID da
tarefa no corpo:

```bash
git add <arquivos da tarefa>          # nomeados, não `-A` às cegas
git commit -m "feat: <resumo>" -m "Task <id> — <título da story>"
```

O Change Log precisa citar o SHA do estado validado, que só existe depois do
commit. Duas saídas, nesta preferência:

1. **Carimbar o SHA-base**: "validado na árvore de trabalho sobre `<SHA>`" no
   Change Log, num único commit — serve quando o commit contém exatamente o
   que foi validado.
2. **Dois commits**: implementação primeiro; depois a validação rodada **nele**
   e um commit `docs:` com status + SHA. Use quando houver dúvida sobre o que
   entrou no primeiro commit.

## 7. Entrega

- Há remoto (`git remote -v` não vazio) e o usuário pediu PR/MR → skill
  `merge-request`.
- Não há remoto (o caso de hoje) → termine aqui com o resumo no formato do
  AGENTS.md § 10 (**Objetivo, Arquivos, Decisões, Validação, Pendências,
  Riscos**), citando o SHA.

## Idioma

Relatório, story e entrega em português do Brasil; mensagem de commit em inglês
(o padrão do histórico); identificadores em inglês.
