"use client";

import Image from "next/image";

export function CinematicHero() {
    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">

            {/* =========================================
          LAYER 0: BACKGROUNDS (Global)
          Absolute Inset-0, Object Cover to fill screen
      ========================================= */}
            <div className="absolute inset-0 z-0">
                {/* Phase 1 (0-2s) & 5 (8-10s): Purple Pink */}
                <div className="absolute inset-0 animate-cinematic-bg-phase-1 opacity-0">
                    <Image src="/images/hero-cinematic/bg-purplepink.png" alt="Background" fill className="object-cover opacity-90" priority />
                </div>

                {/* Phase 2 (2-4s): Particles */}
                <div className="absolute inset-0 animate-cinematic-bg opacity-0" style={{ animationDelay: "2000ms" }}>
                    <Image src="/images/hero-cinematic/bg-particles.png" alt="Background" fill className="object-cover opacity-90" />
                </div>

                {/* Phase 3 (4-6s): Hyperliquid */}
                <div className="absolute inset-0 animate-cinematic-bg opacity-0" style={{ animationDelay: "4000ms" }}>
                    <Image src="/images/hero-cinematic/bg-hyperliquid.png" alt="Background" fill className="object-cover opacity-90" />
                </div>

                {/* Phase 4 (6-8s): Matrix */}
                <div className="absolute inset-0 animate-cinematic-bg opacity-0" style={{ animationDelay: "6000ms" }}>
                    <Image src="/images/hero-cinematic/bg-matrix.png" alt="Background" fill className="object-cover opacity-90" />
                </div>

                {/* Phase 5 (8-10s): Re-entry / Loop transition */}
                <div className="absolute inset-0 animate-cinematic-bg opacity-0" style={{ animationDelay: "8000ms" }}>
                    <Image src="/images/hero-cinematic/bg-purplepink.png" alt="Background" fill className="object-cover opacity-90" />
                </div>

                {/* Overlay for depth */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            </div>

            {/* =========================================
          LAYER GROUP: FOREGROUND (Hand + Screens)
          Centered container, responsive aspect ratio
      ========================================= */}
            <div className="relative z-10 h-[85vh] md:h-[95vh] w-full flex items-center justify-center pointer-events-none perspective-[1000px]">

                {/* ANIMATED WRAPPER: Moves Hand & Screens together vertically */}
                <div className="absolute inset-0 z-10 animate-cinematic-hand origin-bottom font-[0]">

                    {/* LAYER 0.5: HAND SHADOW - From Asset */}
                    <div className="absolute inset-0 z-0 opacity-80 mix-blend-multiply">
                        <Image
                            src="/images/hero-cinematic/hand-shadow.png"
                            alt="Hand Shadow"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* LAYER 0.6: HAND GLASS - Absolute Inset-0, above Shadow, below Screens */}
                    <div className="absolute inset-0 z-[5] opacity-60">
                        <Image
                            src="/home/iPhone%20Layers%20Home%20Panel/Layer2/HandGlass.png"
                            alt="Hand Glass"
                            fill
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </div>

                    {/* LAYER 1: SCREENS (UI) - Absolute Inset-0 to container */}
                    <div className="absolute inset-0 z-10">
                        {/* Phase 2: Screen Free */}
                        <div className="absolute inset-0 animate-cinematic-screen opacity-0" style={{ animationDelay: "2000ms" }}>
                            <Image src="/images/hero-cinematic/ui-free.png" alt="UI Free Backing" fill className="object-contain" priority />
                            <Image src="/images/hero-cinematic/ui-free.png" alt="UI Free" fill className="object-contain" priority />
                        </div>
                        {/* Phase 3: Screen Pro */}
                        <div className="absolute inset-0 animate-cinematic-screen opacity-0" style={{ animationDelay: "4000ms" }}>
                            <Image src="/images/hero-cinematic/ui-pro.png" alt="UI Pro Backing" fill className="object-contain" priority />
                            <Image src="/images/hero-cinematic/ui-pro.png" alt="UI Pro" fill className="object-contain" priority />
                        </div>
                        {/* Phase 4: Screen Diamond */}
                        <div className="absolute inset-0 animate-cinematic-screen opacity-0" style={{ animationDelay: "6000ms" }}>
                            <Image src="/images/hero-cinematic/ui-diamond.png" alt="UI Diamond Backing" fill className="object-contain" priority />
                            <Image src="/images/hero-cinematic/ui-diamond.png" alt="UI Diamond" fill className="object-contain" priority />
                        </div>
                    </div>

                    {/* LAYER 1.5: SCREEN GLOW (Hyperliquid Theme) */}
                    <div
                        className="absolute inset-0 z-[15] mix-blend-plus-lighter opacity-100 pointer-events-none"
                        style={{
                            maskImage: `url("/home/iPhone%20Layers%20Home%20Panel/Layer2/HandGlass.png")`,
                            maskSize: "contain",
                            maskPosition: "center",
                            maskRepeat: "no-repeat",
                            WebkitMaskImage: `url("/home/iPhone%20Layers%20Home%20Panel/Layer2/HandGlass.png")`,
                            WebkitMaskSize: "contain",
                            WebkitMaskPosition: "center",
                            WebkitMaskRepeat: "no-repeat",
                        }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.7)_0%,rgba(236,72,153,0.5)_40%,transparent_80%)]" />
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(34,211,238,0.5)_180deg,transparent_360deg)] animate-spin-slow" />
                    </div>

                    {/* LAYER 2: HAND - Absolute Inset-0 to container */}
                    <div className="absolute inset-0 z-20">
                        <Image
                            src="/images/hero-cinematic/hand.png"
                            alt="Hand"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>

        </div >
    );
}
