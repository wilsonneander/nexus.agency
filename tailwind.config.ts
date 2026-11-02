import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
