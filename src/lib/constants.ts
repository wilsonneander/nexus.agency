export const SITE_CONFIG = {
  name: "Nexus Agency",
  title: "Nexus | Agency",
  description:
    "Nossa agência de soluções digitais combina expertise em marketing digital e tecnologia para oferecer soluções personalizadas que fortalecem sua marca e geram resultados concretos.",
  // Domínio oficial (confirmado pelo responsável em 2026-11-05); fonte única para
  // canonical, OpenGraph, robots e sitemap.
  url: "https://nexusagencybr.com.br",
  // Logo da marca (Navbar, Footer e JSON-LD); o mesmo arquivo do legado.
  logo: "/assets/logo.png",
  whatsapp: {
    number: "556192985392",
    displayNumber: "+55 (61) 9298-5392",
    url: "https://wa.me/556192985392",
    defaultMessage: "Quero saber mais!",
  },
  // E-mail institucional do cliente (PEND-11 RESOLVED em 2026-11-03)
  email: "contato@nexusagencybr.com.br",
  // Formulário de contato (#contact) enviado pelo Formspree (PEND-10, 2026-11-05)
  formspree: {
    formId: "xpppnoer",
    endpoint: "https://formspree.io/f/xpppnoer",
  },
  // Canais do rodapé do cliente (PEND-09 resolvido para estes dois itens em 2026-11-03)
  serviceArea: "Atendimento em todo o Brasil, 100% online",
  // Área de atendimento para o JSON-LD (story 8.4), derivada de serviceArea
  // ("em todo o Brasil"); não é dado novo.
  areaServed: { "@type": "Country", name: "Brasil" },
  businessHours: "Horário: segunda a sexta, das 9h às 18h",
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

// Cor da barra do navegador (viewport.themeColor). O viewport não lê CSS var:
// espelho de --secondary-color em globals.css — mude os dois juntos.
export const THEME_COLOR = "#04091d";
