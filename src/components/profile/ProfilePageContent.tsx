"use client";

import { useEffect, useState, useMemo } from "react";
import {
    User,
    Instagram,
    Youtube,
    Globe,
    MessageCircle,
    Twitch,
    Music2,
    Zap,
} from "lucide-react";
import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";
import { LinkCarousel } from "@/components/profile/LinkCarousel";
import { ScrollIndicator } from "@/components/profile/ScrollIndicator";
import { Theme } from "@/lib/themes";

interface Link {
    id: string;
    title: string;
    url: string;
    icon: string | null;
}

interface ProfilePageContentProps {
    profile: {
        displayName: string;
        bio: string | null;
        avatarUrl: string | null;
        backgroundType: string | null;
        backgroundEnabled: boolean;
        buttonSize: string; // "micro", "small", "regular", "large"
        linksLayout?: string; // "list", "grid", "carousel"
        removeBranding?: boolean;
        displayPlanFrame?: boolean;
    };
    links: Link[];
    isPro: boolean;
    planType?: "FREE" | "PRO" | "DIAMOND";
    theme: Theme;
    themeStyles: React.CSSProperties;
    proAnimationClass: string;
    proGradientClass: string;
}

const ICONS: Record<string, typeof Instagram> = {
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Music2,
    twitch: Twitch,
    whatsapp: MessageCircle,
    website: Globe,
};

const SIZE_CLASSES = {
    micro: "h-10 px-5", // "Micro" (Fixed 40px Height + Standard Left Spacing)
    small: "py-3 px-5", // "Pequeno" (Compact)
    regular: "py-4 px-5", // "Médio" (Changed from px-6 to px-5 for consistency)
    large: "py-6 px-5", // "Grande" (Changed from px-8 to px-5 for consistency)
};

