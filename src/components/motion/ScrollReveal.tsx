"use client";

/**
 * ScrollReveal — Entrada animada ao entrar no viewport (FR-04)
 *
 * Envolve children com animação fade-in + translação vertical/horizontal.
 * - Suporta stagger para múltiplos filhos marcados com [data-stagger].
 * - Reversível por padrão (toggleActions: play none none reverse).
 * - Respeita prefers-reduced-motion.
 */

import { useRef, useEffect, ReactNode, ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Deslocamento Y inicial em px. Padrão: 42 */
  y?: number;
  /** Deslocamento X inicial em px. Padrão: 0 */
  x?: number;
  /** Duração da animação em segundos. Padrão: 0.7 */
  duration?: number;
  /** Delay antes de iniciar. Padrão: 0 */
  delay?: number;
  /** Stagger entre filhos [data-stagger]. Padrão: 0 */
  stagger?: number;
  /** Início do trigger. Padrão: "top 88%" */
  start?: string;
  /** Easing. Padrão: power3.out */
  ease?: string;
  /** Se true, anima cada filho com [data-stagger] individualmente */
  staggerChildren?: boolean;
  /** Tag HTML do container. Padrão: div */
  as?: ElementType;
}

export function ScrollReveal({
  children,
  className = "",
  y = 42,
  x = 0,
  duration = 0.7,
  delay = 0,
  stagger = 0,
  start = "top 88%",
  ease = "power3.out",
  staggerChildren = false,
  as: Tag = "div",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const targets = staggerChildren
      ? containerRef.current.querySelectorAll<HTMLElement>("[data-stagger]")
      : [containerRef.current];

    if (!targets || targets.length === 0) return;

    gsap.set(targets, { opacity: 0, y, x });

    const anim = gsap.to(targets, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease,
      stagger: staggerChildren ? stagger : 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start,
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [reducedMotion, y, x, duration, delay, stagger, start, ease, staggerChildren]);

  return (
    <Tag
      ref={containerRef}
      className={className}
      suppressHydrationWarning
    >
      {children}
    </Tag>
  );
}
