import { SocialIcons } from "@/components/ui/SocialIcons";

export function HeroSection() {
  return (
    <section id="home" className="relative pt-32 pb-20 bg-secondary-dark min-h-[70vh] flex items-center">
      {/* Redes sociais laterais (desktop) */}
      <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20">
        <SocialIcons variant="header" />
      </div>

      <div className="max-w-container mx-auto px-4 w-full">
        <div className="max-w-2xl text-left">
          <h4 className="text-lg text-primary-dark font-medium mb-2">Nexus Agency</h4>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Somos Nexus <span className="text-accent-span">Agency.</span>
          </h1>
          <p className="text-white/80 leading-relaxed text-base">
            Em um mundo cada vez mais conectado, uma presença digital consolidada é essencial para o sucesso da sua
            empresa. Nossa agência de soluções digitais combina expertise em marketing digital e tecnologia para oferecer
            soluções personalizadas que fortalecem sua marca e geram resultados concretos. Compreendemos suas necessidades
            e transformamos sua presença online, mantendo você à frente no mercado através de ferramentas modernas e
            serviços como BI, SEO, gestão de tráfego, desenvolvimento de sites e inbound marketing.
          </p>
        </div>
      </div>
    </section>
  );
}
