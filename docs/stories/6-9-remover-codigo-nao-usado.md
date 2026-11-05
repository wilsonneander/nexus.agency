---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 6.9 — Remover código de motion/About não usado

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | DONE                                                                                    |
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
| `gsap.client.ts` inteiro (`initGSAP` e os re-exports) | nenhum `import` do arquivo |
| `duration`, `stagger`, `scrollTriggerDefaults` e `ease.elastic` em [presets.ts](../../src/animations/presets.ts) | nenhum leitor (`ease.smooth`/`ease.reveal` **são** lidos pelo Navbar e pelos Projetos desde a 7.7 — ficam) |
| tipos `NavItem`, `SocialLink`; campos `ProjectItem.title`, `ProjectItem.categoryLabel`, `ABOUT_DATA.metric.value` | nenhum leitor (a métrica "+50" está fixa no JSX) |
| `sectionRef` em [HeroClient](../../src/sections/Hero/HeroClient.tsx) (prop) e em [Projects](../../src/sections/Projects/index.tsx) | declarado, nunca lido |
| `@gsap/react` no [package.json](../../package.json) | `grep -rn "@gsap/react\|useGSAP" src` vazio |
| ~~`public/assets/grafic.png`, `icon.png`, `project-1…6.jpg`~~ | **já removidos na [8.2](8-2-deploy-estatico-cloudflare-pages.md)** (iam para o deploy); nada a fazer aqui |
| `font-light` (22 usos) | o Poppins só carrega 400–700 ([layout.tsx](../../src/app/layout.tsx), igual ao legado `styles.css:1`); a classe renderiza 400 |
| `"./src/pages/**"` no [tailwind.config.ts](../../tailwind.config.ts) | a pasta não existe |
| Scripts de captura com o Chrome do Windows fixo (`C:\Program Files\...`) em [scripts/](../../scripts/) | todos os `capture_*`; `capture_fluid.js`, `capture_validation.js`, `capture_mvv.js` só validaram stories fechadas |

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

