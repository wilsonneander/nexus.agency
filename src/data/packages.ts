import { CommercialPackage } from "@/types";

export const PACKAGES_DATA: CommercialPackage[] = [
  {
    id: "essencial",
    name: "Essencial",
    includes: "Tráfego pago + relatório mensal",
    targetAudience: "Quem já tem site e atendimento estruturados",
    highlight: false,
  },
  {
    id: "crescimento",
    name: "Crescimento",
    includes: "Essencial + landing page",
    targetAudience: "Quem precisa de uma página que converta",
    highlight: true,
  },
  {
    id: "completo",
    name: "Completo",
    includes: "Crescimento + chatbot e automações",
    targetAudience: "Quem quer o funil inteiro funcionando",
    highlight: false,
  },
];
