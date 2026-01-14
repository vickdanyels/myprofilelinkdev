import { getProfile } from "@/actions/profile";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { ProfileEditor } from "@/components/dashboard/ProfileEditor";
import { LinkManager } from "@/components/dashboard/LinkManager";
import { ProfilePreview } from "@/components/dashboard/ProfilePreview";
import { ThemeSelector } from "@/components/dashboard/ThemeSelector";
import { BackgroundSelector } from "@/components/dashboard/BackgroundSelector";
import { LayoutSelector } from "@/components/dashboard/LayoutSelector";
import { PlanBadges } from "@/components/dashboard/PlanBadges";
import { getThemeById, getDefaultTheme, Theme } from "@/lib/themes";
import { ExternalLink, Eye, Link2, Sparkles, Palette, Lock } from "lucide-react";
import Link from "next/link";

// Theme Status Card showing current theme colors
function ThemeStatusCard({ theme, themeName, action }: { theme: Theme; themeName: string; action?: React.ReactNode }) {
    return (
        <div
            className="glass-panel p-4"
            style={{
                '--theme-primary': theme.colors.primary,
                '--theme-accent': theme.colors.accent,
            } as React.CSSProperties}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                        background: `linear-gradient(135deg, rgb(${theme.colors.primary}) 0%, rgb(${theme.colors.accent}) 100%)`,
                    }}
                >
                    <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                        Tema Ativo
                    </p>
                    <p className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                        {themeName}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex gap-1">
                        <div
                            className="w-6 h-6 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: `rgb(${theme.colors.primary})` }}
                            title="Cor Primária"
                        />
                        <div
                            className="w-6 h-6 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: `rgb(${theme.colors.accent})` }}
                            title="Cor de Acento"
                        />
                    </div>
                    {action}
                </div>
            </div>
        </div>
    );
}

// Define the expected profile structure for the dashboard
interface DashboardProfile {
    id: string;
    userId: string;
    username: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    links: Array<any>; // Using any for links to avoid deep type issues with Prisma payload
    themeId: string;
    backgroundType: string | null;
    backgroundEnabled: boolean;
    buttonSize: string;
    linksLayout: string;
    removeBranding: boolean;
    displayPlanFrame: boolean;
    isPro: boolean;
    planType: "FREE" | "PRO" | "DIAMOND";
    planExpiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export default async function DashboardPage() {
    const rawProfile = await getProfile();

    if (!rawProfile) {
        redirect("/login");
    }

    const profile = rawProfile as unknown as DashboardProfile;

    // Get current theme
    const currentTheme = profile.themeId
        ? getThemeById(profile.themeId) || getDefaultTheme()
        : getDefaultTheme();

    // Fetch Analytics Data
    const totalViews = await prisma.profilePageView.count({
        where: { profilePageId: profile.id }
    });

    const totalClicks = await prisma.clickAnalytics.count({
        where: { profilePageId: profile.id }
    });

    // Build theme CSS variables - applies selected theme to dashboard
    const isDefaultTheme = !profile.themeId || profile.themeId === "default";
    const themeStyles = isDefaultTheme ? {} : {
        '--color-primary': currentTheme.colors.primary,
        '--color-accent': currentTheme.colors.accent,
        '--color-background': currentTheme.colors.background,
        '--color-surface': currentTheme.colors.surface,
        '--color-surface-elevated': currentTheme.colors.surface,
        '--color-text-primary': currentTheme.colors.text,
        '--color-text-secondary': currentTheme.colors.textSecondary,
    } as React.CSSProperties;

    return (
        <div
            className="max-w-7xl mx-auto"
            style={themeStyles}
        >
            {/* Plan Badges - Top of page */}
            <div className="mb-6">
                <PlanBadges
                    currentPlan={profile.planType}
                    expiresAt={profile.planExpiresAt}
                />
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">
                    Dashboard
                </h1>
                <p className="text-[rgb(var(--color-text-secondary))] mt-1">
                    Gerencie sua página e seus links
                </p>
            </div>

            {/* Theme Status Card - Always visible now to show 'View Page' button */}
            <div className="mb-6">
                <ThemeStatusCard
                    theme={currentTheme}
                    themeName={currentTheme.name}
                    action={
                        <Link
                            href={`/${profile.username}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-surface-elevated))] hover:bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-primary))] rounded-xl transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Ver página
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    }
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                    icon={<Link2 className="w-5 h-5" />}
                    label="Links ativos"
                    value={profile.links.filter((l) => l.isEnabled).length.toString()}
                />
                <Link href="/dashboard/analytics">
                    <StatCard
                        icon={<Eye className="w-5 h-5" />}
                        label="Visualizações"
                        value={totalViews.toString()}
                        badge="PRO"
                        isBlurred={profile.planType === "FREE"}
                    />
                </Link>
                <Link href="/dashboard/analytics">
                    <StatCard
                        icon={<Sparkles className="w-5 h-5" />}
                        label="Cliques"
                        value={totalClicks.toString()}
                        badge="PRO"
                        isBlurred={profile.planType === "FREE"}
                    />
                </Link>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Column */}
                <div className="space-y-6">

                    <ProfileEditor
                        profile={profile}
                        isPro={profile.isPro}
                        planType={profile.planType || "FREE"}
                    />
                    <LinkManager links={profile.links} userPlan={profile.planType || "FREE"} buttonSize={profile.buttonSize || "regular"} />
                    <LayoutSelector
                        currentLayout={profile.linksLayout || "list"}
                        isPro={profile.isPro}
                        planType={profile.planType || "FREE"}
                    />
                    <ThemeSelector currentThemeId={profile.themeId} isPro={profile.isPro} />
                    <BackgroundSelector
                        currentBackground={profile.backgroundType || "none"}
                        backgroundEnabled={profile.backgroundEnabled || false}
                        isPro={profile.isPro}
                    />
                </div>

                {/* Preview Column */}
                <div className="lg:sticky lg:top-8 lg:h-fit">
                    <ProfilePreview profile={profile} />
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    badge,
    isBlurred,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    badge?: string;
    isBlurred?: boolean;
}) {
    return (
        <Card padding="md" variant="glass" className="relative">
            {badge && (
                <div className="absolute top-2 right-2 scale-75 origin-top-right">
                    <span className="pro-badge text-[10px] py-1 px-3">
                        {badge}
                    </span>
                </div>
            )}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        {label}
                    </p>
                    <div className="flex items-center gap-2">
                        <p className={`text-2xl font-bold text-[rgb(var(--color-text-primary))] ${isBlurred ? 'blur-sm select-none' : ''}`}>
                            {value}
                        </p>
                        {isBlurred && (
                            <Lock className="w-4 h-4 text-amber-400" />
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
