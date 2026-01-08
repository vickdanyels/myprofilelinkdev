"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { setUserPlan, removeUserPlan, type PlanType } from "@/actions/admin";
import { Settings, Crown, Gem, User, Clock, Infinity, X } from "lucide-react";

interface PlanManagerModalProps {
    user: {
        id: string;
        name: string | null;
        email: string;
        planType: string;
        proExpiresAt: Date | null;
    };
    onClose: () => void;
}

export function PlanManagerModal({ user, onClose }: PlanManagerModalProps) {
    const [selectedPlan, setSelectedPlan] = useState<PlanType>(user.planType as PlanType);
    const [durationType, setDurationType] = useState<"days" | "months" | "years" | "lifetime">("months");
    const [durationValue, setDurationValue] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const plans: { type: PlanType; label: string; icon: typeof User }[] = [
        { type: "FREE", label: "Free", icon: User },
        { type: "PRO", label: "Pro", icon: Crown },
        { type: "DIAMOND", label: "Diamond", icon: Gem },
    ];

    const getPlanStyles = (type: PlanType, isSelected: boolean) => {
        if (!isSelected) return "border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-border)/0.8)] text-[rgb(var(--color-text-secondary))]";

        switch (type) {
            case "DIAMOND":
                return "border-[rgb(var(--color-accent))] bg-[rgb(var(--color-accent)/0.1)] text-[rgb(var(--color-accent))] shadow-lg shadow-[rgb(var(--color-accent)/0.2)]";
            case "PRO":
                return "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))] shadow-lg shadow-[rgb(var(--color-primary)/0.2)]";
            case "FREE":
            default:
                return "border-[rgb(var(--color-text-secondary))] bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-primary))]";
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            if (selectedPlan === "FREE") {
                await removeUserPlan(user.id);
            } else {
                await setUserPlan({
                    userId: user.id,
                    planType: selectedPlan,
                    duration: {
                        ...(durationType === "lifetime" ? { lifetime: true } : {}),
                        ...(durationType === "days" ? { days: durationValue } : {}),
                        ...(durationType === "months" ? { months: durationValue } : {}),
                        ...(durationType === "years" ? { years: durationValue } : {}),
                    },
                });
            }

            setMessage({ type: "success", text: `Plano atualizado para ${selectedPlan}!` });
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setMessage({ type: "error", text: "Erro ao atualizar plano" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-[rgb(var(--color-border))] bg-gradient-to-r from-[rgb(var(--color-primary))]/10 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-[rgb(var(--color-primary))]/10">
                                <Settings className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
                                    Gerenciar Plano
                                </h2>
                                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                                    {user.name || user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-[rgb(var(--color-surface-elevated))] transition-colors"
                        >
                            <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Plan Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                            Selecione o Plano
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {plans.map(({ type, label, icon: Icon }) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedPlan(type)}
                                    className={`
                                        p-4 rounded-xl border-2 transition-all duration-200
                                        flex flex-col items-center gap-2
                                        ${getPlanStyles(type, selectedPlan === type)}
                                    `}
                                >
                                    <Icon className="w-6 h-6" />
                                    <span className="font-medium">
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration Selection (only for PRO/DIAMOND) */}
                    {selectedPlan !== "FREE" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Duration Type */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                                    Tipo de duração
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { value: "days" as const, label: "Dias" },
                                        { value: "months" as const, label: "Meses" },
                                        { value: "years" as const, label: "Anos" },
                                        { value: "lifetime" as const, label: "Vitalício", icon: Infinity },
                                    ].map(({ value, label, icon: DIcon }) => (
                                        <button
                                            key={value}
                                            onClick={() => setDurationType(value)}
                                            className={`
                                                px-3 py-2 rounded-lg text-sm font-medium transition-all
                                                flex items-center justify-center gap-1
                                                ${durationType === value
                                                    ? "bg-[rgb(var(--color-primary))] text-white"
                                                    : "bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border))]"
                                                }
                                            `}
                                        >
                                            {DIcon && <DIcon className="w-3 h-3" />}
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration Value (not for lifetime) */}
                            {durationType !== "lifetime" && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                                        Quantidade de {
                                            durationType === "days" ? "dias" :
                                                durationType === "months" ? "meses" : "anos"
                                        }
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="1"
                                            max={durationType === "days" ? 365 : durationType === "months" ? 24 : 10}
                                            value={durationValue}
                                            onChange={(e) => setDurationValue(Number(e.target.value))}
                                            className="flex-1 h-2 rounded-full appearance-none bg-[rgb(var(--color-surface-elevated))] accent-[rgb(var(--color-primary))]"
                                        />
                                        <div className="flex items-center gap-2 min-w-[80px]">
                                            <input
                                                type="number"
                                                min="1"
                                                max={durationType === "days" ? 365 : durationType === "months" ? 24 : 10}
                                                value={durationValue}
                                                onChange={(e) => setDurationValue(Math.max(1, Number(e.target.value)))}
                                                className="w-16 px-3 py-2 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-center text-[rgb(var(--color-text-primary))]"
                                            />
                                            <Clock className="w-4 h-4 text-[rgb(var(--color-text-muted))]" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lifetime Warning */}
                            {durationType === "lifetime" && (
                                <div className="p-4 rounded-xl bg-[rgb(var(--color-accent))]/10 border border-[rgb(var(--color-accent))]/20">
                                    <div className="flex items-center gap-2 text-[rgb(var(--color-accent))]">
                                        <Infinity className="w-5 h-5" />
                                        <span className="font-medium">Acesso Vitalício</span>
                                    </div>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                                        O usuário terá acesso permanente ao plano {selectedPlan}.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Message */}
                    {message && (
                        <div className={`p-4 rounded-xl ${message.type === "success"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                            {message.text}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[rgb(var(--color-border))] flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
