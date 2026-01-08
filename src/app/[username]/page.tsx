import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getThemeById, getDefaultTheme, Theme } from "@/lib/themes";
import { ProfilePageContent } from "@/components/profile/ProfilePageContent";
import { ProfileViewTracker } from "@/components/profile/ProfileViewTracker";

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;

    const profile = await prisma.profilePage.findUnique({
        where: { username },
        select: { displayName: true, bio: true },
    });

    if (!profile) {
        return {
            title: "Página não encontrada | MyProfile",
        };
    }

    return {
        title: `${profile.displayName} | MyProfile`,
        description: profile.bio || `Confira os links de ${profile.displayName}`,
        openGraph: {
            title: profile.displayName,
            description: profile.bio || `Confira os links de ${profile.displayName}`,
            type: "profile",
        },
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;

    const profile: any = await prisma.profilePage.findUnique({
        where: { username },
        include: {
            links: {
                where: { isEnabled: true },
                orderBy: { order: "asc" },
            },
            user: {
                // @ts-ignore
                select: { planType: true }, // proExpiresAt temporarily removed
            },
        },
    });

    if (!profile || !profile.published) {
        notFound();
    }

    // Check Pro status with expiration
    const now = new Date();
    // @ts-ignore
    const planType = profile.user.planType?.toUpperCase();
    // @ts-ignore
    const isPro = planType === "PRO" || planType === "DIAMOND";
    // @ts-ignore
    // && (!profile.user.proExpiresAt || new Date(profile.user.proExpiresAt) > now); // Temporarily disabled

    // Limit links for Free users
    const visibleLinks = isPro ? profile.links : profile.links.slice(0, 3);

    // Get theme
    const theme = profile.themeId
        ? getThemeById(profile.themeId) || getDefaultTheme()
        : getDefaultTheme();

    // Build CSS variables for theme
    const themeStyles = {
        '--color-primary': theme.colors.primary,
        '--color-accent': theme.colors.accent,
        '--color-background': theme.colors.background,
        '--color-surface': theme.colors.surface,
        '--color-text-primary': theme.colors.text,
        '--color-text-secondary': theme.colors.textSecondary,
        // Pro-enhanced effects
        '--glow-intensity': isPro && theme.hasGlow ? `${theme.proEffects.glowIntensity}%` : '0%',
        '--brightness-multiplier': isPro ? theme.proEffects.brightnessMultiplier : 1,
        '--link-hover-scale': isPro ? theme.proEffects.linkHoverScale : 1.02,
    } as React.CSSProperties;

    // Pro animation classes
    const proAnimationClass = isPro && theme.proEffects.animationsEnabled
        ? 'pro-animations-enabled'
        : '';
    const proGradientClass = isPro && theme.proEffects.gradientAnimated
        ? 'pro-gradient-animated'
        : '';

    return (
        <>
            <ProfileViewTracker profileId={profile.id} />
            <ProfilePageContent
                profile={profile}
                links={visibleLinks}
                isPro={isPro}
                planType={planType as "FREE" | "PRO" | "DIAMOND"}
                theme={theme}
                themeStyles={themeStyles}
                proAnimationClass={proAnimationClass}
                proGradientClass={proGradientClass}
            />
        </>
    );
}
