import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SocialIconsProps {
  className?: string;
  variant?: "header" | "about" | "footer";
}

export function SocialIcons({ className, variant = "header" }: SocialIconsProps) {
  const isFooter = variant === "footer";

  return (
    <ul className={cn("flex gap-2", isFooter ? "flex-row social-footer" : "flex-col", className)}>
      <li className="item">
        <a
          href={SITE_CONFIG.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram da Nexus Agency"
        >
          <i className="fa-brands fa-instagram icon" />
        </a>
      </li>
      <li className="item">
        <a
          href={SITE_CONFIG.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn da Nexus Agency"
        >
          <i className="fa-brands fa-linkedin icon" />
        </a>
      </li>
      <li className="item">
        <a
          href={SITE_CONFIG.socials.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook da Nexus Agency"
        >
          <i className="fa-brands fa-facebook icon" />
        </a>
      </li>
    </ul>
  );

  
}
 export function SocialAboutIcons({ className, variant = "about" }: SocialIconsProps) {
 const isabout = variant === "about";

 return (
    <ul className={cn("flex gap-2", isabout ? "flex-row social-footer" : "flex-col", className)}>
      <li className="item">
        <a
          href={SITE_CONFIG.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram da Nexus Agency"
        >
          <i className="fa-brands fa-instagram icon" />
        </a>
      </li>
      <li className="item">
        <a
          href={SITE_CONFIG.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn da Nexus Agency"
        >
          <i className="fa-brands fa-linkedin icon" />
        </a>
      </li>
      <li className="item">
        <a
          href={SITE_CONFIG.socials.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook da Nexus Agency"
        >
          <i className="fa-brands fa-facebook icon" />
        </a>
      </li>
    </ul>
  );
}