"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { register } from "@/actions/auth";
import { Check } from "lucide-react";
import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";

const THEME = { primary: "236 72 153", accent: "6 182 212", background: "0 0 0" };

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await register(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.success) {
            // Validation Passed - Start Sequence
            setIsSuccess(true);

            // 1. UI Transforms (Form shrinks, Text appears) - handled by React state
            // 2. Warp Speed Boosts - handled by prop passed to LiveBackgrounds

            // 3. Wait for acceleration (e.g. 4 seconds)
            setTimeout(() => {
                // 4. Fade Out Screen
                setIsFadingOut(true);

                // 5. Redirect after fade
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1000); // 1s fade out
            }, 4000);
        }
    }

    const features = [
        "Página pública personalizada",
        "Até 10 links ativos",
        "Tema exclusivo",
        "Setup em 2 minutos",
    ];

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

            {/* Registration Card */}
            <div className={`w-full max-w-md relative z-10 transition-all duration-700 ease-in-out ${isSuccess ? 'opacity-0 scale-95 translate-y-10 pointer-events-none' : 'opacity-100'}`}>
                <Card
                    className="w-full bg-black/10 backdrop-blur-sm border border-[rgb(var(--color-accent)_/_0.3)] shadow-2xl overflow-hidden"
                >
                    <div className={`transition-all duration-700 ease-in-out ${isSuccess ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
                        {/* Logo - Matches Header.tsx Identity */}
                        <div className="text-center mb-6 mt-2">
                            <Link href="/" className="z-10 text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
                                MyProfile
                            </Link>
                        </div>

                        <h1 className="text-2xl font-bold text-center mb-2 text-white">Crie sua conta</h1>
                        <p className="text-gray-400 text-center mb-6">
                            Comece grátis e destaque sua presença digital
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {features.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-2 text-sm text-gray-300"
                                >
                                    <div className="w-5 h-5 rounded-full bg-[rgb(var(--color-accent))]/20 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-[rgb(var(--color-accent))]" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <form action={handleSubmit} className="flex flex-col gap-[16px]">
                            {/* Field Groups (Label, Input, Desc) - Gap ensures 8px+8px spacing */}

                            <Input
                                label="Nome completo"
                                name="name"
                                type="text"
                                placeholder="Seu nome"
                                required
                                autoComplete="name"
                                className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-[rgb(var(--color-accent))]"
                            />

                            <Input
                                label="Username"
                                name="username"
                                type="text"
                                placeholder="seulink"
                                helperText="Sua URL será: myprofile.com/seulink"
                                required
                                className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-[rgb(var(--color-accent))]"
                            />

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
                                placeholder="Mínimo 6 caracteres"
                                required
                                autoComplete="new-password"
                                className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-[rgb(var(--color-accent))]"
                            />

                            <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    isLoading={isLoading}
                                    className="!bg-[#06B6D4] !hover:bg-[#22D3EE] !text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300"
                                >
                                    Criar conta grátis
                                </Button>
                            </div>
                        </form>

                        <p className="text-xs text-center text-gray-500">
                            Ao criar uma conta, você concorda com nossos{" "}
                            <Link href="/terms" className="text-[rgb(var(--color-accent))] hover:underline">
                                Termos de Uso
                            </Link>{" "}
                            e{" "}
                            <Link href="/privacy" className="text-[rgb(var(--color-accent))] hover:underline">
                                Política de Privacidade
                            </Link>
                        </p>

                        <div className="mt-6 text-center text-gray-400 pb-[15px]">
                            Já tem uma conta?{" "}
                            <Link
                                href="/login"
                                className="text-[rgb(var(--color-accent))] hover:underline font-medium"
                            >
                                Fazer login
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
