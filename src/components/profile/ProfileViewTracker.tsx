"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackProfileView } from "@/actions/analytics";

interface ProfileViewTrackerProps {
    profileId: string;
}

export function ProfileViewTracker({ profileId }: ProfileViewTrackerProps) {
    // strict ref to prevent double firing in React Strict Mode (dev only)
    const hasTracked = useRef(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        // Skip tracking if in preview mode (dashboard iframe)
        const isPreview = searchParams.get("preview") === "true";

        if (!hasTracked.current && !isPreview) {
            hasTracked.current = true;
            trackProfileView(profileId);
        }
    }, [profileId, searchParams]);

    return null;
}
