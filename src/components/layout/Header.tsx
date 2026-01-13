"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/5 backdrop-blur-md transition-all duration-300">
                {/* Hyperliquid Glow Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[60%] h-[200px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen opacity-50" />
                    <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[40%] h-[200px] bg-accent/20 blur-[80px] rounded-full mix-blend-screen opacity-60" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="z-10 text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
                        MyProfile
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="#funcionalidades"
                            className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            Funcionalidades
                        </Link>
                        <Link
                            href="#precos"
                            className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            Preços
                        </Link>
                        <Link
                            href="#depoimentos"
                            className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            Depoimentos
                        </Link>
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                            Entrar
                        </Link>
                        <Link href="/register">
                            <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-transform active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                                Criar conta
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden z-10 text-white/80 hover:text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
                    <nav className="flex flex-col gap-6 items-center text-center">
                        <Link
                            href="#funcionalidades"
                            className="text-lg font-medium text-white/80 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Funcionalidades
                        </Link>
                        <Link
                            href="#precos"
                            className="text-lg font-medium text-white/80 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Preços
                        </Link>
                        <Link
                            href="#depoimentos"
                            className="text-lg font-medium text-white/80 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Depoimentos
                        </Link>
                        <div className="w-full h-px bg-white/10 my-2" />
                        <Link
                            href="/login"
                            className="text-lg font-medium text-white hover:text-white/80"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Entrar
                        </Link>
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-full bg-white text-black px-8 py-3 rounded-full text-base font-semibold hover:bg-white/90">
                                Criar conta
                            </button>
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
}
