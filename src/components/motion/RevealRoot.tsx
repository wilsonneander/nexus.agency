"use client";

/**
 * RevealRoot — reveal único da página (story 8.5), montado uma vez no `layout.tsx`.
 *
 * Anima todo `[data-reveal]` fora de um `[data-reveal-scope]` com `scrubReveal`, um
 * trigger por elemento, lendo as opções dos atributos `data-reveal-*` (ver
 * `revealOptions` em `src/animations/scrubReveal.ts`). As seções continuam Server
 * Components: para dar reveal a um bloco, marque-o com `data-reveal` no markup.
 * Projetos e Contato têm efeito próprio (Flip, formulário) e marcam o contêiner com
 * `data-reveal-scope`. Também segura a posição de scroll na troca de condição do
 * `matchMedia` (`keepScrollOnMediaChange`). Não renderiza nada.
 */

import { useEffect } from "react";
import { matchReveal, revealAll } from "@/animations/scrubReveal";
import { keepScrollOnMediaChange } from "@/animations/reducedMotion";

export function RevealRoot() {
  useEffect(() => {
    const releaseScroll = keepScrollOnMediaChange();
    const mm = matchReveal((conditions) => revealAll(document, conditions));
    return () => {
      mm.revert();
      releaseScroll();
    };
  }, []);

  return null;
}
