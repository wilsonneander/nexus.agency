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
