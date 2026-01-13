"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
    id: string;
    type: "free" | "pro" | "diamond";
    title: string;
    desc: string;
    image: string;
    theme: {
        border: string;
        bg: string;
        shadow: string;
        glow: string;
        text: string;
    };
}

const ITEMS: CarouselItem[] = [
    {
        id: "free",
        type: "free",
        title: "Free",
        desc: "O essencial para organizar seus links!",
        image: "/home/iPhone Layers Home Panel/Telas/Free.png",
        theme: {
            border: "border-neutral-800",
            bg: "bg-neutral-900/50",
            shadow: "shadow-[0_0_50px_rgba(255,255,255,0.3)]", // Vibrant white/grey glow
            glow: "bg-white/10",
            text: "text-neutral-200"
        }
    },
    {
        id: "pro",
        type: "pro",
        title: "Pro",
        desc: "Design Premium e recursos exclusivos!",
        image: "/home/iPhone Layers Home Panel/Telas/Pro.png",
        theme: {
            border: "border-amber-500/50",
            bg: "bg-amber-900/10",
            shadow: "shadow-[0_0_50px_rgba(245,158,11,0.6)]", // Vibrant Amber glow
            glow: "bg-amber-500/20",
            text: "text-amber-100"
        }
    },
    {
        id: "diamond",
        type: "diamond",
        title: "Diamond",
        desc: "Presença marcante com destaque para a sua percepção de valor!!",
        image: "/home/iPhone Layers Home Panel/Telas/Diamond.png",
        theme: {
            border: "border-cyan-500/50", // Colored base to fill gap, matching Pro style
            bg: "bg-black/60",
            shadow: "shadow-[0_0_50px_rgba(6,182,212,0.6)]", // Vibrant Cyan glow
            glow: "bg-cyan-500/30",
            text: "text-cyan-100"
        }
    }
];

export function CylinderCarousel({ onIndexChange }: { onIndexChange?: (index: number) => void }) {
    const [activeIndex, setActiveIndex] = useState(1); // Start at Pro
    const rotation = useMotionValue(0);
    const smoothRotation = useSpring(rotation, { stiffness: 60, damping: 20, mass: 1 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Cylinder Config
    // For 3 items, wide spacing but safe for perspective
    // Cylinder Config
    // For 3 items, wide spacing but safe for perspective
    const FACE_ANGLE = 70;
    const RADIUS = 340; // Scaled down by ~30% from 480
    const COUNT = ITEMS.length;

    const rotateTo = (index: number) => {
        setActiveIndex(index);
        // Target: Center item "index" at angle 0.
        // Item Angle = (index - 1) * FACE_ANGLE.
        // To bring it to 0, Container Rotation must be -Item Angle.
        // wait, offsetIndex = index - 1 (because 1 is center).
        // Angle = (index - 1) * FACE_ANGLE.
        // If index=1 (Pro), Angle=0. Rot=0.
        // If index=2 (Diamond), Angle=75. Rot should be -75.
        // If index=0 (Free), Angle=-75. Rot should be +75.
        // So TargetRot = -1 * (index - 1) * FACE_ANGLE.
        const targetAngle = -1 * (index - 1) * FACE_ANGLE;
        rotation.set(targetAngle);
    };

    const next = () => {
        const newIndex = (activeIndex + 1) % COUNT;
        rotateTo(newIndex);
    };

    const prev = () => {
        const newIndex = (activeIndex - 1 + COUNT) % COUNT;
        rotateTo(newIndex);
    };

    // Initial Center
    useEffect(() => {
        rotation.set(0);
    }, []);

    // Notify parent of changes
    useEffect(() => {
        onIndexChange?.(activeIndex);
    }, [activeIndex, onIndexChange]);

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-visible perspective-[1200px]" ref={containerRef}>

            {/* 3D Scene Container */}
            <motion.div
                className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{
                    rotateY: smoothRotation,
                    transformStyle: "preserve-3d" // Critical for z-space sorting
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x > swipeThreshold) {
                        prev();
                    } else if (info.offset.x < -swipeThreshold) {
                        next();
                    }
                }}
            >
                {ITEMS.map((item, index) => {
                    const offsetIndex = index - 1;
                    const angle = offsetIndex * FACE_ANGLE;

                    return (
                        <CylinderCard
                            key={item.id}
                            item={item}
                            angle={angle}
                            radius={RADIUS}
                            containerRotation={smoothRotation}
                            isActive={activeIndex === index}
                        />
                    );
                })}
            </motion.div>

            {/* Navigation Arrows (Neon Style) */}
            <button
                onClick={prev} // Left Arrow goes Prev (Restored)
                className="absolute left-4 md:left-20 z-50 p-4 rounded-full text-white/80 hover:text-white hover:scale-110 transition-all duration-300 group"
                style={{
                    filter: "drop-shadow(0 0 10px rgba(236,72,153,0.8))",
                    animation: "arrow-pulse 2s infinite ease-in-out"
                }}
            >
                <ChevronLeft size={60} strokeWidth={3} />
            </button>
            <button
                onClick={next} // Right Arrow goes Next (Restored)
                className="absolute right-4 md:right-20 z-50 p-4 rounded-full text-white/80 hover:text-white hover:scale-110 transition-all duration-300 group"
                style={{
                    filter: "drop-shadow(0 0 10px rgba(236,72,153,0.8))",
                    animation: "arrow-pulse 2s infinite ease-in-out"
                }}
            >
                <ChevronRight size={60} strokeWidth={3} />
            </button>

        </div>
    );
}

