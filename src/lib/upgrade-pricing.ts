/**
 * Upgrade Pricing Configuration
 * 
 * Defines plans, durations, and discount structure for the upgrade page.
 */

export type PlanType = "PRO" | "DIAMOND";

export interface PlanConfig {
    monthly: number;
    lifetime: number;
    icon: string;
    color: string;
    glowColor: string;
}

export interface DurationOption {
    months: number;
    label: string;
    discount: number;
    popular?: boolean;
}

export const PLANS: Record<PlanType, PlanConfig> = {
    PRO: {
        monthly: 19.90,
        lifetime: 990,
        icon: "👑",
        color: "amber",
        glowColor: "rgba(245, 158, 11, 0.5)"
    },
    DIAMOND: {
        monthly: 49.90,
        lifetime: 2190,
        icon: "💎",
        color: "cyan",
        glowColor: "rgba(103, 254, 253, 0.5)"
    }
};

export const DURATION_OPTIONS: DurationOption[] = [
    { months: 1, label: "1 mês", discount: 0 },
    { months: 3, label: "3 meses", discount: 0.05 },
    { months: 6, label: "6 meses", discount: 0.10 },
    { months: 12, label: "12 meses", discount: 0.20, popular: true },
    { months: 24, label: "2 anos", discount: 0.40 },
    { months: 36, label: "3 anos", discount: 0.50 },
    { months: 0, label: "Vitalício", discount: 1 } // 0 months = lifetime
];

/**
 * Calculate the price for a plan and duration
 */
export function calculatePrice(plan: PlanType, months: number): {
    originalPrice: number;
    finalPrice: number;
    savings: number;
    discountPercent: number;
} {
    const planConfig = PLANS[plan];

    // Lifetime plan
    if (months === 0) {
        const originalPrice = planConfig.monthly * 60; // ~5 years worth
        return {
            originalPrice,
            finalPrice: planConfig.lifetime,
            savings: originalPrice - planConfig.lifetime,
            discountPercent: Math.round((1 - planConfig.lifetime / originalPrice) * 100)
        };
    }

    // Find discount for duration
    const durationOption = DURATION_OPTIONS.find(d => d.months === months);
    const discount = durationOption?.discount || 0;

    const originalPrice = planConfig.monthly * months;
    const finalPrice = originalPrice * (1 - discount);

    return {
        originalPrice: Math.round(originalPrice * 100) / 100,
        finalPrice: Math.round(finalPrice * 100) / 100,
        savings: Math.round((originalPrice - finalPrice) * 100) / 100,
        discountPercent: Math.round(discount * 100)
    };
}

/**
 * Format price to Brazilian currency
 */
export function formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
