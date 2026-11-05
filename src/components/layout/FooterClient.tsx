"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";
import { REVEAL_MEDIA, revealY, scrubReveal } from "@/animations/scrubReveal";

export function FooterClient({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!ref.current) return;

    // Colunas atreladas ao scroll (story 4.2). O `clamp` no fim do trecho garante a
    // última coluna inteira no fim da página, onde não há espaço para rolar mais.
    const mm = gsap.matchMedia();
    mm.add(
      REVEAL_MEDIA,
      ({ conditions }) => {
        scrubReveal(ref.current!.querySelectorAll("[data-footer-col]"), {
          y: revealY(conditions, 30),
        });
      },
      ref
    );

    return () => mm.revert();
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
