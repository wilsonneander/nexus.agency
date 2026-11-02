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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              data-banner-card
              className="group p-6 bg-[#0f1221] rounded-lg border-b-2 border-transparent hover:border-[#a15cf5] transition-all duration-300 flex items-start gap-5 shadow-lg"
            >
              <div
                data-banner-icon
                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#03060f] text-white flex items-center justify-center text-xl group-hover:bg-gradient-to-r group-hover:from-[#a15cf5] group-hover:to-white group-hover:text-[#04091d] transition-all duration-300"
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
