export const SITE_CONFIG = {
  name: "Nexus Agency",
  title: "Nexus | Agency",
  description:
    "Nossa agência de soluções digitais combina expertise em marketing digital e tecnologia para oferecer soluções personalizadas que fortalecem sua marca e geram resultados concretos.",
  url: "https://nexusagency.com.br", // URL base de referência
  whatsapp: {
    number: "556192985392",
    displayNumber: "+55 (61) 9298-5392",
    url: "https://wa.me/556192985392",
    defaultMessage: "Quero saber mais!",
  },
  // E-mail institucional do cliente (PEND-11 RESOLVED em 2026-11-03)
  email: "contato@nexusagencybr.com.br",
  socials: {
    instagram: "https://www.instagram.com/nexusagencybr/",
    linkedin: "https://www.linkedin.com/company/nexus-ag-br/posts/?feedView=all",
    facebook: "https://www.facebook.com/profile.php?id=61561543675556&mibextid=LQQJ4d",
  },
  navLinks: [
    { label: "Inicio", href: "#home" },
    { label: "Sobre nós", href: "#about" },
    { label: "Projetos", href: "#project" },
    { label: "Serviços", href: "#service" },
  ],
} as const;
