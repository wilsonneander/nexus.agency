import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { RollingLink } from "@/components/ui/RollingText";
import { SITE_CONFIG } from "@/lib/constants";
import { FooterClient } from "./FooterClient";

// Cada link leva ao card do serviço na LP (âncora = SERVICES_DATA[].id)
const FOOTER_SERVICE_LINKS = [
  { label: "Planejamento estratégico", href: "#planejamento-estrategico" },
  { label: "Gestão de tráfego pago", href: "#gestao-trafego-pago" },
  { label: "Criação e Desenvolvimento", href: "#criacao-sites-landing-pages" },
  { label: "Chatbots e automação de atendimento", href: "#chatbots-automacao" },
  { label: "Relatórios e análise de resultados", href: "#relatorios-analise" },
];

export function Footer() {
  return (
    <FooterClient>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">

        {/* Coluna 1 — em linha própria até 1199px: as 4 colunas só cabem lado a lado a partir de 1200px */}
        <div data-footer-col className="md:col-span-12 xl:col-span-2 flex flex-col gap-5">
          <Link href="#home">
            <Image
              src="/assets/logo.png"
              alt="Nexus Performance & Insights"
              width={140}
              height={45}
              className="h-auto w-32 object-contain"
            />
          </Link>
          <div className="pt-2">
            <SocialIcons variant="footer" className="flex-row gap-3" />
          </div>
        </div>

        {/* Coluna 2 — Serviços (larga o bastante para o rótulo mais longo em uma linha) */}
        <div data-footer-col className="md:col-span-6 lg:col-span-4 flex flex-col gap-3">
          <h4 className="font-semibold text-base text-white mb-2">Serviços</h4>
          {FOOTER_SERVICE_LINKS.map((link) => (
            <div key={link.href}>
              <RollingLink href={link.href} className="whitespace-nowrap text-xs sm:text-sm font-light">{link.label}</RollingLink>
            </div>
          ))}
        </div>

        {/* Coluna 3 — Suporte (larga o bastante para o e-mail em uma linha) */}
        <div data-footer-col className="md:col-span-6 lg:col-span-4 xl:col-span-3 flex flex-col gap-3">
          <h4 className="font-semibold text-base text-white mb-2">Suporte</h4>
          <div><RollingLink href="#contact" className="text-xs sm:text-sm font-light">Contato</RollingLink></div>
          <div><RollingLink href={`mailto:${SITE_CONFIG.email}`} className="whitespace-nowrap text-xs sm:text-sm font-light">{SITE_CONFIG.email}</RollingLink></div>
          {/* Sem destino até existir a política de privacidade (PEND-12) */}
          <div><RollingLink href="#" className="text-xs sm:text-sm font-light">Politica e privacidade</RollingLink></div>
        </div>

        {/* Coluna 4 — Canais (texto informativo, sem link) */}
        <div data-footer-col className="md:col-span-6 lg:col-span-4 xl:col-span-3 flex flex-col gap-3">
          <h4 className="font-semibold text-base text-white mb-2">Canais</h4>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">{SITE_CONFIG.serviceArea}</p>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">{SITE_CONFIG.businessHours}</p>
        </div>
      </div>
    </FooterClient>
  );
}
