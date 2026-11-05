---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 6.9 — Remover código de motion/About não usado

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | TODO                                                                                    |
| **Fase**        | Fase 6 — QA e entrega                                                                   |
| **Área**        | performance/SEO                                                                         |
| **Seções**      | global (sem mudança visível)                                                            |
| **Tamanho**     | M — remove primitivas compartilhadas (`components/motion`, `components/ui`, `animations/`) e uma dependência |
| **Depende de**  | nada                                                                                    |
| **Requisitos**  | TECHNICAL-SPEC § 7 (qualidade de código)                                                |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

A tarefa nasceu na [4.4](4-4-conteudo-sem-javascript.md) (`MissionVisionValues` e `ScrollReveal` sem uso). A [revisão de código](../CODE-REVIEW-2026-11-05.md) § 3 achou mais. Em `3a87d86`, nada importa ou usa:

| O quê | Prova |
| --- | --- |
| [MissionVisionValues.tsx](../../src/sections/About/MissionVisionValues.tsx) (200 linhas) | `grep -rn "MissionVisionValues" src` só acha o próprio arquivo |
| `SocialAboutIcons` em [SocialIcons.tsx](../../src/components/ui/SocialIcons.tsx) | cópia literal de `SocialIcons variant="footer"` (mesmas classes `flex-row social-footer`); usada só no [About](../../src/sections/About/index.tsx) |
| [Button.tsx](../../src/components/ui/Button.tsx) e o barrel [ui/index.ts](../../src/components/ui/index.ts) | nenhum `import` |
| [ScrollReveal.tsx](../../src/components/motion/ScrollReveal.tsx) e [ParallaxImage.tsx](../../src/components/motion/ParallaxImage.tsx) | sem `<ScrollReveal`/`<ParallaxImage` renderizado; o About importa `ParallaxImage` e `SocialIcons` sem usar |
| `initGSAP` em [gsap.client.ts](../../src/animations/gsap.client.ts) | nenhum chamador |
| `duration`, `ease`, `stagger`, `scrollTriggerDefaults` em [presets.ts](../../src/animations/presets.ts) | nenhum leitor |
| tipos `NavItem`, `SocialLink`; campos `ProjectItem.title`, `ProjectItem.categoryLabel`, `ABOUT_DATA.metric.value` | nenhum leitor (a métrica "+50" está fixa no JSX) |
| `sectionRef` em [HeroClient](../../src/sections/Hero/HeroClient.tsx) (prop) e em [Projects](../../src/sections/Projects/index.tsx) | declarado, nunca lido |
| `@gsap/react` no [package.json](../../package.json) | `grep -rn "@gsap/react\|useGSAP" src` vazio |
| `public/assets/grafic.png`, `icon.png`, `project-1…6.jpg` | não referenciados em `src/`; vão para o deploy (~400 KB) |
| `font-light` (22 usos) | o Poppins só carrega 400–700 ([layout.tsx](../../src/app/layout.tsx), igual ao legado `styles.css:1`); a classe renderiza 400 |
| `"./src/pages/**"` no [tailwind.config.ts](../../tailwind.config.ts) | a pasta não existe |
| Scripts de captura pontuais em [scripts/](../../scripts/) com caminho fixo do Windows (`C:\Users\wilso\...`) | `capture_fluid.js`, `capture_validation.js`, `capture_mvv.js` não rodam fora daquela máquina e só validaram stories fechadas |

Resultado pretendido: o repositório só tem o que a página usa, sem nenhuma diferença no que o visitante vê.

## Escopo

- Apagar os arquivos e símbolos da tabela; trocar `SocialAboutIcons` por `SocialIcons variant="footer"` no About.
- A métrica "+50": JSX e contador passam a ler `ABOUT_DATA.metric` (fonte única), em vez de apagar o campo.
- Remover `@gsap/react` do `package.json`.
- Remover as classes `font-light`.
- Apagar os scripts pontuais; nos que ficam, trocar caminhos absolutos por relativos ao repositório e o Chrome do Windows por variável de ambiente.

**Se for preciso cortar:** os scripts saem para outra tarefa.

## Fora de escopo

- **Não refatora o que é usado.** [8.5](8-5-simplificar-motion-estilos.md).
- **Não apaga nada do legado** (`index.html`, `styles.css`, `main.js`, `assets/` na raiz) — fonte de verdade intocável.
- **Não troca o alt dos projetos.** [4.5](4-5-teclado-foco-semantica.md).