- [x] Apagar arquivos e símbolos mortos (AC #1)
- [x] Métrica lendo `ABOUT_DATA.metric` (AC #3)
- [x] `@gsap/react`, `font-light`, `tailwind.config` (AC #1)
- [x] ~~Assets não usados~~ — feito na 8.2
- [x] Scripts (AC #4)
- [x] Docs e validação (AC #2, AC #5)

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

## Definition of Done

- [x] Todo AC verificado, cada um com a evidência.
- [x] `npx tsc --noEmit` verde.
- [x] `npm run build` verde, sem warning de hidratação/SSR.
- [x] Validação visual/movimento feita nos viewports afetados (capturas conferidas numa pasta temporária fora do repositório, sem commitar).
- [x] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [x] `PEND-xx` consumido: nenhum.
- [x] Docs afetados (ARCHITECTURE, CLAUDE.md) atualizados.
- [x] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:**
- Apagados: [MissionVisionValues.tsx](../../src/sections/About/MissionVisionValues.tsx), `components/ui/Button.tsx`, `components/ui/index.ts`, `components/motion/ScrollReveal.tsx`, `components/motion/ParallaxImage.tsx`, `animations/gsap.client.ts`, `scripts/capture_fluid.js`, `scripts/capture_validation.js`, `scripts/capture_mvv.js`.
- Código: [SocialIcons.tsx](../../src/components/ui/SocialIcons.tsx) (sem `SocialAboutIcons` nem a variante `"about"`, que só ele usava), [About/index.tsx](../../src/sections/About/index.tsx) (`SocialIcons variant="footer"`, métrica lida de `ABOUT_DATA.metric`, imports mortos), [AboutClient.tsx](../../src/sections/About/AboutClient.tsx) (destino do contador = número do HTML do servidor), [about.ts](../../src/data/about.ts) (`metric.prefix` + `metric.value: 50`), [projects.ts](../../src/data/projects.ts) e [types/index.ts](../../src/types/index.ts) (sem `title`/`categoryLabel`, `NavItem`, `SocialLink`), [presets.ts](../../src/animations/presets.ts), [HeroClient.tsx](../../src/sections/Hero/HeroClient.tsx) e [Projects/index.tsx](../../src/sections/Projects/index.tsx) (`sectionRef`), `font-light` em Hero, About, Banners, Services, Contact e Footer, [tailwind.config.ts](../../tailwind.config.ts), [package.json](../../package.json)/`package-lock.json` (`@gsap/react`).
- Scripts: novo [chrome-path.js](../../scripts/chrome-path.js) (Chrome padrão por sistema, `CHROME_PATH` sobrescreve), usado por `capture_nojs`, `capture_screenshots`, `capture_scroll` e `capture_sections`.
- Docs: [CLAUDE.md](../../CLAUDE.md), [README.md](../../README.md), [ARCHITECTURE.md](../ARCHITECTURE.md) § 3, [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) (versão do `@gsap/react`), [QA-CHECKLIST.md](../QA-CHECKLIST.md) (evidência que citava o `ParallaxImage`), skill [implement](../../.claude/skills/implement/SKILL.md) (mapa de precedentes apontava para `ScrollReveal`/`ParallaxImage`).

**O que divergiu do plano:**
- `MOTION_PRESETS.ease` ficou (só `elastic` saiu): `smooth` e `reveal` passaram a ser lidos na 7.7, depois do baseline.
- `gsap.client.ts` saiu inteiro, não só o `initGSAP`: ninguém importa o arquivo; cada wrapper registra os próprios plugins.
- Métrica: o dado virou `{ prefix: "+", value: 50 }`; o `AboutClient` não importa `ABOUT_DATA` (levaria todos os textos do About ao bundle) e anima até o número que o servidor renderizou em `[data-about-metric-number]`.
- Scripts: o caminho `C:\Users\wilso` já não existia; o que prendia ao Windows era o Chrome em todos os `capture_*`, resolvido por um módulo comum em vez de repetir a lógica.

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | TODO | Story criada sobre `3a87d86`; escopo ampliado com a [revisão de código](../CODE-REVIEW-2026-11-05.md) § 3 (o título do TASKS foi mantido). |
| 2026-11-05 | TODO | Os assets sem uso de `public/assets/` saíram na [8.2](8-2-deploy-estatico-cloudflare-pages.md), que limpou o que vai para `out/`; item riscado aqui. |
| 2026-11-05 | TODO | Validada sobre `d7214b1` (7 commits após o baseline): `MOTION_PRESETS.ease` é usado desde a 7.7 e fica; `gsap.client.ts` sai inteiro; scripts presos ao Chrome do Windows (não mais a `C:\Users\wilso`); tarefa e riscos de assets caducos (8.2); skill `implement` incluída nos docs. |
| 2026-11-05 | IN_PROGRESS | Implementada na árvore de trabalho sobre `d7214b1`. **AC #1:** `grep -rn` de todos os símbolos da tabela em `src`, `scripts`, `package.json`, `tailwind.config.ts` vazio (só o caminho do Windows como padrão `win32` em `chrome-path.js`); `npx tsc --noEmit` ok. **AC #2:** `out/` antes × depois servidos na 3008/3009: HTML de `/` idêntico salvo as 22 classes `font-light` e os hashes; CSS sem `font-weight:300`; `JS=1 node scripts/capture_nojs.js` e `node scripts/capture_nojs.js` com as mesmas alturas (375: 13113 … 1200: 7237), 480 e 768 idênticas pixel a pixel, 375/1024/1200 diferem só no quadro do brilho do Hero (loop CSS) e anti-aliasing perto do Contact — recortes conferidos à vista. **AC #3:** CDP em 1200×900 com scroll real: contador 0 → 7,40,47,49,50 e fica em 50 ao subir e voltar (igual ao antes: 0,16,30,…,50); `prefers-reduced-motion: reduce` → 50 o tempo todo; sem JS o HTML traz `+`/`50`. **AC #4:** `capture_nojs.js` (com e sem `JS=1`) e `check_ids.js` rodaram neste Mac sem editar; `capture_sections`, `capture_screenshots` e `capture_scroll` também rodaram (12 PNGs, saída 0), todos pelo mesmo `chrome-path.js`. **AC #5:** `npm install` sem mudança além da remoção do `@gsap/react` no lock; `npm run build` ok, First Load JS de `/` 187 kB (chunk da página 19 043 → 18 634 B), sem warning; `node scripts/check_ids.js` 11/11 `true`. Capturas em pasta temporária, fora do repo. Falta: revisão (`review-mr`) e SHA do commit. |
| 2026-11-05 | DONE | Revisão (`review-mr`) sem bloqueador; o HTML do `SocialIcons variant="footer"` é idêntico ao do `SocialAboutIcons` removido (FR-07). Ajuste do review: a variante `"about"`, que ficou sem uso, saiu do tipo do `SocialIcons`. Validado na árvore de trabalho sobre `4425108`: `npx tsc --noEmit` ok; `npm run build` ok, First Load JS de `/` 187 kB, sem warning; `out/` servido na 3008: `node scripts/check_ids.js` 11/11 `true`, `JS=1 node scripts/capture_nojs.js` com as mesmas alturas (375: 13113 … 1200: 7237) e About conferido à vista em 1200/375. O contador não foi medido de novo: o código não mudou desde a medição anterior. |
