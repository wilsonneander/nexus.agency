"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { SITE_CONFIG } from "@/lib/constants";
import { FluidLink } from "@/components/ui/FluidButton";
import { RollingLink, RollingText } from "@/components/ui/RollingText";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";
import { MOTION_PRESETS } from "@/animations/presets";

const MOBILE_MENU_ID = "mobile-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const reduced = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  // Lido pelo efeito da timeline, que é recriada quando a preferência muda.
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const prevIsOpenRef = useRef(isOpen);

  // Gaveta mobile: desce de trás da barra, como no legado (`translateY(-100%)` → `0`,
  // `styles.css:177-197`), e os itens entram em sequência. Fechar toca a mesma
  // timeline ao contrário. Sem JS e antes da hidratação a gaveta fica fechada
  // (`invisible` no servidor), igual ao estado inicial do legado.
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const ctx = gsap.context(() => {
      const panel = drawer.querySelector("[data-nav-panel]");
      const items = drawer.querySelectorAll("[data-nav-item]");
      const tl = gsap
        .timeline({ paused: true })
        .fromTo(
          panel,
          { yPercent: -100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: MOTION_PRESETS.menu.duration, ease: MOTION_PRESETS.menu.ease }
        )
        .fromTo(
          items,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: MOTION_PRESETS.ease.smooth, stagger: MOTION_PRESETS.menu.stagger },
          "-=0.25"
        );
      // Com reduced motion a timeline só é usada para pular direto ao estado final.
      tl.progress(isOpenRef.current ? 1 : 0);
      timelineRef.current = tl;
    }, drawer);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [reduced]);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    if (reduced || prefersReducedMotion()) {
      tl.pause().progress(isOpen ? 1 : 0);
    } else if (isOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(MOTION_PRESETS.menu.closeTimeScale).reverse();
    }

    // O ícone só gira quando o estado muda de fato (não no carregamento).
    const toggled = prevIsOpenRef.current !== isOpen;
    prevIsOpenRef.current = isOpen;
    if (toggled && iconRef.current && !(reduced || prefersReducedMotion())) {
      gsap.fromTo(
        iconRef.current,
        { rotate: isOpen ? -90 : 90, scale: 0.6, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.35, ease: MOTION_PRESETS.ease.smooth }
      );
    }
  }, [isOpen, reduced]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#04091d]/85 backdrop-blur-md border-b border-white/5 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="#home" className="flex items-center">
          <Image
            src={SITE_CONFIG.logo}
            alt="Nexus Performance & Insights"
            width={140}
            height={45}
            priority
            className="h-auto w-32 sm:w-36 object-contain"
          />
        </Link>

        {/* Links Desktop com animação de circulação vertical */}
        {/* Menu horizontal acima de 768px, como o legado (`width > 768px`; story 4.1) */}
        <ul className="hidden min-[769px]:flex items-center gap-8 text-[15px] font-normal text-white">
          {SITE_CONFIG.navLinks.map((item) => (
            <li key={item.href}>
              <RollingLink
                href={item.href}
                className="text-white hover:text-[#ad7dff] transition-colors duration-200"
              >
                {item.label}
              </RollingLink>
            </li>
          ))}
          <li>
            <FluidLink
              href={SITE_CONFIG.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="px-6 py-2 text-sm font-semibold"
            >
              <RollingText className="h-[1.2em]">Contato</RollingText>
            </FluidLink>
          </li>
        </ul>

        {/* Botão Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="min-[769px]:hidden text-white text-2xl p-2 focus:outline-none"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls={MOBILE_MENU_ID}
        >
          <i ref={iconRef} className={isOpen ? "ri-close-line inline-block" : "ri-menu-3-line inline-block"} />
        </button>
      </div>

      {/* Gaveta Mobile — sempre no DOM para poder animar a saída; o recorte faz a
          gaveta nascer da borda da barra. `inert` tira os links do teclado quando fechada. */}
      <div
        ref={drawerRef}
        id={MOBILE_MENU_ID}
        inert={!isOpen}
        className="min-[769px]:hidden absolute top-full left-0 w-full overflow-hidden pointer-events-none"
      >
        <div
          data-nav-panel
          className="invisible pointer-events-auto bg-[#0f1221] px-6 py-6 border-b border-[#a15cf5]/20 flex flex-col gap-4 text-base"
        >
          {SITE_CONFIG.navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-nav-item
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#a15cf5] py-1 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div data-nav-item className="mt-2 flex flex-col">
            <FluidLink
              href={SITE_CONFIG.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              variant="primary"
              className="text-center py-2.5 text-sm font-semibold"
            >
              Contato
            </FluidLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
