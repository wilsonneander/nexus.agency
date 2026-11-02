import { ServiceItem } from "@/types";

export const SERVICES_SECTION_HEADER = {
  title: "Do anúncio ao atendimento, cuidamos de toda a jornada do seu cliente.",
  subtitle:
    "Não entregamos peças soltas. Montamos um sistema em que cada etapa alimenta a próxima: atrair, converter, atender e medir.",
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "planejamento-estrategico",
    title: "Planejamento estratégico",
    description:
      "Todo resultado começa com um bom plano. Antes de investir, entendemos o seu negócio, o seu público e a sua concorrência. Com base nesses dados, desenhamos uma estratégia sob medida, com metas claras para redes sociais, tráfego e conversão.",
    iconClass: "compass",
    benefits: [
      "Diagnóstico da presença digital atual",
      "Definição de público, metas e indicadores",
      "Plano de ação por canal",
      "Cronograma e orçamento recomendado",
    ],
  },
  {
    id: "gestao-trafego-pago",
    title: "Gestão de tráfego pago",
    description:
      "Campanhas no Instagram, Facebook e Google planejadas para gerar resultado, não só curtidas. Definimos público, criativos e orçamento, acompanhamos diariamente e ajustamos o que não performa.",
    iconClass: "rectangle-ad",
    benefits: [
      "Planejamento e estrutura de campanhas",
      "Segmentação de público e testes de criativos",
      "Otimização contínua de custo por resultado",
      "Configuração de pixel e eventos de conversão",
    ],
  },
  {
    id: "analise-posicionamento",
    title: "Análise e posicionamento nas redes sociais",
    description:
      "Monitoramos a presença da sua marca nas redes e transformamos dados em decisões. Analisamos tendências, comparamos com a concorrência e identificamos oportunidades de engajamento, para que cada publicação tenha um motivo.",
    iconClass: "chart-line",
    benefits: [
      "Monitoramento de redes sociais e site",
      "Análise de concorrência e tendências",
      "Identificação de oportunidades de conteúdo e engajamento",
      "Recomendações de posicionamento da marca",
    ],
  },
  {
    id: "criacao-sites-landing-pages",
    title: "Criação de sites e landing pages",
    description:
      "Sites rápidos, bonitos e pensados para converter visitantes em contatos. Cada página tem um objetivo claro e funciona bem no celular.",
    iconClass: "globe",
    benefits: [
      "Sites institucionais e landing pages de campanha",
      "Textos orientados à conversão",
      "Integração com WhatsApp, formulários e ferramentas de análise",
      "Otimização para Google (SEO básico) e velocidade",
    ],
  },
  {
    id: "chatbots-automacao",
    title: "Chatbots e automação de atendimento",
    description:
      "Seu cliente é atendido na hora, 24 horas por dia. Criamos chatbots para WhatsApp, Instagram e site que respondem dúvidas, qualificam contatos e agendam conversas com a sua equipe.",
    iconClass: "robot",
    benefits: [
      "Fluxos de atendimento personalizados",
      "Qualificação automática de leads",
      "Integração com CRM, planilhas e e-mail",
      "Follow-up automático para não perder oportunidades",
    ],
  },
  {
    id: "relatorios-analise",
    title: "Relatórios e análise de resultados",
    description:
      "Todo mês você recebe um relatório claro: quanto investiu, quantas pessoas alcançou, quanto custou cada resultado e o que vamos melhorar no próximo ciclo.",
    iconClass: "file-lines",
    benefits: [
      "Relatório mensal de performance",
      "Comparativo com meses anteriores",
      "Recomendações práticas para o próximo mês",
      "Reunião de alinhamento",
    ],
  },
];
