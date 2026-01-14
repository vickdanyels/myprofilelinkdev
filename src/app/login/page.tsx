"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { login } from "@/actions/auth";
import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";

const THEME = { primary: "236 72 153", accent: "6 182 212", background: "0 0 0" };

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await login(formData);

            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            } else if (result?.success) {
                // Success Sequence
                setIsSuccess(true);

                // Wait for acceleration (4s)
                setTimeout(() => {
                    setIsFadingOut(true);

                    // Redirect after fade (1s)
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 1000);
                }, 4000);
            }
        } catch (err) {
            setError("Erro ao tentar fazer login. Tente recarregar a página.");
            setIsLoading(false);
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <LiveBackgrounds type="warp-speed" enabled={true} themeColors={THEME} warpSpeedBoost={isSuccess} />
            </div>

            {/* Success Overlay Text */}
            <div className={`fixed inset-0 z-20 flex flex-col items-center justify-center pointer-events-none transition-all duration-1000 ${isSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 animate-pulse">
                    Aguarde ...
                </h1>
                <p className="text-sm md:text-base text-cyan-400 font-light tracking-[0.2em] uppercase">
                    Estamos levando você para outra dimensão ...
                </p>
            </div>

            <div className={`w-full max-w-md relative z-10 transition-all duration-700 ease-in-out ${isSuccess ? 'opacity-0 scale-95 translate-y-10 pointer-events-none' : 'opacity-100'}`}>
                <Card
                    className="w-full bg-black/10 backdrop-blur-sm border border-[rgb(var(--color-accent)_/_0.3)] shadow-2xl overflow-hidden"
                >
                    <div className={`transition-all duration-700 ease-in-out ${isSuccess ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
                        {/* Logo */}
                        <div className="text-center mb-6 mt-2">
                            <Link href="/" className="z-10 text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
                                MyProfile
                            </Link>
                        </div>

                        <h1 className="text-2xl font-bold text-center mb-2 text-white">Bem-vindo de volta</h1>
                        <p className="text-gray-400 text-center mb-6">
                            Entre na sua conta para continuar
                        </p>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <form action={handleSubmit} className="flex flex-col gap-[16px]">
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                autoComplete="email"
                                className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-[rgb(var(--color-accent))]"
                            />

                            <Input
                                label="Senha"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-[rgb(var(--color-accent))]"
                            />

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-white/20 bg-black/40 text-[rgb(var(--color-accent))] focus:ring-[rgb(var(--color-accent))]"
                                    />
                                    <span className="text-gray-400">Lembrar de mim</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[rgb(var(--color-accent))] hover:underline"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>

                            <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    isLoading={isLoading}
                                    className="!bg-[#06B6D4] !hover:bg-[#22D3EE] !text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300"
                                >
                                    Entrar
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-gray-400 pb-[15px]">
                            Não tem uma conta?{" "}
                            <Link
                                href="/register"
                                className="text-[rgb(var(--color-accent))] hover:underline font-medium"
                            >
                                Criar conta grátis
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
