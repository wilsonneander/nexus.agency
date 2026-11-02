import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Variantes de Botão Fluid:
 * - primary: Botão principal de conversão com fundo gradiente, overlay fluido suave e pulso opcional.
 * - secondary: Botão com borda luminosa e preenchimento fluido translúcido ao passar o mouse.
 * - filter: Botão de filtro para portfólio seguindo exatamente a identidade visual e microinterações dos botões principais.
 */
export type FluidButtonVariant = "primary" | "secondary" | "filter";

interface BaseFluidProps {
  variant?: FluidButtonVariant;
  pulse?: boolean;
  isActive?: boolean;
  children: ReactNode;
  className?: string;
}

export type FluidButtonProps = BaseFluidProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const FluidButton = forwardRef<HTMLButtonElement, FluidButtonProps>(
  ({ className, variant = "primary", pulse = false, isActive = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "fluid-btn group",
          `fluid-btn--${variant}`,
          pulse && "fluid-btn--pulse",
          isActive && "fluid-btn--active",
          className
        )}
        {...props}
      >
        <span className="fluid-btn__overlay" aria-hidden="true" />
        <span className="fluid-btn__content">{children}</span>
      </button>
    );
  }
);

FluidButton.displayName = "FluidButton";

export type FluidLinkProps = BaseFluidProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export const FluidLink = forwardRef<HTMLAnchorElement, FluidLinkProps>(
  ({ className, variant = "primary", pulse = false, isActive = false, href, children, ...props }, ref) => {
    const isInternalAnchor = href.startsWith("#");

    if (isInternalAnchor) {
      return (
        <Link
          ref={ref}
          href={href}
          className={cn(
            "fluid-btn group",
            `fluid-btn--${variant}`,
            pulse && "fluid-btn--pulse",
            isActive && "fluid-btn--active",
            className
          )}
          {...props}
        >
          <span className="fluid-btn__overlay" aria-hidden="true" />
          <span className="fluid-btn__content">{children}</span>
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "fluid-btn group",
          `fluid-btn--${variant}`,
          pulse && "fluid-btn--pulse",
          isActive && "fluid-btn--active",
          className
        )}
        {...props}
      >
        <span className="fluid-btn__overlay" aria-hidden="true" />
        <span className="fluid-btn__content">{children}</span>
      </a>
    );
  }
);

FluidLink.displayName = "FluidLink";
