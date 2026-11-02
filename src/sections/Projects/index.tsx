"use client";

/**
 * ProjectsSection — Client Component existente, agora com:
 * - ScrollReveal staggered nos cards de projetos
 * - GSAP Flip para transição suave entre filtros
 *
 * PRESERVADO integralmente:
 * - Lógica de filtro React (useState)
 * - Estrutura HTML/visual original
 * - Todos os projetos e categorias
 */

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { PROJECTS_DATA, PROJECT_FILTERS } from "@/data/projects";
import { ProjectCategory } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const hasRevealedRef = useRef(false);

  const filteredProjects =
    activeFilter === "all"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  // ScrollReveal inicial dos cards (apenas uma vez)
  useEffect(() => {
    if (reduced || hasRevealedRef.current) return;
    if (!gridRef.current) return;

    gsap.registerPlugin(ScrollTrigger, Flip);

    const cards = gridRef.current.querySelectorAll("[data-project-card]");
    if (!cards.length) return;

    gsap.from(cards, {
      y: 48,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 88%",
        toggleActions: "play none none none",
        invalidateOnRefresh: true,
        onEnter: () => {
          hasRevealedRef.current = true;
        },
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Flip animation ao trocar filtro
  const handleFilter = useCallback(
    (filter: string) => {
      if (reduced || !gridRef.current) {
        setActiveFilter(filter as ProjectCategory);
        return;
      }

      gsap.registerPlugin(Flip);

      // Captura estado antes da mudança
      const state = Flip.getState("[data-project-card]");

      setActiveFilter(filter as ProjectCategory);

      // Anima a transição após o React re-renderizar
      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: 0.45,
          ease: "power2.inOut",
          absolute: true,
          onEnter: (els) =>
            gsap.from(els, {
              opacity: 0,
              y: 24,
              duration: 0.35,
              ease: "power2.out",
            }),
          onLeave: (els) =>
            gsap.to(els, {
              opacity: 0,
              y: -12,
              duration: 0.2,
            }),
        });
      });
    },
    [reduced]
  );

  return (
    <section id="project" className="py-24 bg-[#04091d]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-white mb-10">
          Criação e Desenvolvimento
        </h2>

        {/* Barra de Filtros */}
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-14">
          {PROJECT_FILTERS.map((f) => {
            const isActive = activeFilter === f.filter;
            return (
              <button
                key={f.filter}
                onClick={() => handleFilter(f.filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#a15cf5] to-white text-[#04091d] shadow-md shadow-[#a15cf5]/20 font-semibold"
                    : "text-white/80 hover:text-white bg-transparent"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Grid de Projetos */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              data-project-card
              data-flip-id={project.id}
              className="group relative rounded-xl overflow-hidden bg-[#0f1221] border border-white/5 hover:border-[#a15cf5]/40 transition-all duration-300 shadow-xl"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}
