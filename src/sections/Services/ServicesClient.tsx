"use client";

/**
 * ServicesClient — Wrapper client-side para a seção de Serviços.
 *
 * Correção do bug do 1º card:
 * - Uso de gsap.fromTo com immediateRender: false
 * - Triggers referenciando os containers de grid
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
      const servicesGrid = section.querySelector("[data-services-grid]") || serviceCards[0];
      if (serviceCards.length && servicesGrid) {
        gsap.fromTo(
          serviceCards,
          { y: 55, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: servicesGrid,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Badges flutuantes — pulse
      const badges = section.querySelectorAll("[data-service-badge]");
      if (badges.length && servicesGrid) {
        gsap.fromTo(
          badges,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.12,
            ease: "back.out(2.2)",
            delay: 0.25,
            immediateRender: false,
            scrollTrigger: {
              trigger: servicesGrid,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 3 pacotes comerciais (Correção de desaparecimento do 1º card: fromTo + trigger no container da grid)
      const packages = section.querySelectorAll("[data-package-card]");
      const packagesGrid = section.querySelector("[data-packages-grid]") || packages[0];
      if (packages.length && packagesGrid) {
        gsap.fromTo(
          packages,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.15,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: packagesGrid,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        );
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
