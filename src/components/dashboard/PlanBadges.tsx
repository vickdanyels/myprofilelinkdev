"use client";

import { useEffect, useState } from "react";

type PlanType = "FREE" | "PRO" | "DIAMOND";

interface PlanBadgesProps {
    currentPlan: PlanType;
    expiresAt?: Date | string | null;
}

export function PlanBadges({ currentPlan, expiresAt }: PlanBadgesProps) {
    const [remainingDays, setRemainingDays] = useState<number | null>(null);

    useEffect(() => {
        if (expiresAt && currentPlan !== "FREE") {
            const expDate = new Date(expiresAt);
            const now = new Date();
            const diffTime = expDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setRemainingDays(diffDays > 0 ? diffDays : 0);
        }
    }, [expiresAt, currentPlan]);

    const plans: PlanType[] = ["FREE", "PRO", "DIAMOND"];

    return (
        <div className="plan-badges-container flex items-center gap-3 lg:gap-[50px] flex-wrap justify-center" style={{ marginTop: '25px' }}>
            {plans.map((plan) => (
                <PlanBadge
                    key={plan}
                    plan={plan}
                    isActive={currentPlan === plan}
                    remainingDays={currentPlan === plan ? remainingDays : null}
                />
            ))}
        </div>
    );
}

interface PlanBadgeProps {
    plan: PlanType;
    isActive: boolean;
    remainingDays: number | null;
}

function PlanBadge({ plan, isActive, remainingDays }: PlanBadgeProps) {
    const baseClasses = "relative px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2";

    const getBadgeClass = (p: PlanType, active: boolean) => {
        if (!active) {
            if (p === "FREE") return "bg-slate-800/20 text-slate-500 border border-slate-700/20 opacity-40";
            if (p === "PRO") return "bg-amber-900/10 text-amber-600/50 border border-amber-700/20 opacity-40";
            if (p === "DIAMOND") return "bg-cyan-900/10 text-cyan-600/50 border border-cyan-700/20 opacity-40";
            return "";
        }

        switch (p) {
            case "FREE":
                return "bg-slate-600/30 text-slate-300 border border-slate-500/30";
            case "PRO":
                return "pro-badge text-black border-none";
            case "DIAMOND":
                return "diamond-badge text-white border-none";
            default:
                return "";
        }
    };

    const iconStyles = {
        FREE: "💫",
        PRO: "👑", // Icon is handled by CSS pseudo-element for Pro/Diamond usually, but we keep it for Free or text backup
        DIAMOND: "💎",
    };

    // For PRO/DIAMOND active, we likely don't need the text icon if CSS handles it via ::after,
    // but the .pro-badge definition uses ::after for '✨' sparkles, not the main icon.
    // The previous implementation had icons as text. Let's keep them but maybe hide them if the badge class supplies them?
    // Actually, .pro-badge in globals.css doesn't force an icon content *inside* the text flow, it adds a sparkle after.
    // So we should keep the icon here.

    return (
        <div className={`${baseClasses} ${getBadgeClass(plan, isActive)}`}>
            {/* Icons */}
            <span className="text-base drop-shadow-md filter">{iconStyles[plan]}</span>

            <span className="relative z-10 tracking-wider">
                {plan}
            </span>

            {/* Countdown timer */}
            {isActive && remainingDays !== null && plan !== "FREE" && (
                <div className="flex items-center gap-1 ml-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-current font-medium border border-white/10 backdrop-blur-sm">
                        {remainingDays}d
                    </span>
                </div>
            )}

            {/* FREE badge shows "∞" */}
            {isActive && plan === "FREE" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-medium">
                    ∞
                </span>
            )}
        </div>
    );
}
