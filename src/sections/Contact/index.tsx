"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const needsOptions = [
    { id: "trafego", label: "Tráfego pago" },
    { id: "site", label: "Site ou landing page" },
    { id: "chatbot", label: "Chatbot e automação" },
    { id: "pacote", label: "Pacote completo" },
  ];

  useEffect(() => {
    if (reduced) return;
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current!;

      // Cabeçalho
      const header = section.querySelector("[data-contact-header]");
      if (header) {
        gsap.from(header, {
          y: 36,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 86%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }

      // Campos do formulário (stagger)
      const fields = section.querySelectorAll("[data-contact-field]");
      if (fields.length) {
        gsap.from(fields, {
          y: 24,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section.querySelector("form"),
            start: "top 86%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }

      // CTA button
      const cta = section.querySelector("[data-contact-cta]");
      if (cta) {
        gsap.from(cta, {
          scale: 0.92,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.5)",
          delay: 0.45,
          scrollTrigger: {
            trigger: section.querySelector("form"),
            start: "top 86%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} id="contact" className="py-24 bg-[#04091d]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Cabeçalho */}
        <div data-contact-header className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#a15cf5] mb-2">
            Fale conosco
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
            Vamos conversar sobre o seu crescimento?
          </h2>
          <p className="text-white/75 text-sm sm:text-base leading-relaxed font-light">
            Conte um pouco sobre o seu negócio. Nossa equipe responde com um diagnóstico inicial e os
            próximos passos, sem compromisso.
          </p>
        </div>

        {/* Formulário */}
        <form
          action="/"
          method="POST"
          onSubmit={(e) => e.preventDefault()}
          className="max-w-xl mx-auto flex flex-col gap-6 bg-[#0f1221]/50 p-6 sm:p-10 rounded-2xl border border-white/5 shadow-2xl"
        >
          <div data-contact-field>
            <label htmlFor="name" className="block text-xs uppercase tracking-wider text-white/70 mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Seu nome completo"
              className="w-full py-3 px-1 bg-transparent border-b-2 border-[#a15cf5] text-white placeholder-white/40 focus:outline-none focus:border-[#ad7dff] transition-colors text-sm"
            />
          </div>

          <div data-contact-field>
            <label htmlFor="whatsapp" className="block text-xs uppercase tracking-wider text-white/70 mb-1">
              WhatsApp
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              required
              placeholder="(DDD) 99999-9999"
              className="w-full py-3 px-1 bg-transparent border-b-2 border-[#a15cf5] text-white placeholder-white/40 focus:outline-none focus:border-[#ad7dff] transition-colors text-sm"
            />
          </div>

          <div data-contact-field>
            <label htmlFor="company" className="block text-xs uppercase tracking-wider text-white/70 mb-1">
              Empresa ou projeto
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              placeholder="Nome da sua empresa"
              className="w-full py-3 px-1 bg-transparent border-b-2 border-[#a15cf5] text-white placeholder-white/40 focus:outline-none focus:border-[#ad7dff] transition-colors text-sm"
            />
          </div>

          <div data-contact-field className="pt-2">
            <span className="block text-xs uppercase tracking-wider text-white/70 mb-3 text-center sm:text-left">
              O que você precisa?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {needsOptions.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 p-3 bg-[#04091d] rounded-lg border border-white/5 hover:border-[#a15cf5]/40 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="need"
                    value={opt.id}
                    className="accent-[#a15cf5] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-white/90">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div data-contact-cta className="flex justify-center pt-4">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base text-[#04091d] bg-gradient-to-r from-[#a15cf5] to-white hover:opacity-95 hover:shadow-lg hover:shadow-[#a15cf5]/25 transition-all duration-300"
            >
              Quero meu diagnóstico gratuito
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
