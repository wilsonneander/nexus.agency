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
        {/* Colunas nos pontos exatos do legado (`width > 480/768px`; story 4.1, PEND-16) */}
        <div className="glass-ambient grid grid-cols-1 min-[481px]:grid-cols-2 min-[769px]:grid-cols-3 gap-6">
          {cards.map((card) => (
            // 481–768px (2 colunas): ícone acima do texto, senão "Desenvolvimento" não cabe
            // e a página rola para o lado — no legado também.
            <div
              key={card.title}
              data-banner-card
              className="glass-card group p-6 min-[481px]:p-5 min-[769px]:p-6 rounded-2xl flex items-start gap-5 min-[481px]:flex-col min-[769px]:flex-row"
            >
              <div
                data-banner-icon
                className="glass-icon flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              >
                <i className={card.icon} />
              </div>
              <div className="min-w-0">
                <h4 className="text-lg font-semibold text-white mb-2">{card.title}</h4>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
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
