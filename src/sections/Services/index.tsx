import { SERVICES_DATA, SERVICES_SECTION_HEADER } from "@/data/services";
import { PACKAGES_DATA } from "@/data/packages";
import { ScrollText } from "@/components/motion/ScrollText";
import { FluidLink } from "@/components/ui/FluidButton";
import { cn } from "@/lib/utils";

// Reveal dos cards pelos `data-reveal` (RevealRoot, story 8.5): selo em escala dentro do card.
export function ServicesSection() {
  return (
    <section id="service" className="py-24 bg-secondary">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Cabeçalho ── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark mb-2">
            Nossos Serviços
          </p>

          {/* ScrollText no título principal da seção */}
          <ScrollText
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6"
            start="top 80%"
            end="bottom 35%"
            scrub={1.2}
          >
            {SERVICES_SECTION_HEADER.title}
          </ScrollText>

          {/* ScrollText no subtítulo */}
          <ScrollText
            as="p"
            className="text-white/75 text-sm sm:text-base leading-relaxed"
            start="top 78%"
            end="bottom 30%"
            scrub={1.3}
          >
            {SERVICES_SECTION_HEADER.subtitle}
          </ScrollText>
        </div>

        {/* ── Grid dos 6 Serviços ── */}
        <div data-services-grid className="glass-ambient grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-8 gap-y-14 mb-24">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              id={service.id}
              data-reveal
              data-reveal-y="55"
              data-reveal-pop="[data-service-badge]"
              data-reveal-pop-scale="0"
              className="scroll-mt-32 glass-card group pt-12 pb-8 px-6 sm:px-8 rounded-2xl flex flex-col justify-between"
            >
              {/* Badge flutuante */}
              <div
                data-service-badge
                className="glass-icon absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              >
                <i className={`fa-solid fa-${service.iconClass}`} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white text-center mb-4 mt-2">
                  {service.title}
                </h3>
                <p className="text-white/75 text-xs sm:text-sm leading-relaxed mb-6 text-center">
                  {service.description}
                </p>

                {/* 4 benefícios */}
                {service.benefits && service.benefits.length > 0 && (
                  <ul className="space-y-2 border-t border-white/5 pt-4">
                    {service.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80"
                      >
                        <i className="fa-solid fa-check text-primary-dark text-xs mt-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Pacotes Comerciais ── */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-span mb-2">
              Soluções Sob Medida
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              Pacotes para o seu Momento
            </h3>
            <p className="text-white/70 text-sm">
              Escolha a estrutura ideal para transformar o investimento em resultados reais e mensuráveis.
            </p>
          </div>

          <div data-packages-grid className="glass-ambient grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGES_DATA.map((pkg) => (
              <div
                key={pkg.id}
                data-reveal
                data-reveal-y="48"
                className={cn(
                  "glass-card p-8 rounded-2xl flex flex-col justify-between",
                  pkg.highlight && "glass-card--featured scale-105"
                )}
              >
                <div>
                  {pkg.highlight && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-dark/20 text-accent-span mb-4">
                      Recomendado
                    </span>
                  )}
                  <h4 className="text-2xl font-bold text-white mb-2">{pkg.name}</h4>
                  <p className="text-sm font-medium text-accent-span mb-4">{pkg.includes}</p>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-8">
                    <span className="font-semibold text-white">Para quem é: </span>
                    {pkg.targetAudience}
                  </p>
                </div>

                {/* CTA Padronizado com FluidLink */}
                <FluidLink
                  href="#contact"
                  variant={pkg.highlight ? "primary" : "secondary"}
                  pulse={pkg.highlight}
                  className="w-full text-center py-3.5 text-sm"
                >
                  Diagnóstico Gratuito
                </FluidLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
