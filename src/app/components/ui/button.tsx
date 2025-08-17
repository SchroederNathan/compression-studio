import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseClasses = "font-semibold focus-visible:outline-2 focus-visible:outline-offset-2";
    
    const variantClasses = {
      primary: "bg-[var(--color-foreground)] text-[var(--color-background)] shadow-xs hover:bg-[var(--color-foreground)]/70 focus-visible:outline-[var(--color-foreground)] transition-colors duration-200 hover:cursor-pointer",
      secondary: "bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-xs inset-ring inset-ring-[var(--color-border)] hover:bg-[var(--color-border)] focus-visible:outline-[var(--color-ring)] transition-colors duration-200 hover:cursor-pointer"
    };

    const sizeClasses = {
      xs: "rounded-sm px-2 py-1 text-xs",
      sm: "rounded-sm px-2 py-1 text-sm",
      md: "rounded-md px-2.5 py-1.5 text-sm",
      lg: "rounded-md px-3 py-2 text-sm",
      xl: "rounded-md px-3.5 py-2.5 text-sm"
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
