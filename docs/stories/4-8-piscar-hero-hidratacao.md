---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 4.8 — Eliminar o piscar do Hero na hidratação

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | TODO                                                                                    |
| **Fase**        | Fase 4 — Responsividade e acessibilidade                                                |
| **Área**        | motion                                                                                  |
| **Seções**      | Hero                                                                                    |
| **Tamanho**     | S — só o Hero (`Hero/index.tsx`, `HeroClient.tsx`) e um bloco de keyframes no `globals.css` |
| **Depende de**  | nada                                                                                    |
| **Requisitos**  | FR-02, FR-11                                                                            |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Em `3a87d86`, [HeroClient.tsx:44-56](../../src/sections/Hero/HeroClient.tsx) aplica `opacity: 0` ao subtítulo, ao `h1` e aos ícones sociais **dentro do `useEffect`**, depois que o HTML do servidor já foi pintado visível, e só então anima a entrada. Resultado: o texto aparece, some e volta a aparecer (registrado na [4.1](4-1-comportamento-por-breakpoint.md) e na [4.4](4-4-conteudo-sem-javascript.md)). Prova: gravação de performance no Chrome com CPU 4× mostra os quadros com o texto visível antes da hidratação e o quadro seguinte sem ele.

A [revisão de código](../CODE-REVIEW-2026-11-05.md) § 4 propõe fazer a entrada só com CSS: keyframes que já começam no 1º paint, sem depender do JS.

Resultado pretendido: a entrada do FR-02 (subtítulo, título e ícones sociais subindo/deslizando com fade, na ordem atual) começa no 1º quadro, sem piscar; sem JS ou com reduced motion, tudo aparece já no estado final.

Não cobre o parallax do brilho (`[data-hero-glow]`), que continua no GSAP.

## Escopo

- Keyframes CSS da entrada (mesmas distâncias, durações, atrasos e easing de hoje: `y: 20` 0,6s em 0,15s; `y: 30` 0,7s em 0,35s; `x: 20` 0,6s em 0,55s; `power3.out`).
- Classes nos três elementos do Hero; `@media (prefers-reduced-motion: reduce)` desliga.
- O `HeroClient` fica só com o parallax.

**Se for preciso cortar:** Nada, é atômica.

## Fora de escopo

- **Não muda a coreografia da entrada.** Mesmos valores do FR-02 aprovados.
- **Não mexe nos ícones sociais além da entrada.** FR-07: a animação de hover continua igual.

## Decisões

- **Decidido** CSS `@keyframes` com `animation-fill-mode: both`, **descartado** manter GSAP com `gsap.set` antes do paint (`useLayoutEffect` ou script inline), **porque** o CSS chega com o HTML e roda antes da hidratação; o GSAP sempre depende do JS carregar.
- **Decidido** que sem JS a entrada também roda (é CSS), **descartado** escondê-la sem JS, **porque** a animação termina visível em < 1,2s e não depende de nada; o critério da [4.4](4-4-conteudo-sem-javascript.md) é "nada fica invisível", e não fica.

## Critérios de aceite

### AC #1 — Sem piscar

Gravação de performance (CPU 4×, rede "Fast 4G", cache vazio) em 375 e 1200px: em nenhum quadro o subtítulo/título aparece com opacidade 1 e volta a 0. A entrada começa do estado inicial já no 1º paint.

### AC #2 — Mesma coreografia

Comparando um vídeo do baseline com o novo em 1200px: mesma ordem, distâncias e tempo de entrada (diferença ≤ 1 quadro a 60 fps).

### AC #3 — Reduced motion e sem JS

Com `prefers-reduced-motion: reduce`: os três elementos aparecem direto no estado final. Com JS desligado: a entrada roda e termina visível (`node scripts/capture_nojs.js` depois de 2s mostra o Hero completo).

### AC #4 — Ícones sociais fixos intactos

O bloco `[data-hero-social]` continua `fixed` à direita acima de 768px, acima das outras seções, com o hover FR-07 igual.

### AC #5 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes, sem warning de hidratação; nenhum item do QA-CHECKLIST § 9 violado; captura em `docs/references/qa/`; SHA no Change Log.

## Plano técnico

- [globals.css](../../src/app/globals.css): `@keyframes heroEnterUp` / `heroEnterLeft` e classes `.hero-enter-sub`, `.hero-enter-title`, `.hero-enter-social` com `animation-delay`; `cubic-bezier(0.215, 0.61, 0.355, 1)` ≈ `power3.out`; incluir no bloco de reduced motion.
- [Hero/index.tsx](../../src/sections/Hero/index.tsx): aplicar as classes.
- [HeroClient.tsx](../../src/sections/Hero/HeroClient.tsx): remover os `gsap.set`/timeline de entrada; manter o parallax; remover a prop `sectionRef` morta.
- [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) e [CLAUDE.md](../../CLAUDE.md): registrar a exceção (entrada do Hero em CSS).

**Regras que se aplicam:** só `transform`/`opacity`; reduced motion; não pôr `transform` na `<section>` (prenderia o bloco `fixed`).

## Tasks

- [ ] Gravar o baseline (vídeo e trace) (AC #1, AC #2)
- [ ] Keyframes e classes (AC #2, AC #3)
- [ ] Limpar o `HeroClient` (AC #4)
- [ ] Validação (AC #5)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sempre | `npx tsc --noEmit`, `npm run build` |
| movimento | entrada | trace com CPU 4× e vídeo, 375/1200 |
| movimento | reduced motion | emulação no DevTools |
| sem JS | Hero | `node scripts/capture_nojs.js` |
| QA-CHECKLIST | § 3, § 9 | |

## Riscos e armadilhas

- **Armadilha principal:** a animação no `[data-hero-social]` usa `transform`; o bloco já usa `-translate-y-1/2` do Tailwind para centralizar. A keyframe precisa compor (`transform: translate(20px, -50%)` → `translate(0, -50%)`), senão o bloco pula para cima.
- `transform` num ancestral do bloco `fixed` o prenderia ao Hero; a animação fica no próprio bloco, não num pai.
- Se o `HeroClient` deixar de ter efeito de entrada, conferir que o parallax continua revertendo no resize (`gsap.matchMedia`).

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência.
- [ ] `npx tsc --noEmit` verde.
- [ ] `npm run build` verde, sem warning de hidratação/SSR.
- [ ] Validação visual/movimento feita nos viewports afetados (evidência em `docs/references/qa/`).
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [ ] `PEND-xx` consumido: nenhum.
- [ ] Docs afetados (TECHNICAL-SPEC, CLAUDE.md) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao implementar.>

**O que divergiu do plano:** <preenchido ao implementar.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`, com a abordagem em CSS sugerida pela [revisão de código](../CODE-REVIEW-2026-11-05.md) § 4. |
