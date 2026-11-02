export function BannersSection() {
  const cards = [
    {
      icon: "ri-pen-nib-line",
      title: "Design",
      description: "Nossos designers e criadores de conteúdo estão comprometidos em fornecer conteúdo digital envolvente.",
    },
    {
      icon: "ri-layout-masonry-line",
      title: "Desenvolvimento",
      description: "Permanecemos na vanguarda dos avanços tecnológicos, garantindo a sua performer de presença digital.",
    },
    {
      icon: "ri-checkbox-line",
      title: "Teste & QA",
      description: "Entendemos que a sua presença digital não deve apenas ter uma boa aparência, deve gerar tráfego e engajamento.",
    },
  ];

  return (
    <section className="py-12 bg-secondary">
      <div className="max-w-container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-6 bg-secondary-light rounded-md border-b-2 border-transparent hover:border-primary-dark transition-colors flex items-start gap-4"
          >
            <span className="p-3 bg-secondary-dark rounded-full text-primary-dark text-xl flex items-center justify-center">
              <i className={card.icon} />
            </span>
            <div>
              <h4 className="text-lg font-semibold mb-2">{card.title}</h4>
              <p className="text-white/70 text-sm leading-relaxed">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
