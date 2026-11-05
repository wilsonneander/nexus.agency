import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Máscara de telefone BR enquanto o usuário digita: (61) 9298-5392 (fixo, 10 dígitos)
 * ou (61) 99298-5392 (celular, 11 dígitos). Ignora o que não for dígito e o +55 colado.
 */
export function formatPhoneBR(value: string): string {
  let digits = value.replace(/\D/g, "");
  // Número colado com o código do país (+55 61 99298-5392): descarta o 55.
  if (digits.length > 11 && digits.startsWith("55")) digits = digits.slice(2);
  digits = digits.slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;

  const splitAt = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, splitAt)}-${rest.slice(splitAt)}`;
}
