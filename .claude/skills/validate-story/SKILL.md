---
name: validate-story
description: Revisa uma story de docs/stories/ do site Nexus antes de alguém implementá-la — confere o contexto medido contra o código e o site legado de hoje, checa se depende de alguma pendência PEND-xx ainda aberta, reavalia escopo, tamanho, decisões e cada AC (quais ainda se aplicam, quais já estão prontos, quais não dão para falhar), e devolve correções concretas. Use quando a story for revisada, validada, repriorizada ou retomada depois de um tempo parada. Gatilhos - "valida a story", "revisa a 4.1", "essa tarefa ainda faz sentido?", "os ACs ainda valem?", "pode implementar a 4.3?", "confere essa story antes de eu começar".
---

# Validação de uma story

Validar é confrontar o que a story **afirma** com o que o repositório e o site
legado **têm hoje**, e devolver o que precisa mudar — sem reescrever a story
por conta própria. A saída é um **relatório**; o aval para implementar é do
usuário.

A story carrega `baseline_commit:` no cabeçalho: tudo o que ela afirma vale
naquele SHA. A primeira pergunta é quantos commits se passaram desde ele.

## Orçamento de contexto

- Leia por inteiro só a story. O resto é `grep -n` + `sed -n 'A,Bp'`.
- Não releia o CLAUDE.md nem o TEMPLATE da skill `story`.
- Teto de ~15 chamadas de ferramenta. Se a story exige mais para ser
  verificada, **isso é o achado**: ela está vaga demais.
- Não abra subagente.

## O que fazer

### 1. Localize a story

Pelo ID (`4.1`), slug ou caminho: `ls docs/stories/ | grep <id>`. Se não existir,
pare — é caso para a skill `story`. Confira o status na linha do `TASKS.md`:
story que diz uma coisa e quadro que diz outra já é achado.

### 2. Meça a distância até o baseline

```bash
git log --oneline <baseline_commit>..HEAD | wc -l
git diff --stat <baseline_commit>..HEAD -- <arquivos que a story cita>
```

### 3. Colete e confronte as afirmações verificáveis

Extraia o que a story afirma sobre o repositório — `arquivo:linha`, nomes de
componente, atributos `data-*`, IDs de âncora, valores de `SITE_CONFIG`, itens
de `src/data/*`, trechos do legado — e confronte:

```bash
git log --oneline -8 -- <arquivos citados>
grep -rn "<símbolo>" src --include=*.ts --include=*.tsx
sed -n '40,70p' <arquivo>
grep -n "<trecho>" index.html styles.css     # o legado diz isso mesmo?
```

Cada afirmação sai com **confere**, **mudou** (com o que virou) ou **não existe
mais**.

### 4. Pendências e fonte de conteúdo

Confira na tabela _Pendências de Decisão_ do `TASKS.md`:

- A story depende de um `PEND-xx` ainda `PENDING_*`? Então ela está
  **bloqueada** naquele ponto — ou o escopo corta a parte dependente, ou a
  story vai para `BLOCKED`.
- A story introduz conteúdo, número, telefone, link, cor ou texto **sem fonte
  aprovada** (legado, `client-content.pdf`, `PEND` resolvido)? Bloqueador —
  AGENTS.md § 4 proíbe inventar.
- A story toca botões sociais (FR-07) ou WhatsApp (FR-06)? Qualquer mudança
  neles precisa de autorização explícita registrada.

### 5. Reavalie cada critério de aceite

| Veredicto | Significa | O que devolver |
| --- | --- | --- |
| **vale** | verificável e pertinente | nada |
| **já atendido** | o código de hoje já faz isso | onde, e a proposta de cortar |
| **caducou** | o problema sumiu ou virou outro | o que mudou, e o AC substituto |
| **não dá para falhar** | desejo ("fica fluido", "fica bonito") | reescrita com viewport, posição de scroll ou saída observável |
| **é implementação** | descreve **como** | reescrita em comportamento |
| **falta o par infeliz** | só caminho feliz | o AC de reduced motion / sem JS / scroll para cima / 375px |
| **verde vazio** | passa sem verificar nada | o que torna a verificação capaz de reprovar |

**Verde vazio neste repositório**: screenshot capturado antes de a animação
terminar (ou com o dev server em outra porta — o Chrome grava a página de erro e
o script sai 0); `scripts/check_ids.js` contra a porta errada só loga o erro e
sai 0; item do QA-CHECKLIST marcado `[x]` sem evidência; "build verde" de um
build que nem tocou o arquivo alterado.

Depois o conjunto: algum comportamento do escopo ficou sem AC? Existe o AC de
não-regressão com SHA?

### 6. Reavalie escopo, tamanho, decisões e plano

- **Escopo** ainda entrega algo sozinho, ou virou duas stories?
- **Tamanho** ainda bate com os critérios da skill `story`?
- **Fora de escopo** existe e diz para onde cada corte foi?
- **Decisões** trazem o descartado e o porquê? Alguma delas é de negócio e
  deveria ser `PEND-xx`?
- **Plano** respeita AGENTS.md § 7 e TECHNICAL-SPEC § 2: Server Component por
  padrão, animação no wrapper client via `data-*`, cleanup com `gsap.context`,
  reduced motion, sem `pin`, sem hex solto, sem dependência nova não
  justificada?
- **Validações exigidas** cobrem os viewports e o movimento que a story mexe?
- Há decisão em aberto que o dev vai ter de inventar no meio? Ou vira decisão
  agora, ou vira pergunta.

### 7. Devolva o relatório

```
## Validação — 4.1 <título> (status: TODO · baseline 906fbf2, 3 commits atrás)

**Veredicto:** pronta | precisa de ajuste | bloqueada (PEND-xx) | precisa de conversa

### Contexto desatualizado
- `src/sections/About/index.tsx:42` — a story diz X; hoje é Y (mudou em `abc1234`).

### Critérios de aceite
- AC #1 — vale.
- AC #2 — já atendido por `src/components/motion/ScrollText.tsx:58`; propor cortar.
- Falta AC — reduced motion na seção nova.

### Ajustes que evitam retrabalho
1. … (o mais caro de descobrir tarde primeiro)

### Perguntas para o responsável
1. … (só o que muda o que vai ser feito)
```

- Só o que muda o que vai ser feito; seção que está boa não aparece.
- Ordene por custo de descobrir tarde. Cada achado com endereço.
- **Não edite a story** sem o usuário pedir. Se pedir: aplique, mantenha o
  status, e acrescente a linha no Change Log.

## Idioma

Relatório em português do Brasil; identificadores em inglês quando citados.
