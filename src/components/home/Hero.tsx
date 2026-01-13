import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import { PhoneMockup } from "./PhoneMockup";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-12 lg:pt-0">
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left Column: Text */}
                    <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm mb-8 animate-fade-in-up">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-200/80 font-medium">Revolução em Bio Links</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                            Você será lembrado,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-text">
                                pela forma como é visto!
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-slate-400 mb-10 max-w-lg font-light">
                            Transmita credibilidade com um perfil digno de um profissional. Crie sua bio premium em segundos.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link href="/register" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] transition-all hover:scale-105">
                                    Criar minha página grátis
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/login" className="w-full sm:w-auto">
                                <Button variant="ghost" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10">
                                    Fazer Login
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicator */}
                        <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs text-white">
                                        {i}
                                    </div>
                                ))}
                            </div>
                            <span>
                                <strong className="text-white">+10.000</strong> criadores já estão usando
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Phone Mockup */}
                    <div className="relative flex justify-center lg:justify-end items-center">
                        {/* Decorative blob behind phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[650px] bg-gradient-to-b from-cyan-500/20 to-purple-500/20 rounded-full blur-[80px] -z-10" />

                        <PhoneMockup />
                    </div>

                </div>
            </div>
        </section>
    );
}
