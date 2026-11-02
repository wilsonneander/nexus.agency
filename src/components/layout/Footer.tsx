import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "@/components/ui/SocialIcons";

export function Footer() {
  return (
    <footer className="bg-secondary-dark text-white py-12 border-t border-secondary-light">
      <div className="max-w-container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Coluna 1: Institucional */}
        <div className="sm:col-span-2 md:col-span-2 flex flex-col gap-4">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Nexus Agency"
              width={120}
              height={40}
              className="h-auto w-28"
            />
          </Link>
          <p className="text-white/80 max-w-md text-sm leading-relaxed">
            Nosso compromisso com a excelência. Trabalhamos com dedicação para entregar produtos de
            alta qualidade e desempenho, projetados para atender às suas necessidades e impulsionar o
            crescimento do seu negócio, garantindo soluções que fazem a diferença no mercado.
          </p>
          <div className="mt-2">
            <SocialIcons variant="footer" />
          </div>
        </div>

        {/* Coluna 2: Serviços (placeholders preservados) */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-base mb-1">Serviços</h4>
          <a href="#" className="text-white/70 hover:text-primary-dark transition-colors text-sm">
            Inbound Marketing
          </a>
          <a href="#" className="text-white/70 hover:text-primary-dark transition-colors text-sm">
            Criação e Desenvolvimento
          </a>
          <a href="#" className="text-white/70 hover:text-primary-dark transition-colors text-sm">
            Tráfego Pago
          </a>
          <a href="#" className="text-white/70 hover:text-primary-dark transition-colors text-sm">
            Business Intelligence
          </a>
          <a href="#" className="text-white/70 hover:text-primary-dark transition-colors text-sm">
            Marketing
          </a>
        </div>

        {/* Coluna 3: Suporte (placeholders preservados) */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-base mb-1">Suporte</h4>
          <a href="#" className="text-white/70 hover:text-primary-dark transition-colors text-sm">
            Contato
          </a>
          <a href="#" className="text-white/70 hover:text-primary-dark transition-colors text-sm">
            Blogs
          </a>
          <a href="#" className="text-white/70 hover:text-primary-dark transition-colors text-sm">
            Politica e Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
