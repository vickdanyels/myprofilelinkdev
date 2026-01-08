"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/**
 * Responsive Banner Component
 * 
 * BANNER DIMENSIONS (exact sizes for perfect fit):
 * 
 * Desktop (≥1024px):
 *   - Width: 1920px (or larger, will be centered/cropped)
 *   - Height: 80px
 *   - Recommended: 1920x80px
 * 
 * Tablet (768px - 1023px):
 *   - Width: 1024px
 *   - Height: 70px
 *   - Recommended: 1024x70px
 * 
 * Smartphone (<768px):
 *   - Width: 768px
 *   - Height: 60px
 *   - Recommended: 768x60px
 */

interface BannerHeaderProps {
    desktopBanner?: string;  // Path to desktop banner image (1920x80)
    tabletBanner?: string;   // Path to tablet banner image (1024x70)
    mobileBanner?: string;   // Path to mobile banner image (768x60)
    link?: string;           // Optional link when banner is clicked
    alt?: string;            // Alt text for accessibility
}

export function BannerHeader({
    desktopBanner = "/banners/desktop-banner.png",
    tabletBanner = "/banners/tablet-banner.png",
    mobileBanner = "/banners/mobile-banner.png",
    link,
    alt = "Banner promocional"
}: BannerHeaderProps) {
    const [currentBanner, setCurrentBanner] = useState<string>(desktopBanner);
    const [bannerHeight, setBannerHeight] = useState<number>(80);

    useEffect(() => {
        const updateBanner = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setCurrentBanner(desktopBanner);
                setBannerHeight(80);
            } else if (width >= 768) {
                setCurrentBanner(tabletBanner);
                setBannerHeight(70);
            } else {
                setCurrentBanner(mobileBanner);
                setBannerHeight(60);
            }
        };

        updateBanner();
        window.addEventListener("resize", updateBanner);
        return () => window.removeEventListener("resize", updateBanner);
    }, [desktopBanner, tabletBanner, mobileBanner]);

    const bannerContent = (
        <div
            className="w-full bg-gradient-to-r from-[rgb(var(--color-primary))]/20 via-[rgb(var(--color-surface))] to-[rgb(var(--color-accent))]/20 border-b border-[rgb(var(--color-border))] flex items-center justify-center overflow-hidden"
            style={{ height: `${bannerHeight}px` }}
        >
            {/* Placeholder when no banner image is set */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Show gradient placeholder by default */}
                <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-primary))]/10 via-transparent to-[rgb(var(--color-accent))]/10" />

                {/* Banner text placeholder - remove when adding real banner */}
                <span className="relative text-sm text-[rgb(var(--color-text-muted))] font-medium tracking-wide">
                    BANNER • {bannerHeight === 80 ? 'DESKTOP 1920×80' : bannerHeight === 70 ? 'TABLET 1024×70' : 'MOBILE 768×60'}
                </span>
            </div>
        </div>
    );

    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block">
                {bannerContent}
            </a>
        );
    }

    return bannerContent;
}

/**
 * Static heights for CSS usage
 */
export const BANNER_HEIGHTS = {
    desktop: 80,  // px - for screens ≥1024px
    tablet: 70,   // px - for screens 768px-1023px
    mobile: 60,   // px - for screens <768px
} as const;

/**
 * Recommended banner dimensions
 */
export const BANNER_DIMENSIONS = {
    desktop: { width: 1920, height: 80 },
    tablet: { width: 1024, height: 70 },
    mobile: { width: 768, height: 60 },
} as const;
