import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-3
            bg-[rgb(var(--color-surface))]
            border rounded-xl
            text-[rgb(var(--color-text-primary))]
            placeholder:text-[rgb(var(--color-text-muted))]
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-background))]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
                            ? "border-[rgb(var(--color-error))] focus:ring-[rgb(var(--color-error))]"
                            : "border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
                        }
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-sm text-[rgb(var(--color-error))]">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
