import Image from "next/image";
import { ABOUT_DATA } from "@/data/about";
import { SocialIcons } from "@/components/ui/SocialIcons";

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#04091d]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bloco Principal: Imagem + Narrativa Institucional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Ilustração Original Preservada */}
          <div className="flex justify-center">
            <Image
              src="/assets/grafic.png"
              alt="Estratégia e Dados da Nexus Agency"
              width={500}
              height={500}
              priority
              className="w-full max-w-[480px] h-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Conteúdo Institucional Oficial do Cliente */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#a15cf5] mb-2">
                Sobre nós
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
                {ABOUT_DATA.sectionTitle}
              </h2>
            </div>

            <div className="space-y-4 text-white/80 text-sm sm:text-base leading-relaxed font-light">
              <p>{ABOUT_DATA.paragraphs[0]}</p>
              <p>{ABOUT_DATA.paragraphs[1]}</p>
              <p>{ABOUT_DATA.paragraphs[2]}</p>
            </div>

            {/* Destaque Institucional com Borda Roxa (Estilo Original Preservado) */}
            <div className="p-6 bg-[#0f1221] border-l-2 border-[#a15cf5] rounded-md text-white/90 text-sm sm:text-base leading-relaxed">
              <p className="mb-2 font-medium">{ABOUT_DATA.paragraphs[3]}</p>
              <p className="text-white/70 text-sm">{ABOUT_DATA.paragraphs[4]}</p>
            </div>

            {/* Métrica Confirmada do Cliente (+50 clientes atendidos) */}
            <div className="flex items-center gap-6 p-4 bg-[#0f1221] rounded-lg border border-white/5">
              <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a15cf5] to-white">
                {ABOUT_DATA.metric.value}
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
              <SocialIcons variant="about" className="flex-row" />
            </div>
          </div>
        </div>

        {/* Missão e Visão (Novo Bloco Oficial do Cliente) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-[#0f1221] rounded-xl border border-white/5 hover:border-[#a15cf5]/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#a15cf5]/10 flex items-center justify-center text-[#a15cf5] text-2xl mb-4">
              <i className="fa-solid fa-bullseye" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Nossa Missão</h3>
            <p className="text-white/75 text-sm leading-relaxed font-light">
              {ABOUT_DATA.mission}
            </p>
          </div>

          <div className="p-8 bg-[#0f1221] rounded-xl border border-white/5 hover:border-[#a15cf5]/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#a15cf5]/10 flex items-center justify-center text-[#a15cf5] text-2xl mb-4">
              <i className="fa-solid fa-eye" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Nossa Visão</h3>
            <p className="text-white/75 text-sm leading-relaxed font-light">
              {ABOUT_DATA.vision}
            </p>
          </div>
        </div>

        {/* 6 Valores Institucionais (Novo Bloco Oficial do Cliente) */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold text-center text-white mb-10">
            Nossos Valores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ABOUT_DATA.values.map((val, index) => (
              <div
                key={val.title}
                className="p-6 bg-[#0f1221] rounded-lg border border-white/5 hover:border-[#a15cf5]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-[#ad7dff] mb-2">0{index + 1}</div>
                  <h4 className="text-base font-semibold text-white mb-2">{val.title}</h4>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
