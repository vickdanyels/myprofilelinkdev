"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";
import Image from "next/image";
import { CylinderCarousel } from "./CylinderCarousel";

const THEMES = [
    // Free: Gray (Vibrant Accent)
    { primary: "156 163 175", accent: "229 231 235", background: "0 0 0" }, // Lighter accent
    // Pro: Gold/Amber (Vibrant)
    { primary: "234 179 8", accent: "252 211 77", background: "0 0 0" }, // Gold primary, Yellow accent
    // Diamond: Cyan Glow (Vibrant)
    { primary: "6 182 212", accent: "103 232 249", background: "0 0 0" } // Cyan primary, Light Blue accent
];

const TEXT_COLORS = [
    { color: "#97FCE4", glow: "0 0 30px rgba(151,252,228,0.6)" }, // Free: Hyperliquid Mint
    { color: "#FFD700", glow: "0 0 30px rgba(255,215,0,0.6)" },   // Pro: Gold
    { color: "#22D3EE", glow: "0 0 30px rgba(34,211,238,0.6)" }   // Diamond: Cyan
];

const LiquidPulse = ({ color, index }: { color: string; index: number }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    className="absolute w-[600px] h-[600px] rounded-full blur-[60px] opacity-0"
                    style={{
                        background: `radial-gradient(circle, rgb(${color}) 0%, transparent 70%)`
                    }}
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{
                        scale: [0.5, 1.5],
                        opacity: [0, 0.8, 0], // Fade In then Out instantly
                        borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "50% 50% 50% 50% / 50% 50% 50% 50%"] // Organic morph
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 1.2,
                        ease: "easeOut",
                        times: [0, 0.4, 1] // Peak opacity early then fade
                    }}
                >
                    {/* Inner Core for "Water" Highlight */}
                    <div className="absolute inset-[20%] rounded-full border-[2px] border-white/30 blur-md" />
                </motion.div>

                {/* Secondary Ripple Ring */}
                <motion.div
                    key={`ring-${index}`}
                    className="absolute w-[800px] h-[800px] rounded-full border-[1px] opacity-0"
                    style={{ borderColor: `rgb(${color})` }}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{
                        scale: 2,
                        opacity: [0, 0.4, 0]
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </AnimatePresence>
        </div>
    );
};

export function SecondaryHero() {
    const [themeIndex, setThemeIndex] = useState(1); // Start at Pro (1)

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black perspective-[1000px] py-20">

            {/* Background Layer */}
            <div className="absolute inset-0 z-0 transition-colors duration-1000">
                <LiveBackgrounds type="wave" enabled={true} themeColors={THEMES[themeIndex]} />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center h-full justify-center">

                {/* TEXT SECTION */}
                <div className="mb-12 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                        O Futuro é <motion.span
                            className="inline-block ml-3"
                            animate={{
                                color: TEXT_COLORS[themeIndex].color,
                                textShadow: TEXT_COLORS[themeIndex].glow
                            }}
                            transition={{ duration: 0.8 }}
                        >
                            ILIMITADO
                        </motion.span>.
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light text-center">
                        Apresente-se de forma profissional e única!<br />
                        Você só tem uma chance de causar uma boa primeira impressão ... <br />
                        Certifique-se de que isso vai acontecer!
                    </p>
                </div>

                <div className="w-full flex justify-center py-10 relative" style={{ marginTop: "50px" }}>

                    {/* Dynamic Liquid Pulse */}
                    <LiquidPulse color={THEMES[themeIndex].primary} index={themeIndex} />

                    <CylinderCarousel onIndexChange={setThemeIndex} />
                </div>

            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />


        </section>
    );
}
