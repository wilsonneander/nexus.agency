## Sumário

<O que esta entrega faz, por área, e por quê. O diff mostra o quê; aqui vai a
costura e a decisão que amarra tudo.>

- **Seções** (`src/sections/…`) — …
- **Componentes / motion** (`src/components/…`, `src/animations/…`) — …
- **Conteúdo e config** (`src/data/…`, `src/lib/constants.ts`) — …
- **Estilos** (`globals.css`, `tailwind.config.ts`) — …
- **Docs** (`TASKS.md`, `QA-CHECKLIST.md`, …) — …

## Story

[<ID> — <título da story>](docs/stories/<id>-<slug>.md) · requisitos: <FR-xx>

## Fidelidade ao legado

- Comparado com: <`index.html:<linhas>`, legado rodando localmente, `docs/CONTENT-MAPPING.md`>.
- Conteúdo, cores, fontes e ordem das seções: <inalterados | alterados conforme PEND-xx>.
- Botões sociais (FR-07) e WhatsApp (FR-06): **não alterados**. <ou: alterados conforme PEND-xx, resolvido em AAAA-MM-DD>

## Decisões e pendências

- `PEND-xx` — <RESOLVED: decisão em uma frase | criado: o que precisa ser decidido>.
- <Decisão técnica registrada em TECHNICAL-SPEC/ARCHITECTURE § …>

<Nada.>

## Validação

Medida em `<SHA>`, árvore limpa:

```
$ npx tsc --noEmit        <saída>
$ npm run build           <exit 0; warnings: nenhum | quais>
$ node scripts/check_ids.js   <saída, ou "não aplicável">
```

| Verificação | Resultado |
| --- | --- |
| Viewports 375 / 480 / 768 / 1024 / 1200 | <conferidos: quais> |
| Scroll para baixo e para cima | <ok / não verificado — por quê> |
| `prefers-reduced-motion: reduce` | <ok / não verificado — por quê> |
| Sem JS / antes da hidratação | <conteúdo visível / não verificado> |
| Console sem erros de hidratação | <ok / não verificado> |

## Evidências

- <o que foi conferido visualmente e como (sonda, viewport); capturas não são commitadas — se precisar mostrar, anexe ao PR>

## Como conferir na mão

1. `npm install && npm run dev` — site em `http://localhost:3000`.
2. <Ação: rolar até a seção X em 1200px.> → **Esperado:** <o que aparece.>
3. <Rolar de volta para cima.> → **Esperado:** <o estado retorna a …>
4. <Caminho infeliz: DevTools → Rendering → reduced motion; 375px.> →
   **Esperado:** <conteúdo visível, sem animação / sem overflow.>

## Riscos e o que ficou de fora

- **Risco:** <o que pode se comportar diferente em produção, e o sinal disso.>
- **Fora de escopo:** <o que não foi feito, e para qual tarefa foi.>
- **Pendente do responsável:** <PEND-xx em aberto que afeta esta área.>