function CylinderCard({
    item,
    angle,
    radius,
    containerRotation,
    isActive
}: {
    item: CarouselItem,
    angle: number,
    radius: number,
    containerRotation: any,
    isActive: boolean
}) {
    // Dynamic Billboarding:
    // We want the card to face the camera (Rot=0) at all times.
    // WorldRot = ContainerRot + Angle + LocalRot
    // 0 = ContainerRot + Angle + LocalRot
    // LocalRot = -(ContainerRot + Angle)

    // BUT pure billboarding might look weird (sliding 2D planes).
    // The user wants "side images when selected [?] must be turned to the screen".
    // AND "When I move to the side ... it looks like a 2D plane".
    // This implies they want the "Face Camera" behavior.

    // Dynamic Billboarding:
    // We want the card to face the camera (Rot=0) at all times.
    // LocalRot = -(ContainerRot + Angle)
    const transform = useTransform(containerRotation, (r: number) => {
        // Apply standard cylinder transform first, then the correction
        const currentAngle = r + angle;
        const billboardCorrection = -currentAngle;

        // Using a string template for clarity
        // 1. Rotate to position on circle
        // 2. Push out to radius
        // 3. Counter-rotate to face forward
        return `rotateY(${angle}deg) translateZ(${radius}px) rotateY(${billboardCorrection}deg)`;
    });

    return (
        <motion.div
            className={`absolute transform-style-3d transition-all duration-500`}
            style={{ transform, willChange: 'transform' }}
        >
            <div
                className={`
                    group relative flex flex-col items-center w-[160px] md:w-[190px] select-none
                    transition-all duration-500
                    ${isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-80 blur-[0.5px]'}
                `}
            >
                {/* Glow Behind */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[70%] blur-[80px] rounded-full pointer-events-none opacity-0 ${isActive ? 'opacity-100' : 'group-hover:opacity-60'} transition-opacity duration-500 ${item.theme.glow}`} />

                {/* Visual Wrapper (No Overflow Hidden) */}
                <div className="relative w-full aspect-[9/19]">

                    {/* PRO BORDER EFFECT (Matches Badge) */}
                    {item.id === 'pro' && (
                        <div className="absolute inset-[-4px] rounded-[2.8rem] z-0 pointer-events-none"
                            style={{
                                background: "linear-gradient(135deg, #ffd700 0%, #ffec8b 20%, #ffd700 40%, #daa520 60%, #ffd700 80%, #ffec8b 100%)",
                                backgroundSize: "200% 200%",
                                boxShadow: "0 0 25px rgba(255, 215, 0, 0.6)",
                                animation: "pro-badge-shimmer 3s ease-in-out infinite"
                            }}
                        />
                    )}

                    {/* DIAMOND BORDER EFFECT (Matches Badge) */}
                    {item.id === 'diamond' && (
                        <div className="absolute inset-[-4px] rounded-[2.8rem] z-0 pointer-events-none"
                            style={{
                                background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 20%, #22d3ee 40%, #0891b2 60%, #22d3ee 80%, #06b6d4 100%)",
                                backgroundSize: "200% 200%",
                                boxShadow: "0 0 25px rgba(14, 160, 192, 0.8)",
                                animation: "diamond-badge-shimmer 3s ease-in-out infinite"
                            }}
                        />
                    )}

                    <div className={`
                    relative w-full aspect-[9/19] rounded-[2.5rem] border-4 backdrop-blur-md overflow-hidden transition-all duration-500
                    ${item.theme.border} ${item.theme.bg}
                    ${isActive ? item.theme.shadow : ''}
                `}>
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover scale-110"
                            draggable={false}
                        />
                        {/* Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />


                    </div>
                </div>

                <div className="mt-8 text-center relative z-10">
                    {item.id === 'pro' && (
                        <span className="inline-block px-3 py-1 mb-3 rounded-full bg-gradient-to-br from-[#ffd700] via-[#ffec8b] to-[#daa520] text-black text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,215,0,0.4)]">Mais Popular</span>
                    )}
                    {item.id === 'diamond' && (
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] via-[#06b6d4] to-[#22d3ee] mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">Diamond</h3>
                    )}
                    {item.id !== 'diamond' && (
                        <h3 className={`text-2xl font-bold mb-2 ${item.theme.text}`}>{item.title}</h3>
                    )}

                    <p className={`text-sm max-w-[220px] mx-auto opacity-80 ${item.theme.text}`}>
                        {item.desc}
                    </p>
                </div>
            </div>
        </motion.div >
    );
}
