"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Diamond, Crown, Infinity } from "lucide-react";
import { useRouter } from "next/navigation";

const PLANS = [
    {
        id: "free",
        name: "Free",
        price: "R$ 0",
        period: "/mês",
        color: "text-gray-200",
        border: "border-gray-700",
        glow: "shadow-gray-500/20",
        gradient: "from-gray-700 to-gray-500",
        icon: Zap
    },
    {
        id: "pro",
        name: "Pro",
        price: "R$ 19,90",
        period: "/mês",
        color: "text-amber-400",
        border: "border-amber-500/50",
        glow: "shadow-amber-500/40",
        gradient: "from-amber-400 to-yellow-600",
        popular: true,
        icon: Crown
    },
    {
        id: "diamond",
        name: "Diamond",
        price: "R$ 49,90",
        period: "/mês",
        color: "text-cyan-400",
        border: "border-cyan-500/50",
        glow: "shadow-cyan-500/40",
        gradient: "from-cyan-400 to-blue-600",
        icon: Diamond
    }
];

const FEATURES = [
    {
        category: "Visual & Layout",
        items: [
            { name: "Layout em Lista", free: true, pro: true, diamond: true, type: "check" },
            { name: "Layout em Grade (Grid)", free: false, pro: true, diamond: true, type: "check" },
            { name: "Layout Carrossel 3D", free: false, pro: false, diamond: true, type: "check" },
            { name: "Temas Premium", free: false, pro: true, diamond: true, type: "check" },
            { name: "Live Backgrounds (+10)", free: false, pro: true, diamond: true, type: "check" },
        ]
    },
    {
        category: "Personalização",
        items: [
            { name: "Links Ativos", free: "2", pro: "20", diamond: "100", type: "text" },
            { name: "Bio e Avatar Customizáveis", free: true, pro: true, diamond: true, type: "check" },
            { name: "Moldura de Perfil", free: false, pro: "Dourada", diamond: "Neon", type: "text" },
            { name: "Remover Branding", free: false, pro: true, diamond: true, type: "check" },
        ]
    },
    {
        category: "Analytics",
        items: [
            { name: "Contador de Cliques", free: false, pro: true, diamond: true, type: "check" },
            { name: "Histórico de 30 Dias", free: false, pro: true, diamond: true, type: "check" },
            { name: "Gráficos de Desempenho", free: false, pro: false, diamond: true, type: "check" },
        ]
    }
];

