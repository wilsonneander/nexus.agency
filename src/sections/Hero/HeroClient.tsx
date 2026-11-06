"use client";

/**
 * HeroClient — Wrapper client-side para animações da seção Hero.
 *
 * Correções aplicadas (QA 3.2):
 * B1 — ref agora é passado para a <section> via callback ref, não para div.contents
 *      (story 7.1: o parallax de backgroundPositionY virou yPercent no [data-hero-glow])
 * B2 — gsap.set inicial no useEffect (depois do 1º paint: o Hero ainda pisca na
 *      hidratação, ver story 4.4/4.1)
 * Reduced motion (story 8.5): condição `motionOk` do gsap.matchMedia() na entrada e no
 * parallax; ao ligar a preferência, o revert devolve o estado visível do servidor.
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_MEDIA } from "@/animations/presets";

interface HeroClientProps {
  children: ReactNode;
}

export function HeroClient({ children }: HeroClientProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Encontra o <section id="home"> que está como filho direto do wrapper
    const section = wrapperRef.current.querySelector<HTMLElement>("[data-hero-section]");
    if (!section) return;

    const h4 = section.querySelector<HTMLElement>("[data-hero-sub]");
    const h1 = section.querySelector<HTMLElement>("[data-hero-title]");
    const social = section.querySelector<HTMLElement>("[data-hero-social]");
    const glow = section.querySelector<HTMLElement>("[data-hero-glow]");

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add(MOTION_MEDIA.motionOk, () => {
      // Estado inicial da entrada. Dentro do callback, para o revert devolver o estado
      // visível do servidor (fora dele, o Hero sumia com reduced motion — story 4.3).
      if (h4) gsap.set(h4, { opacity: 0, y: 20 });
      if (h1) gsap.set(h1, { opacity: 0, y: 30 });
      if (social) gsap.set(social, { opacity: 0, x: 20 });

      // Entrada sequencial dos elementos do hero
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (h4) tl.to(h4, { opacity: 1, y: 0, duration: 0.6 }, 0.15);
      if (h1) tl.to(h1, { opacity: 1, y: 0, duration: 0.7 }, 0.35);
      if (social) tl.to(social, { opacity: 1, x: 0, duration: 0.6 }, 0.55);
    });

    // Parallax do brilho (story 7.1): só o contêiner [data-hero-glow], nunca a <section>
    // — transform nela prenderia o bloco social `fixed` ao Hero. Reverte com o scrub.
    // Só acima de 768px (story 4.1); o matchMedia desfaz e refaz ao cruzar a faixa.
    if (glow) {
      mm.add(`${MOTION_MEDIA.desktop} and ${MOTION_MEDIA.motionOk}`, () => {
        gsap.to(glow, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }

    return () => mm.revert();
  }, []);

  return (
    <div ref={wrapperRef}>
      {children}
    </div>
  );
}
