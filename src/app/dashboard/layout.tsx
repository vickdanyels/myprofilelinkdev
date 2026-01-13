import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import {
    Zap,
    LayoutDashboard,
    Settings,
    LogOut,
    User,
    Shield,
} from "lucide-react";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { BannerHeader } from "@/components/dashboard/BannerHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const signOutAction = async () => {
        "use server";
        await signOut({ redirectTo: "/" });
    };

    return (
        <div className="min-h-screen flex overflow-x-hidden bg-black relative">
            {/* Background Glows - like home page */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/8 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full" />
            </div>
            {/* Mobile Sidebar (Client Component) */}
            <MobileSidebar
                user={{
                    name: session.user.name,
                    email: session.user.email,
                    // @ts-ignore
                    role: session.user.role,
                }}
                signOutAction={signOutAction}
            />

            {/* Desktop Sidebar - ALWAYS visible on lg+ screens */}
            <aside
                className="w-64 flex-col fixed h-full z-30 bg-black/80 backdrop-blur-xl border-r border-white/10"
                style={{ display: 'none' }}
            >
                {/* This will be overridden by media query in globals.css */}
                {/* Hyperliquid Glow Effect - matching home header */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[200px] bg-amber-500/5 blur-[80px] rounded-full" />
                </div>

                {/* Logo with colored glow */}
                <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-transparent">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-xl font-bold"
                    >
                        <span className="text-white">My</span>
                        <span className="text-cyan-400">Profile</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="relative flex-1 p-4 space-y-1">
                    <NavItem href="/dashboard" icon={LayoutDashboard}>
                        Dashboard
                    </NavItem>
                    <NavItem href="/dashboard/settings" icon={Settings}>
                        Configurações
                    </NavItem>
                    {/* @ts-ignore */}
                    {session.user.role === "ADMIN" && (
                        <NavItem href="/dashboard/admin" icon={Shield}>
                            Admin
                        </NavItem>
                    )}
                </nav>

                {/* User Section */}
                <div className="relative p-4 border-t border-white/10 bg-gradient-to-t from-cyan-500/5 to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-amber-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {session.user.name || session.user.email}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </div>

                    <form action={signOutAction}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content - Full width on mobile, with left margin on desktop */}
            <main className="flex-1 lg:ml-64 relative h-screen overflow-hidden">
                {/* Banner Header - Absolute/Fixed on top */}
                <div className="absolute top-0 left-0 right-0 z-50">
                    <BannerHeader />
                </div>



                {/* Page Content - Scrolls BEHIND the header */}
                <div className="h-full overflow-y-auto p-4 lg:p-8">
                    <DashboardContent>
                        {children}
                    </DashboardContent>
                </div>
            </main>
        </div>
    );
}

function NavItem({
    href,
    icon: Icon,
    children,
}: {
    href: string;
    icon: typeof LayoutDashboard;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{children}</span>
        </Link>
    );
}
