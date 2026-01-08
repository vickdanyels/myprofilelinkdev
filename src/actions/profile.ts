"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { profileSchema, linkSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// Get current user's profile
export async function getProfile() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { planType: true, proExpiresAt: true, planStartedAt: true },
    });

    const profile = await prisma.profilePage.findUnique({
        where: { userId: session.user.id },
        include: {
            links: {
                where: { deletedAt: null },
                orderBy: { order: "asc" },
            },
        },
    });

    if (!profile) return null;

    const now = new Date();
    // Check if plan is active AND not expired
    const planType = (user?.planType?.toUpperCase() || "FREE") as "FREE" | "PRO" | "DIAMOND";
    const isProOrDiamond = (planType === "PRO" || planType === "DIAMOND") &&
        (!user?.proExpiresAt || user.proExpiresAt > now);

    // Enforce logic: If not PRO/DIAMOND, override premium settings
    if (!isProOrDiamond) {
        return {
            ...profile,
            isPro: false,
            planType: "FREE" as const,
            planExpiresAt: null,
            themeId: "default",
            backgroundType: "none",
            backgroundEnabled: false,
        };
    }

    return {
        ...profile,
        isPro: true,
        planType,
        planExpiresAt: user?.proExpiresAt || null,
    };
}

// Update profile
export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    console.log("UPDATE PROFILE DATA:", Object.fromEntries(formData));

    const rawData = {
        displayName: formData.get("displayName") as string,
        bio: formData.get("bio") as string,
        avatarUrl: formData.get("avatarUrl") as string,
        buttonSize: formData.get("buttonSize") as string || "regular",
        removeBranding: formData.get("removeBranding") === "true",
        displayPlanFrame: formData.get("displayPlanFrame") === "true",
    };

    const validated = profileSchema.safeParse(rawData);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    const updatedProfile = await prisma.profilePage.update({
        where: { userId: session.user.id },
        data: validated.data,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${updatedProfile.username}`);
    return { success: true };
}

// Add new link
export async function addLink(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    const profile = await prisma.profilePage.findUnique({
        where: { userId: session.user.id },
        include: {
            links: true,
            // @ts-ignore
            user: { select: { planType: true, proExpiresAt: true } },
        },
    });

    if (!profile) {
        return { error: "Perfil não encontrado" };
    }

    // Check link limit for FREE users (max 3 links)
    const FREE_LINK_LIMIT = 3;
    // @ts-ignore
    const planType = profile.user.planType?.toUpperCase();
    // @ts-ignore
    const isPro = (planType === "PRO" || planType === "DIAMOND") && (!profile.user.proExpiresAt || profile.user.proExpiresAt > new Date());
    if (!isPro && profile.links.length >= FREE_LINK_LIMIT) {
        return { error: "Limite de links atingido. Atualize para o plano Pro para adicionar mais links!" };
    }

    const rawData = {
        title: formData.get("title") as string,
        url: formData.get("url") as string,
        icon: formData.get("icon") as string,
        isEnabled: true,
    };

    const validated = linkSchema.safeParse(rawData);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    // Get max order
    const maxOrder = await prisma.link.findFirst({
        where: { profilePageId: profile.id, deletedAt: null },
        orderBy: { order: "desc" },
        select: { order: true },
    });

    await prisma.link.create({
        data: {
            ...validated.data,
            profilePageId: profile.id,
            order: (maxOrder?.order ?? 0) + 1,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${profile.username}`);
    return { success: true };
}

// Update link
export async function updateLink(linkId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    const rawData = {
        title: formData.get("title") as string,
        url: formData.get("url") as string,
        icon: formData.get("icon") as string,
        isEnabled: formData.get("isEnabled") === "true",
    };

    const validated = linkSchema.safeParse(rawData);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    await prisma.link.update({
        where: { id: linkId },
        data: validated.data,
    });

    revalidatePath("/dashboard");
    return { success: true };
}

// Delete link
export async function deleteLink(linkId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    await prisma.link.update({
        where: { id: linkId },
        data: {
            deletedAt: new Date(),
            isEnabled: false
        }
    });

    revalidatePath("/dashboard");
    return { success: true };
}

