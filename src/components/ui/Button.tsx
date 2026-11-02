import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  pulse?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", pulse = false, children, ...props }, ref) => {
    const isPrimary = variant === "primary";
    const mappedVariant = isPrimary ? "primary" : "secondary";

    return (
      <button
        ref={ref}
        className={cn(
          "fluid-btn",
          `fluid-btn--${mappedVariant}`,
          pulse && "fluid-btn--pulse",
          "px-8 py-3.5 text-sm sm:text-base font-semibold",
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

Button.displayName = "Button";
