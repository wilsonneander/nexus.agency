"use client";

/**
 * BannersClient — Wrapper client-side para animações da seção Diferenciais.
 *
 * Animações (story 4.2): cada card entra atrelado ao scroll, com o ícone em escala
 * na 2ª metade do trecho do card.
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";
import { REVEAL_MEDIA, popInside, revealY, scrubReveal } from "@/animations/scrubReveal";

export function BannersClient({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!ref.current) return;

    // Um trigger por card, sem stagger: o `fromTo` com stagger + ScrollTrigger só
    // desenhava o estado inicial do 1º card (4.1) e o `from` gravava o estado inicial
    // como destino (4.7). O scrubReveal usa `fromTo` com destino explícito por alvo.
    const mm = gsap.matchMedia();
    mm.add(
      REVEAL_MEDIA,
      ({ conditions }) => {
        scrubReveal(ref.current!.querySelectorAll("[data-banner-card]"), {
          y: revealY(conditions, 50),
          extra: popInside("[data-banner-icon]", 0.5),
        });
      },
      ref
    );

    return () => mm.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="py-14 bg-[#04091d]">
      {children}
    </section>
  );
}
