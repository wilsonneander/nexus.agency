import { Button } from "@/components/ui/Button";

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-secondary">
      <div className="max-w-container mx-auto px-4">
        <p className="text-sm font-medium text-primary-dark text-center mb-2">Fale conosco</p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">Entre em contato</h2>

        <form action="/" className="max-w-xl mx-auto flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome"
              className="w-full p-4 bg-transparent border-b-2 border-primary-dark text-white placeholder-white/60 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Sobrenome"
              className="w-full p-4 bg-transparent border-b-2 border-primary-dark text-white placeholder-white/60 focus:outline-none"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 bg-transparent border-b-2 border-primary-dark text-white placeholder-white/60 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Descrição"
            className="w-full p-4 bg-transparent border-b-2 border-primary-dark text-white placeholder-white/60 focus:outline-none"
          />

          <div className="mt-4">
            <h6 className="text-sm font-semibold text-center mb-4 text-white">Serviços</h6>
            <div className="flex justify-around flex-wrap gap-4">
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <input type="radio" name="service" id="marketing" className="cursor-pointer" />
                <span className="text-xs text-white/90">Marketing</span>
              </label>
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <input type="radio" name="service" id="sites" className="cursor-pointer" />
                <span className="text-xs text-white/90">Sites</span>
              </label>
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <input type="radio" name="service" id="trafego" className="cursor-pointer" />
                <span className="text-xs text-white/90">Tráfego Pago</span>
              </label>
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <input type="radio" name="service" id="bi" className="cursor-pointer" />
                <span className="text-xs text-white/90">BI</span>
              </label>
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <input type="radio" name="service" id="outros" className="cursor-pointer" />
                <span className="text-xs text-white/90">Outros</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button type="submit">Enviar</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
