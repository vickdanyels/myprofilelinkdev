"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Import styles
import "@/app/globals.css"; // Ensure globals are available if needed (though usually global)

import { Theme } from "@/lib/themes";
import { User, Instagram, Youtube, Globe, MessageCircle, Twitch, Music2, Zap } from "lucide-react";

interface Link {
    id: string;
    title: string;
    url: string;
    icon: string | null;
}

interface LinkCarouselProps {
    links: Link[];
    theme: Theme;
    isPro: boolean;
    buttonSize: string;
    onLinkClick: (id: string) => void;
}

const ICONS: Record<string, typeof Instagram> = {
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Music2,
    twitch: Twitch,
    whatsapp: MessageCircle,
    website: Globe,
};

export function LinkCarousel({ links, theme, isPro, buttonSize, onLinkClick }: LinkCarouselProps) {
    // Ensure we have enough items for a smooth infinite loop
    // Reduced to 12 for performance optimization while maintaining symmetry
    const MIN_ITEMS_FOR_LOOP = 12;
    let displayLinks = [...links];

    // If we have some links but fewer than MIN, keep appending the original list
    if (links.length > 0 && links.length < MIN_ITEMS_FOR_LOOP) {
        while (displayLinks.length < MIN_ITEMS_FOR_LOOP) {
            displayLinks = [...displayLinks, ...links];
        }
    }

    return (
        <div className="w-full py-8 relative">
            {/* Scroll Hint Indicator */}
            <div className="absolute top-0 left-0 w-full flex justify-center items-center gap-8 mb-2 z-20 pointer-events-none fade-in-out">
                {/* Left Arrow Group - Wave Outwards (Right to Left) */}
                <div className="flex gap-1 text-[rgb(var(--color-primary))]">
                    <span className="text-lg font-light animate-swipe-left" style={{ animationDelay: '0.8s' }}>❮</span>
                    <span className="text-lg font-light animate-swipe-left" style={{ animationDelay: '0.6s' }}>❮</span>
                    <span className="text-lg font-light animate-swipe-left" style={{ animationDelay: '0.4s' }}>❮</span>
                    <span className="text-lg font-light animate-swipe-left" style={{ animationDelay: '0.2s' }}>❮</span>
                    <span className="text-lg font-light animate-swipe-left" style={{ animationDelay: '0s' }}>❮</span>
                </div>
                {/* Right Arrow Group - Wave Outwards (Left to Right) */}
                <div className="flex gap-1 text-[rgb(var(--color-primary))]">
                    <span className="text-lg font-light animate-swipe-right" style={{ animationDelay: '0s' }}>❯</span>
                    <span className="text-lg font-light animate-swipe-right" style={{ animationDelay: '0.2s' }}>❯</span>
                    <span className="text-lg font-light animate-swipe-right" style={{ animationDelay: '0.4s' }}>❯</span>
                    <span className="text-lg font-light animate-swipe-right" style={{ animationDelay: '0.6s' }}>❯</span>
                    <span className="text-lg font-light animate-swipe-right" style={{ animationDelay: '0.8s' }}>❯</span>
                </div>
            </div>

            <Swiper
                watchSlidesProgress={true}
                onProgress={(swiper) => {
                    for (let i = 0; i < swiper.slides.length; i++) {
                        const slide = swiper.slides[i];
                        // @ts-ignore - Swiper adds progress property
                        const progress = slide.progress;

                        // Progressive blur: 0px for center, 5px per step away
                        const absProgress = Math.abs(progress);
                        const blurAmount = absProgress * 5;

                        // Calculate Opacity based on distance (Piecewise Linear Interpolation)
                        let opacity = 1;
                        if (absProgress > 5) {
                            opacity = 0;
                        } else if (absProgress > 4) {
                            // 4->5 : 0.2 -> 0.0
                            opacity = 0.2 - (absProgress - 4) * 0.2;
                        } else if (absProgress > 3) {
                            // 3->4 : 0.5 -> 0.2
                            opacity = 0.5 - (absProgress - 3) * 0.3;
                        } else if (absProgress > 2) {
                            // 2->3 : 0.75 -> 0.5
                            opacity = 0.75 - (absProgress - 2) * 0.25;
                        } else if (absProgress > 1) {
                            // 1->2 : 0.9 -> 0.75
                            opacity = 0.9 - (absProgress - 1) * 0.15;
                        } else {
                            // 0->1 : 1.0 -> 0.9
                            opacity = 1 - absProgress * 0.1;
                        }

                        // Apply styles directly for performance
                        slide.style.filter = `blur(${blurAmount}px)`;
                        slide.style.opacity = `${opacity}`;
                    }
                }}
                onBeforeInit={(swiper) => {
                    // Force loopedSlides parameter before initialization to ensure symmetry
                    // This bypasses the React prop issue while correctly configuring Swiper core
                    Object.assign(swiper.params, {
                        loopedSlides: 8,
                        loopAdditionalSlides: 4
                    });
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                initialSlide={0}
                loop={true}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: "auto",
                        coverflowEffect: {
                            depth: 200,
                            modifier: 3,
                        }
                    },
                    1024: {
                        slidesPerView: "auto",
                        coverflowEffect: {
                            depth: 300,
                            modifier: 2,
                        }
                    }
                }}
                modules={[EffectCoverflow, Pagination]}
                className="w-full !overflow-visible py-10"
            >
                {displayLinks.map((link, index) => {
                    const IconComponent = link.icon ? ICONS[link.icon] : Globe;
                    // Create a unique key combination since IDs will be repeated
                    const uniqueKey = `${link.id}-${index}`;

                    return (
                        <SwiperSlide
                            key={uniqueKey}
                            className="!w-[280px] !h-[400px] lg:!w-[320px] lg:!h-[450px]"
                        >
                            <a
                                href={`/api/click/${link.id}`}
                                onClick={(e) => { }}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                                    w-full h-full flex flex-col items-center justify-center p-6 text-center
                                    rounded-[32px] border relative transition-all duration-300
                                    group bg-opacity-80
                                `}
                                style={{
                                    backgroundColor: `rgb(${theme.colors.surface})`,
                                    borderColor: `rgb(${theme.colors.accent})`,
                                }}
                            >
                                {/* Strong Background Glow for Active Slide */}
                                <div className="absolute inset-0 -z-10 rounded-[32px] opacity-0 transition-opacity duration-500 swiper-slide-active-glow"
                                    style={{
                                        boxShadow: `0 0 80px -10px rgb(${theme.colors.primary})`,
                                        background: `radial-gradient(circle at center, rgb(${theme.colors.primary} / 0.4) 0%, transparent 70%)`
                                    }}
                                ></div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                                    {/* Text Top */}
                                    <span
                                        className="font-bold text-xl mb-4 line-clamp-2 leading-tight w-full"
                                        style={{ color: `rgb(${theme.colors.text})` }}
                                    >
                                        {link.title}
                                    </span>

                                    {/* Icon Bottom/Center */}
                                    <div
                                        className="p-5 rounded-2xl"
                                        style={{
                                            background: `linear-gradient(135deg, rgb(${theme.colors.primary} / 0.2) 0%, rgb(${theme.colors.accent} / 0.2) 100%)`,
                                        }}
                                    >
                                        <IconComponent
                                            className="w-12 h-12"
                                            style={{ color: `rgb(${theme.colors.primary})` }}
                                        />
                                    </div>
                                </div>
                            </a>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}
