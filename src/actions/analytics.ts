"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Tracks a visit to the home page
 */
export async function trackHomeVisit() {
    try {
        const headersList = await headers();
        const userAgent = headersList.get("user-agent") || null;
        const referrer = headersList.get("referer") || null;

        await prisma.homePageView.create({
            data: {
                userAgent,
                referrer,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to track home visit:", error);
        return { success: false };
    }
}

/**
 * Tracks a visit to a profile page
 */
export async function trackProfileView(profileId: string) {
    try {
        const headersList = await headers();
        const userAgent = headersList.get("user-agent") || null;
        const referer = headersList.get("referer") || null;

        await prisma.profilePageView.create({
            data: {
                profilePageId: profileId,
                userAgent,
                referer,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to track profile view:", error);
        return { success: false };
    }
}
