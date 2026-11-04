---
baseline_commit: d83dbea
---

# Story 7.5 — Coluna Canais no rodapé e remoção do texto institucional

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | IN_PROGRESS                                                                             |
| **Fase**        | Fase 7 — Evolução visual (pós-entrega)                                                  |
| **Área**        | conteúdo, layout/UI                                                                     |
| **Seções**      | Footer                                                                                  |
| **Tamanho**     | XS — uma coluna nova de texto, um parágrafo removido e a grade do rodapé redistribuída  |
| **Depende de**  | `PEND-09` (aberto, **resolvido só para horário e área de atendimento** em 2026-11-03)   |
| **Requisitos**  | FR-08 (com a exceção desta decisão), FR-07, FR-10                                        |
| **Baseline**    | `d83dbea` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

No baseline, o rodapé ([Footer.tsx](../../src/components/layout/Footer.tsx) em
`d83dbea`) tem 3 colunas: logo + texto institucional do legado ("Nosso
compromisso com a excelência…", [AUDIT.md § 4.6](../AUDIT.md)) + ícones sociais;
Serviços; Suporte (com o e-mail da [7.4](7-4-email-institucional-rodape.md)).

O rodapé do cliente ([CONTENT-MAPPING.md](../CONTENT-MAPPING.md), linha 11 e
Divergência 3) traz dois dados entre colchetes que estavam no `PEND-09`: a área
de atendimento e o horário.

O responsável decidiu (2026-11-03):

- nova coluna **Canais** no rodapé com "Atendimento em todo o Brasil, 100%
  online" e "Horário: segunda a sexta, das 9h às 18h" (sem os colchetes);
- **remover o texto debaixo da logo** no rodapé, para liberar espaço.

## Escopo

- `SITE_CONFIG.serviceArea` e `SITE_CONFIG.businessHours` em [constants.ts](../../src/lib/constants.ts).
- Coluna "Canais" (título + 2 linhas de texto, sem link), depois de Suporte.
- Parágrafo institucional removido do rodapé; logo e `SocialIcons` ficam.
- Grade do rodapé redistribuída para 4 colunas.

## Fora de escopo

- **Não preenche** os outros colchetes do `PEND-09` (`[ano]`, `[número]`, `[24 horas úteis]`).
- **Não move** o e-mail de Suporte para Canais nem acrescenta o WhatsApp à coluna — o pedido cita só as duas informações.
- **Não altera** `SocialIcons` (FR-07), `WhatsAppFloat` nem o reveal do `FooterClient`.
- **Não toca no legado** (`index.html` mantém o parágrafo).

## Decisões

- **Decidido** "Canais" como coluna (como Serviços e Suporte), com o texto em
  `<p>` no estilo dos links (`text-white/70`, `text-xs sm:text-sm`, `font-light`).
- **Decidido** colchetes fora do texto exibido, **porque** eram a marcação de
  "dado a confirmar" do cliente, e o responsável agora forneceu os valores.
- **Decidido** grade: ≥ 1200px 2/4/3/3 (logo, Serviços, Suporte, Canais); até
  1199px a logo em linha própria e as 3 colunas abaixo (768: 6/6/6; 1024:
  4/4/4), **porque** Serviços precisa de ~265px e o e-mail de 230px numa
  linha: com 4 colunas lado a lado em 1024px (unidade de 36px) não cabe. Sem o
  parágrafo, a coluna da logo só precisa de ~160px (3 ícones sociais), e 2/12
  em 1200px (197px) basta.

## Critérios de aceite

### AC #1 — Coluna Canais

O rodapé mostra o título "Canais" e, abaixo, "Atendimento em todo o Brasil,
100% online" e "Horário: segunda a sexta, das 9h às 18h", vindos do `SITE_CONFIG`.

### AC #2 — Texto institucional removido

O HTML não contém "Nosso compromisso com a excelência"; logo e ícones sociais continuam no rodapé.

### AC #3 — Rodapé sem corte nem vazamento

Em 375/480/768/1024/1200px nenhum link do rodapé é cortado pelo `RollingText`
nem passa da coluna, e a página não tem rolagem horizontal.

### AC #4 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; `check_ids.js` 11/11; nenhum item
do QA-CHECKLIST § 9 violado; evidência em `docs/references/qa/`; SHA no Change Log.

## Plano técnico

- [constants.ts](../../src/lib/constants.ts): `serviceArea`, `businessHours`.
- [Footer.tsx](../../src/components/layout/Footer.tsx): parágrafo removido, coluna 4 com `data-footer-col` (entra no reveal existente), spans `md`/`lg`/`xl`.

**Regras que se aplicam:** Footer continua Server Component; sem animação
nova; texto visível sem JS (HTML do servidor); nenhuma dependência nova.

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sem erro | `npx tsc --noEmit`, `npm run build` |
| âncoras | 11 IDs | `node scripts/check_ids.js` |
| visual | encaixe nos 5 viewports | sonda CDP descartável (fora do repo) + capturas conferidas |

## Riscos e armadilhas

- Em 1200px a coluna Suporte começa em meio pixel (616,5px); em tela 1x o
  antialiasing do último "r" do e-mail fica rente ao recorte do `RollingText`.
  A captura em 3x mostra o glifo inteiro e a caixa do texto não transborda
  (medido); não se mexeu no `RollingText`, compartilhado com a navbar.
- Rótulo mais longo em Suporte ou Serviços volta a apertar a grade em 1024/1200px — rodar a sonda de encaixe.

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde.
- [x] Validação visual feita nos viewports afetados ([footer_canais_1200.png](../references/qa/footer_canais_1200.png), [footer_canais_1024.png](../references/qa/footer_canais_1024.png), [footer_canais_375.png](../references/qa/footer_canais_375.png)).
- [x] Itens tocados do [QA-CHECKLIST.md](../QA-CHECKLIST.md) atualizados com a evidência.
- [x] `PEND-09` atualizado (horário e área resolvidos; demais colchetes abertos).
- [ ] Revisão (`review-mr`) e status `DONE` na story **e** no `TASKS.md`.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-03 | IN_PROGRESS | Story criada sobre `d83dbea` a partir dos pedidos do responsável: coluna Canais (horário e área de atendimento, `PEND-09` parcial) e remoção do texto debaixo da logo. |
| 2026-11-03 | IN_PROGRESS | Implementada (árvore de trabalho sobre `d83dbea`). Validação no build de produção limpo (`rm -rf .next && npm run build` + `next start`): `npx tsc --noEmit` ✓, `npm run build` ✓ (`/` 13,5 kB); `check_ids.js` 11/11; HTML com "Canais" e "100% online", sem "Nosso compromisso"; sonda de encaixe em 375/480/768/1024/1200 → 0/8 links cortados ou fora da coluna, sem scroll horizontal, colunas com `opacity` 1 após o reveal; capturas de 375, 1024 e 1200 conferidas. Reduced motion e sem JS não reexercitados (nenhuma animação mudou; a coluna nova usa o mesmo `data-footer-col` e é HTML do servidor). |
