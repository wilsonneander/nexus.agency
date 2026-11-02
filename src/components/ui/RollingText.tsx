import { AnchorHTMLAttributes, ReactNode, forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RollingTextProps {
  children: string;
  className?: string;
}

/**
 * RollingText: Exibe o texto em um container com overflow: hidden.
 * Ao passar o mouse (ou no hover do container pai .group), o texto superior sobe
 * e o clone inferior sobe junto, criando o efeito de rotação vertical fluida.
 */
export function RollingText({ children, className }: RollingTextProps) {
  return (
    <span
      className={cn(
        "relative inline-flex flex-col h-[1.25em] overflow-hidden leading-tight select-none",
        className
      )}
      aria-label={children}
    >
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full will-change-transform"
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute top-full left-0 inline-block text-[#ad7dff] transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full will-change-transform"
      >
        {children}
      </span>
    </span>
  );
}

interface RollingLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: string;
  className?: string;
}

export const RollingLink = forwardRef<HTMLAnchorElement, RollingLinkProps>(
  ({ href, children, className, ...props }, ref) => {
    const isInternal = href.startsWith("#") || href.startsWith("/");

    if (isInternal) {
      return (
        <Link
          ref={ref}
          href={href}
          className={cn("group inline-flex items-center text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad7dff] rounded", className)}
          {...props}
        >
          <RollingText>{children}</RollingText>
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        href={href}
        className={cn("group inline-flex items-center text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad7dff] rounded", className)}
        {...props}
      >
        <RollingText>{children}</RollingText>
      </a>
    );
  }
);

RollingLink.displayName = "RollingLink";
