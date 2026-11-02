"use client";

/**
 * ScrollText — Leitura Progressiva (FR-03)
 *
 * Implementa destaque progressivo de palavras sincronizado com o scroll.
 * - Inicia com cor discreta (nunca invisível).
 * - Ilumina palavra a palavra conforme o scroll avança.
 * - Reversível: ao subir a página, o destaque retorna.
 * - Usa GSAP + ScrollTrigger com scrub.
 * - Respeita prefers-reduced-motion.
 * - Acessível: aria-label no container + aria-hidden nas spans visuais.
 */

import { useRef, useEffect, useMemo, ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollTextProps {
  children: string;
  className?: string;
  /** Cor inicial (muted). Padrão: rgba(255,255,255,0.22) */
  startColor?: string;
  /** Cor final (iluminado). Padrão: rgba(255,255,255,1) */
  endColor?: string;
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
  startColor = "rgba(255,255,255,0.22)",
  endColor = "rgba(255,255,255,1)",
  scrub = 1.2,
  start = "top 82%",
  end = "bottom 28%",
  as: Tag = "p",
}: ScrollTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  // Divide o texto preservando espaços, pontuação e acentos.
  const tokens = useMemo(() => children.split(/(\s+)/), [children]);

  useEffect(() => {
    if (reducedMotion) return;
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const spans = containerRef.current.querySelectorAll<HTMLSpanElement>("[data-word]");
    if (!spans.length) return;

    gsap.set(spans, { color: startColor });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start,
        end,
        scrub,
        invalidateOnRefresh: true,
      },
    });

    tl.to(spans, {
      color: endColor,
      stagger: { each: 1 / spans.length, from: "start" },
      ease: "none",
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reducedMotion, startColor, endColor, scrub, start, end]);

  return (
    <Tag ref={containerRef} className={className} aria-label={children}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return token;
        return (
          <span
            key={i}
            data-word
            aria-hidden="true"
            style={{
              color: reducedMotion ? endColor : startColor,
              display: "inline",
            }}
          >
            {token}
          </span>
        );
      })}
    </Tag>
  );
}
