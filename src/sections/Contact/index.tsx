"use client";

import { useRef, useEffect, useState } from "react";
import { matchReveal, revealAll } from "@/animations/scrubReveal";
import { useForm, ValidationError } from "@formspree/react";
import { FluidButton } from "@/components/ui/FluidButton";
import { SITE_CONFIG } from "@/lib/constants";
import { formatPhoneBR } from "@/lib/utils";

const fieldErrorClass = "mt-1 text-xs text-red-400";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // Envio pelo Formspree (PEND-10): o handleSubmit faz o preventDefault e envia por fetch.
  const [formState, handleSubmit] = useForm(SITE_CONFIG.formspree.formId);
  const [whatsapp, setWhatsapp] = useState("");

  const needsOptions = [
    { id: "trafego", label: "Tráfego pago" },
    { id: "site", label: "Site ou landing page" },
    { id: "chatbot", label: "Chatbot e automação" },
    { id: "pacote", label: "Pacote completo" },
  ];

  // Cabeçalho, campos e botão atrelados ao scroll (story 4.2), lidos dos `data-reveal-*`
  // pelo mesmo helper do RevealRoot (story 8.5); a seção é `data-reveal-scope` porque é
  // Client Component inteiro (formulário).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = matchReveal((conditions) => revealAll(section, conditions));
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" data-reveal-scope className="py-24 bg-secondary">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho */}
        <div data-reveal data-reveal-y="36" className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark mb-2">
            Fale conosco
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
            Vamos conversar sobre o seu crescimento?
          </h2>
          <p className="text-white/75 text-sm sm:text-base leading-relaxed">
            Conte um pouco sobre o seu negócio. Nossa equipe responde com um diagnóstico inicial e os
            próximos passos, sem compromisso.
          </p>
        </div>

        {/* Formulário — sem JS, o action envia direto ao Formspree (PEND-10) */}
        {formState.succeeded ? (
          <div
            role="status"
            className="max-w-xl mx-auto bg-secondary-light/50 p-6 sm:p-10 rounded-2xl border border-white/5 shadow-2xl text-center"
          >
            <p className="text-white text-base sm:text-lg font-semibold mb-2">Mensagem enviada!</p>
            <p className="text-white/75 text-sm sm:text-base">
              Recebemos seus dados e entraremos em contato em breve.
            </p>
          </div>
        ) : (
        <form
          action={SITE_CONFIG.formspree.endpoint}
          method="POST"
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto flex flex-col gap-6 bg-secondary-light/50 p-6 sm:p-10 rounded-2xl border border-white/5 shadow-2xl"
        >
          {/* Isca anti-spam do Formspree: invisível; robô que preenche tem o envio descartado */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div data-reveal data-reveal-y="24">
            <label htmlFor="name" className="block text-xs uppercase tracking-wider text-white/70 mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Seu nome completo"
              className="w-full py-3 px-1 bg-transparent border-b-2 border-primary-dark text-white placeholder-white/40 focus:outline-none focus:border-accent-span transition-colors text-sm"
            />
            <ValidationError field="name" prefix="Nome" errors={formState.errors} className={fieldErrorClass} />
          </div>

          <div data-reveal data-reveal-y="24">
            <label htmlFor="whatsapp" className="block text-xs uppercase tracking-wider text-white/70 mb-1">
              WhatsApp
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              required
              inputMode="tel"
              autoComplete="tel-national"
              // Sem JS a máscara não roda: também aceita só os dígitos (DDD + número).
              pattern="\(\d{2}\) \d{4,5}-\d{4}|\d{10,11}"
              title="Informe o DDD e o número, ex.: (61) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatPhoneBR(e.target.value))}
              placeholder="(DDD) 99999-9999"
              className="w-full py-3 px-1 bg-transparent border-b-2 border-primary-dark text-white placeholder-white/40 focus:outline-none focus:border-accent-span transition-colors text-sm"
            />
            <ValidationError field="whatsapp" prefix="WhatsApp" errors={formState.errors} className={fieldErrorClass} />
          </div>

          <div data-reveal data-reveal-y="24">
            <label htmlFor="company" className="block text-xs uppercase tracking-wider text-white/70 mb-1">
              Empresa ou projeto
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              placeholder="Nome da sua empresa"
              className="w-full py-3 px-1 bg-transparent border-b-2 border-primary-dark text-white placeholder-white/40 focus:outline-none focus:border-accent-span transition-colors text-sm"
            />
            <ValidationError field="company" prefix="Empresa" errors={formState.errors} className={fieldErrorClass} />
          </div>

          <div data-reveal data-reveal-y="24" className="pt-2">
            <span className="block text-xs uppercase tracking-wider text-white/70 mb-3 text-center sm:text-left">
              O que você precisa?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {needsOptions.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-white/5 hover:border-primary-dark/40 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="need"
                    value={opt.id}
                    className="accent-primary-dark cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-white/90">{opt.label}</span>
                </label>
              ))}
            </div>
            <ValidationError field="need" prefix="Necessidade" errors={formState.errors} className={fieldErrorClass} />
          </div>

          {/* Erro geral do envio (rede, formulário inválido no Formspree) */}
          {formState.errors && formState.errors.getFormErrors().length > 0 && (
            <p role="alert" className="text-sm text-red-400 text-center">
              Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.
            </p>
          )}

          {/* Botão de Envio com FluidButton e Pulse Sutil */}
          <div data-reveal data-reveal-scale="0.92" className="flex justify-center pt-4">
            <FluidButton
              type="submit"
              variant="primary"
              pulse
              disabled={formState.submitting}
              aria-busy={formState.submitting}
              className="px-10 py-4 text-base font-bold tracking-wide shadow-lg shadow-primary-dark/20"
            >
              {formState.submitting ? "Enviando..." : "Diagnóstico Gratuito"}
            </FluidButton>
          </div>
        </form>
        )}
      </div>
    </section>
  );
}
