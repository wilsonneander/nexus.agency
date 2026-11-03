import { SocialIcons } from "@/components/ui/SocialIcons";
import { HeroClient } from "./HeroClient";
import { ScrollText } from "@/components/motion/ScrollText";

export function HeroSection() {
  const heroParagraph =
    "Em um mundo cada vez mais conectado, uma presença digital consolidada é essencial para o " +
    "sucesso da sua empresa. Nossa agência de soluções digitais combina expertise em marketing " +
    "digital e tecnologia para oferecer soluções personalizadas que fortalecem sua marca e geram " +
    "resultados concretos. Compreendemos suas necessidades e transformamos sua presença online, " +
    "mantendo você à frente no mercado através de ferramentas modernas e serviços como BI, SEO, " +
    "gestão de tráfego, desenvolvimento de sites e inbound marketing.";

  return (
    <HeroClient>
      {/*
        Sem `isolate`/`transform` na <section>: o bloco social é `fixed` e precisa continuar
        no contexto de empilhamento raiz, acima das seções seguintes (FR-07).
      */}
      <section
        id="home"
        data-hero-section
        className="relative overflow-hidden min-h-[90vh] md:min-h-screen flex flex-col pt-32 md:pt-40 bg-secondary"
      >
        {/* Redes Sociais Verticais — desktop (FR-07 inviolável) */}
        <div
          data-hero-social
          className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40"
        >
          <SocialIcons variant="header" />
        </div>

        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h4
              data-hero-sub
              className="text-white/90 text-lg sm:text-xl font-normal mb-3"
            >
              Nexus Agency
            </h4>
            <h1
              data-hero-title
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-white mb-6"
            >
              Somos Nexus <span className="text-accent-span">Agency.</span>
            </h1>

            {/* ScrollText — Leitura progressiva do parágrafo hero */}
            <ScrollText
              className="max-w-2xl mx-auto text-white/80 text-sm sm:text-base leading-relaxed text-center font-light"
              start="top 78%"
              end="bottom 20%"
              scrub={1.5}
            >
              {heroParagraph}
            </ScrollText>
          </div>
        </div>

        {/*
          Brilho roxo animado (story 7.1). Decorativo: aria-hidden e só CSS, então aparece
          sem JS e fica parado com reduced motion (globals.css). Fica no fluxo, abaixo do
          texto, para o núcleo claro nunca passar atrás do parágrafo.
        */}
        <div
          aria-hidden="true"
          data-hero-glow
          className="hero-glow relative mt-auto w-full shrink-0 pointer-events-none select-none"
        >
          <div className="hero-glow__halo" />
          <div className="hero-glow__bloom" />
          <div className="hero-glow__reflection" />
          <div className="hero-glow__ring" />
          <div className="hero-glow__core" />
          <div className="hero-glow__horizon" />
        </div>

        {/* Funde a base do Hero com o fundo do About, sem emenda. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-secondary pointer-events-none"
        />
      </section>
    </HeroClient>
  );
}
