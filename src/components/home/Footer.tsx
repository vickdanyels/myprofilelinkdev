"use client";

import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = {
    produto: [
        { label: "Funcionalidades", href: "#funcionalidades" },
        { label: "Preços", href: "#precos" },
        { label: "Templates", href: "#templates" },
    ],
    legal: [
        { label: "Termos de Uso", href: "/terms" },
        { label: "Privacidade", href: "/privacy" },
        { label: "Cookies", href: "/cookies" },
    ],
};

const SOCIAL_LINKS = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:contato@myprofile.com", label: "Email" },
];

export function Footer() {
    return (
        <footer className="relative z-10 w-full bg-black border-t border-white/5">

            {/* Final CTA Section */}
            <div className="relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-radial from-cyan-500/15 via-transparent to-transparent blur-[100px] pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10" style={{ marginBottom: '50px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 px-2" style={{ marginTop: '50px' }}>
                            Pronto para <span className="text-cyan-400">transformar</span> sua bio?
                        </h2>
                        <p className="text-gray-400 text-base sm:text-lg mb-8 px-2">
                            Junte-se a milhares de criadores que já elevaram sua presença digital.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register" className="pro-badge w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base transition-all duration-300 hover:-translate-y-1 flex justify-center">
                                <span className="flex items-center justify-center gap-2">
                                    Começar Grátis
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </span>
                            </Link>
                            <Link href="/login" className="px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-300 text-sm sm:text-base">
                                Já tenho conta
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16" style={{ marginTop: '50px' }}>
                <div className="flex flex-col md:flex-row md:justify-between gap-8">

                    {/* Brand Column */}
                    <div className="md:max-w-xs text-center md:text-left">
                        <Link href="/" className="text-xl sm:text-2xl font-black text-white mb-4 block">
                            My<span className="text-cyan-400">Profile</span>
                        </Link>
                        <p className="text-gray-500 text-sm mb-6">
                            Sua bio digital premium. Centralize, engaje e domine.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4 sm:gap-3 justify-center md:justify-start">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5 sm:w-4 sm:h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="text-center md:text-left">
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Produto</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.produto.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-gray-500 hover:text-white transition-colors text-base sm:text-sm py-1">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-center md:text-left">
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.legal.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-gray-500 hover:text-white transition-colors text-base sm:text-sm py-1">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} MyProfile. Todos os direitos reservados.
                        </p>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                            Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500" /> no Brasil
                        </p>
                    </div>
                </div>
            </div>

        </footer>
    );
}
