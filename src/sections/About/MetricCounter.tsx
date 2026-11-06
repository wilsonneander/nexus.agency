"use client";

/**
 * Contador da métrica do About: conta de 0 até `value` uma vez, ao entrar na tela.
 * O servidor já entrega o número final; o contador escreve `textContent`, que o
 * `revert()` não desfaz, por isso a limpeza restaura o valor (story 4.3).
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_MEDIA } from "@/animations/presets";

export function MetricCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(MOTION_MEDIA.motionOk, () => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: value,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = `${Math.round(counter.val)}`;
        },
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });
      return () => {
        el.textContent = `${value}`;
      };
    });

    return () => mm.revert();
  }, [value]);

  return (
    <span ref={ref} data-about-metric-number>
      {value}
    </span>
  );
}
