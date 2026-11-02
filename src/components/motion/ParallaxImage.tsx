"use client";

/**
 * ParallaxImage – aplica efeito de paralaxe vertical simples ao elemento <img>.
 * Ideal para imagens de fundo ou ilustrações estáticas (ex.: grafic.png).
 *
 * Uso: <ParallaxImage src="/assets/grafic.png" alt="..." className="..." />
 */
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Percentual de deslocamento Y (negativo move up). Padrão: -15 */
  yPercent?: number;
  /** Início do trigger (padrão: "top bottom" -> quando começa a entrar) */
  start?: string;
  /** Fim do trigger (padrão: "bottom top") */
  end?: string;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  yPercent = -15,
  start = "top bottom",
  end = "bottom top",
}: ParallaxImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!imgRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: imgRef.current,
          start,
          end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, imgRef);
    return () => ctx.revert();
  }, [reduced, yPercent, start, end]);

  return <img src={src} alt={alt} className={className} ref={imgRef} />;
}