// Toggle link enabled/disabled
export async function toggleLink(linkId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    const link = await prisma.link.findUnique({
        where: { id: linkId },
    });

    if (!link) {
        return { error: "Link não encontrado" };
    }

    await prisma.link.update({
        where: { id: linkId },
        data: { isEnabled: !link.isEnabled },
    });

    revalidatePath("/dashboard");
    return { success: true };
}

// Reorder links
export async function reorderLinks(orderedIds: string[]) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    // Update each link's order
    await Promise.all(
        orderedIds.map((id, index) =>
            prisma.link.update({
                where: { id },
                data: { order: index },
            })
        )
    );

    revalidatePath("/dashboard");
    return { success: true };
}

// Update user's theme
export async function updateTheme(themeId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    // Validate theme exists
    // Validate theme exists
    const validThemes = ["default", "influencer", "creator", "streamer", "minimalist", "sunset", "hyperliquid", "barbie"];
    if (!validThemes.includes(themeId)) {
        return { error: "Tema inválido" };
    }

    // Check if user can use premium themes
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        // @ts-ignore
        select: { planType: true, proExpiresAt: true },
    });

    const premiumThemes = ["influencer", "creator", "streamer", "minimalist", "sunset", "hyperliquid", "barbie"];
    // @ts-ignore
    const planType = user?.planType?.toUpperCase();
    // @ts-ignore
    const isPro = (planType === "PRO" || planType === "DIAMOND") && (!user.proExpiresAt || user.proExpiresAt > new Date());
    if (premiumThemes.includes(themeId) && !isPro) {
        return { error: "Tema disponível apenas para usuários Pro" };
    }

    const updatedProfile = await prisma.profilePage.update({
        where: { userId: session.user.id },
        data: { themeId },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${updatedProfile.username}`);
    return { success: true };
}

// Update background settings
export async function updateBackground(type: string, enabled: boolean) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    const validTypes = ["none", "particles", "wave", "gradient", "matrix", "blockchain", "glamour", "lashes", "sobrancelhas", "cabelos", "petshop", "hyperliquid", "cryptobubbles", "galaxy"];
    if (!validTypes.includes(type)) {
        return { error: "Tipo de background inválido" };
    }

    // Check Pro status
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        // @ts-ignore
        select: { planType: true, proExpiresAt: true },
    });

    // @ts-ignore
    const planType = user?.planType?.toUpperCase();
    // @ts-ignore
    const isPro = (planType === "PRO" || planType === "DIAMOND") && (!user.proExpiresAt || user.proExpiresAt > new Date());
    if (type !== "none" && !isPro) {
        return { error: "Backgrounds live disponíveis apenas para usuários Pro" };
    }

    const updatedProfile = await prisma.profilePage.update({
        where: { userId: session.user.id },
        data: {
            backgroundType: type,
            backgroundEnabled: enabled,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${updatedProfile.username}`);
    return { success: true };
}

// Update button size
export async function updateButtonSize(buttonSize: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    const validSizes = ["micro", "small", "regular", "large"];
    if (!validSizes.includes(buttonSize)) {
        return { error: "Tamanho inválido" };
    }

    const updatedProfile = await prisma.profilePage.update({
        where: { userId: session.user.id },
        data: { buttonSize },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${updatedProfile.username}`);
    return { success: true };
}

// Update links layout
export async function updateLinksLayout(layout: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Não autorizado" };
    }

    const validLayouts = ["list", "grid", "carousel"];
    if (!validLayouts.includes(layout)) {
        return { error: "Layout inválido" };
    }

    // Check Pro status for Grid and Carousel
    if (layout !== "list") {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            // @ts-ignore
            select: { planType: true, proExpiresAt: true },
        });

        // @ts-ignore
        const planType = user?.planType?.toUpperCase();
        // @ts-ignore
        const isPro = (planType === "PRO" || planType === "DIAMOND") && (!user.proExpiresAt || user.proExpiresAt > new Date());
        if (!isPro) {
            return { error: "Layouts Grid e Carrossel disponíveis apenas para usuários Pro" };
        }
    }

    const updatedProfile = await prisma.profilePage.update({
        where: { userId: session.user.id },
        data: { linksLayout: layout },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${updatedProfile.username}`);
    return { success: true };
}
