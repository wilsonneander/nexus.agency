import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface WhatsAppFloatProps {
  className?: string;
}

export function WhatsAppFloat({ className }: WhatsAppFloatProps) {
  return (
    <a
      href={SITE_CONFIG.whatsapp.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("whatsapp-link", className)}
      aria-label="Contato direto pelo WhatsApp"
    >
      <i className="fa fa-whatsapp" />
      <span className="wpp">{SITE_CONFIG.whatsapp.defaultMessage}</span>
    </a>
  );
}
