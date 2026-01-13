"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function PhoneMockup() {
    const [activeScreen, setActiveScreen] = useState(0);
    const screens = [
        "/images/mockups/screen_list.png",
        "/images/mockups/screen_grid.png",
        "/images/mockups/screen_carousel.png"
    ];

    // Loop through screens every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveScreen((prev) => (prev + 1) % screens.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex items-center justify-center gap-[-40px] lg:gap-[-60px] scale-[0.8] sm:scale-100 lg:translate-x-12">

            {/* PHONE 1: FRONT VIEW (Left) */}
            <div className="relative z-20 w-[280px] h-[580px] sm:w-[320px] sm:h-[650px] bg-black rounded-[45px] border-[8px] border-zinc-900 shadow-2xl transition-transform hover:scale-105 duration-500 hover:z-30 overflow-hidden">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-[12px] left-0 right-0 mx-auto w-[100px] h-[28px] bg-black rounded-full z-40 pointer-events-none" />

                {/* Screen Slideshow */}
                <div className="relative w-full h-full bg-zinc-900">
                    {screens.map((src, index) => (
                        <div
                            key={src}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeScreen ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <Image
                                src={src}
                                alt={`Screen ${index}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                    ))}

                    {/* Screen Glare Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-30" />
                </div>
            </div>

            {/* PHONE 2: BACK VIEW (Right) - Overlapping */}
            <div className="relative z-10 -ml-24 lg:-ml-32 w-[280px] h-[580px] sm:w-[320px] sm:h-[650px] transition-transform hover:scale-105 duration-500 hover:z-30">
                <Image
                    src="/images/mockups/iphone_back.png"
                    alt="iPhone 17 Pro Max Back"
                    fill
                    className="object-contain drop-shadow-2xl"
                />
            </div>

        </div>
    );
}
