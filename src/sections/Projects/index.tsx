"use client";

/**
 * ProjectsSection — Client Component com:
 * - Filtros padronizados com FluidButton (variant="filter") e microinteração do botão Contato
 * - Entrada de cada card atrelada ao scroll (story 4.2), no filho [data-project-reveal]:
 *   o Flip anima o transform do [data-project-card] e os dois não podem dividir o mesmo nó
 * - Troca de categoria em três tempos: saída dos cards, Flip dos que ficam e entrada em sequência (story 7.7)
 *
 * PRESERVADO integralmente:
 * - Lógica de filtro React (useState)
 * - Seleção e renderização dos 6 cases
 */

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { flushSync } from "react-dom";
import { PROJECTS_DATA, PROJECT_FILTERS } from "@/data/projects";
import { ProjectCategory } from "@/types";
import { prefersReducedMotion, useReducedMotion } from "@/hooks/useReducedMotion";
import { FluidButton } from "@/components/ui/FluidButton";
import { REVEAL_MEDIA, revealY, scrubReveal } from "@/animations/scrubReveal";
import { MOTION_PRESETS } from "@/animations/presets";

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const revealRef = useRef<gsap.MatchMedia | null>(null);

  const filteredProjects =
    activeFilter === "all"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  // Entrada atrelada ao scroll, um trigger por card. Refeita depois de cada filtro
  // (cards novos e posições novas), por isso fica numa função guardada no ref.
  const setupReveal = useCallback(() => {
    revealRef.current?.revert();
    revealRef.current = null;
    if (reduced || prefersReducedMotion() || !gridRef.current) return;

    const mm = gsap.matchMedia();
    mm.add(
      REVEAL_MEDIA,
      ({ conditions }) => {
        scrubReveal(gridRef.current!.querySelectorAll("[data-project-reveal]"), {
          y: revealY(conditions, 48),
        });
      },
      gridRef
    );
    revealRef.current = mm;
  }, [reduced]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip);
    setupReveal();
    return () => {
      revealRef.current?.revert();
      revealRef.current = null;
    };
  }, [setupReveal]);

  // Troca de filtro em três tempos (story 7.7): os cards que saem desbotam e encolhem
  // ainda no DOM (o React os remove no setState, então o onLeave do Flip não teria o
  // que animar), os que ficam deslizam para a nova posição com Flip e os novos entram
  // em sequência. Um clique no meio da troca termina a anterior na hora e começa a nova.
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const flipRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(
    () => () => {
      transitionRef.current?.kill();
      flipRef.current?.kill();
    },
    []
  );

  const handleFilter = useCallback(
    (filter: string) => {
      const nextFilter = filter as ProjectCategory;
      if (reduced || prefersReducedMotion() || !gridRef.current) {
        setActiveFilter(nextFilter);
        return;
      }

      gsap.registerPlugin(Flip);
      transitionRef.current?.progress(1);
      flipRef.current?.progress(1);

      const grid = gridRef.current;
      const leaving = Array.from(grid.querySelectorAll<HTMLElement>("[data-project-card]")).filter(
        (card) => nextFilter !== "all" && card.dataset.category !== nextFilter
      );
      const preset = MOTION_PRESETS.filter;

      const tl = gsap.timeline();
      if (leaving.length) {
        tl.to(leaving, {
          opacity: 0,
          scale: preset.scaleFrom,
          duration: preset.leaveDuration,
          ease: "power2.in",
          overwrite: "auto",
        });
      }
      tl.add(() => {
        // Captura as posições ANTES da mudança de DOM; flushSync garante o DOM novo antes do Flip.from.
        const state = Flip.getState(grid.querySelectorAll("[data-project-card]"));
        flushSync(() => setActiveFilter(nextFilter));

        flipRef.current = Flip.from(state, {
          duration: preset.flipDuration,
          ease: preset.ease,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { opacity: 0, scale: preset.scaleFrom, y: 24 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: preset.enterDuration,
                ease: MOTION_PRESETS.ease.reveal,
                stagger: preset.stagger,
                delay: preset.flipDuration * 0.35,
                clearProps: "opacity,transform",
              }
            ),
          // A altura da grade mudou: refaz os triggers dos cards e recalcula os das
          // seções abaixo, senão a entrada delas fica fora da posição.
          onComplete: () => {
            setupReveal();
            ScrollTrigger.refresh();
          },
        });
      });
      transitionRef.current = tl;
    },
    [reduced, setupReveal]
  );

  return (
    <section ref={sectionRef} id="project" className="py-24 bg-[#04091d]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-white mb-10">
          Criação e Desenvolvimento
        </h2>

        {/* Barra de Filtros com FluidButton padronizado */}
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-14" role="tablist" aria-label="Filtro de projetos">
          {PROJECT_FILTERS.map((f) => {
            const isActive = activeFilter === f.filter;
            return (
              <FluidButton
                key={f.filter}
                onClick={() => handleFilter(f.filter)}
                variant="filter"
                isActive={isActive}
                role="tab"
                aria-selected={isActive}
                className="px-6 py-2.5"
              >
                {f.label}
              </FluidButton>
            );
          })}
        </div>

        {/* Grid de Projetos */}
        <div
          ref={gridRef}
          className="glass-ambient grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              data-project-card
              data-category={project.category}
              data-flip-id={project.id}
            >
              <div data-project-reveal className="glass-card group rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    width={500}
                    height={380}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
