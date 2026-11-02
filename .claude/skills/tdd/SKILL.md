---
name: tdd
description: Escreve um Technical Design Document em docs/tdds/ — como um fluxo do site Nexus funciona de ponta a ponta hoje, ou como vai passar a funcionar — atores (Server Component, wrapper client, GSAP/ScrollTrigger, browser, serviço externo), sequência, estados de animação/scroll, invariantes de acessibilidade e fidelidade, modos de falha e onde cada pedaço mora em src/. Use SEMPRE que a implementação de um fluxo precisar ser explicada, desenhada ou revisitada. Gatilhos - "escreve o TDD", "documenta como funciona a leitura progressiva", "explica o fluxo do formulário de contato", "desenha o sistema de animação", "como o filtro de projetos funciona por dentro?", "atualiza o TDD do scroll".
---

# Technical Design Document

Um TDD descreve **um fluxo** — não uma tarefa, não a arquitetura inteira. Ele
responde: quem chama quem, em que ordem, em que momento (servidor, hidratação,
scroll), o que muda na tela, o que acontece quando falha ou quando o usuário
prefere movimento reduzido, e onde em `src/` cada pedaço mora.

## Quando é TDD, e quando é outra coisa

| Documento | Escopo | Pergunta que responde |
| --- | --- | --- |
| `ARCHITECTURE.md` | o sistema | pastas, responsabilidades, convenções, decisões registradas |
| `TECHNICAL-SPEC.md` | as regras | stack, padrões GSAP/Next/Tailwind, restrições |
| `PRD.md` | o comportamento aprovado | o que o usuário deve ver (FR-xx) |
| **TDD** (`docs/tdds/`) | **um fluxo** | como a leitura progressiva vai do markup do servidor até a cor da palavra no scroll |
| Story (`docs/stories/`) | uma tarefa | o que muda, por quê, e como saber que acabou |

Escreva um TDD quando o fluxo **atravessa camadas** e ninguém o segura na
cabeça lendo um arquivo só. Candidatos neste repositório: leitura progressiva
(`ScrollText`), sistema de reveals por seção (Server → `*Client` → ScrollTrigger),
filtro de projetos com Flip, entrada do Hero + parallax, WhatsApp flutuante,
e o formulário de contato **quando** o `PEND-10` for decidido. Componente que
cabe num arquivo **não** vira TDD.

**TDD não decide.** Decisão de negócio/conteúdo vira `PEND-xx`; decisão técnica
que muda padrão vai para a TECHNICAL-SPEC/ARCHITECTURE — o TDD linka.

Pode ser **descritivo** (o fluxo existe) ou **prospectivo** (desenho a
seguir). O cabeçalho diz qual, e carrega `baseline_commit:`.

## O que fazer

1. **Leia o código antes da primeira linha.** TDD descritivo não conferido é
   ficção plausível. Percorra o fluxo de verdade: o markup em
   `src/sections/<X>/index.tsx`, o wrapper `*Client.tsx`, o componente de
   motion, os presets, o hook de reduced motion, o CSS em `globals.css`.
2. **Escreva** em `docs/tdds/<slug-em-kebab>.md` a partir de
   [TEMPLATE.md](TEMPLATE.md). O slug é o nome do fluxo
   (`leitura-progressiva.md`, `filtro-de-projetos.md`).
3. **Nenhuma seção é opcional** — seção vazia vira "Nada." explícito.
4. **Registre no índice** `docs/tdds/README.md` (crie se não existir): fluxo,
   estado (descritivo/prospectivo), SHA da última conferência.
5. **Aponte para o TDD** a partir da story que originou o fluxo — e só dela.
6. **Não commite** — commit é pedido explícito do usuário.

## As regras que separam um TDD de um resumo

- **Toda afirmação carrega o caminho do arquivo e o símbolo**
  (`src/components/motion/ScrollText.tsx → ScrollText`). Evite número de linha.
- **O diagrama de sequência é obrigatório, e é sobre chamadas reais** — um
  `sequenceDiagram` mermaid com os atores de verdade: Servidor (RSC/SSG),
  Browser, React (hidratação/effect), GSAP/ScrollTrigger, Usuário (scroll,
  resize, clique), serviço externo (WhatsApp, redes, e-mail) quando houver. Se
  não dá para desenhar sem inventar uma seta, volte ao código.
- **Estado é tabela, não prosa.** Os estados visuais (antes da hidratação,
  inicial, em progresso, final, revertido, reduced motion) — o que o usuário vê
  em cada um, quem transiciona e para onde, e qual transição é **impossível**
  (ex.: "conteúdo invisível" não pode ser estado alcançável).
- **Modos de falha, um por linha**: JS não carregou, hidratação atrasada,
  reduced motion ligado no meio da sessão, resize/rotação, scroll rápido para
  cima, Strict Mode montando duas vezes, asset que não carrega, link externo
  fora do ar. O que o sistema faz e o que o usuário vê.
- **Invariantes dizem onde são garantidas e como se verificam**: "o texto é
  sempre legível — cor inicial `rgba(255,255,255,0.22)` em `ScrollText`,
  conferido em `docs/references/qa/…`"; "nenhum ScrollTrigger sobrevive ao
  unmount — `ctx.revert()` em `<arquivo>`".
- **Contratos são copiados, não parafraseados** — props do componente, forma
  do dado em `src/data/*`, `SITE_CONFIG`, atributos `data-*` que o wrapper
  procura.
- **O descartado fica no documento**: **Decidido** X, **descartado** Y,
  **porque** Z (ex.: Lenis descartado — ARCHITECTURE.md § 7).
- **Documento desatualizado é bug.** Mudou o fluxo, o TDD muda no mesmo passo e
  o _Histórico_ ganha linha com data e SHA.
- **Violação encontrada não se normaliza na prosa.** Conteúdo escondido por
  animação, cleanup faltando, hex fora dos tokens, segmentação que quebra o
  leitor de tela: registre em _Dívidas e pontas soltas_ com o arquivo, e vire
  tarefa no `TASKS.md`.

## Idioma

Documento em português do Brasil. Identificadores, arquivos e componentes em
inglês quando citados.