export function FeaturesComparison() {
    const router = useRouter();

    return (
        <section className="relative w-full py-32 bg-black overflow-hidden perspective-[1000px] lazy-render">

            {/* Background Effects - Matching Hero Colors (Cyan/Gold) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-900/10 via-amber-900/5 to-transparent blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
                    >
                        Como você quer ser <span className="text-amber-400">visto</span>?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto font-light"
                    >
                        Compare os recursos e descubra qual plano<br />
                        se adapta melhor à sua identidade!
                    </motion.p>
                </div>

                {/* Table Container */}
                <div className="relative max-w-6xl mx-auto" style={{ marginTop: '50px' }}>

                    {/* Glass Panel - CYAN NEON AESTHETIC */}
                    <div className="relative rounded-[2.5rem] border border-cyan-500/30 bg-black/40 backdrop-blur-2xl overflow-hidden shadow-[0_0_50px_-10px_rgba(6,182,212,0.3)]">

                        {/* Table Header / Sticky */}
                        <div className="grid grid-cols-4 border-b border-cyan-500/20 bg-cyan-950/10 sticky top-0 z-20 backdrop-blur-xl">
                            <div className="p-6 md:p-8 flex items-end">
                                <span className="text-xs md:text-sm font-bold text-cyan-500/70 uppercase tracking-[0.2em] hidden md:block" style={{ paddingLeft: '15px' }}>Recursos</span>
                            </div>

                            {PLANS.map((plan) => (
                                <div key={plan.id} className={`relative p-6 md:p-8 text-center border-l border-white/5 group transition-all duration-500 overflow-hidden ${plan.popular ? 'bg-amber-500/5' : ''}`}>

                                    {/* Popular Badge - BADGE STYLE MATCH */}
                                    {plan.popular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] z-10">
                                            Mais Popular
                                        </div>
                                    )}

                                    {/* Plan Glow Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-b ${plan.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />

                                    {/* Icon with specific Plan Glow */}
                                    <div className="relative z-10 mb-4 transition-transform duration-300 group-hover:scale-110">
                                        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${plan.id === 'diamond' ? 'shadow-[0_0_30px_rgba(34,211,238,0.3)]' :
                                            plan.id === 'pro' ? 'shadow-[0_0_30px_rgba(251,191,36,0.3)]' : ''
                                            }`}>
                                            <plan.icon className={`w-6 h-6 ${plan.color}`} />
                                        </div>
                                    </div>

                                    <h3 className={`text-lg md:text-xl font-bold mb-1 tracking-tight ${plan.color}`}>{plan.name}</h3>

                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{plan.price}</span>
                                        <span className="text-xs text-gray-500 font-medium">{plan.period}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Features Rows */}
                        <div className="divide-y divide-white/5">
                            {FEATURES.map((section, sIndex) => (
                                <div key={sIndex}>
                                    {/* Section Header */}
                                    <div className="px-6 py-3 md:px-8 bg-white/5 border-y border-white/5">
                                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.15em]" style={{ paddingLeft: '15px' }}>
                                            {section.category}
                                        </span>
                                    </div>

                                    {/* Section Items */}
                                    {section.items.map((item, iIndex) => (
                                        <div key={iIndex} className="grid grid-cols-4 group hover:bg-white/[0.02] transition-colors duration-200">

                                            {/* Label */}
                                            <div className="p-4 md:p-6 text-xs md:text-sm text-gray-300 flex items-center justify-center text-center font-medium border-r border-transparent">
                                                <span className="group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>{item.name}</span>
                                            </div>

                                            {/* Free Value */}
                                            <div className="p-4 md:p-6 border-l border-white/5 flex items-center justify-center text-center">
                                                <FeatureValue value={item.free} type={item.type} />
                                            </div>

                                            {/* Pro Value */}
                                            <div className="p-4 md:p-6 border-l border-white/5 flex items-center justify-center text-center relative overflow-hidden">
                                                {/* Liquid Hover specific to Pro */}
                                                <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                <FeatureValue value={item.pro} type={item.type} color="pro" />
                                            </div>

                                            {/* Diamond Value */}
                                            <div className="p-4 md:p-6 border-l border-white/5 flex items-center justify-center text-center relative overflow-hidden">
                                                {/* Liquid Hover specific to Diamond */}
                                                <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                <FeatureValue value={item.diamond} type={item.type} color="diamond" />
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* CTA Footer */}
                        <div className="grid grid-cols-4 border-t border-white/10 bg-black/60 backdrop-blur-xl">
                            <div></div>
                            {PLANS.map((plan) => (
                                <div key={plan.id} className="p-6 md:p-8 flex items-center justify-center border-l border-white/5">
                                    <button
                                        onClick={() => router.push('/register')}
                                        className={`
                                        w-full py-3 md:py-4 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all duration-300 transform hover:-translate-y-1
                                        ${plan.id === 'free' ? 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10' : ''}
                                        ${plan.id === 'pro' ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]' : ''}
                                        ${plan.id === 'diamond' ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]' : ''}
                                    `}>
                                        {plan.id === 'free' ? 'Começar' : 'COMPRAR'}
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

function FeatureValue({ value, type, color = "default" }: { value: any, type: string, color?: string }) {
    if (!value) return <span className="text-gray-700">-</span>;
    if (value === true) {
        let iconColor = "text-white";
        if (color === "pro") iconColor = "text-amber-400";
        if (color === "diamond") iconColor = "text-cyan-400";
        return <Check className={`w-5 h-5 ${iconColor}`} strokeWidth={3} />;
    }
    if (typeof value === "string") {
        let textColor = "text-gray-400";
        if (color === "pro") textColor = "text-amber-200 font-semibold";
        if (color === "diamond") textColor = "text-cyan-200 font-bold";
        return <span className={`text-sm ${textColor}`}>{value}</span>;
    }
    return null;
}
