"use client";

/**
 * BannersClient — Wrapper client-side para animações da seção Diferenciais.
 *
 * Animações:
 * - 3 cards entram com stagger (bottom → up, stagger 0.15s)
 * - Ícone de cada card tem leve pulse ao entrar no viewport
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";

export function BannersClient({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!ref.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = ref.current!.querySelectorAll("[data-banner-card]");
      if (!cards.length) return;

      // fromTo, não from: com stagger + ScrollTrigger, o refresh do `from` gravava
      // o estado inicial do 1º card como destino e ele ficava em opacity 0 (4.7).
      // O destino explícito é o estado do HTML do servidor.
      // O `set` explícito: com stagger, o immediateRender do fromTo só desenha o tempo 0
      // da timeline interna — só o 1º card começava escondido e os outros piscavam (4.1).
      const cardFrom = { y: 50, opacity: 0 };
      gsap.set(cards, cardFrom);
      gsap.fromTo(cards, cardFrom, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });

      // Pulse entrance dos ícones
      const icons = ref.current!.querySelectorAll("[data-banner-icon]");
      if (icons.length) {
        const iconFrom = { scale: 0.5, opacity: 0 };
        gsap.set(icons, iconFrom);
        gsap.fromTo(icons, iconFrom, {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.15,
          ease: "back.out(2)",
          delay: 0.2,
          scrollTrigger: {
            trigger: ref.current,
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
    <section ref={ref} className="py-14 bg-[#04091d]">
      {children}
    </section>
  );
}
