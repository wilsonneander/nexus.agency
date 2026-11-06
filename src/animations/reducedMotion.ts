import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Leitura síncrona de `prefers-reduced-motion: reduce`, só para handlers de evento fora
 * de efeito (clique do menu da Navbar, troca de filtro dos Projetos), onde não há
 * `gsap.matchMedia()` para reverter (story 8.5). Efeitos GSAP usam a condição
 * `MOTION_MEDIA.motionOk`. Não use no render: o servidor não conhece a preferência.
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Mantém a posição de scroll quando uma condição do `gsap.matchMedia()` muda.
 * Ao desligar reduced motion com a página aberta, os callbacks com `motionOk` recriam
 * os ScrollTriggers; o refresh de um trigger novo zera a memória de scroll do
 * ScrollTrigger e o refresh da troca de condição devolvia a página ao topo (GSAP 3.15,
 * medido na story 8.5). O `revert` sai antes de o scroll mudar e o `matchMedia` depois
 * do refresh: guarda num, restaura no outro. Devolve a limpeza.
 */
export function keepScrollOnMediaChange(): () => void {
  gsap.registerPlugin(ScrollTrigger);
  let y = window.scrollY;
  const save = () => {
    y = window.scrollY;
  };
  const restore = () => {
    if (window.scrollY === y) return;
    window.scrollTo({ top: y, behavior: "instant" });
    ScrollTrigger.update();
  };
  ScrollTrigger.addEventListener("revert", save);
  ScrollTrigger.addEventListener("matchMedia", restore);
  return () => {
    ScrollTrigger.removeEventListener("revert", save);
    ScrollTrigger.removeEventListener("matchMedia", restore);
  };
}
