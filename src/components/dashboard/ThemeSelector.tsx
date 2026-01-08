"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { THEMES, Theme } from "@/lib/themes";
import { updateTheme } from "@/actions/profile";
import { Check, Lock, Sparkles, Eye } from "lucide-react";

interface ThemeSelectorProps {
    currentThemeId: string;
    isPro: boolean;
}

export function ThemeSelector({ currentThemeId, isPro }: ThemeSelectorProps) {
    const [selectedTheme, setSelectedTheme] = useState<string>(currentThemeId);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSelectTheme(theme: Theme) {
        if (theme.isPremium && !isPro) {
            // Show upgrade prompt
            window.location.href = "/#pricing";
            return;
        }

        setIsLoading(true);
        setSelectedTheme(theme.id);
        await updateTheme(theme.id);
        setIsLoading(false);
    }

    return (
        <Card variant="glass" padding="lg">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                        Personalização
                    </h2>
                    <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                        Escolha o tema da sua página
                    </p>
                </div>
                {!isPro && (
                    <div className="scale-75 origin-right">
                        <span className="pro-badge text-[10px] py-1 px-3">PRO</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {THEMES.map((theme) => {
                    const isSelected = selectedTheme === theme.id;
                    const isLocked = theme.isPremium && !isPro;

                    return (
                        <button
                            key={theme.id}
                            onClick={() => !isLocked && handleSelectTheme(theme)}
                            disabled={isLoading}
                            className={`
                                relative p-6 rounded-xl border-2 transition-all duration-200 text-left
                                ${isSelected
                                    ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10"
                                    : "border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50"
                                }
                                ${isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                            `}
                        >
                            {/* Theme Preview */}
                            <div
                                className="w-full h-16 rounded-lg mb-4 relative overflow-hidden shadow-sm"
                                style={{
                                    background: `rgb(${theme.colors.background})`,
                                }}
                            >
                                {/* Mini preview elements */}
                                <div
                                    className="absolute top-2 left-2 right-2 h-3 rounded-full"
                                    style={{
                                        background: `linear-gradient(to right, rgb(${theme.colors.primary}), rgb(${theme.colors.accent}))`,
                                    }}
                                />
                                <div
                                    className="absolute top-7 left-2 right-2 h-2 rounded"
                                    style={{ background: `rgb(${theme.colors.surface})` }}
                                />
                                <div
                                    className="absolute top-11 left-2 w-3/4 h-2 rounded"
                                    style={{ background: `rgb(${theme.colors.surface})` }}
                                />

                                {/* Glow effect indicator */}
                                {theme.hasGlow && (
                                    <div
                                        className="absolute inset-0 opacity-30"
                                        style={{
                                            background: `radial-gradient(circle at 30% 30%, rgb(${theme.colors.primary}) 0%, transparent 50%)`,
                                        }}
                                    />
                                )}
                            </div>

                            {/* Theme info */}
                            <div className="flex items-center justify-between">
                                <div className="pr-8">
                                    <p className="font-medium text-[rgb(var(--color-text-primary))] text-sm mb-0.5">
                                        {theme.name}
                                    </p>
                                    <p className="text-xs text-[rgb(var(--color-text-muted))]">
                                        {theme.description}
                                    </p>
                                </div>
                            </div>

                            {/* Status indicators */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center shadow-lg transform scale-110">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}

                            {isLocked && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[rgb(var(--color-surface-elevated))] flex items-center justify-center border border-[rgb(var(--color-border))]">
                                    <Lock className="w-3 h-3 text-[rgb(var(--color-text-muted))]" />
                                </div>
                            )}

                            {/* Premium badge */}
                            {theme.isPremium && (
                                <div className="absolute bottom-4 right-4 scale-75 origin-bottom-right">
                                    <span className="pro-badge text-[10px] py-1 px-3">PRO</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Upgrade CTA for free users */}
            {!isPro && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-accent))]/10 border border-[rgb(var(--color-primary))]/30">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p className="font-medium text-[rgb(var(--color-text-primary))]">
                                Desbloqueie todos os temas
                            </p>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                                Personalize sua página com temas exclusivos
                            </p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => window.location.href = "/#pricing"}
                        >
                            <Sparkles className="w-4 h-4" />
                            Seja Pro
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
