import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { RollingLink } from "@/components/ui/RollingText";
import { FooterClient } from "./FooterClient";

export function Footer() {
  return (
    <FooterClient>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">

        {/* Coluna 1 */}
        <div data-footer-col className="md:col-span-6 flex flex-col gap-5">
          <Link href="#home">
            <Image
              src="/assets/logo.png"
              alt="Nexus Performance & Insights"
              width={140}
              height={45}
              className="h-auto w-32 object-contain"
            />
          </Link>
          <p className="text-white/70 max-w-md text-xs sm:text-sm leading-relaxed font-light">
            Nosso compromisso com a excelência. Trabalhamos com dedicação para entregar produtos de
            alta qualidade e desempenho, projetados para atender às suas necessidades e impulsionar o
            crescimento do seu negócio, garantindo soluções que fazem a diferença no mercado.
          </p>
          <div className="pt-2">
            <SocialIcons variant="footer" className="flex-row gap-3" />
          </div>
        </div>

        {/* Coluna 2 — Serviços */}
        <div data-footer-col className="md:col-span-3 flex flex-col gap-3">
          <h4 className="font-semibold text-base text-white mb-2">Serviços</h4>
          <div><RollingLink href="#" className="text-xs sm:text-sm font-light">Inbound Marketing</RollingLink></div>
          <div><RollingLink href="#" className="text-xs sm:text-sm font-light">Criação e Desenvolvimento</RollingLink></div>
          <div><RollingLink href="#" className="text-xs sm:text-sm font-light">Tráfego Pago</RollingLink></div>
          <div><RollingLink href="#" className="text-xs sm:text-sm font-light">Business Intelligence</RollingLink></div>
          <div><RollingLink href="#" className="text-xs sm:text-sm font-light">Marketing</RollingLink></div>
        </div>

        {/* Coluna 3 — Suporte */}
        <div data-footer-col className="md:col-span-3 flex flex-col gap-3">
          <h4 className="font-semibold text-base text-white mb-2">Suporte</h4>
          <div><RollingLink href="#" className="text-xs sm:text-sm font-light">Contato</RollingLink></div>
          <div><RollingLink href="#" className="text-xs sm:text-sm font-light">Blogs</RollingLink></div>
          <div><RollingLink href="#" className="text-xs sm:text-sm font-light">Politica e Privacidade</RollingLink></div>
        </div>
      </div>
    </FooterClient>
  );
}
