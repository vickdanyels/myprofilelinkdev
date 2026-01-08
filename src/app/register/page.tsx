"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";
import { register } from "@/actions/auth";
import { Zap, Check } from "lucide-react";

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await register(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    }

    const features = [
        "Página pública personalizada",
        "Até 10 links ativos",
        "Tema exclusivo",
        "Setup em 2 minutos",
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary))]/10 via-transparent to-[rgb(var(--color-accent))]/10" />
            <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[rgb(var(--color-primary))]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[rgb(var(--color-accent))]/20 rounded-full blur-3xl" />

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

                <h1 className="text-2xl font-bold text-center mb-2">Crie sua conta</h1>
                <p className="text-[rgb(var(--color-text-secondary))] text-center mb-6">
                    Comece grátis e destaque sua presença digital
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {features.map((feature) => (
                        <div
                            key={feature}
                            className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]"
                        >
                            <div className="w-5 h-5 rounded-full bg-[rgb(var(--color-success))]/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-[rgb(var(--color-success))]" />
                            </div>
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-[rgb(var(--color-error))]/10 border border-[rgb(var(--color-error))]/30 text-[rgb(var(--color-error))] text-sm">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome completo"
                        name="name"
                        type="text"
                        placeholder="Seu nome"
                        required
                        autoComplete="name"
                    />

                    <Input
                        label="Username"
                        name="username"
                        type="text"
                        placeholder="seulink"
                        helperText="Sua URL será: myprofile.com/seulink"
                        required
                    />

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
                        placeholder="Mínimo 6 caracteres"
                        required
                        autoComplete="new-password"
                    />

                    <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                        Criar conta grátis
                    </Button>
                </form>

                <p className="mt-4 text-xs text-center text-[rgb(var(--color-text-muted))]">
                    Ao criar uma conta, você concorda com nossos{" "}
                    <Link href="/terms" className="text-[rgb(var(--color-primary-light))] hover:underline">
                        Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacy" className="text-[rgb(var(--color-primary-light))] hover:underline">
                        Política de Privacidade
                    </Link>
                </p>

                <div className="mt-6 text-center text-[rgb(var(--color-text-secondary))]">
                    Já tem uma conta?{" "}
                    <Link
                        href="/login"
                        className="text-[rgb(var(--color-primary-light))] hover:underline font-medium"
                    >
                        Fazer login
                    </Link>
                </div>
            </Card>
        </div>
    );
}
