"use client";

import { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
    color: string;
}

export function ScrollIndicator({ color }: ScrollIndicatorProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);

    // Refs to manage timers and cycle state without triggering re-renders
    const cycleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkOverflow = () => {
            const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
            // Check if user is already near bottom (within 50px)
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;

            const shouldShow = isScrollable && !atBottom;

            // Only update state if changed to prevent unnecessary effect triggers
            setHasOverflow((prev) => {
                if (prev !== shouldShow) return shouldShow;
                return prev;
            });
        };

        // Initial check
        checkOverflow();

        window.addEventListener('resize', checkOverflow);
        window.addEventListener('scroll', checkOverflow);

        return () => {
            window.removeEventListener('resize', checkOverflow);
            window.removeEventListener('scroll', checkOverflow);
        };
    }, []);

    useEffect(() => {
        // If no overflow content, ensure hidden and stop logic
        if (!hasOverflow) {
            setIsVisible(false);
            if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
            return;
        }

        // Cycle logic: Wait 5s -> Show -> Wait 2s -> Hide -> Loop (Wait 5s...)

        const startCycle = () => {
            // Clear any existing timers
            if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);

            // 1. Wait 5s idle
            cycleTimeoutRef.current = setTimeout(() => {
                setIsVisible(true);

                // 2. Hide after 2s
                hideTimeoutRef.current = setTimeout(() => {
                    setIsVisible(false);

                    // 3. Restart cycle (Wait 5s again)
                    // We call startCycle directly to loop
                    startCycle();
                }, 2000);

            }, 5000);
        };

        // Start the cycle initially
        startCycle();

        // Reset cycle on user interaction
        const resetCycle = () => {
            setIsVisible(false);
            startCycle();
        };

        // Listen for interactions to reset "Idle" timer
        window.addEventListener('scroll', resetCycle);
        window.addEventListener('touchstart', resetCycle);
        window.addEventListener('mousemove', resetCycle);
        window.addEventListener('click', resetCycle);

        return () => {
            // Cleanup
            if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);

            window.removeEventListener('scroll', resetCycle);
            window.removeEventListener('touchstart', resetCycle);
            window.removeEventListener('mousemove', resetCycle);
            window.removeEventListener('click', resetCycle);
        };
    }, [hasOverflow]);

    // Construct RGBA for shadow layers to create neon effect
    // We assume 'color' is r,g,b format like "255, 0, 0" or hex.
    // The previous code passes theme.colors.primary which is "R G B" or "R, G, B" typically in this project based on globals.css?
    // Let's check how the color is passed. It's normally "R G B" space separated or comma.
    // CSS variables are often "R G B".
    // We can use `rgb(${color})` directly.

    const neonStyle = {
        color: `rgb(${color})`,
        filter: `drop-shadow(0 0 2px rgb(${color})) drop-shadow(0 0 8px rgb(${color})) drop-shadow(0 0 15px rgb(${color}))`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
    };

    return (
        <div
            className="fixed bottom-12 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-1000 ease-in-out"
            style={neonStyle}
        >
            <div className="animate-bounce">
                <ChevronDown className="w-10 h-10" strokeWidth={2.5} />
            </div>
        </div>
    );
}
