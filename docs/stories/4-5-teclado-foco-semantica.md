---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 4.5 — Testar teclado, foco e semântica

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | TODO                                                                                    |
| **Fase**        | Fase 4 — Responsividade e acessibilidade                                                |
| **Área**        | a11y                                                                                    |
| **Seções**      | Navbar, Hero, Banners, Projects, Contact, Footer                                        |
| **Tamanho**     | M — primitivas compartilhadas (`FluidButton`, `RollingText`, `globals.css`) e várias seções |
| **Depende de**  | nada                                                                                    |
| **Requisitos**  | QA-CHECKLIST § 5, TECHNICAL-SPEC § 5, FR-09                                             |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Achados 2.1–2.5 e parte do § 3 da [revisão de código](../CODE-REVIEW-2026-11-05.md). Em `3a87d86`:

1. **Nenhum CTA tem foco visível.** [globals.css](../../src/app/globals.css) `.fluid-btn` tem `outline: none`, e o `.fluid-btn:focus-visible` usa `ring:`, `ring-offset:`, `ring-offset-color:` — propriedades que não existem em CSS (são nomes do Tailwind), descartadas pelo navegador. Prova: Tab até "Contato" na navbar em 1200px; nada indica o foco. Atinge todos os `FluidButton`/`FluidLink` (navbar, filtros, pacotes, envio do formulário).
2. **Nome acessível frágil nos links rolantes.** [RollingText.tsx](../../src/components/ui/RollingText.tsx) põe `aria-label` num `<span>` sem papel (proibido em `generic` pelo ARIA 1.2) e esconde as duas cópias do texto com `aria-hidden`. Em leitores que ignoram o `aria-label` do span, os links da navbar e do rodapé ficam sem nome.
3. **Menu mobile** ([Navbar.tsx](../../src/components/layout/Navbar.tsx)): botão sem `aria-expanded`/`aria-controls`; Esc não fecha.
4. **Filtro dos Projetos** ([Projects/index.tsx](../../src/sections/Projects/index.tsx)): `role="tablist"`/`role="tab"` sem `tabpanel` nem setas — ARIA de abas incompleto num controle que é um filtro.
5. **Formulário** ([Contact/index.tsx](../../src/sections/Contact/index.tsx)): o grupo "O que você precisa?" é um `<span>` solto sobre os rádios, sem `<fieldset>`/`<legend>`; `name` e `company` sem `autoComplete` (o WhatsApp já ganhou `inputMode`/`autoComplete` na [7.6](7-6-formulario-formspree.md)).
6. **Hierarquia de títulos:** o Hero abre com `<h4>Nexus Agency</h4>` antes do `<h1>` ([Hero/index.tsx](../../src/sections/Hero/index.tsx)); os Banners usam `<h4>` sem título de seção acima; o rodapé usa `<h4>`. O legado faz igual (`index.html:61-62`, `:125`), mas o nível do título não é visual.
7. **Alt dos projetos** em [projects.ts](../../src/data/projects.ts): `"project wine"` etc., em inglês e sem informação, com `title` e `categoryLabel` disponíveis.

Resultado pretendido: o site é navegável e compreensível por teclado e leitor de tela, sem mudar nada do que se vê sem foco.

Não cobre contraste (4.6) nem textos novos (`PEND-19`).

## Escopo

- Foco visível nos `fluid-btn` (anel lilás `#ad7dff` com offset, só em `:focus-visible`).
- `RollingText` com a 1ª cópia legível por leitor de tela e só o clone `aria-hidden`.
- Menu mobile com `aria-expanded`, `aria-controls` e Esc.
- Filtro como `<button aria-pressed>` dentro de um grupo rotulado.
- `<fieldset>`/`<legend>` no grupo de rádios; `autoComplete="name"` e `"organization"`.
- Títulos: `Nexus Agency` do Hero vira `<p>`; Banners e rodapé descem/ sobem para o nível certo, com as mesmas classes.
- Alt dos projetos derivado dos dados (`"Projeto Wine — Fast Food"`), sem texto novo inventado.

**Se for preciso cortar:** títulos e alt saem por último; foco visível e `RollingText` são o mínimo.

## Fora de escopo

- **Não muda o visual sem foco.** Nenhuma cor, tamanho ou espaçamento.
- **Não torna o grupo "O que você precisa?" obrigatório.** Regra de negócio: `PEND-19`.
- **Não corrige "Inicio"/"Politica e privacidade".** Texto do legado; `PEND-19`.
- **Não mexe no foco dos botões sociais nem do WhatsApp.** FR-06/FR-07; já têm o foco nativo do navegador.

## Decisões

- **Decidido** `aria-pressed` para o filtro, **descartado** completar o padrão de abas (setas, `tabpanel`), **porque** o controle filtra uma grade única; abas seriam mais código para uma semântica errada.
- **Decidido** trocar os níveis de título mantendo as classes, **descartado** manter o `<h4>` do legado, **porque** o FR-01 protege o que se vê, e a tag não muda o visual (as classes do Tailwind definem tamanho e peso).
- **Decidido** alt derivado de `title` + `categoryLabel`, **descartado** escrever descrições das imagens, **porque** descrição nova seria conteúdo inventado.

