---
name: review-mr
description: Revisa código do site Nexus contra a story que o originou — por padrão o que está na staged area; também revisa o não commitado, uma branch inteira, um intervalo de commits ou um PR/MR quando houver remoto. Confere AC por AC se foi entregue e verificado, aponta o que foi feito além do pedido, e procura quebra de fidelidade ao site legado, violação das restrições do AGENTS.md (botões sociais, WhatsApp, conteúdo inventado), bug de GSAP/SSR/hidratação, conteúdo escondido por animação e verde vazio. Use SEMPRE que código, diff, branch ou implementação de tarefa for revisado. Gatilhos - "revisa o que eu implementei", "faz o code review", "revisa o que está staged", "confere antes de eu commitar", "revisa esse commit", "pode mesclar?", "os ACs foram cumpridos?".
---

# Revisão de código contra a story

A pergunta não é "o código está bom?", é **"esta mudança entrega exatamente a
story — nada a menos, nada a mais — sem quebrar a fidelidade ao site legado nem
o que já estava de pé?"**.

Quatro achados valem mais que os outros e vêm sempre primeiro:

1. **Violação de restrição inegociável** (AGENTS.md § 4): botão social ou
   WhatsApp alterado, conteúdo/número/depoimento inventado, seção removida ou
   reordenada, cor/fonte trocada, dependência nova sem justificativa.
2. **AC não entregue** ou entregue sem verificação.
3. **Conteúdo dependente de animação** — invisível antes da hidratação, com
   reduced motion, ou depois de rolar para cima.
4. **Escopo além do pedido** — inclusive "melhoria" visual não pedida.

A saída é um **relatório na conversa**. Esta skill **não corrige** e não
commita; se o usuário pedir os consertos, aplique um por vez, citando o achado.

## Orçamento de contexto

- Leia por inteiro só a story e o diff. O resto é `grep -n` + `sed -n`.
- Teto de ~25 chamadas de ferramenta. Não abra subagente.
- Não releia o CLAUDE.md nem o AGENTS.md — já estão no contexto.

## 1. Escolha o alvo

| O usuário pediu | Diff |
| --- | --- |
| nada em particular (padrão) | `git diff --cached` |
| "o que eu ainda não commitei" | `git diff` + `git diff --cached` |
| "esse commit", "os últimos N" | `git show <sha>` / `git diff <base>..HEAD` |
| "essa branch", "pode mesclar?" | `git diff main...HEAD` |
| PR/MR aberto (se houver remoto) | `gh pr diff <n>` / `glab mr diff <n>` |

```bash
git rev-parse --abbrev-ref HEAD
git status --short
git diff --cached --stat
```

Pergunte antes de revisar quando: o staged está vazio mas há mudança/commits
(qual é o alvo?); o mesmo arquivo está staged e não staged. Liste os `??`
plausivelmente parte da mudança (componente novo, script de captura, screenshot
de evidência) e pergunte se entram — `git diff` não os mostra.

## 2. Ache a story

Pela mensagem do commit, nome da branch (`task/<id>-<slug>`), linha do
`TASKS.md` ou pelo que o usuário disse: `ls docs/stories/ | grep <id>`.

Sem story: diga isso. Se o usuário confirmar que não há, revise só fidelidade,
restrições e corretude (passos 4–5) e registre que os ACs não foram verificados.

## 3. AC por AC — a espinha da revisão

| Veredicto | Significa |
| --- | --- |
| **entregue** | o código faz isso, e há evidência que **reprovaria** sem a mudança (screenshot conferido, comando, passo reproduzível) |
| **entregue sem verificação** | o comportamento está lá, nada o comprova |
| **verde vazio** | a evidência existe mas não prova nada (ver CHECKLIST) |
| **parcial** | só caminho feliz, ou só um viewport |
| **não entregue** | não achei o código que faz isso |
| **divergente** | feito, mas diferente do AC — ou diferente do legado |

Depois o conjunto: a _Definition of Done_ está cumprida — status na story
**e** no `TASKS.md`, `QA-CHECKLIST.md` atualizado com evidência, `PEND-xx`
consumido marcado `RESOLVED`, docs afetados atualizados, validação carimbada
com comando e SHA? Em revisão de staged area isso pode estar pendente de
propósito — cobre como pendência.

## 4. O que foi feito além do pedido

- componente, dependência, rota, script ou seção que a story não cita;
- refatoração de código que a story não toca;
- mudança de texto, cor, espaçamento ou ordem não pedida ("já que eu estava aqui");
- comentário de proteção removido (ex.: "FR-07 inviolável") ou keyframe do
  legado alterado;
- resolução silenciosa de um `PEND-xx` (ex.: trocar o número do WhatsApp, o
  perfil do Instagram, preencher `[número]`);
- afrouxamento: `!important`, `any`, `@ts-expect-error`, `eslint-disable`.

Cada um: **necessário** para algum AC (falta explicação), **inofensivo mas fora
de escopo** (propor outra tarefa), ou **arriscado** (pedir remoção). O que a
story listou em _Fora de escopo_ e foi implementado também é achado.

## 5. Corretude e fidelidade

Leia [CHECKLIST.md](CHECKLIST.md) e passe pelas áreas que o diff toca. Ao
afirmar um bug, escreva o **cenário concreto** — viewport, posição de scroll,
preferência de movimento, sequência de ações — e o resultado errado.

## 6. Rode a validação

Não aceite "tudo verde" dito na conversa ou no Change Log:

```bash
npx tsc --noEmit
npm run build                     # exit 0; leia os warnings, não só o código de saída
```

Quando o diff toca layout, seção, âncora ou animação, valide também com o dev
server de pé (`node scripts/check_ids.js`, captura de screenshots dos viewports
afetados) e **abra as imagens**. O que não deu para rodar é **não rodado**, com
o motivo — nunca verde. Anote o **SHA**. Se havia mudança não staged junto, o
resultado não é sobre o alvo: diga isso.

## 7. O relatório

```
## Revisão — 4.1 <título> (alvo: staged area, N arquivos · SHA abc1234)

**Veredicto:** pode seguir | ajustes antes de commitar | precisa de conversa

### Bloqueadores
1. `src/sections/About/AboutClient.tsx:31` — <defeito>. Dispara quando: <cenário>. AC #2.

### Critérios de aceite
- AC #1 — entregue (`src/sections/Hero/index.tsx:40`, `docs/references/qa/x.png`).
- AC #2 — parcial: só 1200px conferido; 375px sem evidência.

### Além do escopo
- `src/data/services.ts:14` — texto do card alterado sem fonte aprovada. Reverter.

### Ajustes menores
- …

### Validação (rodada em abc1234)
- `tsc --noEmit`: ok. `build`: ok, sem warnings.
- Screenshots 375/1200 conferidos; reduced motion **não verificado** — <por quê>.

### Perguntas
1. … (só o que muda o que vai ser feito)
```

- Ordene por custo de descobrir tarde. Todo achado com endereço.
- Não liste o que está certo — exceto os ACs, que aparecem todos.
- "Eu teria feito diferente" não é achado. Máximo de ~10 achados; acima disso,
  agrupe por padrão.
- Achado que não entra nesta entrega vira tarefa nova no `TASKS.md` (ou
  `PEND-xx`, se for decisão), com destino explícito.

## Idioma

Relatório em português do Brasil. Identificador de código em português
(componente, função, variável, `data-*`) é achado — ver CHECKLIST.
