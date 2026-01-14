"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";

const THEME_CYAN = { primary: "148 249 227", accent: "21 181 164", background: "0 0 0" }; // Hyperliquid Mint
const THEME_GRAY = { primary: "229 231 235", accent: "156 163 175", background: "0 0 0" }; // Silver/Slate
const THEME_GOLD = { primary: "251 191 36", accent: "234 179 8", background: "0 0 0" };   // Amber/Yellow
const THEME_DIAMOND = { primary: "34 211 238", accent: "6 182 212", background: "0 0 0" }; // Cyan Electric

export function CinematicHero() {
    // Cycle is 10 seconds total (2s per phase):
    // 0: Cyan (Base)
    // 1: Gray
    // 2: Gold
    // 3: Diamond
    // 4: Cyan (Base revealed)
    const [phase, setPhase] = useState(0);

    // Determine active theme based on phase
    const activeTheme = useMemo(() => {
        switch (phase) {
            case 0: return THEME_CYAN;
            case 1: return THEME_GRAY;
            case 2: return THEME_GOLD;
            case 3: return THEME_DIAMOND;
            case 4: return THEME_CYAN;
            default: return THEME_CYAN;
        }
    }, [phase]);

    // Determine active speed multiplier based on phase
    // 1st Stage (Cyan): Normal (1.0)
    // 2nd Stage (Gray): +200% (3.0)
    // 3rd Stage (Gold): +200% (5.0)
    // 4th Stage (Diamond): +250% (7.5)
    // 5th Stage (Loop): Normal (1.0)
    const activeSpeed = useMemo(() => {
        switch (phase) {
            case 0: return 1.0;
            case 1: return 3.0; // Aggressive start
            case 2: return 5.0; // Rapid acceleration
            case 3: return 7.5; // Hyperspace
            case 4: return 1.0;
            default: return 1.0;
        }
    }, [phase]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => (p + 1) % 5);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">

            {/* BACKGROUNDS LAYER - SINGLE OPTIMIZED CANVAS */}
            <div className="absolute inset-0 z-0">
                {/* Single WarpSpeed instance that transitions colors internally */}
                <div className="absolute inset-0 opacity-100">
                    <LiveBackgrounds type="warp-speed" enabled={true} themeColors={activeTheme} speedMultiplier={activeSpeed} starCount={200} className="absolute inset-0 z-0 pointer-events-none" />
                </div>
            </div>

            {/* FOREGROUND (Unchanged) */}
            <div className="relative z-10 h-[85vh] md:h-[95vh] w-full flex items-center justify-center pointer-events-none perspective-[1000px] scale-[2.2] md:scale-100">

                <div className="absolute inset-0 z-10 animate-cinematic-hand origin-bottom font-[0] gpu-accelerated">

                    <div className="absolute inset-0 z-0 opacity-80 mix-blend-multiply">
                        <Image src="/images/hero-cinematic/hand-shadow.png" alt="Hand Shadow" fill className="object-contain" priority />
                    </div>

                    <div className="absolute inset-0 z-[5] opacity-60">
                        <Image src="/home/iPhone%20Layers%20Home%20Panel/Layer2/HandGlass.png" alt="Hand Glass" fill className="object-contain" priority unoptimized />
                    </div>

                    <div className="absolute inset-0 z-10">
                        {/* UI Transitions - Synced with Phases roughly */}
                        {/* 0-2 (Base): Free UI? */}
                        {/* 2-4 (Gray): Free UI */}
                        {/* 4-6 (Gold): Pro UI */}
                        {/* 6-8 (Diamond): Diamond UI */}

                        <div className={`absolute inset-0 transition-opacity duration-1000 ${phase <= 1 || phase === 4 ? 'opacity-100' : 'opacity-0'}`}>
                            <Image src="/images/hero-cinematic/ui-free.png" alt="UI Free" fill className="object-contain z-10" priority />
                        </div>
                        <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 2 ? 'opacity-100' : 'opacity-0'}`}>
                            <Image src="/images/hero-cinematic/ui-pro.png" alt="UI Pro" fill className="object-contain z-10" priority />
                        </div>
                        <div className={`absolute inset-0 transition-opacity duration-1000 ${phase === 3 ? 'opacity-100' : 'opacity-0'}`}>
                            <Image src="/images/hero-cinematic/ui-diamond.png" alt="UI Diamond" fill className="object-contain z-10" priority />
                        </div>
                    </div>

                    <div
                        className="absolute inset-0 z-[15] mix-blend-plus-lighter opacity-100 pointer-events-none filter drop-shadow-[0_0_20px_rgba(148,249,227,0.4)]"
                        style={{ maskImage: `url("/home/iPhone%20Layers%20Home%20Panel/Layer2/HandGlass.png")`, maskSize: "contain", maskPosition: "center", maskRepeat: "no-repeat", WebkitMaskImage: `url("/home/iPhone%20Layers%20Home%20Panel/Layer2/HandGlass.png")`, WebkitMaskSize: "contain", WebkitMaskPosition: "center", WebkitMaskRepeat: "no-repeat" }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(148,249,227,0.7)_0%,rgba(21,181,164,0.5)_40%,transparent_80%)]" />
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(148,249,227,0.5)_180deg,transparent_360deg)] animate-spin-slow" />
                    </div>

                    <div className="absolute inset-0 z-20">
                        <Image src="/images/hero-cinematic/hand.png" alt="Hand" fill className="object-contain" priority />
                    </div>
                </div>
            </div>
        </div >
    );
}