## Decisões

- **Decidido** remover `font-light` em vez de carregar o peso 300, **descartado** carregar o 300, **porque** carregar mudaria o visual (hoje tudo é 400, igual ao legado) e somaria uma fonte.
- **Decidido** fazer a métrica ler `ABOUT_DATA.metric`, **descartado** apagar o campo, **porque** o número é conteúdo e deve morar em `src/data` (CLAUDE.md).
- **Decidido** apagar sem "confirmar com quem escreveu" (pedido na linha original do TASKS), **porque** o histórico está no git e nada é renderizado; se o responsável quiser o acordeão de volta, `git show 3a87d86:src/sections/About/MissionVisionValues.tsx`.

## Critérios de aceite

### AC #1 — Nada sem uso

Para cada item da tabela do Contexto, o `grep` correspondente volta vazio (ou só o uso correto). `npx tsc --noEmit` sem erro.

### AC #2 — Página idêntica

Capturas em 375/768/1200 iguais ao baseline, incluindo About (botões sociais redondos no lugar de sempre, "+50" e contador), Projetos e textos com o mesmo peso de fonte.

### AC #3 — Motion idêntico

Contador "+50" anima uma vez e termina em 50; com reduced motion mostra 50; sem JS mostra +50.

### AC #4 — Scripts que ficam rodam aqui

Cada script que sobra em `scripts/` roda neste repositório com o dev server na 3008 sem editar o arquivo.

### AC #5 — Nada regride, e a validação é carimbada

`npx tsc --noEmit`, `npm install` limpo e `npm run build` verdes (First Load JS de `/` igual ou menor que 187 kB); `node scripts/check_ids.js` ok; nenhum item do QA-CHECKLIST § 9 violado; SHA no Change Log.

## Plano técnico

Ver tabela do Contexto, arquivo a arquivo. Em [About/index.tsx](../../src/sections/About/index.tsx) e [AboutClient.tsx](../../src/sections/About/AboutClient.tsx), ler `ABOUT_DATA.metric` (separar `"+"` e o número no dado, ou derivar com `parseInt`). Atualizar o [CLAUDE.md](../../CLAUDE.md) (cita `ScrollReveal`, `ParallaxImage` e a 6.9) e o [ARCHITECTURE.md](../ARCHITECTURE.md) § 3.

**Regras que se aplicam:** botões sociais intocados (FR-07) — a troca de `SocialAboutIcons` por `SocialIcons variant="footer"` gera o mesmo HTML; legado intocado.

## Tasks

- [ ] Apagar arquivos e símbolos mortos (AC #1)
- [ ] Métrica lendo `ABOUT_DATA.metric` (AC #3)
- [ ] `@gsap/react`, `font-light`, `tailwind.config` (AC #1)
- [ ] Assets não usados (AC #1)
- [ ] Scripts (AC #4)
- [ ] Docs e validação (AC #2, AC #5)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sempre | `npx tsc --noEmit`, `npm run build` |
| âncoras | About tocado | `node scripts/check_ids.js` |
| visual | página inteira | capturas 375/768/1200 antes × depois |
| movimento | contador | scroll até o About, reduced motion, sem JS |
| QA-CHECKLIST | § 1, § 9 | |

## Riscos e armadilhas

- Remover `font-light` só é neutro se o peso 300 continuar não carregado; se alguém adicionar o 300 depois, o visual mudaria — por isso remover em vez de manter "por via das dúvidas".
- `icon.png` e `icon2.png` são parecidos: o favicon usa o **`icon2.png`** (layout.tsx). Apagar só o `icon.png`.
- `header.webp` não é usado na página mas é a imagem OG: **não apagar** (ver [8.4](8-4-metadados-dados-estruturados.md)).

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência.
- [ ] `npx tsc --noEmit` verde.
- [ ] `npm run build` verde, sem warning de hidratação/SSR.
- [ ] Validação visual/movimento feita nos viewports afetados (capturas conferidas numa pasta temporária fora do repositório, sem commitar).
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [ ] `PEND-xx` consumido: nenhum.
- [ ] Docs afetados (ARCHITECTURE, CLAUDE.md) atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao implementar.>

**O que divergiu do plano:** <preenchido ao implementar.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`; escopo ampliado com a [revisão de código](../CODE-REVIEW-2026-11-05.md) § 3 (o título do TASKS foi mantido). |
