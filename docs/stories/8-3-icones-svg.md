---
baseline_commit: 3a87d8651cce981791692b61f5c127889090347e
---

# Story 8.3 — Trocar as fontes de ícones de CDN por SVG inline

|                 |                                                                                         |
| --------------- | --------------------------------------------------------------------------------------- |
| **Status**      | BLOCKED                                                                                 |
| **Fase**        | Fase 8 — Leveza, SEO e deploy no Cloudflare Pages                                       |
| **Área**        | performance/SEO, layout/UI                                                              |
| **Seções**      | global (Navbar, Hero, About, Banners, Services, Footer, WhatsAppFloat)                  |
| **Tamanho**     | L — muda `app/layout.tsx` e toca os elementos protegidos do FR-07 e do FR-06            |
| **Depende de**  | `PEND-18` (`PENDING_APPROVAL` — trocar o glifo de fonte por SVG nos botões sociais e no WhatsApp) |
| **Requisitos**  | FR-06, FR-07, QA-CHECKLIST § 6                                                          |
| **Baseline**    | `3a87d86` — todo "hoje" desta story vale nesse commit                                   |

## Contexto

Achado 1.4 de [CODE-REVIEW-2026-11-05.md](../CODE-REVIEW-2026-11-05.md). Em `3a87d86`, [layout.tsx:61-72](../../src/app/layout.tsx) carrega três folhas de estilo de CDN que bloqueiam a renderização:

- FontAwesome 6.0.0 `all.min.css` (cdnjs) — todos os estilos e as fontes `solid`/`brands`;
- FontAwesome **4.5.0** inteiro (cdnjs) — usado só por `fa fa-whatsapp` em [WhatsAppFloat.tsx](../../src/components/ui/WhatsAppFloat.tsx);
- RemixIcon 3.5.0 (jsdelivr) — usado por 5 ícones (3 dos Banners e os 2 do menu mobile).

O legado carrega as mesmas três (`index.html:7-10`). O site inteiro usa cerca de 20 glifos: 3 marcas (Instagram, LinkedIn, Facebook), WhatsApp, `bullseye`, `eye`, `check`, `compass`, `rectangle-ad`, `chart-line`, `globe`, `robot`, `file-lines` e os 5 do RemixIcon. Por isso o navegador baixa centenas de KB de CSS e fontes, abrindo duas origens extras, antes de desenhar.

Resultado pretendido: zero CSS de ícone externo; cada ícone é um SVG inline com o mesmo desenho, tamanho e cor.

Esta story **está bloqueada**: os botões sociais (FR-07) e o botão flutuante do WhatsApp (FR-06) não podem mudar visual nem animação, e trocar o glifo de fonte por SVG é mudança de implementação nesses elementos — precisa do aval do responsável (`PEND-18`).

## Escopo

- Componente de ícone SVG (ou SVGs inline por uso) com os ~20 glifos, no mesmo `path` do FontAwesome 6 / RemixIcon 3.5 (licenças CC BY 4.0 / Apache 2.0, compatíveis).
- Remover os três `<link>` de CDN de [layout.tsx](../../src/app/layout.tsx).
- Ajustar o CSS que mira `.icon`, `.fa-whatsapp` em [globals.css](../../src/app/globals.css) para os SVGs, mantendo cor, tamanho, `rotateY(360deg)` e o preenchimento por marca.

**Se for preciso cortar:** trocar primeiro só o FontAwesome 4.5 (um ícone, `fa-brands fa-whatsapp` do FA6 é o mesmo glifo) e o RemixIcon; os ícones do FR-07 ficam para depois.

## Fora de escopo

- **Não muda nenhum ícone de desenho.** Mesmo glifo, mesmo tamanho; trocar o ícone em si é redesign.
- **Não adiciona pacote de ícones** (`react-icons`, `@fortawesome/*`). Ver Decisões.

## Decisões

- **Decidido** SVG inline copiado dos pacotes originais, **descartado** `react-icons`/`@fortawesome/react-fontawesome`, **porque** são ~20 ícones; uma dependência para isso contraria o AGENTS.md (sem dependência nova sem justificar) e pesa mais no bundle.
- **Decidido** manter as classes `.item a`/`.icon` do FR-07 e trocar só o elemento interno, **descartado** reescrever o CSS dos botões sociais, **porque** a animação protegida mora nessas classes.
- ⚠️ A troca nos elementos protegidos é decisão do responsável: `PEND-18`.

## Critérios de aceite

### AC #1 — Sem CSS de ícone externo

O HTML de `/` não tem `<link>` para `cdnjs.cloudflare.com` nem `cdn.jsdelivr.net`. No DevTools > Network, nenhuma requisição a essas origens.

### AC #2 — Ícones idênticos

Em 375, 768 e 1200px, captura lado a lado com o baseline de cada ícone (Navbar mobile, Hero social, About social, Banners, Missão/Visão, Serviços, Footer social, WhatsApp): mesmo desenho, tamanho e cor; diferença visual nenhuma perceptível.

