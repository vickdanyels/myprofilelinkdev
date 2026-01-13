"use client";

import { useState, useEffect, ReactNode } from "react";

interface DashboardContentProps {
    children: ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
    const [marginTop, setMarginTop] = useState<number>(80);

    useEffect(() => {
        const updateMargin = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setMarginTop(100); // Desktop (80 + 20)
            } else if (width >= 768) {
                setMarginTop(90); // Tablet (70 + 20)
            } else {
                setMarginTop(80); // Mobile (60 + 20)
            }
        };

        updateMargin();
        window.addEventListener("resize", updateMargin);
        return () => window.removeEventListener("resize", updateMargin);
    }, []);

    return (
        <div style={{ marginTop: `${marginTop}px` }}>
            {children}
        </div>
    );
}
