"use client";

import Link from "next/link";
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
    const [bannerHeight, setBannerHeight] = useState<number>(80);

    useEffect(() => {
        const updateBanner = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setBannerHeight(80);
            } else if (width >= 768) {
                setBannerHeight(70);
            } else {
                setBannerHeight(60);
            }
        };

        updateBanner();
        window.addEventListener("resize", updateBanner);
        return () => window.removeEventListener("resize", updateBanner);
    }, []);

    const bannerContent = (
        <div
            className="w-full bg-black/5 backdrop-blur-md border-b border-white/5 flex items-center justify-center overflow-hidden relative"
            style={{ height: `${bannerHeight}px` }}
        >
            {/* Hyperliquid Glow Effect - matching home header */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[60%] h-[200px] bg-cyan-500/15 blur-[100px] rounded-full" />
                <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[40%] h-[200px] bg-amber-500/10 blur-[80px] rounded-full" />
            </div>

            {/* "Comprar dias:" buttons */}
            <div className="relative w-full h-full flex items-center justify-center gap-4 md:gap-6 px-4">
                <span className="text-sm text-gray-400 font-medium hidden sm:block">Comprar dias:</span>

                {/* PRO Badge Button */}
                <Link
                    href="/dashboard/upgrade?plan=pro"
                    className="pro-badge px-4 py-2 rounded-full font-bold text-sm text-black flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                >
                    <span className="text-base drop-shadow-md">👑</span>
                    <span className="tracking-wider">PRO</span>
                </Link>

                {/* DIAMOND Badge Button */}
                <Link
                    href="/dashboard/upgrade?plan=diamond"
                    className="diamond-badge px-4 py-2 rounded-full font-bold text-sm text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(103,254,253,0.5)]"
                >
                    <span className="text-base drop-shadow-md">💎</span>
                    <span className="tracking-wider">DIAMOND</span>
                </Link>
            </div>
        </div>
    );

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
