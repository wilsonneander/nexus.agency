"use client";

/**
 * HeroClient — Wrapper client-side para animações da seção Hero.
 *
 * Correções aplicadas (QA 3.2):
 * B1 — ref agora é passado para a <section> via callback ref, não para div.contents
 * B2 — gsap.set inicial no useEffect (depois do 1º paint: o Hero ainda pisca na
 *      hidratação, ver story 4.4/4.1)
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroClientProps {
  children: ReactNode;
  /** Callback ref que o Hero/index.tsx passa para o <section> interno */
  sectionRef?: React.RefObject<HTMLElement | null>;
}

export function HeroClient({ children }: HeroClientProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!wrapperRef.current) return;

    // Encontra o <section id="home"> que está como filho direto do wrapper
    const section = wrapperRef.current.querySelector<HTMLElement>("[data-hero-section]");
    if (!section) return;

    const h4 = section.querySelector<HTMLElement>("[data-hero-sub]");
    const h1 = section.querySelector<HTMLElement>("[data-hero-title]");
    const social = section.querySelector<HTMLElement>("[data-hero-social]");

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Estado inicial da entrada. Dentro do contexto, para o ctx.revert() devolver o
      // estado visível do servidor (fora dele, o Hero sumia com reduced motion — story 4.3).
      if (h4) gsap.set(h4, { opacity: 0, y: 20 });
      if (h1) gsap.set(h1, { opacity: 0, y: 30 });
      if (social) gsap.set(social, { opacity: 0, x: 20 });

      // Entrada sequencial dos elementos do hero
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (h4) tl.to(h4, { opacity: 1, y: 0, duration: 0.6 }, 0.15);
      if (h1) tl.to(h1, { opacity: 1, y: 0, duration: 0.7 }, 0.35);
      if (social) tl.to(social, { opacity: 1, x: 0, duration: 0.6 }, 0.55);

      // B1 — Parallax correto: anima o <section> que tem backgroundImage
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
    }, wrapperRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={wrapperRef}>
      {children}
    </div>
  );
}
