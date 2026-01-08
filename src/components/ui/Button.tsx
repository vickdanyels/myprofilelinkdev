import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            isLoading = false,
            fullWidth = false,
            className = "",
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-xl
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-background))]
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `;

        const variants = {
            primary: `
        bg-[rgb(var(--color-primary))]
        text-white
        hover:bg-[rgb(var(--color-primary))]/90
        hover:shadow-lg hover:shadow-[rgb(var(--color-primary))/30]
        focus-visible:ring-[rgb(var(--color-primary))]
      `,
            secondary: `
        bg-[rgb(var(--color-surface-elevated))]
        text-[rgb(var(--color-text-primary))]
        border border-[rgb(var(--color-border))]
        hover:bg-[rgb(var(--color-border))]
        focus-visible:ring-[rgb(var(--color-border))]
      `,
            ghost: `
        bg-transparent
        text-[rgb(var(--color-text-secondary))]
        hover:bg-[rgb(var(--color-surface))]
        hover:text-[rgb(var(--color-text-primary))]
        focus-visible:ring-[rgb(var(--color-border))]
      `,
            danger: `
        bg-[rgb(var(--color-error))]
        text-white
        hover:bg-[rgb(var(--color-error))]/90
        focus-visible:ring-[rgb(var(--color-error))]
      `,
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-5 py-2.5 text-base",
            lg: "px-7 py-3.5 text-lg",
        };

        return (
            <button
                ref={ref}
                className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        <span>Carregando...</span>
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
