import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // `min-width`, que inclui o valor; o legado vira ACIMA dele (`width > 480px`). Onde a
    // classe do rebuild corresponde à do legado (menu, ícones sociais fixos, Banners), o
    // ponto exato usa `min-[481px]:`/`min-[769px]:` (story 4.1, PEND-16) — não mude estas
    // telas: as outras grades foram montadas sobre elas.
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1200px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-color)",
          dark: "var(--primary-color-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary-color)",
          light: "var(--secondary-color-light)",
          dark: "var(--secondary-color-dark)",
        },
        accent: {
          span: "var(--span)",
        },
        whatsapp: "#218e49",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(to right, var(--primary-color-dark), var(--primary-color))",
      },
    },
  },
  plugins: [],
};

export default config;
