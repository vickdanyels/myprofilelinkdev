import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UpgradePageClient } from "./UpgradePageClient";

export default async function UpgradePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch user's current plan
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { planType: true }
    });

    const userPlan = (user?.planType?.toUpperCase() || "FREE") as 'FREE' | 'PRO' | 'DIAMOND';

    return <UpgradePageClient userPlan={userPlan} />;
}
