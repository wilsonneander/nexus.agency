"use client";

/**
 * AboutClient — Wrapper client-side para animações da seção Sobre Nós.
 *
 * Correção do bug do 1º card:
 * - Uso de gsap.fromTo com immediateRender: false
 * - Trigger referenciando o container da grid ou section
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";

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
    // guarda o texto do servidor ("50") para restaurar na limpeza (story 4.3).
    const metricEl = sectionRef.current.querySelector("[data-about-metric-number]");
    const metricText = metricEl?.textContent ?? null;

    const ctx = gsap.context(() => {
      const section = sectionRef.current!;

      // Ilustração — entrada da esquerda
      const illustration = section.querySelector("[data-about-image]");
      if (illustration) {
        gsap.fromTo(
          illustration,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: illustration,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Parágrafos — stagger
      const paragraphs = section.querySelectorAll("[data-about-para]");
      if (paragraphs.length) {
        gsap.fromTo(
          paragraphs,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.15,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: paragraphs[0],
              start: "top 88%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Destaque institucional (borda roxa)
      const highlight = section.querySelector("[data-about-highlight]");
      if (highlight) {
        gsap.fromTo(
          highlight,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: highlight,
              start: "top 88%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Métrica +50 — counter
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
        gsap.fromTo(
          mvCards,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.18,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: mvCards[0],
              start: "top 88%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 6 Valores — stagger grid (Correção de desaparecimento do 1º card: fromTo + trigger no container da grid)
      const valueCards = section.querySelectorAll("[data-about-value]");
      const valuesGrid = section.querySelector("[data-about-values-grid]") || valueCards[0];
      if (valueCards.length) {
        gsap.fromTo(
          valueCards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: valuesGrid,
              start: "top 88%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => {
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
