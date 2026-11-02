"use client";

import { useState } from "react";
import Image from "next/image";
import { PROJECTS_DATA, PROJECT_FILTERS } from "@/data/projects";
import { ProjectCategory } from "@/types";

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");

  const filteredProjects =
    activeFilter === "all"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  return (
    <section id="project" className="py-24 bg-[#04091d]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-white mb-10">
          Criação e Desenvolvimento
        </h2>

        {/* Barra de Filtros com Estilo Pílula Original */}
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-14">
          {PROJECT_FILTERS.map((f) => {
            const isActive = activeFilter === f.filter;
            return (
              <button
                key={f.filter}
                onClick={() => setActiveFilter(f.filter as ProjectCategory)}
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

        {/* Grid com os 6 Projetos Originais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
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
