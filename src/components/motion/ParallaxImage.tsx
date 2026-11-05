"use client";

/**
 * ParallaxImage – aplica efeito de paralaxe vertical suave.
 * B5: Utiliza next/image com wrapper relativo para evitar warnings e otimizar LCP.
 */
import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";
import { MOTION_MEDIA } from "@/animations/presets";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /** Percentual de deslocamento Y (negativo move up). Padrão: -12 */
  yPercent?: number;
  /** Início do trigger */
  start?: string;
  /** Fim do trigger */
  end?: string;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  width = 500,
  height = 500,
  priority = false,
  yPercent = -12,
  start = "top bottom",
  end = "bottom top",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    
    const container = containerRef.current;
    // Só acima de 768px (story 4.1): no layout de uma coluna o parallax é peso sem ganho.
    // O matchMedia desfaz o transform ao cruzar a faixa num resize.
    const mm = gsap.matchMedia();
    mm.add(MOTION_MEDIA.desktop, () => {
      gsap.to(container, {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, [reduced, yPercent, start, end]);

  return (
    <div ref={containerRef} className="will-change-transform">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
      />
    </div>
  );
}
