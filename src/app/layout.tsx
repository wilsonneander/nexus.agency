import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { SITE_CONFIG, THEME_COLOR } from "@/lib/constants";

// Imagem de compartilhamento provisória (story 8.4): a foto do Hero legado em JPG,
// sem recorte. A arte 1200×630 aprovada fica para a 8.8 (PEND-19).
const OG_IMAGE = {
  url: "/assets/og-image.jpg",
  width: 1200,
  height: 686,
  type: "image/jpeg",
  alt: SITE_CONFIG.name,
};

// Dados estruturados da organização (story 8.4): só campos de SITE_CONFIG.
// Organization, e não LocalBusiness, porque este exige endereço e não há um aprovado.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: new URL(SITE_CONFIG.logo, SITE_CONFIG.url).href,
  email: SITE_CONFIG.email,
  telephone: `+${SITE_CONFIG.whatsapp.number}`,
  sameAs: Object.values(SITE_CONFIG.socials),
  areaServed: SITE_CONFIG.areaServed,
};

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: "pt_BR",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <head>
        {/* RemixIcon e FontAwesome preservados para os ícones originais */}
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"
        />
        {/*
          Fallback sem JS (FR-03 aceite, story 4.4): só vale com JavaScript desligado.
          O ScrollText grava a cor inicial (22%) inline em cada [data-word] e só o GSAP
          a ilumina; sem JS o texto ficaria ilegível. O !important é o único jeito de
          uma folha de estilo vencer o style="" inline. Com JS, o <noscript> não se aplica.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: "<style>[data-word]{color:rgb(255 255 255)!important}</style>",
          }}
        />
        {/* "<" escapado: um valor nunca fecha o <script> antes da hora. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-secondary text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
