"use client";

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
      if (!cards.length) return;

      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.65,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 86%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="blog" className="py-24 bg-[#04091d]">
      {children}
    </section>
  );
}
