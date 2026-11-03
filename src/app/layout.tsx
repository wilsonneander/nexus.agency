import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { SITE_CONFIG } from "@/lib/constants";

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
    images: [
      {
        url: "/assets/header.webp",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ["/assets/header.webp"],
  },
  icons: {
    icon: "/assets/icon2.png",
    shortcut: "/assets/icon2.png",
    apple: "/assets/icon2.png",
  },
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
