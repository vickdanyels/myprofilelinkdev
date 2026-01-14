import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { ArrowLeft, Users, MousePointer2, ExternalLink, Calendar, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

// Helper to format date as DD/MM
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
};

// Analytics access rules per plan
const ANALYTICS_ACCESS = {
    FREE: {
        clickCounter: false,
        history30Days: false,
        performanceCharts: false
    },
    PRO: {
        clickCounter: true,
        history30Days: true,
        performanceCharts: false
    },
    DIAMOND: {
        clickCounter: true,
        history30Days: true,
        performanceCharts: true
    }
};

// Component for blurred/restricted stats
function BlurredStat({ value, canAccess, label }: { value: string | number, canAccess: boolean, label?: string }) {
    if (canAccess) {
        return <span>{value}</span>;
    }
    return (
        <div className="relative inline-flex items-center gap-2">
            <span className="blur-sm select-none text-gray-500">{value || "---"}</span>
            <Lock className="w-4 h-4 text-amber-400" />
        </div>
    );
}

// Component for blurred chart section
function BlurredChart({ children, canAccess }: { children: React.ReactNode, canAccess: boolean }) {
    if (canAccess) {
        return <>{children}</>;
    }
    return (
        <div className="relative">
            <div className="blur-sm select-none pointer-events-none">
                {children}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
                <Lock className="w-8 h-8 text-amber-400 mb-2" />
                <p className="text-amber-400 font-medium text-sm">Recurso DIAMOND</p>
                <Link href="/dashboard/upgrade?plan=diamond" className="mt-2 text-xs text-cyan-400 hover:underline flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Fazer Upgrade
                </Link>
            </div>
        </div>
    );
}

