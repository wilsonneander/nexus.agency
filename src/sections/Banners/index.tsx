import { BannersClient } from "./BannersClient";

const cards = [
  {
    icon: "ri-pen-nib-line",
    title: "Design",
    description:
      "Nossos designers e criadores de conteúdo estão comprometidos em fornecer conteúdo digital envolvente.",
  },
  {
    icon: "ri-layout-masonry-line",
    title: "Desenvolvimento",
    description:
      "Permanecemos na vanguarda dos avanços tecnológicos, garantindo a sua performer de presença digital.",
  },
  {
    icon: "ri-checkbox-line",
    title: "Teste & QA",
    description:
      "Entendemos que a sua presença digital não deve apenas ter uma boa aparência, deve gerar tráfego e engajamento.",
  },
];

export function BannersSection() {
  return (
    <BannersClient>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-ambient grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              data-banner-card
              className="glass-card group p-6 rounded-2xl flex items-start gap-5"
            >
              <div
                data-banner-icon
                className="glass-icon flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              >
                <i className={card.icon} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{card.title}</h4>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BannersClient>
  );
}
