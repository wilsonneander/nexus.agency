import Image from "next/image";
import { SocialIcons } from "@/components/ui/SocialIcons";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-secondary">
      <div className="max-w-container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <Image
            src="/assets/grafic.png"
            alt="Sobre a Nexus Agency"
            width={450}
            height={400}
            className="w-full max-w-[450px] h-auto object-contain"
          />
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-semibold">Sobre nós</h2>
          <p className="text-white/80 leading-relaxed text-base">
            A Nexus surge como uma referência inovadora no cenário do marketing digital, proporcionando soluções
            especializadas em análise e monitoramento de redes sociais e websites. Em um ambiente de negócios cada vez mais
            digitalizado, destacar-se torna-se uma necessidade premente para alcançar e superar metas estratégicas.
          </p>
          <h4 className="p-6 bg-secondary-light border-l-2 border-primary-dark rounded-md text-white/90 text-sm leading-relaxed">
            Contando com um time experiente com passagens por grandes agências de marketing e publicidades assim como grandes
            empresas de referência no mercado digital, a expertise é um dos pontos diferenciais para o sucesso planejado.
          </h4>
          <div className="flex items-center gap-4 mt-2">
            <SocialIcons variant="about" className="flex-row" />
          </div>
        </div>
      </div>
    </section>
  );
}
