import { SERVICES_DATA } from "@/data/services";

export function ServicesSection() {
  return (
    <section id="service" className="py-20 bg-secondary">
      <div className="max-w-container mx-auto px-4">
        <p className="text-sm font-medium text-primary-dark text-center mb-2">Nossos Serviços</p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4">O que fazemos?</h2>
        <p className="max-w-2xl mx-auto text-white/80 text-center mb-16 text-sm leading-relaxed">
          Oferecemos uma ampla gama de soluções digitais para ajudar sua empresa a crescer e se destacar no ambiente
          online, desde a criação de estratégias até o desenvolvimento de plataformas, sempre focando em resultados e na
          transformação das suas ideias em projetos de sucesso.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="relative pt-12 pb-8 px-6 bg-secondary-light rounded-md border-b-2 border-transparent hover:border-primary-dark transition-colors text-center"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-secondary-light border border-secondary-dark rounded text-primary-dark text-xl">
                <i className={`fa-solid fa-${service.iconClass}`} />
              </div>
              <h4 className="text-lg font-semibold mb-3">{service.title}</h4>
              <p className="text-white/70 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
