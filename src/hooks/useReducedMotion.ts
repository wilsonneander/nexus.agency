"use client";

import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Leitura síncrona da preferência, para usar DENTRO de efeitos (story 4.3).
 * O hook abaixo começa em `false` (o servidor não conhece a preferência), então a
 * primeira passada de efeitos sempre o vê como `false`. Todo efeito de animação
 * deve retornar cedo com `if (reduced || prefersReducedMotion()) return;`.
 * Não use no render: o resultado difere do servidor e quebra a hidratação.
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.(REDUCED_MOTION_QUERY).matches;
}

/** Estado reativo da preferência; re-renderiza quando ela muda com a página aberta. */
export function useReducedMotion(): boolean {
  const [prefersReducedMotionState, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotionState;
}
