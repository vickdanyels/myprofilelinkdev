"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap, LayoutDashboard, Settings, LogOut, User, Shield, ChevronRight } from "lucide-react";

interface MobileSidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        role?: string;
    };
    signOutAction: () => Promise<void>;
}

export function MobileSidebar({ user, signOutAction }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const closeMenu = () => setIsOpen(false);
    const openMenu = () => setIsOpen(true);

    // Desktop: render nothing (sidebar is in server component layout)
    if (!isMobile) return null;

    return (
        <>
            {/* Mobile Tab Button (Collapsed state) - Fixed on left edge */}
            <button
                onClick={openMenu}
                className={`fixed top-4 left-0 z-50 flex items-center gap-1 px-3 py-3 bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] text-white rounded-r-xl shadow-lg transition-all duration-300 lg:hidden ${isOpen ? "opacity-0 pointer-events-none -translate-x-full" : "opacity-100 translate-x-0"
                    }`}
                aria-label="Abrir menu"
            >
                <Menu className="w-5 h-5" />
                <ChevronRight className="w-4 h-4" />
            </button>

            {/* Overlay with fade animation */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeMenu}
            />

            {/* Mobile Sidebar with slide animation */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col transition-transform duration-300 ease-out lg:hidden bg-[rgb(var(--color-surface))] border-r border-[rgb(var(--color-border))] shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Translucent theme color overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--color-primary))]/10 via-transparent to-[rgb(var(--color-accent))]/5 pointer-events-none" />

                {/* Header with Close Button */}
                <div className="relative p-4 flex items-center justify-between border-b border-[rgb(var(--color-primary))]/20 bg-gradient-to-r from-[rgb(var(--color-primary))]/10 to-transparent">
                    <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold" onClick={closeMenu}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center shadow-lg shadow-[rgb(var(--color-primary))]/30">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="gradient-text">MyProfile</span>
                        <span className="text-[rgb(var(--color-text-primary))]">Pro</span>
                    </Link>
                    <button
                        onClick={closeMenu}
                        className="p-2.5 rounded-xl bg-[rgb(var(--color-surface-elevated))] hover:bg-red-500/20 transition-colors group"
                        aria-label="Fechar menu"
                    >
                        <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))] group-hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="relative flex-1 p-4 space-y-1 overflow-y-auto">
                    <MobileNavItem href="/dashboard" icon={LayoutDashboard} onClick={closeMenu}>
                        Dashboard
                    </MobileNavItem>
                    <MobileNavItem href="/dashboard/settings" icon={Settings} onClick={closeMenu}>
                        Configurações
                    </MobileNavItem>
                    {user.role === "ADMIN" && (
                        <MobileNavItem href="/dashboard/admin" icon={Shield} onClick={closeMenu}>
                            Admin
                        </MobileNavItem>
                    )}
                </nav>

                {/* User Section with colored glow */}
                <div className="relative p-4 border-t border-[rgb(var(--color-primary))]/20 bg-gradient-to-t from-[rgb(var(--color-primary))]/10 to-transparent">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center shadow-lg shadow-[rgb(var(--color-primary))]/30">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
                                {user.name || user.email}
                            </p>
                            <p className="text-xs text-[rgb(var(--color-text-muted))] truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <form action={signOutAction}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[rgb(var(--color-text-secondary))] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}

function MobileNavItem({
    href,
    icon: Icon,
    children,
    onClick,
}: {
    href: string;
    icon: typeof LayoutDashboard;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3.5 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-surface-elevated))] rounded-xl transition-colors"
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{children}</span>
        </Link>
    );
}
