"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui";
import { updateLinksLayout } from "@/actions/profile";
import { useRouter } from "next/navigation";
import { Lock, Sparkles, LayoutList, LayoutGrid, GalleryHorizontal } from "lucide-react";

interface LayoutSelectorProps {
    currentLayout: string;
    isPro: boolean;
    planType?: "FREE" | "PRO" | "DIAMOND";
}

export function LayoutSelector({ currentLayout, isPro, planType = "FREE" }: LayoutSelectorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLayout, setSelectedLayout] = useState(currentLayout);
    const router = useRouter();

    // Sync state with props on server re-render
    useEffect(() => {
        setSelectedLayout(currentLayout);
    }, [currentLayout]);

    // Helper to check access
    const hasAccess = (requiredPlan: "FREE" | "PRO" | "DIAMOND") => {
        const levels = { FREE: 0, PRO: 1, DIAMOND: 2 };
        // Normalize input planType to handle potential case issues, though types enforce it
        const currentLevel = levels[planType as keyof typeof levels] || 0;
        const requiredLevel = levels[requiredPlan];
        return currentLevel >= requiredLevel;
    };

    const handleLayoutChange = async (layout: string, requiredPlan: "FREE" | "PRO" | "DIAMOND") => {
        if (layout === selectedLayout) return;

        // Check access
        if (!hasAccess(requiredPlan)) {
            router.push("/#pricing");
            return;
        }

        // Optimistic update
        setSelectedLayout(layout);
        setIsLoading(true);

        try {
            const result = await updateLinksLayout(layout);
            if (result?.error) {
                alert(result.error);
                setSelectedLayout(currentLayout); // Revert on error
            } else {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar layout");
            setSelectedLayout(currentLayout);
        } finally {
            setIsLoading(false);
        }
    };

    const layouts = [
        {
            id: "list",
            label: "Lista",
            icon: LayoutList,
            description: "Padrão",
            planRequired: "FREE" as const,
            preview: (
                <div className="w-full h-full relative">
                    <img
                        src="/previews/layout-list.png"
                        alt="Preview Lista"
                        className="w-full h-full object-cover object-top rounded-lg"
                    />
                </div>
            )
        },
        {
            id: "grid",
            label: "Grade",
            icon: LayoutGrid,
            description: "Pro",
            planRequired: "PRO" as const,
            preview: (
                <div className="w-full h-full relative">
                    <img
                        src="/previews/layout-grid.png"
                        alt="Preview Grade"
                        className="w-full h-full object-cover object-top rounded-lg"
                    />
                </div>
            )
        },
        {
            id: "carousel",
            label: "Carrossel",
            icon: GalleryHorizontal,
            description: "Diamond",
            planRequired: "DIAMOND" as const,
            preview: (
                <div className="w-full h-full relative">
                    <img
                        src="/previews/layout-carousel.png"
                        alt="Preview Carrossel"
                        className="w-full h-full object-cover object-center rounded-lg"
                    />
                </div>
            )
        }
    ];

    return (
        <Card variant="glass" padding="lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                        Layout dos Links
                    </h2>
                    <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                        Escolha como seus links são exibidos
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {layouts.map((layout) => {
                    const isSelected = selectedLayout === layout.id;
                    const canAccess = hasAccess(layout.planRequired);

                    return (
                        <button
                            key={layout.id}
                            type="button"
                            onClick={() => handleLayoutChange(layout.id, layout.planRequired)}
                            disabled={isLoading}
                            className={`group relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 w-full hover:scale-[1.02] active:scale-[0.98] ${isSelected
                                ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 shadow-[0_0_15px_-5px_rgb(var(--color-primary)/0.3)]"
                                : "border-transparent bg-[rgb(var(--color-surface-elevated))] hover:border-[rgb(var(--color-primary))]/30"
                                }`}
                        >
                            {/* Plan Badge */}
                            {!canAccess && (
                                <div className="absolute top-1.5 right-1.5 z-20">
                                    <Lock className="w-3 h-3 text-[rgb(var(--color-text-muted))]" />
                                </div>
                            )}

                            {/* Selection Indicator */}
                            <div className={`absolute top-1.5 left-1.5 w-3 h-3 rounded-full border-2 flex items-center justify-center transition-colors z-20 ${isSelected
                                ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]"
                                : "border-[rgb(var(--color-border))] bg-white/50 dark:bg-black/50"
                                }`}>
                                {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                            </div>

                            {/* Access Verification - Plan Badge */}
                            {layout.planRequired === "PRO" && (
                                <div className="absolute top-1 right-1 scale-[0.6] origin-top-right z-20">
                                    <span className="pro-badge text-[8px] py-0.5 px-2">PRO</span>
                                </div>
                            )}

                            {layout.planRequired === "DIAMOND" && (
                                <div className="absolute top-1 right-1 scale-[0.6] origin-top-right z-20">
                                    <span className="diamond-badge text-[8px] py-0.5 px-2">DIAMOND</span>
                                </div>
                            )}

                            {/* Preview Image */}
                            <div className="w-full aspect-square rounded-lg overflow-hidden border border-[rgb(var(--color-border))] group-hover:border-[rgb(var(--color-primary))]/30 transition-colors bg-[rgb(var(--color-background))]">
                                {layout.preview}
                            </div>

                            {/* Label */}
                            <span className={`text-xs font-semibold transition-colors ${isSelected ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-primary))]"
                                }`}>
                                {layout.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
}
