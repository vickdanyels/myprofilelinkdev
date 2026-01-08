import { getProfile } from "@/actions/profile";
import { redirect } from "next/navigation";
import { getThemeById, getDefaultTheme } from "@/lib/themes";
import { Card } from "@/components/ui";
import { ArrowLeft, Rocket, Construction, Sparkles, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
    const profile = await getProfile();

    if (!profile) {
        redirect("/login");
    }

    // Get current theme
    const currentTheme = profile.themeId
        ? getThemeById(profile.themeId) || getDefaultTheme()
        : getDefaultTheme();

    // Build theme CSS variables - applies selected theme to this page
    const isDefaultTheme = !profile.themeId || profile.themeId === "default";
    const themeStyles = isDefaultTheme ? {} : {
        '--color-primary': currentTheme.colors.primary,
        '--color-accent': currentTheme.colors.accent,
        '--color-background': currentTheme.colors.background,
        '--color-surface': currentTheme.colors.surface,
        '--color-surface-elevated': currentTheme.colors.surface, // Assuming mostly surface for glass
        '--color-text-primary': currentTheme.colors.text,
        '--color-text-secondary': currentTheme.colors.textSecondary,
    } as React.CSSProperties;

    return (
        <div
            className="max-w-4xl mx-auto min-h-[60vh] flex flex-col"
            style={themeStyles}
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <ArrowLeft className="w-6 h-6 text-[rgb(var(--color-text-secondary))]" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] flex items-center gap-2">
                        <SettingsIcon className="w-8 h-8 opacity-80" />
                        Configurações
                    </h1>
                    <p className="text-[rgb(var(--color-text-secondary))]">
                        Gerencie sua conta e preferências
                    </p>
                </div>
            </div>

            {/* Coming Soon Card */}
            <div className="flex-1 flex items-center justify-center p-8">
                <Card
                    padding="lg"
                    variant="glass"
                    className="w-full max-w-2xl relative overflow-hidden group hover:border-[rgb(var(--color-primary))]/30 transition-colors duration-500"
                >
                    {/* Background Decorative Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] opacity-5 group-hover:opacity-10 transition-opacity duration-700" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">

                        {/* Icon Container */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] blur-2xl opacity-20 animate-pulse" />
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center shadow-lg shadow-[rgb(var(--color-primary))]/30">
                                <Rocket className="w-10 h-10 text-white animate-bounce-slow" />
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <Sparkles className="w-6 h-6 text-[rgb(var(--color-accent))] animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-3 max-w-md">
                            <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                                Em Desenvolvimento
                            </h2>
                            <p className="text-lg text-[rgb(var(--color-text-secondary))] font-medium leading-relaxed">
                                Estamos preparando novos recursos incríveis para você personalizar ainda mais o seu perfil.
                            </p>
                            <p className="text-sm text-[rgb(var(--color-text-muted))]">
                                Em breve: Alteração de senha, gestão de e-mail e configurações avançadas de privacidade.
                            </p>
                        </div>

                        {/* Visual Progress Bar (Static aesthetics) */}
                        <div className="w-full max-w-sm h-1.5 bg-[rgb(var(--color-surface-elevated))] rounded-full overflow-hidden mt-4">
                            <div className="h-full w-2/3 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-full animate-pulse" />
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] mt-4">
                            <Construction className="w-4 h-4 text-[rgb(var(--color-text-muted))]" />
                            <span className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-widest">
                                Work in Progress
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
