import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_MEDIA, MOTION_PRESETS } from "./presets";

/**
 * Condições do `gsap.matchMedia()` dos reveals: a função roda em qualquer faixa, e
 * `motionOk` é a guarda de reduced motion (story 8.5). Use por `matchReveal`, que só
 * chama o setup com `motionOk` verdadeiro.
 */
export const REVEAL_MEDIA = {
  narrow: MOTION_MEDIA.narrow,
  desktop: MOTION_MEDIA.desktop,
  motionOk: MOTION_MEDIA.motionOk,
};

/** Deslocamento da faixa: único até 768px, o da seção acima. */
export function revealY(conditions: gsap.Conditions | undefined, desktopY: number): number {
  return conditions?.narrow ? MOTION_PRESETS.scrubReveal.yNarrow : desktopY;
}

interface ScrubRevealOptions {
  /** Deslocamento vertical inicial em px. */
  y?: number;
  /** Escala inicial (ex.: botão do Contato). */
  scale?: number;
  /** Acrescenta à timeline do alvo (ícone/selo dentro do card), na escala 0–1. */
  extra?: (tl: gsap.core.Timeline, target: Element) => void;
}

/**
 * Topo do elemento no documento pelo layout (`offsetTop`), sem `transform`. O alvo é o
 * próprio elemento animado: pelo `getBoundingClientRect` (o que o ScrollTrigger usa
 * com `trigger`), a medida inclui o `y` inicial, e depois de um resize que recria os
 * triggers a entrada atrasava exatamente esse valor (medido na story 4.2).
 */
function layoutTop(el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/**
 * Entrada atrelada ao scroll, um ScrollTrigger por alvo (story 4.2): o estado de cada
 * elemento depende só da posição dele na tela — descendo entra, subindo desfaz,
 * parado fica parado. `fromTo` com destino explícito (nunca `from` — story 4.7);
 * o `immediateRender` do `fromTo` aplica o estado da posição no 1º quadro.
 * Chamar dentro de `gsap.context()`/`matchMedia().add()`, que desfazem tudo no revert.
 */
export function scrubReveal(
  targets: ArrayLike<Element> | Element | null | undefined,
  { y = 0, scale, extra }: ScrubRevealOptions
): void {
  if (!targets) return;
  const list = (targets instanceof Element ? [targets] : Array.from(targets)).filter(
    (el): el is HTMLElement => el instanceof HTMLElement
  );
  if (!list.length) return;

  gsap.registerPlugin(ScrollTrigger);
  const { startAt, endAt, scrub } = MOTION_PRESETS.scrubReveal;

  const from: gsap.TweenVars = { opacity: 0, y };
  const to: gsap.TweenVars = { opacity: 1, y: 0, duration: 1, ease: "none" };
  if (scale !== undefined) {
    from.scale = scale;
    to.scale = 1;
  }

  list.forEach((target) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        // Posições em px de scroll, recalculadas a cada refresh.
        start: () => layoutTop(target) - window.innerHeight * startAt,
        // `clamp` só no fim: no fim da página o alvo termina inteiro mesmo sem espaço
        // para rolar; no início, zeraria o que já está na tela no carregamento.
        end: () =>
          Math.min(
            layoutTop(target) - window.innerHeight * endAt,
            ScrollTrigger.maxScroll(window)
          ),
        scrub,
        invalidateOnRefresh: true,
      },
    });
    tl.fromTo(target, from, to, 0);
    extra?.(tl, target);
  });
}

/** Ícone/selo dentro do card: entra em escala na 2ª metade do trecho do card. */
export function popInside(selector: string, fromScale: number) {
  return (tl: gsap.core.Timeline, target: Element) => {
    const el = target.querySelector(selector);
    if (!el) return;
    tl.fromTo(
      el,
      { scale: fromScale, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "none" },
      0.4
    );
  };
}

/**
 * Lê as opções de um alvo `[data-reveal]` (story 8.5):
 * - `data-reveal-y="<px>"` — `y` inicial acima de 768px (até 768px vale `revealY`);
 *   sem ele, `y: 0` em qualquer faixa;
 * - `data-reveal-scale="<escala>"` — escala inicial;
 * - `data-reveal-pop="<seletor>"` + `data-reveal-pop-scale="<escala>"` — ícone/selo
 *   dentro do alvo que entra em escala (`popInside`).
 */
export function revealOptions(el: HTMLElement, conditions?: gsap.Conditions): ScrubRevealOptions {
  const { revealY: y, revealScale: scale, revealPop: pop, revealPopScale: popScale } = el.dataset;
  return {
    y: y === undefined ? 0 : revealY(conditions, Number(y)),
    scale: scale === undefined ? undefined : Number(scale),
    extra: pop ? popInside(pop, Number(popScale ?? 0)) : undefined,
  };
}

/**
 * Alvos `[data-reveal]` de `root`. Um efeito próprio marca o seu contêiner com
 * `data-reveal-scope` (Projetos, Contato): o `RevealRoot` (root = document) pula o que
 * está dentro dele, e o efeito da seção pega só o seu.
 */
function revealTargets(root: Element | Document): HTMLElement[] {
  const scope = root instanceof Element ? root.closest("[data-reveal-scope]") : null;
  return Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
    (el) => el.closest("[data-reveal-scope]") === scope
  );
}

/** Um `scrubReveal` por alvo `[data-reveal]` de `root`, com as opções dos `data-reveal-*`. */
export function revealAll(root: Element | Document, conditions?: gsap.Conditions): void {
  revealTargets(root).forEach((el) => scrubReveal(el, revealOptions(el, conditions)));
}

/**
 * `gsap.matchMedia()` dos reveals: o setup roda em qualquer faixa, só sem reduced motion,
 * e é desfeito/refeito ao cruzar 768px ou ao mudar a preferência. Devolve o `MatchMedia`
 * para o cleanup (`mm.revert()`).
 */
export function matchReveal(setup: (conditions: gsap.Conditions) => void): gsap.MatchMedia {
  const mm = gsap.matchMedia();
  mm.add(REVEAL_MEDIA, ({ conditions }) => {
    if (conditions?.motionOk) setup(conditions);
  });
  return mm;
}
