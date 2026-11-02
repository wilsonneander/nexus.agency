"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-40 bg-secondary/80 backdrop-blur-md">
      <div className="max-w-container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Nexus Agency"
            width={120}
            height={40}
            priority
            className="h-auto w-28"
          />
        </Link>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {SITE_CONFIG.navLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-white hover:text-primary-dark transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={SITE_CONFIG.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-gradient text-secondary font-medium px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Contato
            </a>
          </li>
        </ul>

        {/* Botão Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-2xl focus:outline-none"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span className="ri-menu-3-line" />
        </button>
      </div>

      {/* Menu Gaveta Mobile */}
      {isOpen && (
        <div className="md:hidden bg-secondary-light px-6 py-4 flex flex-col gap-4 border-t border-primary-dark/20">
          {SITE_CONFIG.navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-white py-1 hover:text-primary-dark transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={SITE_CONFIG.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="bg-primary-gradient text-secondary text-center font-medium px-5 py-2 rounded-full hover:opacity-90 transition-opacity mt-2"
          >
            Contato
          </a>
        </div>
      )}
    </nav>
  );
}