export function ProfilePageContent({
    profile,
    links,
    isPro,
    planType = "FREE",
    theme,
    themeStyles,
    proAnimationClass,
    proGradientClass,
}: ProfilePageContentProps) {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [startAnimation, setStartAnimation] = useState(false);

    // Frame Logic
    const showFrame = isPro && profile.displayPlanFrame;
    const frameClass = showFrame
        ? (planType === "DIAMOND" ? "avatar-frame-diamond" : "avatar-frame-pro")
        : "";

    useEffect(() => {
        setStartAnimation(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.scrollHeight - 20; // 20px tolerance
            setIsAtBottom(scrollPosition >= threshold);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    // Neon Glow Styles for "At Bottom" state
    const glowStyle = isAtBottom
        ? {
            borderColor: `rgb(${theme.colors.primary})`,
            boxShadow: `0 0 15px -2px rgb(${theme.colors.primary} / 0.6), inset 0 0 10px -5px rgb(${theme.colors.primary} / 0.2)`,
        }
        : {};

    // Memoize themeColors to prevent background reset on scroll (when isAtBottom changes)
    const themeColors = useMemo(() => ({
        primary: theme.colors.primary,
        accent: theme.colors.accent,
        background: theme.colors.background,
        textSecondary: theme.colors.textSecondary,
    }), [theme.colors.primary, theme.colors.accent, theme.colors.background, theme.colors.textSecondary]);

    // Calculate staggering delays for header elements
    const linksCount = links.length;
    const baseDelay = linksCount * 0.15 + 0.1; // Start shortly after top link

    // Determine button size class
    const buttonSize = (profile.buttonSize || "regular") as keyof typeof SIZE_CLASSES;
    const sizeClass = SIZE_CLASSES[buttonSize] || SIZE_CLASSES.regular;

    return (
        <div
            className={`min-h-screen flex flex-col relative overflow-x-hidden ${proAnimationClass} ${proGradientClass}`}
            style={{
                ...themeStyles,
                backgroundColor: `rgb(${theme.colors.background})`,
            }}
        >
            {/* Fixed Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <LiveBackgrounds
                    type={profile.backgroundType || "none"}
                    enabled={profile.backgroundEnabled ?? false}
                    themeColors={themeColors}
                />

                <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary))]/5 via-transparent to-[rgb(var(--color-accent))]/5" />
                <div
                    className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${proGradientClass ? 'animate-pulse-glow' : ''}`}
                    style={{
                        background: `radial-gradient(circle, rgb(${theme.colors.primary}) 0%, transparent 70%)`,
                        opacity: isPro && theme.hasGlow ? 0.15 : 0.08,
                    }}
                />
            </div>

            <ScrollIndicator color={theme.colors.primary} />

            {/* Hide scrollbar for this page */}
            <style jsx global>{`
                ::-webkit-scrollbar {
                    display: none;
                }
                * {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* Scrollable Content */}
            <div className="relative z-10 flex flex-col min-h-screen w-full max-w-md mx-auto">
                <main className="flex-1 flex flex-col justify-center pt-28 pb-0 px-4">
                    {/* Profile Header */}
                    <div id="profile-header" className="text-center mb-10 transition-all duration-700">
                        <div
                            className={`w-56 h-56 mx-auto mb-6 rounded-full flex items-center justify-center overflow-visible p-1 transition-all duration-700 animate-ripple-glow ${frameClass} ${isPro && theme.hasGlow ? 'animate-pulse-glow' : ''}`}
                            style={{
                                background: !frameClass ? `linear-gradient(135deg, rgb(${theme.colors.primary}) 0%, rgb(${theme.colors.accent}) 100%)` : undefined,
                                boxShadow: isPro && theme.hasGlow
                                    ? `0 0 ${theme.proEffects.glowIntensity * 0.5}px rgb(${theme.colors.primary} / 0.5)`
                                    : 'none',
                                animationDelay: `${baseDelay + 0.4}s`,
                                ...glowStyle
                            }}
                        >
                            <div
                                className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: `rgb(${theme.colors.background})` }}
                            >
                                {profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        alt={profile.displayName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-24 h-24" style={{ color: `rgb(${theme.colors.textSecondary})` }} />
                                )}
                            </div>
                        </div>

                        <h1
                            className="text-3xl font-bold mb-2 break-words transition-all duration-700 animate-zoom-pulse px-2"
                            style={{
                                color: (theme.id === 'minimalist' && profile.backgroundType === 'galaxy') ? '#ffffff' : `rgb(${theme.colors.primary})`,
                                textShadow: isAtBottom ? `0 0 10px rgb(${theme.colors.primary} / 0.4)` : 'none',
                                animationDelay: `${baseDelay + 0.2}s`
                            }}
                        >
                            {profile.displayName}
                        </h1>

                        {profile.bio && (
                            <p
                                className="mt-2 text-lg font-bold max-w-sm mx-auto px-4 leading-relaxed break-words whitespace-pre-wrap animate-zoom-pulse"
                                style={{
                                    color: (theme.id === 'minimalist' && profile.backgroundType === 'galaxy') ? '#ffffff' : `rgb(${theme.colors.text})`,
                                    textShadow: "0 2px 4px rgba(0,0,0,0.5)", // Added shadow for contrast
                                    animationDelay: `${baseDelay}s`
                                }}
                            >
                                {profile.bio}
                            </p>
                        )}
                    </div>

                    {/* Links */}
                    {/* Links */}
                    {profile.linksLayout === 'carousel' ? (
                        <div className="w-full relative z-10">
                            <LinkCarousel
                                links={links}
                                theme={theme}
                                isPro={isPro}
                                buttonSize={profile.buttonSize}
                                onLinkClick={(id) => { }} // Click handling logic
                            />
                        </div>
                    ) : (
                        <div className={`w-full pb-0 ${profile.linksLayout === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-6'}`}>
                            {links.map((link, index) => {
                                const IconComponent = link.icon ? ICONS[link.icon] : Globe;
                                // Increased border radius as requested
                                let linkRadius = theme.borderRadius === 'pill' ? '9999px' : theme.borderRadius === 'sharp' ? '12px' : '24px';

                                // For Grid, prevent full circles (pill) to maintain "rounded square" aesthetic
                                if (profile.linksLayout === 'grid' && theme.borderRadius === 'pill') {
                                    linkRadius = '32px';
                                }

                                const hoverScale = isPro ? theme.proEffects.linkHoverScale : 1.02;
                                const hoverShadow = isPro && theme.hasGlow
                                    ? `0 10px 40px -10px rgb(${theme.colors.primary} / 0.3)`
                                    : `0 10px 30px -10px rgb(${theme.colors.primary} / 0.15)`;

                                // Calculate reverse index (0 for last item, 1 for second to last...)
                                const reverseIndex = links.length - 1 - index;
                                const rippleDelay = `${reverseIndex * 0.15}s`;

                                const isMicro = buttonSize === 'micro';
                                const isGrid = profile.linksLayout === 'grid';

                                // Grid specific classes
                                const containerClasses = isGrid
                                    ? "aspect-square flex flex-col items-center justify-center text-center p-4 content-center"
                                    : `flex items-center justify-between ${sizeClass}`;

                                return (
                                    <a
                                        key={link.id}
                                        href={`/api/click/${link.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`profile-link group relative ${containerClasses} backdrop-blur-md border transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 ${isPro ? 'pro-link' : ''} ${startAnimation ? 'animate-ripple-glow' : ''}`}
                                        style={{
                                            backgroundColor: `rgb(${theme.colors.surface} / 0.8)`,
                                            // User Request: Pink border default for Barbie, Accent for Grid with Glow
                                            borderColor: isGrid
                                                ? `rgb(${theme.colors.accent})`
                                                : theme.id === 'barbie' ? `rgb(${theme.colors.primary})` : `rgb(${theme.colors.surface})`,
                                            // Add Glow for Grid
                                            boxShadow: isGrid
                                                ? `0 0 15px -2px rgb(${theme.colors.accent} / 0.5)`
                                                : 'none',
                                            borderRadius: linkRadius,
                                            '--link-hover-scale': hoverScale,
                                            '--link-hover-shadow': hoverShadow,
                                            '--link-hover-border': `rgb(${theme.colors.primary})`,
                                            // User Request: Light/Clear glow for Barbie (White) instead of Pink
                                            '--ripple-mid': theme.id === 'barbie' ? 'rgb(255 255 255 / 0.8)' : `rgb(${theme.colors.primary} / 0.6)`,
                                            '--ripple-start': theme.id === 'barbie' ? 'rgb(255 255 255 / 0)' : `rgb(${theme.colors.primary} / 0)`,
                                            '--ripple-end': theme.id === 'barbie' ? 'rgb(255 255 255 / 0)' : `rgb(${theme.colors.primary} / 0)`,
                                            animationDelay: startAnimation ? rippleDelay : '0s',
                                        } as any as React.CSSProperties}
                                    >
                                        {/* Text - Header for Grid */}
                                        {isGrid && (
                                            <span
                                                // Removed flex-1 to prevent taking up all space (pushes icon down)
                                                // Added mb-2 for spacing between text and icon
                                                className={`font-semibold px-2 ${isMicro ? 'text-sm' : 'text-lg'} w-full text-center line-clamp-2 whitespace-normal leading-tight mx-auto mb-2`}
                                                style={{ color: `rgb(${theme.colors.text})` }}
                                            >
                                                {link.title}
                                            </span>
                                        )}

                                        {/* Icon - Centered below text for Grid */}
                                        <div
                                            className={`shrink-0 rounded-xl transition-colors ${isMicro ? 'p-1' : 'p-2'} ${isGrid ? 'p-3' : ''}`}
                                            style={{
                                                background: `linear-gradient(135deg, rgb(${theme.colors.primary} / 0.2) 0%, rgb(${theme.colors.accent} / 0.2) 100%)`,
                                            }}
                                        >
                                            <IconComponent
                                                className={isMicro ? "w-4 h-4" : isGrid ? "w-10 h-10" : "w-6 h-6"}
                                                style={{ color: `rgb(${theme.colors.primary})` }}
                                            />
                                        </div>

                                        {/* Text - Standard for List */}
                                        {!isGrid && (
                                            <span
                                                className={`flex-1 font-semibold px-4 truncate ${isMicro ? 'text-sm' : 'text-lg'} text-center`}
                                                style={{ color: `rgb(${theme.colors.text})` }}
                                            >
                                                {link.title}
                                            </span>
                                        )}

                                        {/* Right Arrow - Hide in Grid */}
                                        {!isGrid && (
                                            <div className="shrink-0">
                                                <svg
                                                    className="w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300"
                                                    style={{ color: `rgb(${theme.colors.textSecondary})` }}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2.5}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </main>

                {/* Spacer to guarantee 40px distance from last item */}
                <div className="h-10 shrink-0" aria-hidden="true" />

                {/* Branding Footer */}
                {!(isPro && profile.removeBranding) && (
                    <footer className="relative flex justify-center pointer-events-none z-20">
                        <a
                            href="/"
                            className="pointer-events-auto inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full backdrop-blur-xl border transition-all duration-700 hover:scale-105 hover:bg-white/5 group shadow-lg"
                            style={{
                                backgroundColor: `rgb(${theme.colors.surface} / 0.6)`,
                                borderColor: `rgb(${theme.colors.primary} / 0.3)`,
                                boxShadow: `0 0 20px -5px rgb(${theme.colors.primary} / 0.3), inset 0 0 10px -5px rgb(${theme.colors.primary} / 0.1)`,
                                ...glowStyle
                            }}
                        >
                            <div
                                className={`w-5 h-5 rounded flex items-center justify-center shadow-inner`}
                                style={{
                                    background: `linear-gradient(135deg, rgb(${theme.colors.primary}), rgb(${theme.colors.accent}))`
                                }}
                            >
                                <Zap className="w-3 h-3 text-white fill-white" />
                            </div>
                            <span
                                className="text-sm font-medium tracking-wide"
                                style={{ color: `rgb(${theme.colors.text})` }}
                            >
                                Feito com <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]">MyProfile</span>
                            </span>
                        </a>
                    </footer>
                )}

                {/* Bottom Spacer to guarantee distance from bottom of page */}
                <div className="h-20 shrink-0" aria-hidden="true" />
            </div>
        </div>
    );
}
