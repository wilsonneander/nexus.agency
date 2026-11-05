---
baseline_commit: 8aeee4f
---

# Story 7.4 — Incluir o e-mail institucional no rodapé

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
| **Fase**        | Fase 7 — Evolução visual (pós-entrega)                                                  |
| **Área**        | conteúdo, conversão                                                                     |
| **Seções**      | Footer                                                                                  |
| **Tamanho**     | XS — um link novo no rodapé, uma chave no `SITE_CONFIG` e um ajuste de colunas em 1024px |
| **Depende de**  | `PEND-11` (`RESOLVED` — decisão do responsável em 2026-11-03)                           |
| **Requisitos**  | FR-08 (com a exceção do `PEND-11`), FR-07, FR-10                                         |
| **Baseline**    | `8aeee4f` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

No baseline, o e-mail institucional não aparece em nenhum lugar do site. O
relatório do cliente propõe `contato@nexusagencybr.com.br` como canal
([CONTENT-MAPPING.md](../CONTENT-MAPPING.md), linhas 01 e 11), e o
[AUDIT.md § 12](../AUDIT.md) o catalogou sob o `PEND-11`.

O responsável decidiu (2026-11-03, `PEND-11` no [TASKS.md](../TASKS.md)):
incluir o e-mail nos canais de contato do **rodapé**. A coluna Suporte de
[Footer.tsx](../../src/components/layout/Footer.tsx) tem hoje Contato
(`#contact`) e Politica e privacidade (`#`, `PEND-12`).

## Escopo

- `SITE_CONFIG.email` em [constants.ts](../../src/lib/constants.ts), fonte única do endereço.
- Link `mailto:` com o endereço como rótulo na coluna Suporte, entre Contato e Politica e privacidade.

## Fora de escopo

- **Não inclui o e-mail na seção Contato, na navbar nem no Hero** — a decisão cita só o rodapé.
- **Não inclui horário nem endereço** do rodapé do cliente (entre colchetes, `PEND-09`).
- **Não liga o formulário a e-mail** (`PEND-10`).
- **Não altera** `SocialIcons`, `WhatsAppFloat` nem os demais `SITE_CONFIG`.

## Decisões

- **Decidido** o rótulo ser o próprio endereço, **descartado** um rótulo "E-mail",
  **porque** o visitante precisa ver o endereço para copiar quando o `mailto:`
  não tem cliente de e-mail configurado.
- **Decidido** reaproveitar `RollingLink` (link externo → `<a>`), igual aos vizinhos da coluna.
- **Decidido** colunas 4/4/4 só entre 1024 e 1199px (`lg:col-span-4`,
  `xl:col-span-5`/`xl:col-span-3`), **descartado** mexer no `RollingText` ou
  diminuir a fonte, **porque** em 1024px a coluna Suporte (5/4/3) tinha 204px e o
  endereço mede 230px: passava 30px da coluna (medido). Em 1200px o 5/4/3 da
  [7.3](7-3-links-rodape-remover-blog.md) já comporta e fica igual. Mesmo
  precedente da 7.3 (redistribuir colunas para o rótulo mais longo).

## Critérios de aceite

### AC #1 — E-mail no rodapé

A coluna Suporte mostra `contato@nexusagencybr.com.br` com `href="mailto:contato@nexusagencybr.com.br"`, vindo de `SITE_CONFIG.email`.

### AC #2 — Rodapé sem corte nem vazamento

Em 375/480/768/1024/1200px nenhum link do rodapé é cortado pelo `RollingText`
nem passa da coluna, e a página não tem rolagem horizontal.

### AC #3 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; nenhum item do QA-CHECKLIST § 9
violado; evidência em `docs/references/qa/`; SHA no Change Log.

## Plano técnico

- [constants.ts](../../src/lib/constants.ts): `email`.
- [Footer.tsx](../../src/components/layout/Footer.tsx): `RollingLink` `mailto:` com `whitespace-nowrap`; spans das colunas em `lg`/`xl`.

**Regras que se aplicam:** Footer continua Server Component; sem animação nova
(o reveal das colunas do `FooterClient` cobre o link); nenhuma dependência nova.

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sem erro | `npx tsc --noEmit`, `npm run build` |
| visual | encaixe nos 5 viewports, `href` do e-mail | sonda CDP descartável (fora do repo) + capturas |

## Riscos e armadilhas

- Rótulo novo mais longo na coluna Suporte volta a estourar em 1024px — rodar a sonda de encaixe.
- Trocar o domínio exige mudar só `SITE_CONFIG.email`.

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde.
- [x] Validação visual feita nos viewports afetados ([footer_email_1200.png](../references/qa/footer_email_1200.png), [footer_email_375.png](../references/qa/footer_email_375.png)).
- [x] Itens tocados do [QA-CHECKLIST.md](../QA-CHECKLIST.md) atualizados com a evidência.
- [x] `PEND-11` marcado `RESOLVED`.
- [x] Revisão (`review-mr`) e status `DONE` na story **e** no `TASKS.md`.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-03 | IN_PROGRESS | Story criada sobre `8aeee4f` a partir da decisão do `PEND-11` (e-mail nos canais de contato do rodapé). |
| 2026-11-03 | IN_PROGRESS | Implementada (árvore de trabalho sobre `8aeee4f`). Validação: `npx tsc --noEmit` ✓, `npm run build` ✓ (`/` 13,5 kB); sonda CDP de encaixe em 375/480/768/1024/1200 → 8 links do rodapé, 0 cortados ou fora da coluna, sem scroll horizontal, `href` = `mailto:contato@nexusagencybr.com.br`. Primeira medição em 1024px: e-mail passava 30px da coluna Suporte → colunas 4/4/4 entre 1024 e 1199px. Reduced motion e sem JS não reexercitados (nenhuma animação mudou; o link é HTML do servidor). |
| 2026-11-03 | DONE | Revisada (`review-mr`: sem bloqueadores nem escopo extra; colunas 4/4/4 em 1024–1199px aceitas como necessárias ao AC #2) e revalidada no build de produção limpo (`rm -rf .next && npm run build` + `next start`), na árvore de trabalho sobre `8aeee4f`: `npx tsc --noEmit` ✓, `npm run build` ✓ (`/` 13,5 kB); `check_ids.js` 11/11; sonda de encaixe em 375/480/768/1024/1200 → 0/8 links cortados ou fora da coluna, sem scroll horizontal, `href` `mailto:` correto; captura de 1024px conferida (logo, Serviços e Suporte em colunas iguais, textos inteiros). |
| 2026-11-05 | DONE | Aprovação visual do rodapé pelo responsável (vale para as stories 7.3, 7.4 e 7.5). |
