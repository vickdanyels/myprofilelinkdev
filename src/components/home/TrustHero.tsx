"use client";

import { motion } from "framer-motion";
import { CreditCard, Gift, Sparkles, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";

const TRUST_ITEMS = [
    { icon: Gift, text: "15 dias de Pro Grátis", highlight: true },
    { icon: CreditCard, text: "Sem cartão de crédito" },
    { icon: Sparkles, text: "Acesso total imediato" },
    { icon: Heart, text: "Cancele quando quiser" }
];

const INFLUENCER_THEME_BG = {
    primary: "251 191 36", // Claro (Amber-400)
    accent: "234 179 8",   // Escuro (Yellow-500)
    background: "0 0 0"
};

export function TrustHero() {
    const router = useRouter();

    return (
        <>
            {/* Elegant Separator (Cyan) - Top */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--color-accent))] to-transparent opacity-80 shadow-[0_0_15px_rgba(6,182,212,0.5)] relative z-20" />

            <section className="relative z-10 w-full py-24 bg-black overflow-hidden">
                <LiveBackgrounds
                    type="warp-speed"
                    enabled={true}
                    themeColors={INFLUENCER_THEME_BG}
                    className="absolute inset-0 z-0 pointer-events-none"
                    starCount={500}
                    disableMouseInteraction={true}
                />

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-[100px] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">

                    {/* Gift Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-8"
                        style={{ marginTop: '50px' }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            <Gift className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-300 font-bold text-sm uppercase tracking-wider">Presente Exclusivo</span>
                        </div>
                    </motion.div>

                    {/* Main Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-6"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 tracking-tight px-2">
                            <span className="text-amber-400">15 dias de Pro</span> por nossa conta.
                        </h2>
                        <p className="text-xl sm:text-2xl md:text-3xl text-white font-light px-2">
                            Sem cartão. <span className="text-cyan-400 font-semibold">Sem compromisso.</span>
                        </p>
                    </motion.div>

                    {/* Reciprocity Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-center mb-12"
                    >
                        <p className="text-lg sm:text-xl text-white font-light max-w-2xl mx-auto leading-loose px-2">
                            Primeiro você <strong className="font-bold">testa</strong> ...<br />
                            depois nos conta se gostou!
                        </p>
                        <p className="text-lg sm:text-xl text-white font-semibold mt-4">
                            Simples assim!
                        </p>
                    </motion.div>

                    {/* Trust Badges Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 mb-12 px-2"
                    >
                        {TRUST_ITEMS.map((item, index) => (
                            <div
                                key={index}
                                className={`
                                    group flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-xl border backdrop-blur-md transition-all duration-300
                                    ${item.highlight
                                        ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }
                                `}
                            >
                                <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.highlight ? 'text-amber-400' : 'text-cyan-400'}`} />
                                <span className={`font-medium text-xs sm:text-sm ${item.highlight ? 'text-amber-200' : 'text-gray-300'}`}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center"
                    >
                        <button
                            onClick={() => router.push('/register')}
                            className="pro-badge group relative px-10 py-4 text-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <span className="relative flex items-center justify-center gap-3">
                                GRÁTIS 15 DIAS
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </span>
                        </button>
                        <p className="mt-4 text-sm text-gray-500" style={{ marginBottom: '50px' }}>
                            Resgatar 15 dias PRO GRÁTIS
                        </p>
                    </motion.div>

                </div>
            </section>

            {/* Elegant Separator (Cyan) - Bottom */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--color-accent))] to-transparent opacity-80 shadow-[0_0_15px_rgba(6,182,212,0.5)] relative z-20" />
        </>
    );
}
