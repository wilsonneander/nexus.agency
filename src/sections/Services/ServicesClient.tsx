"use client";

/**
 * ServicesClient — Wrapper client-side para a seção de Serviços.
 *
 * Animações:
 * - ScrollText no título e subtítulo do cabeçalho
 * - Entrada sequencial dos 6 cards de serviços (stagger)
 * - Pulse de entrada nos badges/ícones flutuantes
 * - Revelação dos 4 benefícios dentro de cada card
 * - Entrada dos 3 pacotes comerciais
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ServicesClient({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!ref.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = ref.current!;

      // 6 cards de serviços
      const serviceCards = section.querySelectorAll("[data-service-card]");
      if (serviceCards.length) {
        gsap.from(serviceCards, {
          y: 55,
          opacity: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: serviceCards[0],
            start: "top 88%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }

      // Badges flutuantes — pulse
      const badges = section.querySelectorAll("[data-service-badge]");
      if (badges.length) {
        gsap.from(badges, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          stagger: 0.12,
          ease: "back.out(2.2)",
          delay: 0.25,
          scrollTrigger: {
            trigger: serviceCards[0] || section,
            start: "top 88%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }

      // 3 pacotes comerciais
      const packages = section.querySelectorAll("[data-package-card]");
      if (packages.length) {
        gsap.from(packages, {
          y: 48,
          opacity: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: packages[0],
            start: "top 88%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="service" className="py-24 bg-[#04091d]">
      {children}
    </section>
  );
}
