"use client";

/**
 * WhatsAppFloat — FR-06 (inviolável)
 *
 * Preserva integralmente:
 * - URL e número do WhatsApp (SITE_CONFIG.whatsapp.url)
 * - Animação CSS WaveWhatsApp (globals.css)
 * - Classe .whatsapp-link e .wpp
 * - Ícone fa-whatsapp
 *
 * ADICIONA (Fase 3 — FR-05 micro-interações):
 * - GSAP scale spring no mouseenter/mouseleave (só com mouse — story 4.1)
 * - GSAP click feedback (scale pulse)
 *
 * Não altera o CSS original. GSAP complementa, não substitui.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";
import { MOTION_MEDIA } from "@/animations/presets";

interface WhatsAppFloatProps {
  className?: string;
}

export function WhatsAppFloat({ className }: WhatsAppFloatProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    const el = linkRef.current;
    if (!el) return;

    // Spring hover — sobrescreve o hover CSS scale(1.2) com GSAP para fluido
    const onEnter = () => {
      gsap.to(el, {
        scale: 1.18,
        duration: 0.35,
        ease: "back.out(2)",
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    };
    // Click feedback
    const onClick = () => {
      gsap.timeline()
        .to(el, { scale: 0.92, duration: 0.1, ease: "power2.in" })
        .to(el, { scale: 1.18, duration: 0.25, ease: "back.out(2)" })
        .to(el, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" });
    };

    // Mola de hover só com mouse (story 4.1, FR-10): em toque o navegador emula
    // mouseenter/mouseleave e a mola brigava com o feedback de clique.
    const mm = gsap.matchMedia();
    mm.add(MOTION_MEDIA.finePointer, () => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    });
    el.addEventListener("click", onClick);

    return () => {
      mm.revert();
      el.removeEventListener("click", onClick);
      gsap.killTweensOf(el);
    };
  }, [reduced]);

  return (
    <a
      ref={linkRef}
      href={SITE_CONFIG.whatsapp.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("whatsapp-link", className)}
      aria-label="Contato direto pelo WhatsApp"
    >
      <i className="fa fa-whatsapp" />
      <span className="wpp">{SITE_CONFIG.whatsapp.defaultMessage}</span>
    </a>
  );
}
