"use client";

import { motion } from "framer-motion";
import { Star, Quote, TrendingUp } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS = [
    {
        id: 1,
        name: "Marina Santos",
        role: "Influenciadora Digital",
        avatar: "/testimonials/avatar-1.jpg",
        content: "Estou simplesmente apaixonada no visual premium da minha página! Todas as minhas redes sociais em um único site ... Estou passada com a qualidade!",
        metric: "+10",
        metricLabel: "Parcerias",
        platform: "Instagram"
    },
    {
        id: 2,
        name: "Lucas Ferreira",
        role: "Empreendedor",
        avatar: "/testimonials/avatar-2.jpg",
        content: "Eu não perco mais tempo procurando os links, e meus clientes não perdem tempo tentando achar as unidades da minha loja!",
        metric: "+15%",
        metricLabel: "Faturamento",
        platform: "TikTok"
    },
    {
        id: 3,
        name: "Carla Mendes",
        role: "Loja virtual",
        avatar: "/testimonials/avatar-3.jpg",
        content: "Profissionalismo instantâneo. Meus clientes elogiam a página e a facilidade de encontrar os links. Vale cada centavo!!",
        metric: "+20%",
        metricLabel: "Leads",
        platform: "Hotmart"
    }
];

export function Testimonials() {
    return (
        <>
            {/* Elegant Separator (Cyan) - Top */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--color-accent))] to-transparent opacity-80 shadow-[0_0_15px_rgba(6,182,212,0.5)] relative z-20" />

            <section className="relative z-10 w-full py-24 bg-black overflow-hidden">

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-amber-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 relative z-10" style={{ marginBottom: '50px' }}>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6" style={{ marginTop: '50px' }}>
                            <Star className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-300 font-semibold text-sm uppercase tracking-wider">Avaliações de usuários</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 tracking-tight px-2">
                            Quem já <span className="text-cyan-400">transformou</span> sua presença
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-400 font-light max-w-2xl mx-auto px-2">
                            Histórias reais de criadores que elevaram seu jogo digital
                        </p>
                    </motion.div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative"
                            >
                                {/* Card Glow */}
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/20 to-amber-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

                                {/* Card */}
                                <div className="relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-500/30 transition-all duration-300">

                                    {/* Quote Icon */}
                                    <Quote className="w-8 h-8 text-cyan-500/30 mb-4" />

                                    {/* Content */}
                                    <p className="text-gray-300 leading-relaxed mb-6">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Metric Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
                                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                                        <span className="text-cyan-300 font-bold text-sm">{testimonial.metric}</span>
                                        <span className="text-cyan-400/70 text-xs">{testimonial.metricLabel}</span>
                                    </div>

                                    {/* Author */}
                                    <div className="flex items-center gap-3 pt-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-amber-500 p-0.5">
                                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{testimonial.name}</p>
                                            <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded">{testimonial.platform}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}
