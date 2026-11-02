"use client";

/**
 * AboutClient — Wrapper client-side para animações da seção Sobre Nós.
 *
 * Animações:
 * - Ilustração: ScrollReveal from left (x: -60) + ParallaxImage leve
 * - Título: ScrollText (leitura progressiva)
 * - Parágrafos: ScrollReveal staggered
 * - Bloco destaque (borda roxa): ScrollReveal
 * - Métrica +50: counter ao entrar no viewport
 * - Missão / Visão: ScrollReveal pair
 * - 6 Valores: stagger de cards
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AboutClientProps {
  children: ReactNode;
}

export function AboutClient({ children }: AboutClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current!;

      // Ilustração — entrada da esquerda
      const illustration = section.querySelector("[data-about-image]");
      if (illustration) {
        gsap.from(illustration, {
          x: -60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: illustration,
            start: "top 85%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }

      // Parágrafos — stagger
      const paragraphs = section.querySelectorAll("[data-about-para]");
      if (paragraphs.length) {
        gsap.from(paragraphs, {
          y: 30,
          opacity: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: paragraphs[0],
            start: "top 88%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }

      // Destaque institucional (borda roxa)
      const highlight = section.querySelector("[data-about-highlight]");
      if (highlight) {
        gsap.from(highlight, {
          y: 24,
          opacity: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: highlight,
            start: "top 88%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }

      // Métrica +50 — B3: anima apenas o span do número para preservar bg-clip-text
      const metricEl = section.querySelector("[data-about-metric-number]");
      if (metricEl) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: 50,
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

      // Missão + Visão — fade sequencial
      const mvCards = section.querySelectorAll("[data-about-mv]");
      if (mvCards.length) {
        gsap.from(mvCards, {
          y: 32,
          opacity: 0,
          duration: 0.7,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: {
            trigger: mvCards[0],
            start: "top 88%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }

      // 6 Valores — stagger grid
      const valueCards = section.querySelectorAll("[data-about-value]");
      if (valueCards.length) {
        gsap.from(valueCards, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: valueCards[0],
            start: "top 90%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-[#04091d]">
      {children}
    </section>
  );
}
