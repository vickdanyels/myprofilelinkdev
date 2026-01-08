"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Middleware check for admin
async function checkAdmin() {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function getAdminStats() {
    await checkAdmin();

    const [
        totalUsers,
        freeUsers,
        proUsers,
        diamondUsers,
        totalLinks,
        totalProfileViews,
        totalLinkClicks,
        totalHomeViews,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { planType: "FREE" } }),
        prisma.user.count({ where: { planType: "PRO" } }),
        prisma.user.count({ where: { planType: "DIAMOND" } }),
        prisma.link.count(),
        // @ts-ignore - may need prisma generate
        prisma.profilePageView?.count() || Promise.resolve(0),
        prisma.clickAnalytics.count(),
        // @ts-ignore - may need prisma generate
        prisma.homePageView?.count() || Promise.resolve(0),
    ]);

    return {
        totalUsers,
        freeUsers,
        proUsers,
        diamondUsers,
        totalLinks,
        totalProfileViews: totalProfileViews || 0,
        totalLinkClicks,
        totalHomeViews,
    };

    return {
        totalUsers,
        freeUsers,
        proUsers,
        diamondUsers,
        totalLinks,
        totalProfileViews: totalProfileViews || 0,
        totalLinkClicks,
        totalHomeViews,
    };
}

export async function getUsers(query: string = "") {
    await checkAdmin();

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: query } },
                { name: { contains: query } },
            ]
        },
        orderBy: { createdAt: "desc" },
        include: {
            profilePage: {
                select: { username: true }
            }
        },
        take: 50,
    });

    return users;
}

export type PlanType = "FREE" | "PRO" | "DIAMOND";

export interface SetPlanParams {
    userId: string;
    planType: PlanType;
    duration: {
        days?: number;
        months?: number;
        years?: number;
        lifetime?: boolean;
    };
}

/**
 * Set a user's plan with duration
 * Duration can be days, months, years, or lifetime (null expiration)
 * Note: DIAMOND currently grants same access as PRO, only badge differs
 */
export async function setUserPlan({ userId, planType, duration }: SetPlanParams) {
    await checkAdmin();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const now = new Date();
    let proExpiresAt: Date | null = null;

    // Calculate expiration date (except for FREE or lifetime)
    if (planType !== "FREE" && !duration.lifetime) {
        const expirationDate = new Date(now);

        if (duration.days) {
            expirationDate.setDate(expirationDate.getDate() + duration.days);
        }
        if (duration.months) {
            expirationDate.setMonth(expirationDate.getMonth() + duration.months);
        }
        if (duration.years) {
            expirationDate.setFullYear(expirationDate.getFullYear() + duration.years);
        }

        proExpiresAt = expirationDate;
    }
    // If lifetime, proExpiresAt stays null (never expires)

    await prisma.user.update({
        where: { id: userId },
        data: {
            planType,
            proExpiresAt,
        },
    });

    revalidatePath("/admin");
    return {
        success: true,
        planType,
        expiresAt: proExpiresAt?.toISOString() || null,
    };
}

/**
 * Quick action to remove a user's plan (set to FREE)
 */
export async function removeUserPlan(userId: string) {
    return setUserPlan({
        userId,
        planType: "FREE",
        duration: {}
    });
}

