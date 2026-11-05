export const MOTION_PRESETS = {
  ease: {
    smooth: "power2.out",
    reveal: "power3.out",
  },
  /**
   * Entrada dos cards/blocos das seções atrelada ao scroll, um trigger por elemento
   * (story 4.2): começa com o topo do alvo a 92% da altura da tela e termina a 68%
   * (equivale a `start: "top 92%"`, `end: "clamp(top 68%)"`; o cálculo está no
   * `scrubReveal.ts`, que mede sem o `transform` do próprio alvo).
   */
  scrubReveal: {
    startAt: 0.92,
    endAt: 0.68,
    /** Suavização em segundos; abaixo do 1,2 do ScrollText. */
    scrub: 0.6,
    /** Deslocamento único até 768px; acima, cada seção mantém o seu. */
    yNarrow: 24,
  },
  /** Gaveta do menu mobile (story 7.7): mesma duração do legado (`transition: 0.5s`). */
  menu: {
    duration: 0.5,
    ease: "power3.out",
    stagger: 0.05,
    /** Fechar toca a timeline ao contrário, um pouco mais rápido. */
    closeTimeScale: 1.4,
  },
  /** Troca de filtro dos Projetos (story 7.7): saída, reposicionamento e entrada. */
  filter: {
    leaveDuration: 0.25,
    flipDuration: 0.6,
    enterDuration: 0.45,
    stagger: 0.06,
    ease: "power3.inOut",
    scaleFrom: 0.92,
  },
} as const;

/**
 * Consultas do `gsap.matchMedia()` para os efeitos que mudam por faixa (story 4.1).
 * `desktop` é o mesmo ponto do menu horizontal (`min-[769px]:` no Navbar; legado `width > 768px`).
 */
export const MOTION_MEDIA = {
  /** Parallax só no layout de duas colunas. */
  desktop: "(min-width: 769px)",
  /** Complemento exato de `desktop` (sem buraco em larguras fracionárias, ex.: zoom). */
  narrow: "not all and (min-width: 769px)",
  /** Microinterações de hover só com mouse; em toque o hover emulado briga com o clique. */
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;