## Critérios de aceite

### AC #1 — Foco visível em todo controle

Navegando só com Tab/Shift+Tab de cima a baixo em 1200 e 375px, cada link e botão mostra um indicador de foco visível; nenhum foco "some". Com mouse, nenhum anel aparece ao clicar (`:focus-visible`).

### AC #2 — Nomes acessíveis

Na árvore de acessibilidade do Chrome (DevTools > Accessibility), cada link da navbar e do rodapé tem nome igual ao texto visível; cada filtro anuncia "pressionado" ou não; o botão do menu anuncia "expandido"/"recolhido".

### AC #3 — Menu mobile por teclado

Em 375px: Enter no botão abre, Esc fecha e devolve o foco ao botão; Tab percorre os links da gaveta.

### AC #4 — Formulário

O leitor de tela anuncia "O que você precisa?" ao entrar no grupo de rádios; o preenchimento automático do navegador sugere nome, telefone e empresa. Nomes dos campos (`name`, `whatsapp`, `company`, `need`) inalterados; envio pelo Formspree continua funcionando.

### AC #5 — Títulos em ordem

A lista de títulos (extensão HeadingsMap ou `document.querySelectorAll("h1,h2,h3,h4")`) começa pelo `h1` e não pula níveis. Capturas 375/1200 idênticas ao baseline.

### AC #6 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; Lighthouse Accessibility ≥ o atual (94); nenhum item do QA-CHECKLIST § 9 violado; capturas de foco conferidas fora do repositório (não commitadas); SHA no Change Log.

## Plano técnico

- [globals.css](../../src/app/globals.css): `.fluid-btn:focus-visible { outline: 2px solid var(--span); outline-offset: 3px; }` (sai o `ring:` inválido).
- [RollingText.tsx](../../src/components/ui/RollingText.tsx): tirar `aria-label` e o `aria-hidden` da 1ª cópia.
- [Navbar.tsx](../../src/components/layout/Navbar.tsx): `aria-expanded`, `aria-controls="mobile-menu"`, `id` na gaveta, `keydown` Esc com retorno de foco.
- [Projects/index.tsx](../../src/sections/Projects/index.tsx): `role="group" aria-label="Filtro de projetos"`, `aria-pressed` nos botões; alt `${title} — ${categoryLabel}` (ou campo `alt` de [projects.ts](../../src/data/projects.ts) reescrito a partir deles).
- [Contact/index.tsx](../../src/sections/Contact/index.tsx): `<fieldset>` + `<legend>` com as mesmas classes do `span` atual; `autoComplete`.
- [Hero/index.tsx](../../src/sections/Hero/index.tsx), [Banners/index.tsx](../../src/sections/Banners/index.tsx), [Footer.tsx](../../src/components/layout/Footer.tsx): tags de título. Conferir que os seletores `data-hero-sub` etc. continuam no elemento.

**Regras que se aplicam:** sem mudança visual (FR-01); botões sociais e WhatsApp intocados; tokens em vez de hex no CSS novo.

## Tasks

- [ ] Foco visível (AC #1)
- [ ] RollingText (AC #2)
- [ ] Menu mobile (AC #3)
- [ ] Filtro dos Projetos e alt (AC #2, AC #5)
- [ ] Formulário (AC #4)
- [ ] Títulos (AC #5)
- [ ] Validação (AC #6)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sempre | `npx tsc --noEmit`, `npm run build` |
| a11y | teclado | percurso completo com Tab em 375 e 1200 |
| a11y | árvore | DevTools > Accessibility; VoiceOver no Safari num percurso curto |
| a11y | Lighthouse | categoria Accessibility antes × depois |
| visual | sem foco | capturas 375/1200 antes × depois |
| QA-CHECKLIST | § 5 | |

## Riscos e armadilhas

- O `.fluid-btn` tem `overflow: hidden` e `isolation`: um `outline` aparece fora da caixa (não é cortado), mas um `box-shadow` de anel seria. Usar `outline`.
- Tirar `aria-hidden` da 1ª cópia do `RollingText` faz o texto entrar no `textContent` do link, como esperado; o clone continua escondido, então não há leitura dupla.
- Trocar `<h4>` por `<p>` no Hero: o `HeroClient` seleciona `[data-hero-sub]`, não a tag — manter o atributo.
- `<fieldset>` tem `border`, `padding` e `min-inline-size` padrão do navegador: zerar para não mudar o layout.

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência.
- [ ] `npx tsc --noEmit` verde.
- [ ] `npm run build` verde, sem warning de hidratação/SSR.
- [ ] Validação visual/movimento feita nos viewports afetados (capturas conferidas numa pasta temporária fora do repositório, sem commitar).
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [ ] `PEND-xx` consumido: nenhum.
- [ ] Docs afetados (TECHNICAL-SPEC § 5) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao implementar.>

**O que divergiu do plano:** <preenchido ao implementar.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`, a partir da [revisão de código](../CODE-REVIEW-2026-11-05.md) §§ 2.1–2.5 e § 3. |
