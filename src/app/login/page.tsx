"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { login } from "@/actions/auth";
import { Zap } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary))]/10 via-transparent to-[rgb(var(--color-accent))]/10" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(var(--color-primary))]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(var(--color-accent))]/20 rounded-full blur-3xl" />

            <Card variant="glass" className="w-full max-w-md animate-slide-up relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="gradient-text">MyProfile</span>
                        <span className="text-[rgb(var(--color-text-primary))]">Pro</span>
                    </Link>
                </div>

                <h1 className="text-2xl font-bold text-center mb-2">Bem-vindo de volta</h1>
                <p className="text-[rgb(var(--color-text-secondary))] text-center mb-8">
                    Entre na sua conta para continuar
                </p>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-[rgb(var(--color-error))]/10 border border-[rgb(var(--color-error))]/30 text-[rgb(var(--color-error))] text-sm">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-5">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        autoComplete="email"
                    />

                    <Input
                        label="Senha"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
                            />
                            <span className="text-[rgb(var(--color-text-secondary))]">Lembrar de mim</span>
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-[rgb(var(--color-primary-light))] hover:underline"
                        >
                            Esqueceu a senha?
                        </Link>
                    </div>

                    <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                        Entrar
                    </Button>
                </form>

                <div className="mt-6 text-center text-[rgb(var(--color-text-secondary))]">
                    Não tem uma conta?{" "}
                    <Link
                        href="/register"
                        className="text-[rgb(var(--color-primary-light))] hover:underline font-medium"
                    >
                        Criar conta grátis
                    </Link>
                </div>
            </Card>
        </div>
    );
}
