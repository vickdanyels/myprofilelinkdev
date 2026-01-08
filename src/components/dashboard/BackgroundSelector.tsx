"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { updateBackground } from "@/actions/profile";
import { Sparkles, Lock, Play, Pause, Waves, Stars, Grid3X3, Zap, Bitcoin, Gem, Eye, Scissors, PawPrint, Frown, MessageCircle, Utensils } from "lucide-react";

interface BackgroundSelectorProps {
    currentBackground: string;
    backgroundEnabled: boolean;
    isPro: boolean;
}

// Background type definitions
const BACKGROUND_TYPES = [
    {
        id: "none",
        name: "Nenhum",
        description: "Sem animação de fundo",
        icon: Grid3X3,
        isPremium: false,
        isImplemented: true,
    },
    {
        id: "particles",
        name: "Partículas",
        description: "Partículas flutuantes interativas",
        icon: Stars,
        isPremium: true,
        isImplemented: true,
    },
    {
        id: "wave",
        name: "Ondas",
        description: "Ondas animadas gradientes",
        icon: Waves,
        isPremium: true,
        isImplemented: true,
    },
    {
        id: "gradient",
        name: "Gradiente Animado",
        description: "Cores fluindo suavemente",
        icon: Sparkles,
        isPremium: true,
        isImplemented: true,
    },
    {
        id: "matrix",
        name: "Matrix",
        description: "Chuva de código estilo Matrix",
        icon: Zap,
        isPremium: true,
        isImplemented: true,
    },
    {
        id: "hyperliquid",
        name: "Hyperliquid",
        description: "Logo neon e background animado oficial",
        icon: Zap,
        isPremium: true,
        isImplemented: true,
    },
    {
        id: "glamour",
        name: "Glamour",
        description: "Brilhos fofos e cintilantes",
        icon: Gem,
        isPremium: true,
        isImplemented: true,
    },
    {
        id: "lashes",
        name: "Cílios",
        description: "Estilo beauty para lash designers",
        icon: Eye,
        isPremium: true,
        isImplemented: true,
    },
    {
        id: "cryptobubbles",
        name: "Aurora Ethereal",
        description: "Gradientes orgânicos e premium",
        icon: Zap,
        isPremium: true,
        isImplemented: true,
    },
    {
        id: "galaxy",
        name: "Galáxia 3D",
        description: "Universo em rotação diagonal",
        icon: Sparkles,
        isPremium: true,
        isImplemented: true,
    },
    {
        id: "sobrancelhas",
        name: "Sobrancelhas",
        description: "Estilo beauty para designer de sobrancelhas",
        icon: Frown,
        isPremium: true,
        isImplemented: false,
    },
    {
        id: "cabelos",
        name: "Cabelos",
        description: "Tesouras e pentes para cabeleireiros",
        icon: Scissors,
        isPremium: true,
        isImplemented: false,
    },
    {
        id: "petshop",
        name: "Pet Shop",
        description: "Patinhas fofas para pet shops",
        icon: PawPrint,
        isPremium: true,
        isImplemented: false,
    },
    {
        id: "fastfood",
        name: "Fast Food",
        description: "Elementos deliciosos de lanche",
        icon: Utensils,
        isPremium: true,
        isImplemented: false,
    },
];

export function BackgroundSelector({
    currentBackground,
    backgroundEnabled,
    isPro
}: BackgroundSelectorProps) {
    const [selected, setSelected] = useState(currentBackground || "none");
    const [enabled, setEnabled] = useState(backgroundEnabled);
    const [isLoading, setIsLoading] = useState(false);

    async function handleUpdate(type: string, isEnabled: boolean) {
        if (type !== "none" && !isPro) return;

        setIsLoading(true);
        setSelected(type);
        setEnabled(isEnabled);

        await updateBackground(type, isEnabled);
        setIsLoading(false);
    }

    const toggleEnabled = async () => {
        await handleUpdate(selected, !enabled);
    };

    const selectType = async (type: string) => {
        // Auto-enable when selecting a type if it was disabled
        const newEnabled = type === "none" ? false : true;
        await handleUpdate(type, newEnabled);
    };

    return (
        <Card padding="lg" variant="glass">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary))]/20 to-[rgb(var(--color-accent))]/20">
                        <Sparkles className="w-5 h-5 text-[rgb(var(--color-primary))]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
                            Live Backgrounds
                        </h3>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                            Animações de fundo para sua página
                        </p>
                    </div>
                </div>

                {isPro && selected !== "none" && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleEnabled}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                    >
                        {enabled ? (
                            <>
                                <Pause className="w-4 h-4" />
                                Pausar
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Ativar
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Background Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BACKGROUND_TYPES.map((bg) => {
                    const IconComponent = bg.icon;
                    const isLocked = bg.isPremium && !isPro;
                    const isSelected = selected === bg.id;
                    const isComingSoon = !bg.isImplemented && bg.id !== "none";

                    return (
                        <button
                            key={bg.id}
                            onClick={() => !isLocked && bg.isImplemented && selectType(bg.id)}
                            disabled={isLocked || isComingSoon || isLoading}
                            className={`
                                relative p-6 rounded-xl border transition-all duration-200 text-left
                                ${isSelected
                                    ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10'
                                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/50'
                                }
                                ${isLocked || isComingSoon
                                    ? 'opacity-60 cursor-not-allowed'
                                    : 'hover:border-[rgb(var(--color-primary))]/50 cursor-pointer'
                                }
                            `}
                        >
                            {/* Lock or Coming Soon Badge */}
                            {isLocked && (
                                <div className="absolute top-3 right-3">
                                    <Lock className="w-3 h-3 text-[rgb(var(--color-text-muted))]" />
                                </div>
                            )}
                            {isComingSoon && !isLocked && (
                                <div className="absolute top-3 right-3">
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgb(var(--color-accent))]/20 text-[rgb(var(--color-accent))]">
                                        Em breve
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-3 pr-6">
                                <div className={`
                                    p-2 rounded-lg
                                    ${isSelected
                                        ? 'bg-[rgb(var(--color-primary))]/20'
                                        : 'bg-[rgb(var(--color-surface-elevated))]'
                                    }
                                `}>
                                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text-secondary))]'}`} />
                                </div>
                                <span className={`font-medium text-sm ${isSelected ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text-primary))]'}`}>
                                    {bg.name}
                                </span>
                            </div>
                            <p className="text-xs text-[rgb(var(--color-text-muted))] line-clamp-2">
                                {bg.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Pro Upsell */}
            {!isPro && (
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-accent))]/10 border border-[rgb(var(--color-primary))]/20">
                    <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                        <span className="text-[rgb(var(--color-text-secondary))]">
                            <span className="font-semibold text-[rgb(var(--color-primary))]">Seja Pro</span> para desbloquear todos os live backgrounds
                        </span>
                    </div>
                </div>
            )}

            {/* Info Note */}
            <div className="mt-24 -mx-8 -mb-8 pt-6 pb-8 text-center bg-[rgb(var(--color-surface))]/30 border-t border-[rgb(var(--color-border))]/50">
                <p className="text-xs text-[rgb(var(--color-text-muted))] flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 text-[rgb(var(--color-accent))]" />
                    Novos backgrounds serão adicionados em breve!
                </p>
            </div>
        </Card>
    );
}