### AC #3 — Botões sociais e WhatsApp intactos (FR-06, FR-07)

Hover nos 3 locais dos botões sociais: o preenchimento sobe por marca e o ícone gira `rotateY(360deg)` com a mesma duração. WhatsApp: pulso `WaveWhatsApp`, texto e destino `wa.me/556192985392` iguais.

### AC #4 — Acessibilidade preservada

Os SVGs são decorativos (`aria-hidden="true"`, `focusable="false"`); os nomes acessíveis continuam vindo dos `aria-label` existentes.

### AC #5 — Nada regride, e a validação é carimbada

`npx tsc --noEmit` e `npm run build` verdes; Lighthouse Performance de `/` em mobile não piora (esperado: FCP menor); nenhum item do QA-CHECKLIST § 9 violado; capturas conferidas fora do repositório (não commitadas); SHA no Change Log.

## Plano técnico

- `src/components/ui/Icon.tsx` (Server Component): mapa `nome → path` e `<svg viewBox>` com `fill="currentColor"`, `width/height="1em"`.
- Substituir cada `<i className="...">` pelo `<Icon name="..." />` em [SocialIcons.tsx](../../src/components/ui/SocialIcons.tsx), [WhatsAppFloat.tsx](../../src/components/ui/WhatsAppFloat.tsx), [Navbar.tsx](../../src/components/layout/Navbar.tsx), [About](../../src/sections/About/index.tsx), [Banners](../../src/sections/Banners/index.tsx), [Services](../../src/sections/Services/index.tsx). `ServiceItem.iconClass` em [types](../../src/types/index.ts) e [services.ts](../../src/data/services.ts) vira o nome do ícone.
- [globals.css](../../src/app/globals.css): `.icon` e `.fa-whatsapp` passam a mirar o SVG (`svg.icon`), com o `display: inline-block` necessário para o `rotateY` funcionar.

**Regras que se aplicam:** FR-06/FR-07 (TECHNICAL-SPEC § 2, "Botões Sociais" e "WhatsApp Oficial") — visual, posição, links e animação idênticos; sem hex solto.

## Tasks

- [ ] Aguardar `PEND-18`
- [ ] Componente `Icon` com os glifos (AC #2, AC #4)
- [ ] Trocar os usos e remover os `<link>` (AC #1)
- [ ] Ajustar CSS do FR-07/FR-06 (AC #3)
- [ ] Validação (AC #5)

## Validações exigidas

| Camada | Caso | Como |
| --- | --- | --- |
| tipos/build | sempre | `npx tsc --noEmit`, `npm run build` |
| visual | todos os ícones | capturas 375/768/1200 antes × depois |
| movimento | hover social e WhatsApp | mouse real em 1200px; reduced motion (`PEND-13` segue valendo) |
| performance | CSS bloqueante | Lighthouse mobile antes × depois |
| QA-CHECKLIST | § 1, § 6, § 9 | botões sociais inalterados |

## Riscos e armadilhas

- O `rotateY` do FR-07 depende do ícone ser caixa transformável: um `<svg>` inline funciona, mas sem `display: inline-block`/`block` a transformação pode não aparecer em alguns navegadores.
- O glifo de fonte tem métricas de linha (baseline, `line-height`) que o SVG não tem: o ícone pode subir ou descer 1–2px. Comparar na captura.
- O FontAwesome 4.5 desenha o WhatsApp um pouco diferente do FA6. Usar o path do **4.5** para manter o desenho atual.
- **Preservar** o comentário "FR-06 inviolável" de [WhatsAppFloat.tsx](../../src/components/ui/WhatsAppFloat.tsx) e o bloco "Preservação Inegociável" do [globals.css](../../src/app/globals.css).

## Definition of Done

- [ ] Todo AC verificado, cada um com a evidência.
- [ ] `npx tsc --noEmit` verde.
- [ ] `npm run build` verde, sem warning de hidratação/SSR.
- [ ] Validação visual/movimento feita nos viewports afetados (capturas conferidas numa pasta temporária fora do repositório, sem commitar).
- [ ] Itens tocados do `QA-CHECKLIST.md` atualizados com a evidência.
- [ ] `PEND-18` marcado `RESOLVED`.
- [ ] Docs afetados (TECHNICAL-SPEC, ARCHITECTURE, CLAUDE.md — "RemixIcon/FontAwesome via CDN") atualizados.
- [ ] Status movido na story **e** no `TASKS.md`, com a validação carimbada (comando + SHA) no Change Log.

## Execução

**Arquivos tocados:** <preenchido ao implementar.>

**O que divergiu do plano:** <preenchido ao implementar.>

## Change Log

| Data | Status | O que mudou |
| --- | --- | --- |
| 2026-11-05 | BLOCKED | Story criada sobre `3a87d86`, a partir da [revisão de código](../CODE-REVIEW-2026-11-05.md) § 1.4. Bloqueada no `PEND-18` (troca nos elementos protegidos FR-06/FR-07). |
