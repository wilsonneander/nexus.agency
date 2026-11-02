import { SocialIcons } from "@/components/ui/SocialIcons";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-screen flex items-center pt-28 pb-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(4, 9, 29, 0.7), rgba(4, 9, 29, 0.75)), url(/assets/header.webp)",
      }}
    >
      {/* Redes Sociais Verticais Flutuantes à Direita (Desktop) - Idêntico ao Legado */}
      <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <SocialIcons variant="header" />
      </div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left">
          <h4 className="text-white/90 text-lg sm:text-xl font-normal mb-3">
            Nexus Agency
          </h4>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-white mb-6">
            Somos Nexus <span className="text-[#ad7dff]">Agency.</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed text-justify sm:text-left font-light">
            Em um mundo cada vez mais conectado, uma presença digital consolidada é essencial para o
            sucesso da sua empresa. Nossa agência de soluções digitais combina expertise em marketing
            digital e tecnologia para oferecer soluções personalizadas que fortalecem sua marca e geram
            resultados concretos. Compreendemos suas necessidades e transformamos sua presença online,
            mantendo você à frente no mercado através de ferramentas modernas e serviços como BI, SEO,
            gestão de tráfego, desenvolvimento de sites e inbound marketing.
          </p>
        </div>
      </div>
    </section>
  );
}
