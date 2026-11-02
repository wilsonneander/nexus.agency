"use client";

import { useState } from "react";
import { ABOUT_DATA } from "@/data/about";
import { cn } from "@/lib/utils";

type AccordionKey = "mission" | "vision" | "values" | null;

interface MissionVisionValuesProps {
  className?: string;
}

export function MissionVisionValues({ className }: MissionVisionValuesProps) {
  // Estado para permitir abrir/fechar os cards com comportamento de accordion (um por vez)
  const [activeCard, setActiveCard] = useState<AccordionKey>(null);

  const toggleCard = (card: "mission" | "vision" | "values") => {
    setActiveCard((prev) => (prev === card ? null : card));
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start mb-16", className)}>
      {/* ── CARD 1: MISSÃO ── */}
      <div
        data-about-mv
        className={cn(
          "mvv-card group relative p-6 sm:p-7 bg-[#0f1221] rounded-2xl border transition-colors duration-300 shadow-xl cursor-pointer select-none",
          activeCard === "mission"
            ? "border-[#a15cf5] shadow-[#a15cf5]/15"
            : "border-white/5 hover:border-[#a15cf5]/40"
        )}
        onClick={() => toggleCard("mission")}
        role="button"
        tabIndex={0}
        aria-expanded={activeCard === "mission"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleCard("mission");
          }
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#a15cf5]/10 flex items-center justify-center text-[#a15cf5] text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-bullseye" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
              Nossa Missão
            </h3>
          </div>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white/60 bg-white/5 group-hover:text-white group-hover:bg-[#a15cf5]/20 transition-all duration-300 flex-shrink-0",
              activeCard === "mission" && "rotate-180 text-[#ad7dff] bg-[#a15cf5]/20"
            )}
          >
            <i className="fa-solid fa-chevron-down text-xs transition-transform duration-300" />
          </div>
        </div>

        {/* Dropdown com grid animado */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
            activeCard === "mission"
              ? "grid-rows-[1fr] opacity-100 pt-5 mt-4 border-t border-white/5"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <p className="text-white/80 text-sm leading-relaxed font-light">
              {ABOUT_DATA.mission}
            </p>
          </div>
        </div>
      </div>

      {/* ── CARD 2: VISÃO ── */}
      <div
        data-about-mv
        className={cn(
          "mvv-card group relative p-6 sm:p-7 bg-[#0f1221] rounded-2xl border transition-colors duration-300 shadow-xl cursor-pointer select-none",
          activeCard === "vision"
            ? "border-[#a15cf5] shadow-[#a15cf5]/15"
            : "border-white/5 hover:border-[#a15cf5]/40"
        )}
        onClick={() => toggleCard("vision")}
        role="button"
        tabIndex={0}
        aria-expanded={activeCard === "vision"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleCard("vision");
          }
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#a15cf5]/10 flex items-center justify-center text-[#a15cf5] text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-eye" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
              Nossa Visão
            </h3>
          </div>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white/60 bg-white/5 group-hover:text-white group-hover:bg-[#a15cf5]/20 transition-all duration-300 flex-shrink-0",
              activeCard === "vision" && "rotate-180 text-[#ad7dff] bg-[#a15cf5]/20"
            )}
          >
            <i className="fa-solid fa-chevron-down text-xs transition-transform duration-300" />
          </div>
        </div>

        {/* Dropdown com grid animado */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
            activeCard === "vision"
              ? "grid-rows-[1fr] opacity-100 pt-5 mt-4 border-t border-white/5"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <p className="text-white/80 text-sm leading-relaxed font-light">
              {ABOUT_DATA.vision}
            </p>
          </div>
        </div>
      </div>

      {/* ── CARD 3: VALORES ── */}
      <div
        data-about-mv
        className={cn(
          "mvv-card group relative p-6 sm:p-7 bg-[#0f1221] rounded-2xl border transition-colors duration-300 shadow-xl cursor-pointer select-none",
          activeCard === "values"
            ? "border-[#a15cf5] shadow-[#a15cf5]/15"
            : "border-white/5 hover:border-[#a15cf5]/40"
        )}
        onClick={() => toggleCard("values")}
        role="button"
        tabIndex={0}
        aria-expanded={activeCard === "values"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleCard("values");
          }
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#a15cf5]/10 flex items-center justify-center text-[#a15cf5] text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-gem" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
              Nossos Valores
            </h3>
          </div>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white/60 bg-white/5 group-hover:text-white group-hover:bg-[#a15cf5]/20 transition-all duration-300 flex-shrink-0",
              activeCard === "values" && "rotate-180 text-[#ad7dff] bg-[#a15cf5]/20"
            )}
          >
            <i className="fa-solid fa-chevron-down text-xs transition-transform duration-300" />
          </div>
        </div>

        {/* Dropdown com grid animado revelando os 6 valores originais */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
            activeCard === "values"
              ? "grid-rows-[1fr] opacity-100 pt-5 mt-4 border-t border-white/5"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-3.5">
              {ABOUT_DATA.values.map((val, index) => (
                <div key={val.title} className="pb-2.5 last:pb-0 border-b border-white/5 last:border-b-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-[#ad7dff]">0{index + 1}.</span>
                    <h4 className="text-sm font-semibold text-white">{val.title}</h4>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-light pl-4">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