export default async function AnalyticsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch user with plan info
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { planType: true }
    });

    const userPlan = (user?.planType || "FREE") as keyof typeof ANALYTICS_ACCESS;
    const access = ANALYTICS_ACCESS[userPlan];

    const profile = await prisma.profilePage.findUnique({
        where: { userId: session.user.id }
    });

    if (!profile) {
        redirect("/dashboard");
    }

    // Fetch Data
    const views = await prisma.profilePageView.findMany({
        where: { profilePageId: profile.id },
        orderBy: { timestamp: 'asc' }
    });

    // We must use 'any' cast here temporarily until the client is regenerated
    // safely in the environment to avoid build errors if using old client types
    const clicks = await prisma.clickAnalytics.findMany({
        where: { profilePageId: profile.id } as any,
        include: { link: { select: { deletedAt: true } } } as any,
        orderBy: { timestamp: 'asc' }
    });

    // Process Data for Link Performance
    const linkStats: Record<string, { title: string, url: string, clicks: number, lastClick: Date, deletedAt?: Date | null }> = {};

    clicks.forEach((click: any) => {
        const key = click.linkUrl || "deleted-link";

        if (!linkStats[key]) {
            linkStats[key] = {
                title: click.linkTitle || "Link Excluído",
                url: click.linkUrl || "#",
                clicks: 0,
                lastClick: click.timestamp,
                deletedAt: click.link?.deletedAt
            };
        }

        linkStats[key].clicks++;
        if (new Date(click.timestamp) > new Date(linkStats[key].lastClick)) {
            linkStats[key].lastClick = click.timestamp;
            // Ensure deletedAt is consistent if we encounter it
            if (click.link?.deletedAt) linkStats[key].deletedAt = click.link.deletedAt;
        }
    });

    const sortedLinks = Object.values(linkStats).sort((a, b) => b.clicks - a.clicks);

    // Process Data for Daily Chart (Last 30 Days)
    const dailyStats: Record<string, { views: number, clicks: number }> = {};

    // Initialize last 30 days
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = formatDate(d);
        dailyStats[dateStr] = { views: 0, clicks: 0 };
    }

    views.forEach(view => {
        const dateStr = formatDate(view.timestamp);
        if (dailyStats[dateStr]) dailyStats[dateStr].views++;
    });

    clicks.forEach(click => {
        const dateStr = formatDate(click.timestamp);
        if (dailyStats[dateStr]) dailyStats[dateStr].clicks++;
    });

    // Simple Sparkline Logic (just for visuals)
    const maxViews = Math.max(...Object.values(dailyStats).map(d => d.views), 1);
    const maxClicks = Math.max(...Object.values(dailyStats).map(d => d.clicks), 1);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">Analytics</h1>
                    <p className="text-[rgb(var(--color-text-secondary))]">Desempenho da sua página nos últimos 30 dias</p>
                </div>
                {userPlan === 'FREE' && (
                    <Link href="/dashboard/upgrade" className="ml-auto px-4 py-2 bg-amber-500/10 text-amber-400 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-amber-500/20 transition-colors">
                        <Lock className="w-4 h-4" /> Upgrade para ver dados
                    </Link>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card padding="lg" variant="glass">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">Total de Visitas</p>
                            <p className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">
                                <BlurredStat value={views.length} canAccess={access.clickCounter} />
                            </p>
                        </div>
                    </div>
                </Card>
                <Card padding="lg" variant="glass">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                            <MousePointer2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">Total de Cliques</p>
                            <p className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">
                                <BlurredStat value={clicks.length} canAccess={access.clickCounter} />
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Daily Performance Chart (Simulated Visual) */}
            <Card padding="lg" variant="glass">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-[rgb(var(--color-text-primary))]">
                    <Calendar className="w-4 h-4" /> Desempenho Diário
                </h3>
                <BlurredChart canAccess={access.performanceCharts}>
                    <div className="h-48 flex items-end justify-between gap-1">
                        {Object.entries(dailyStats).map(([date, stats], i) => (
                            <div key={date} className="flex-1 flex flex-col justify-end gap-1 group relative">
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                                    {date}: {stats.views} views, {stats.clicks} clicks
                                </div>

                                {/* View Bar */}
                                <div
                                    className="w-full bg-blue-500/50 rounded-t-sm transition-all hover:bg-blue-500/80"
                                    style={{ height: `${(stats.views / maxViews) * 100}%`, minHeight: stats.views > 0 ? '4px' : '0' }}
                                />
                                {/* Click Bar */}
                                <div
                                    className="w-full bg-purple-500/50 rounded-t-sm -mt-1 mix-blend-screen transition-all hover:bg-purple-500/80"
                                    style={{ height: `${(stats.clicks / maxClicks) * 100}%`, minHeight: stats.clicks > 0 ? '4px' : '0' }}
                                />

                                {/* X Axis Label (every 5 days) */}
                                {i % 5 === 0 && (
                                    <span className="absolute top-full mt-2 text-[10px] text-[rgb(var(--color-text-secondary))] -rotate-45 origin-top-left">
                                        {date}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </BlurredChart>
            </Card>

            {/* Links Table */}
            <Card padding="none" variant="glass" className="overflow-hidden">
                <div className="px-6 py-6 border-b border-[rgb(var(--color-border))]">
                    <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] text-center">Detalhes dos Links</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))]">
                            <tr>
                                <th style={{ paddingLeft: '12%' }} className="pr-6 py-3 font-semibold text-left">Link</th>
                                <th className="px-6 py-3 font-semibold text-center w-32">Cliques</th>
                                <th className="pr-12 pl-6 py-3 font-semibold text-center w-40">Último Clique</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgb(var(--color-border))]">
                            {sortedLinks.map((link, i) => (
                                <tr key={i} className="hover:bg-[rgb(var(--color-surface-elevated))]/50 transition-colors">
                                    <td style={{ paddingLeft: '8%' }} className="pr-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-[rgb(var(--color-text-primary))] hover:text-[rgb(var(--color-primary))] transition-colors inline-flex items-center gap-2 group/link"
                                            >
                                                {link.title}
                                                <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                            </a>
                                            {link.deletedAt && (
                                                <span className="px-2.5 py-1 text-[10px] font-medium bg-red-500/10 text-red-500 rounded-full border border-red-500/20 whitespace-nowrap">
                                                    Excluído em {formatDate(new Date(link.deletedAt))}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[2rem] font-bold text-[rgb(var(--color-text-primary))] text-base">
                                            <BlurredStat value={link.clicks} canAccess={access.history30Days} />
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-[rgb(var(--color-text-secondary))]">
                                        {access.history30Days ? formatDate(new Date(link.lastClick)) : <BlurredStat value="--/--" canAccess={false} />}
                                    </td>
                                </tr>
                            ))}
                            {sortedLinks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-[rgb(var(--color-text-secondary))]">
                                        Nenhum clique registrado ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
