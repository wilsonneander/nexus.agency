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
    <section id="project" className="py-20 bg-secondary">
      <div className="max-w-container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-8">
          Criação e Desenvolvimento
        </h2>

        {/* Botões de Filtro */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {PROJECT_FILTERS.map((f) => (
            <button
              key={f.filter}
              onClick={() => setActiveFilter(f.filter as ProjectCategory)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.filter
                  ? "bg-primary-gradient text-secondary"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-md overflow-hidden bg-secondary-light hover:opacity-90 transition-opacity"
            >
              <Image
                src={project.image}
                alt={project.alt}
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
