"use client";

/**
 * BlogClient — Wrapper client-side para animações dos cards de Blog.
 *
 * Correção do bug de desaparecimento de card:
 * - Uso de gsap.fromTo com immediateRender: false
 * - Trigger vinculado ao container da grid
 */

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function BlogClient({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!ref.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = ref.current!.querySelectorAll("[data-blog-card]");
      const grid = ref.current!.querySelector("[data-blog-grid]") || ref.current!;
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.18,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="blog" className="py-24 bg-[#04091d]">
      {children}
    </section>
  );
}
