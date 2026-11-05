export const MOTION_PRESETS = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
  },
  ease: {
    smooth: "power2.out",
    reveal: "power3.out",
    elastic: "back.out(1.7)",
  },
  stagger: {
    cards: 0.15,
    list: 0.1,
  },
  scrollTriggerDefaults: {
    scrub: true,
    invalidateOnRefresh: true,
  },
} as const;

/**
 * Consultas do `gsap.matchMedia()` para os efeitos que mudam por faixa (story 4.1).
 * `desktop` é o mesmo ponto do menu horizontal (`min-[769px]:` no Navbar; legado `width > 768px`).
 */
export const MOTION_MEDIA = {
  /** Parallax só no layout de duas colunas. */
  desktop: "(min-width: 769px)",
  /** Microinterações de hover só com mouse; em toque o hover emulado briga com o clique. */
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;
