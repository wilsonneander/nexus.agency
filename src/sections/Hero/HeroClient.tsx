"use client";

/**
 * HeroClient — Wrapper client-side para animações da seção Hero.
 *
 * Animações implementadas:
 * - Entrada sequencial: h4 → h1 → (ScrollText p) ao montar (timeline)
 * - Paralaxe sutil no background via backgroundPositionY
 * - Revelação das redes sociais (fade-in from right)
 * - ScrollText no parágrafo (importado e usado como componente filho)
 *
 * O layout e conteúdo NÃO são alterados — apenas anima o que já existe.
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroClientProps {
  children: ReactNode;
}

export function HeroClient({ children }: HeroClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const h4 = section.querySelector("[data-hero-sub]");
    const h1 = section.querySelector("[data-hero-title]");
    const social = section.querySelector("[data-hero-social]");

    const ctx = gsap.context(() => {
      // --- Entrada sequencial dos elementos do hero (ao montar) ---
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (h4) {
        gsap.set(h4, { opacity: 0, y: 20 });
        tl.to(h4, { opacity: 1, y: 0, duration: 0.6 }, 0.1);
      }
      if (h1) {
        gsap.set(h1, { opacity: 0, y: 30 });
        tl.to(h1, { opacity: 1, y: 0, duration: 0.7 }, 0.3);
      }
      if (social) {
        gsap.set(social, { opacity: 0, x: 20 });
        tl.to(social, { opacity: 1, x: 0, duration: 0.6 }, 0.5);
      }

      // --- Paralaxe sutil no background ---
      gsap.to(section, {
        backgroundPositionY: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={sectionRef} className="contents">
      {children}
    </div>
  );
}
