"use client";

/**
 * ServicesClient — Wrapper client-side para a seção de Serviços.
 *
 * Animações (story 4.2): cards de serviço e pacotes entram atrelados ao scroll,
 * um trigger por card; o selo de cada serviço entra em escala dentro do seu card.
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";
import { REVEAL_MEDIA, popInside, revealY, scrubReveal } from "@/animations/scrubReveal";

export function ServicesClient({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!ref.current) return;

    const mm = gsap.matchMedia();
    mm.add(
      REVEAL_MEDIA,
      ({ conditions }) => {
        const section = ref.current!;

        scrubReveal(section.querySelectorAll("[data-service-card]"), {
          y: revealY(conditions, 55),
          extra: popInside("[data-service-badge]", 0),
        });

        scrubReveal(section.querySelectorAll("[data-package-card]"), {
          y: revealY(conditions, 48),
        });
      },
      ref
    );

    return () => mm.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="service" className="py-24 bg-[#04091d]">
      {children}
    </section>
  );
}
