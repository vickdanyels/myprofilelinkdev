"use client";

import { useEffect, useRef } from "react";
import { trackProfileView } from "@/actions/analytics";

interface ProfileViewTrackerProps {
    profileId: string;
}

export function ProfileViewTracker({ profileId }: ProfileViewTrackerProps) {
    // strict ref to prevent double firing in React Strict Mode (dev only)
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!hasTracked.current) {
            hasTracked.current = true;
            trackProfileView(profileId);
        }
    }, [profileId]);

    return null;
}
