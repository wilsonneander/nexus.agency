"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";

export function FooterClient({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!ref.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cols = ref.current!.querySelectorAll("[data-footer-col]");
      if (!cols.length) return;

      gsap.from(cols, {
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.14,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 92%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer
      ref={ref}
      className="bg-[#03060f] text-white pt-16 pb-12 border-t border-white/5"
    >
      {children}
    </footer>
  );
}
