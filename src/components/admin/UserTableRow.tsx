"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { PlanManagerModal } from "./PlanManagerModal";
import { Settings, Crown, Gem, User } from "lucide-react";

interface UserData {
    id: string;
    name: string | null;
    email: string;
    planType: string;
    proExpiresAt: Date | null;
    role: string;
    profilePage: { username: string } | null;
}

interface UserTableRowProps {
    user: UserData;
}

export function UserTableRow({ user }: UserTableRowProps) {
    const [showModal, setShowModal] = useState(false);

    const getPlanBadgeStyles = (planType: string) => {
        switch (planType) {
            case "DIAMOND":
                return "diamond-badge text-white border-none";
            case "PRO":
                return "pro-badge text-black border-none px-4";
            default:
                return "bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))] border-[rgb(var(--color-border))]";
        }
    };

    const getPlanIcon = (planType: string) => {
        switch (planType) {
            case "DIAMOND":
                return <Gem className="w-3 h-3" />;
            case "PRO":
                return <Crown className="w-3 h-3" />;
            default:
                return <User className="w-3 h-3" />;
        }
    };

    const getExpirationText = () => {
        if (user.planType === "FREE") return null;
        if (!user.proExpiresAt) return "Vitalício";

        const expDate = new Date(user.proExpiresAt);
        const now = new Date();
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Expirado";
        if (diffDays === 0) return "Expira hoje";
        if (diffDays === 1) return "Expira amanhã";
        return `${diffDays} dias restantes`;
    };

    const expirationText = getExpirationText();

    return (
        <>
            <tr className="group hover:bg-[rgb(var(--color-surface-elevated))] transition-colors duration-200">
                <td className="py-4 text-[rgb(var(--color-text-secondary))] pl-4">
                    @{user.profilePage?.username || '-'}
                    <div className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
                        {user.email}
                    </div>
                </td>
                <td className="py-4">
                    <div className="flex flex-col gap-1">
                        <span className={`
                            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border w-fit
                            ${getPlanBadgeStyles(user.planType)}
                        `}>
                            {getPlanIcon(user.planType)}
                            {user.planType}
                        </span>
                    </div>
                </td>
                <td className="py-4 text-[rgb(var(--color-text-secondary))] text-sm">
                    {expirationText || '-'}
                </td>
                <td className="py-4 text-[rgb(var(--color-text-secondary))] text-sm">
                    {user.role}
                </td>
                <td className="py-4 text-right pr-4">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowModal(true)}
                    >
                        <Settings className="w-4 h-4 mr-1" />
                        Gerenciar Plano
                    </Button>
                </td>
            </tr >

            {showModal && (
                <PlanManagerModal
                    user={user}
                    onClose={() => setShowModal(false)}
                />
            )
            }
        </>
    );
}
