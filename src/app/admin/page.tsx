import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminStats, getUsers } from "@/actions/admin";
import { Button, Card, Input } from "@/components/ui";
import { Search, Shield, User, Star, Gem, Zap } from "lucide-react";
import Link from "next/link";
import { UserTableRow } from "@/components/admin/UserTableRow";

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth();
    const params = await searchParams;
    const query = typeof params.q === 'string' ? params.q : "";

    // @ts-ignore
    if (session?.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const stats = await getAdminStats();
    const users = await getUsers(query);

    return (
        <div className="min-h-screen p-8 space-y-8 bg-[rgb(var(--color-background))]">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">Admin Dashboard</h1>
                    <p className="text-[rgb(var(--color-text-secondary))]">Gerenciamento de usuários e planos</p>
                </div>
                <Link href="/dashboard">
                    <Button variant="ghost">Voltar ao Dashboard</Button>
                </Link>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card variant="glass" padding="lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">Total Usuários</p>
                            <p className="text-2xl font-bold">{stats.totalUsers}</p>
                        </div>
                    </div>
                </Card>
                <Card variant="glass" padding="lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                            <Star size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">Usuários PRO</p>
                            <p className="text-2xl font-bold">{stats.proUsers}</p>
                        </div>
                    </div>
                </Card>
                <Card variant="glass" padding="lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
                            <Gem size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">Usuários DIAMOND</p>
                            <p className="text-2xl font-bold">{stats.diamondUsers}</p>
                        </div>
                    </div>
                </Card>
                <Card variant="glass" padding="lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">Total Links</p>
                            <p className="text-2xl font-bold">{stats.totalLinks}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* User Management */}
            <Card variant="default" padding="lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Usuários</h2>
                    <form className="flex gap-2">
                        <Input
                            name="q"
                            placeholder="Buscar por email ou nome..."
                            defaultValue={query}
                            className="w-64"
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
                                <th className="pb-3 pl-4">Usuário</th>
                                <th className="pb-3">Username</th>
                                <th className="pb-3">Plano Atual</th>
                                <th className="pb-3">Role</th>
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
