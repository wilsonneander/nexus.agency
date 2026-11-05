export interface ValueItem {
  title: string;
  description: string;
}

export const ABOUT_DATA = {
  sectionTitle: "Dados que viram decisões. Decisões que viram resultado.",
  paragraphs: [
    "Ao longo da nossa trajetória, a Nexus Ag. já acompanhou mais de 50 empresas e organizações na construção de uma presença digital mais organizada, consistente e com resultados.",
    "Nascemos para resolver um problema comum. Muitos negócios sabem que precisam estar no digital, mas não sabem por onde começar, o que precisam ter nem onde investir. Nós entregamos esse caminho, com decisões baseadas em dados e cada resultado medido.",
    "Atuamos de ponta a ponta: estruturamos perfis nas redes sociais, criamos sites e landing pages, gerimos campanhas de anúncios e desenvolvemos chatbots que atendem e qualificam contatos 24 horas por dia. Como tudo fica com a mesma equipe, anúncio, site e atendimento trabalham juntos e nenhuma oportunidade se perde no caminho. Todo mês, cada cliente recebe um relatório claro, com números reais e os próximos passos.",
    "Nosso time vem de grandes agências de marketing e publicidade e de empresas de referência no mercado digital. Estrategistas, analistas de dados, designers e desenvolvedores trabalham lado a lado com cada cliente, com atendimento direto e sem intermediários.",
    "Se o seu negócio precisa de direção no digital, é por aí que a gente começa.",
  ],
  metric: {
    /** O contador do AboutClient anima de 0 até `value`, lido do HTML do servidor. */
    prefix: "+",
    value: 50,
    label: "clientes atendidos",
    description: "Empresas e organizações impulsionadas no digital com estratégias mensuráveis.",
  },
  mission:
    "Transformar investimento em comunicação digital em resultados reais, integrando análise de dados, anúncios, sites e automação em um só sistema, com transparência em cada número.",
  vision:
    "Ser reconhecida como a agência que une estratégia, tecnologia e dados para fazer nossos clientes crescerem de forma consistente e mensurável.",
  values: [
    {
      title: "Resultado acima de aparência",
      description: "Medimos sucesso pelo que muda no negócio do cliente, não por métricas de vaidade.",
    },
    {
      title: "Transparência",
      description: "Mostramos todos os números, inclusive os que precisam melhorar.",
    },
    {
      title: "Parceria",
      description: "Tratamos os objetivos do cliente como nossos e mantemos comunicação direta e próxima.",
    },
    {
      title: "Inovação com propósito",
      description: "Usamos automação e tecnologia quando elas economizam tempo e geram resultado.",
    },
    {
      title: "Melhoria contínua",
      description: "Todo mês testamos, aprendemos e ajustamos.",
    },
    {
      title: "Compromisso",
      description: "Cumprimos prazos e entregamos o que prometemos.",
    },
  ] as ValueItem[],
};
