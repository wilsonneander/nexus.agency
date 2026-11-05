---
baseline_commit: c87fd50
---

# Story 7.6 — Enviar o formulário de contato pelo Formspree

|                 |                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                              |
| **Fase**        | Fase 7 — Evolução visual (pós-entrega)                                                            |
| **Área**        | conversão, formulário                                                                             |
| **Seções**      | Contact                                                                                           |
| **Tamanho**     | S — uma dependência, um hook no formulário, uma máscara de telefone                               |
| **Depende de**  | `PEND-10` (`RESOLVED` — decisão do responsável em 2026-11-05, opção C)                            |
| **Requisitos**  | FR-08 (conversão), FR-10                                                                          |
| **Baseline**    | `c87fd50` — o envio pelo Formspree entrou em `2995f26`; a máscara foi validada sobre `c87fd50`    |

## Contexto

Até `182462e`, o formulário de [Contact/index.tsx](../../src/sections/Contact/index.tsx)
tinha `action="/"` e `onSubmit` com `preventDefault`: nada era enviado e, sem JS,
os dados se perdiam num `POST /` (medido na [4.4](4-4-conteudo-sem-javascript.md)).
O responsável decidiu (2026-11-05, `PEND-10` no [TASKS.md](../TASKS.md)) usar o
Formspree (`@formspree/react`, form `xpppnoer`). Depois pediu uma máscara no campo
WhatsApp, para o número não ficar com os dígitos todos juntos.

Story escrita no fechamento: a implementação veio de pedido direto do responsável.

## Escopo

- `SITE_CONFIG.formspree` (`formId`, `endpoint`) em [constants.ts](../../src/lib/constants.ts).
- `useForm` envia os 4 campos que já existiam (`name`, `whatsapp`, `company`, `need`), desativa o botão durante o envio ("Enviando...") e mostra erros por campo (`ValidationError`) e um aviso geral em pt-BR.
- Sucesso: o formulário dá lugar a uma confirmação (`role="status"`) no estilo do card.
- Sem JS: o `action` posta direto no endpoint do Formspree.
- Máscara do WhatsApp com `formatPhoneBR` ([utils.ts](../../src/lib/utils.ts)): `(61) 9298-5392` / `(61) 99298-5392`, descarta letras e o `+55` colado; `pattern` exige o número completo.

## Fora de escopo

- **Não muda** marcação, rótulos, placeholders, ordem dos campos nem o reveal da [4.2](4-2-distancias-intensidades-por-breakpoint.md).
- **Não trata LGPD** (consentimento, política de privacidade) — `PEND-12`.
- **Não traduz** as mensagens de erro por campo que o Formspree devolve em inglês.

## Decisões

- **Decidido** o ID no `SITE_CONFIG`, ao lado dos outros canais, **descartado** literal no componente, **porque** contato e destinos moram numa fonte só.
- **Decidido** máscara própria (~15 linhas), **descartada** biblioteca de máscara, **porque** um formato fixo não justifica dependência nova (AGENTS.md § 4).
- **Decidido** sem `maxLength` no campo, **porque** o navegador corta o texto colado antes do `onChange` e estragaria `+55 61 99298-5392`; a função já limita a 11 dígitos.
- **Decidido** o `pattern` aceitar também 10–11 dígitos seguidos, **porque** sem JS a máscara não roda e quem digita só os números seria barrado.
- **Textos novos** ("Mensagem enviada!", "Recebemos seus dados e entraremos em contato em breve.", aviso de falha, "Enviando...", `title` do WhatsApp) não existem no legado nem no PDF do cliente: aguardam aprovação no `PEND-17`.

## Critérios de aceite

### AC #1 — Envio pelo Formspree

Com JS, o submit chama o `useForm(SITE_CONFIG.formspree.formId)` com os 4 campos; botão desativado durante o envio; confirmação depois do sucesso; erros visíveis.

### AC #2 — Sem JS não perde os dados

O `action` do formulário é `https://formspree.io/f/xpppnoer` com `method="POST"`.

### AC #3 — Máscara do WhatsApp

Digitar `61992985392` mostra `(61) 99298-5392`; um fixo de 10 dígitos mostra `(61) 3234-5678`; backspace apaga normalmente; colar `+55 61 99298-5392` vira `(61) 99298-5392`; letras são ignoradas; número incompleto é inválido.

### AC #4 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; nenhum item do QA-CHECKLIST § 9 violado; SHA no Change Log.

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sem erro | `npx tsc --noEmit`, `npm run build` |
| comportamento | máscara, colagem, backspace, validade | sonda CDP descartável (fora do repo) em 375 e 1200px |
| visual | campo formatado | [contact_whatsapp_mask_1200.png](../references/qa/contact_whatsapp_mask_1200.png) |

## Riscos e armadilhas

- Trocar o form ou os `name` dos campos quebra os envios já configurados no painel do Formspree.
- O envio real não foi exercitado daqui (cairia na caixa do cliente).

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde.
- [x] Validação visual feita nos viewports afetados ([contact_whatsapp_mask_1200.png](../references/qa/contact_whatsapp_mask_1200.png)).
- [x] Itens tocados do [QA-CHECKLIST.md](../QA-CHECKLIST.md) atualizados com a evidência.
- [x] `PEND-10` marcado `RESOLVED`.
- [ ] Envio real conferido no painel do Formspree — não feito: geraria uma mensagem de teste na caixa do cliente; fica para o responsável.
- [x] Revisão e status `DONE` na story **e** no `TASKS.md`.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | IN_PROGRESS | Envio pelo Formspree implementado e commitado em `2995f26` (`PEND-10` RESOLVED): `npx tsc --noEmit` ✓, `npm run build` ✓. |
| 2026-11-05 | IN_PROGRESS | Máscara do WhatsApp (`formatPhoneBR`) a pedido do responsável. No review do fechamento: `pattern` passou a aceitar só os dígitos (caso sem JS) e o `maxLength` saiu (cortava o `+55` colado). |
| 2026-11-05 | DONE | Validado na árvore de trabalho sobre `c87fd50`: `npx tsc --noEmit` ✓, `npm run build` ✓; sonda CDP em `next dev` (375 e 1200px): celular `(61) 99298-5392` válido, fixo `(61) 3234-5678` válido, `(61) 9929` inválido, 6× backspace → `(61) 992`, colar `+55 61 99298-5392` → `(61) 99298-5392`, `6a1b9` → `(61) 9`. Captura do campo conferida. Envio real e sem JS não exercitados. |
