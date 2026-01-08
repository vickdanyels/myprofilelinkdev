import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ linkId: string }> } // Correct type for Next.js 15+ App Router
) {
    const { linkId } = await context.params;

    if (!linkId) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        const link = await prisma.link.findUnique({
            where: { id: linkId },
            select: { id: true, url: true, title: true, isEnabled: true, profilePageId: true },
        });

        if (!link || !link.isEnabled) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Log the click asynchronously (don't await to speed up redirect)
        // We capture title and url as snapshots
        const headersList = request.headers;
        const userAgent = headersList.get("user-agent") || "unknown";
        const referer = headersList.get("referer") || "direct";
        const country = headersList.get("x-vercel-ip-country") || headersList.get("x-country") || null;

        await prisma.clickAnalytics.create({
            data: {
                linkId: link.id,
                profilePageId: link.profilePageId,
                linkTitle: link.title,
                linkUrl: link.url,
                userAgent,
                referer,
                country,
            },
        });

        return NextResponse.redirect(link.url);
    } catch (error) {
        console.error("Error tracking click:", error);
        // Fallback: try to find the link again just to redirect, or go home
        return NextResponse.redirect(new URL("/", request.url));
    }
}
