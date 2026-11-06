import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef, ReactNode } from "react";
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

/** Classes do botão fluido, iguais para `<button>` e `<a>`. */
function fluidClasses({
  variant = "primary",
  pulse = false,
  isActive = false,
  className,
}: Omit<BaseFluidProps, "children">) {
  return cn(
    "fluid-btn group",
    `fluid-btn--${variant}`,
    pulse && "fluid-btn--pulse",
    isActive && "fluid-btn--active",
    className
  );
}

export const FluidButton = forwardRef<HTMLButtonElement, FluidButtonProps>(
  ({ className, variant, pulse, isActive, children, ...props }, ref) => (
    <button ref={ref} className={fluidClasses({ variant, pulse, isActive, className })} {...props}>
      <span className="fluid-btn__overlay" aria-hidden="true" />
      <span className="fluid-btn__content">{children}</span>
    </button>
  )
);

FluidButton.displayName = "FluidButton";

export type FluidLinkProps = BaseFluidProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

/** `<a>` simples também para âncoras (`#contact`): o `next/link` não acrescenta nada a elas. */
export const FluidLink = forwardRef<HTMLAnchorElement, FluidLinkProps>(
  ({ className, variant, pulse, isActive, children, ...props }, ref) => (
    <a ref={ref} className={fluidClasses({ variant, pulse, isActive, className })} {...props}>
      <span className="fluid-btn__overlay" aria-hidden="true" />
      <span className="fluid-btn__content">{children}</span>
    </a>
  )
);

FluidLink.displayName = "FluidLink";
