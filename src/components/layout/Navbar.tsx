"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { FluidLink } from "@/components/ui/FluidButton";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#04091d]/85 backdrop-blur-md border-b border-white/5 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="#home" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Nexus Performance & Insights"
            width={140}
            height={45}
            priority
            className="h-auto w-32 sm:w-36 object-contain"
          />
        </Link>

        {/* Links Desktop */}
        <ul className="hidden md:flex items-center gap-8 text-[15px] font-normal text-white">
          {SITE_CONFIG.navLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-[#a15cf5] transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <FluidLink
              href={SITE_CONFIG.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="px-6 py-2 text-sm font-semibold"
            >
              Contato
            </FluidLink>
          </li>
        </ul>

        {/* Botão Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-2xl p-2 focus:outline-none"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          <i className={isOpen ? "ri-close-line" : "ri-menu-3-line"} />
        </button>
      </div>

      {/* Gaveta Mobile */}
      {isOpen && (
        <div className="md:hidden bg-[#0f1221] px-6 py-6 border-b border-[#a15cf5]/20 flex flex-col gap-4 text-base">
          {SITE_CONFIG.navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#a15cf5] py-1 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <FluidLink
            href={SITE_CONFIG.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            variant="primary"
            className="mt-2 text-center py-2.5 text-sm font-semibold"
          >
            Contato
          </FluidLink>
        </div>
      )}
    </nav>
  );
}
