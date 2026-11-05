"use client";

/**
 * AboutClient — Wrapper client-side para animações da seção Sobre Nós.
 *
 * Animações (story 4.2): parágrafos, destaque, Missão/Visão e os 6 Valores entram
 * atrelados ao scroll, um trigger por elemento; o contador da métrica dispara uma vez.
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";
import { REVEAL_MEDIA, revealY, scrubReveal } from "@/animations/scrubReveal";

interface AboutClientProps {
  children: ReactNode;
}

export function AboutClient({ children }: AboutClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // O contador escreve textContent no onUpdate, que o ctx.revert() não desfaz:
    // guarda o texto do servidor (ABOUT_DATA.metric.value) para restaurar na limpeza
    // (story 4.3) e usa o mesmo número como destino (story 6.9).
    const metricEl = sectionRef.current.querySelector("[data-about-metric-number]");
    const metricText = metricEl?.textContent ?? null;
    const metricTarget = Number(metricText);

    const ctx = gsap.context(() => {
      // Contador da métrica
      if (metricEl && Number.isFinite(metricTarget)) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: metricTarget,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            metricEl.textContent = `${Math.round(counter.val)}`;
          },
          scrollTrigger: {
            trigger: metricEl,
            start: "top 88%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    const mm = gsap.matchMedia();
    mm.add(
      REVEAL_MEDIA,
      ({ conditions }) => {
        const section = sectionRef.current!;
        scrubReveal(section.querySelectorAll("[data-about-para]"), { y: revealY(conditions, 30) });
        scrubReveal(section.querySelector("[data-about-highlight]"), { y: revealY(conditions, 24) });
        scrubReveal(section.querySelectorAll("[data-about-mv]"), { y: revealY(conditions, 32) });
        scrubReveal(section.querySelectorAll("[data-about-value]"), { y: revealY(conditions, 40) });
      },
      sectionRef
    );

    return () => {
      mm.revert();
      ctx.revert();
      if (metricEl && metricText !== null) metricEl.textContent = metricText;
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-[#04091d]">
      {children}
    </section>
  );
}
