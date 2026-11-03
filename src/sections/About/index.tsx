import { ABOUT_DATA } from "@/data/about";
import { SocialIcons, SocialAboutIcons } from "@/components/ui/SocialIcons";
import { AboutClient } from "./AboutClient";
import { ScrollText } from "@/components/motion/ScrollText";
import { ParallaxImage } from "@/components/motion/ParallaxImage";


export function AboutSection() {
  return (
    <AboutClient>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Bloco Principal: Imagem + Narrativa ── */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 lg:gap-16 items-center mb-20">

         
          {/* Conteúdo institucional */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#a15cf5] mb-2">
                Sobre nós
              </p>

              {/* ScrollText — Leitura progressiva no título da seção */}
              <ScrollText
                as="h2"
                className="text-3xl sm:text-4xl font-semibold text-white leading-tight"
                start="top 80%"
                end="bottom 35%"
                scrub={1.2}
              >
                {ABOUT_DATA.sectionTitle}
              </ScrollText>
            </div>

            <div className="space-y-4 text-white/80 text-sm sm:text-base leading-relaxed font-light">
              {/* Primeiro parágrafo com ScrollText */}
              <ScrollText
                as="p"
                start="top 82%"
                end="bottom 30%"
                scrub={1.3}
              >
                {ABOUT_DATA.paragraphs[0]}
              </ScrollText>
              <p data-about-para>{ABOUT_DATA.paragraphs[1]}</p>
              <p data-about-para>{ABOUT_DATA.paragraphs[2]}</p>
            </div>

            {/* Destaque institucional */}
            <div
              data-about-highlight
              className="glass-card p-6 rounded-2xl border-l-2 border-primary-dark text-white/90 text-sm sm:text-base leading-relaxed"
            >
              <p className="mb-2 font-medium">{ABOUT_DATA.paragraphs[3]}</p>
              <p className="text-white/70 text-sm">{ABOUT_DATA.paragraphs[4]}</p>
            </div>

            {/* Métrica +50 — B3: número em span separado para não quebrar bg-clip-text */}
            <div className="glass-card flex items-center gap-6 p-4 rounded-2xl">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a15cf5] to-white">
                <span data-about-metric-value>+</span>
                <span data-about-metric-number>50</span>
              </div>
              <div>
                <p className="text-base font-semibold text-white uppercase tracking-wide">
                  {ABOUT_DATA.metric.label}
                </p>
                <p className="text-xs text-white/60">
                  {ABOUT_DATA.metric.description}
                </p>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="flex items-center gap-4 pt-2">
              <SocialAboutIcons variant="about" className="flex-row" />
            </div>
          </div>
        </div>

        {/* ── Missão e Visão ── */}
        <div className="glass-ambient grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div
            data-about-mv
            className="glass-card group p-8 rounded-2xl"
          >
            <div className="glass-icon w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4">
              <i className="fa-solid fa-bullseye" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Nossa Missão</h3>
            <p className="text-white/75 text-sm leading-relaxed font-light">
              {ABOUT_DATA.mission}
            </p>
          </div>

          <div
            data-about-mv
            className="glass-card group p-8 rounded-2xl"
          >
            <div className="glass-icon w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4">
              <i className="fa-solid fa-eye" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Nossa Visão</h3>
            <p className="text-white/75 text-sm leading-relaxed font-light">
              {ABOUT_DATA.vision}
            </p>
          </div>
        </div>

        {/* ── 6 Valores Institucionais ── */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold text-center text-white mb-10">
            Nossos Valores
          </h3>
          <div data-about-values-grid className="glass-ambient grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ABOUT_DATA.values.map((val, index) => (
              <div
                key={val.title}
                data-about-value
                className="glass-card p-6 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-[#ad7dff] mb-2">
                    0{index + 1}
                  </div>
                  <h4 className="text-base font-semibold text-white mb-2">
                    {val.title}
                  </h4>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AboutClient>
  );
}
