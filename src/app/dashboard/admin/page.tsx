import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/actions/admin";
import { Button, Input } from "@/components/ui";
import {
    Search, User, Star, Gem, Link as LinkIcon, Eye, MousePointerClick, Home,
    Users
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { UserTableRow } from "@/components/admin/UserTableRow";
import { getProfile } from "@/actions/profile";
import { getThemeById, getDefaultTheme } from "@/lib/themes";

export default async function AdminDashboard() {
    const session = await auth();

    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // 1. Get current user profile to determine theme
    const profile = await getProfile();
    if (!profile) redirect("/login");

    // 2. Get theme colors for injection
    const currentTheme = profile.themeId
        ? getThemeById(profile.themeId) || getDefaultTheme()
        : getDefaultTheme();

    const isDefaultTheme = !profile.themeId || profile.themeId === "default";
    const themeStyles = isDefaultTheme ? {} : {
        '--color-primary': currentTheme.colors.primary,
        '--color-accent': currentTheme.colors.accent,
        '--color-background': currentTheme.colors.background,
        '--color-surface': currentTheme.colors.surface,
        '--color-surface-elevated': currentTheme.colors.surface,
        '--color-text-primary': currentTheme.colors.text,
        '--color-text-secondary': currentTheme.colors.textSecondary,
    } as React.CSSProperties;

    // 3. Fetch Admin Data
    const stats = await getAdminStats();

    const users = await prisma.user.findMany({
        include: {
            profilePage: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const statCards = [
        // Row 1
        { label: "Total Usuários", value: stats.totalUsers, icon: Users },
        { label: "Usuários Free", value: stats.freeUsers, icon: User },
        { label: "Usuários PRO", value: stats.proUsers, icon: Star },
        { label: "Usuários DIAMOND", value: stats.diamondUsers, icon: Gem },
        // Row 2
        { label: "Total Links", value: stats.totalLinks, icon: LinkIcon },
        { label: "Visitas aos Perfis", value: stats.totalProfileViews, icon: Eye },
        { label: "Cliques nos Links", value: stats.totalLinkClicks, icon: MousePointerClick },
        { label: "Visitas à Home", value: stats.totalHomeViews, icon: Home },
    ];

    const getColorClasses = (index: number) => {
        // Alternating theme colors using explicit opacity syntax
        const isAccent = index % 2 !== 0;
        return isAccent
            ? "bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))]"
            : "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]";
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6" style={themeStyles}>
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">Admin Dashboard</h1>
                    <p className="text-[rgb(var(--color-text-secondary))]">Gerenciamento de usuários e planos</p>
                </div>
            </header>

            {/* Stats Cards - 4x2 Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index} variant="glass" padding="lg" className="border-[rgb(var(--color-border))]/50 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${getColorClasses(index)}`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[rgb(var(--color-text-secondary))] truncate">
                                    {stat.label}
                                </p>
                                <p className="text-xl font-bold text-[rgb(var(--color-text-primary))]">
                                    {stat.value.toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* User Management */}
            <Card variant="default" padding="lg" className="!mt-[20px] bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold">Usuários</h2>
                    <form className="flex gap-2 w-full sm:w-auto">
                        <Input
                            name="q"
                            placeholder="Buscar por email ou nome..."
                            className="flex-1 sm:w-64"
                        />
                        <Button type="submit" size="md">
                            <Search size={18} />
                        </Button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] text-sm">
                                <th className="pb-3 pl-4">Username</th>
                                <th className="pb-3">Plano Atual</th>
                                <th className="pb-3">Dias</th>
                                <th className="pb-3">Perfil</th>
                                <th className="pb-3 text-right pr-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgb(var(--color-border))]">
                            {users.map((user) => (
                                <UserTableRow
                                    key={user.id}
                                    user={{
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                        planType: user.planType,
                                        proExpiresAt: user.proExpiresAt,
                                        role: user.role,
                                        profilePage: user.profilePage,
                                    }}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
