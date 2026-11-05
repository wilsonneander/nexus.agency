import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Site 100% estático, publicado no Cloudflare Pages (PEND-06): `next build` gera `out/`.
  output: "export",
  // Sem servidor não há otimizador de imagem; os assets já vão otimizados em public/assets.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
