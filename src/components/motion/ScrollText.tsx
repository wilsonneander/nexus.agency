"use client";

/**
 * ScrollText — Leitura Progressiva (FR-03)
 *
 * Implementa destaque progressivo de palavras sincronizado com o scroll.
 * - Inicia com cor discreta (nunca invisível).
 * - Ilumina palavra a palavra conforme o scroll avança.
 * - Reversível: ao subir a página, o destaque retorna.
 * - Usa GSAP + ScrollTrigger com scrub.
 * - Cor inicial (22%) na classe `.scroll-word` de `globals.css`, que o servidor já
 *   entrega (sem piscar) e sem estilo inline (story 8.5).
 * - Respeita prefers-reduced-motion pela condição `motionOk` do gsap.matchMedia(): ao
 *   ligar a preferência, o revert tira o inline do GSAP e vale o CSS.
 * - Sem JS: o <noscript> do <head> em `src/app/layout.tsx` força `[data-word]` para
 *   branco pleno (story 4.4). Com reduced motion, a regra de `globals.css` faz o mesmo
 *   (story 4.3). Renomear o atributo `data-word` quebra os dois.
 * - B6 Correção de Acessibilidade:
 *   Utiliza texto padrão legível para leitores de tela em span sr-only sem causar leitura duplicada,
 *   ou mantém o fluxo natural renderizando palavras sem duplicar aria-label redundante no container.
 */

import { useRef, useEffect, useMemo, ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_MEDIA } from "@/animations/presets";

/** Mesmo valor da classe `.scroll-word` (globals.css): o GSAP parte dele. */
const START_COLOR = "rgba(255,255,255,0.22)";
const END_COLOR = "rgba(255,255,255,1)";

interface ScrollTextProps {
  children: string;
  className?: string;
  /** Fator scrub. Padrão: 1.2 */
  scrub?: number;
  /** Início do trigger. Padrão: "top 82%" */
  start?: string;
  /** Fim do trigger. Padrão: "bottom 28%" */
  end?: string;
  /** Tag HTML do container. Padrão: p */
  as?: ElementType;
}

export function ScrollText({
  children,
  className = "",
  scrub = 1.2,
  start = "top 82%",
  end = "bottom 28%",
  as: Tag = "p",
}: ScrollTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Divide o texto preservando espaços, pontuação e acentos.
  const tokens = useMemo(() => children.split(/(\s+)/), [children]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);

    const spans = container.querySelectorAll<HTMLSpanElement>("[data-word]");
    if (!spans.length) return;

    // matchMedia + revert (não kill): tira o inline do GSAP ao limpar e vale de novo a
    // classe; kill deixava a cor no meio do scrub quando a preferência mudava (story 4.3).
    const mm = gsap.matchMedia();
    mm.add(MOTION_MEDIA.motionOk, () => {
      gsap.set(spans, { color: START_COLOR });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub,
          invalidateOnRefresh: true,
        },
      });

      tl.to(spans, {
        color: END_COLOR,
        stagger: { each: 1 / spans.length, from: "start" },
        ease: "none",
      });
    });

    return () => mm.revert();
  }, [scrub, start, end]);

  return (
    <Tag ref={containerRef} className={className}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return token;
        return (
          <span key={i} data-word className="scroll-word">
            {token}
          </span>
        );
      })}
    </Tag>
  );
}
