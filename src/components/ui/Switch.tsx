"use client"

import * as React from "react"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${checked ? 'bg-[rgb(var(--color-primary))]' : 'bg-slate-200 dark:bg-slate-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <input
                type="checkbox"
                className="peer sr-only"
                ref={ref}
                checked={checked}
                onChange={(e) => onCheckedChange?.(e.target.checked)}
                disabled={disabled}
                {...props}
            />
            <div
                className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
            />
        </div>
    )
)
Switch.displayName = "Switch"

export { Switch }
