import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "@/components/ui/SocialIcons";

export function Footer() {
  return (
    <footer className="bg-[#03060f] text-white pt-16 pb-12 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
        {/* Coluna 1: Logo, Compromisso e Redes Sociais */}
        <div className="md:col-span-6 flex flex-col gap-5">
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

        {/* Coluna 2: Serviços (5 links originais preservados) */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h4 className="font-semibold text-base text-white mb-2">Serviços</h4>
          <a href="#" className="text-white/70 hover:text-[#a15cf5] transition-colors text-xs sm:text-sm font-light">
            Inbound Marketing
          </a>
          <a href="#" className="text-white/70 hover:text-[#a15cf5] transition-colors text-xs sm:text-sm font-light">
            Criação e Desenvolvimento
          </a>
          <a href="#" className="text-white/70 hover:text-[#a15cf5] transition-colors text-xs sm:text-sm font-light">
            Tráfego Pago
          </a>
          <a href="#" className="text-white/70 hover:text-[#a15cf5] transition-colors text-xs sm:text-sm font-light">
            Business Intelligence
          </a>
          <a href="#" className="text-white/70 hover:text-[#a15cf5] transition-colors text-xs sm:text-sm font-light">
            Marketing
          </a>
        </div>

        {/* Coluna 3: Suporte (3 links originais preservados) */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <h4 className="font-semibold text-base text-white mb-2">Suporte</h4>
          <a href="#" className="text-white/70 hover:text-[#a15cf5] transition-colors text-xs sm:text-sm font-light">
            Contato
          </a>
          <a href="#" className="text-white/70 hover:text-[#a15cf5] transition-colors text-xs sm:text-sm font-light">
            Blogs
          </a>
          <a href="#" className="text-white/70 hover:text-[#a15cf5] transition-colors text-xs sm:text-sm font-light">
            Politica e Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
