export const SITE_CONFIG = {
  name: "Nexus Agency",
  title: "Nexus | Agency",
  description:
    "Nossa agência de soluções digitais combina expertise em marketing digital e tecnologia para oferecer soluções personalizadas que fortalecem sua marca e geram resultados concretos.",
  url: "https://nexusagency.com.br", // URL base de referência
  whatsapp: {
    number: "5561995395969",
    displayNumber: "+55 (61) 99539-5969",
    url: "https://wa.me/5561995395969",
    defaultMessage: "Quero saber mais!",
  },
  socials: {
    instagram: "https://www.instagram.com/nexus.ag.contato?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    linkedin: "https://www.linkedin.com/in/nexusagency/",
    facebook: "https://www.facebook.com/profile.php?id=61561543675556&mibextid=LQQJ4d",
  },
  navLinks: [
    { label: "Inicio", href: "#home" },
    { label: "Sobre nós", href: "#about" },
    { label: "Projetos", href: "#project" },
    { label: "Serviços", href: "#service" },
    { label: "Blog", href: "#blog" },
  ],
} as const;
