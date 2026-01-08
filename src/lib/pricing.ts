/**
 * Pricing configuration for purchase flow
 */
export const PLAN_PRICING = {
    PRO: {
        basePrice: 19.90, // Monthly base price in BRL
        discounts: {
            1: 0,      // 1 month: no discount
            3: 10,     // 3 months: 10% off
            6: 20,     // 6 months: 20% off
            12: 30,    // 12 months: 30% off
            24: 40,    // 24 months: 40% off
        }
    },
    DIAMOND: {
        basePrice: 49.90,
        discounts: {
            1: 0,
            3: 10,
            6: 20,
            12: 35,
            24: 50,
        }
    }
} as const;

/**
 * Calculate price with discount
 */
export function calculatePlanPrice(
    planType: "PRO" | "DIAMOND",
    months: number
): { total: number; discount: number; perMonth: number } {
    const config = PLAN_PRICING[planType];
    const discountPercent = config.discounts[months as keyof typeof config.discounts] || 0;

    const subtotal = config.basePrice * months;
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal - discountAmount;

    return {
        total: Math.round(total * 100) / 100,
        discount: discountPercent,
        perMonth: Math.round((total / months) * 100) / 100,
    };
}
