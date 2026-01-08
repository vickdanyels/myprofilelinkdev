import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "glass";
    padding?: "none" | "sm" | "md" | "lg";
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            variant = "default",
            padding = "md",
            hover = false,
            className = "",
            ...props
        },
        ref
    ) => {
        const variants = {
            default: `
        bg-[rgb(var(--color-surface))]
        border border-[rgb(var(--color-border))]
      `,
            elevated: `
        bg-[rgb(var(--color-surface-elevated))]
        border border-[rgb(var(--color-border))]
        shadow-lg shadow-black/20
      `,
            glass: `glass-panel`,
        };

        const paddings = {
            none: "",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
        };

        return (
            <div
                ref={ref}
                className={`
          rounded-2xl
          ${variants[variant]}
          ${paddings[padding]}
          ${hover ? "transition-all duration-200 hover:border-[rgb(var(--color-primary))]/50 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/10" : ""}
          ${className}
        `}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export { Card };
export type { CardProps };
