"use client";

import { useEffect } from "react";
import { CinematicHero } from "@/components/home/CinematicHero";
import { Header } from "@/components/layout/Header";
import { SecondaryHero } from "@/components/home/SecondaryHero";
import { FeaturesComparison } from "@/components/home/FeaturesComparison";
import { TrustHero } from "@/components/home/TrustHero";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/home/Footer";
import { trackHomeVisit } from "@/actions/analytics";

import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";

const THEME = { primary: "236 72 153", accent: "6 182 212", background: "0 0 0" };

export default function HomePage() {
  useEffect(() => {
    trackHomeVisit();
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden bg-black">
      {/* Global Background Particles */}
      {/* Global Background - Elegant Cyber Grid */}
      <div className="fixed inset-0 z-0">
        <LiveBackgrounds type="tech-grid" enabled={true} themeColors={THEME} />
      </div>

      <Header />

      {/* Unified Cinematic Hero (Background + Animation) */}
      <main className="relative z-10 w-full">
        <CinematicHero />
      </main>

      {/* Elegant Separator (Cyan) */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgb(var(--color-accent))] to-transparent opacity-80 shadow-[0_0_15px_rgba(6,182,212,0.5)] relative z-20" />

      {/* Persuasive Introduction Section - Premium Redesign */}
      <section className="relative z-10 w-full py-32 bg-transparent perspective-[2000px]">

        <div className="container mx-auto px-4">

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 relative z-20">

            {/* --- CARD 1: THE PROBLEM (Styled like Solution) --- */}
            <div className="group relative rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:-rotate-1">
              {/* Cyan Glow (Uniform Style) */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#67FEFD] to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-100 group-hover:blur-xl transition duration-700" />

              <div className="relative h-full !min-h-[300px] p-12 md:p-20 rounded-3xl bg-black/60 backdrop-blur-3xl border border-[rgb(var(--color-accent)_/_0.3)] shadow-2xl flex flex-col items-center text-center overflow-hidden">

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-20 transition duration-700 pointer-events-none" />
                <div className="absolute -inset-full top-0 block h-[200%] w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:animate-shine" />

                <div className="relative z-10 flex flex-col items-center h-full w-full">
                  <div style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 mb-6 p-2 pr-4 rounded-full bg-red-500/10 border border-red-500/20">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </span>
                    <span style={{ paddingRight: "20px" }} className="text-red-500 font-bold text-xs uppercase tracking-wider">O Problema</span>
                  </div>

                  <h2 className="!text-[1.875rem] font-bold leading-tight mb-6 text-white/90">
                    Links dispersos matam conversão.
                  </h2>

                  <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                    Seu público se perde tentando te encontrar. Cada clique extra é um seguidor a menos.
                    <strong className="block mt-4 text-white">O caos digital te custa caro.</strong>
                  </p>

                  <button
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                    className="group/btn relative px-8 py-3 rounded-full bg-red-500/10 border border-red-500/50 text-red-500 font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-red-500 hover:text-white hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] w-full max-w-[280px]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center justify-center gap-3">
                      Saiba mais ...
                      <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* --- CARD 2: THE SOLUTION --- */}
            <div className="group relative rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:rotate-1">
              {/* Cyan Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#67FEFD] to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-100 group-hover:blur-xl transition duration-700" />

              <div className="relative h-full !min-h-[300px] p-12 md:p-20 rounded-3xl bg-black/60 backdrop-blur-3xl border border-[rgb(var(--color-accent)_/_0.3)] shadow-2xl flex flex-col items-center text-center overflow-hidden">

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-20 transition duration-700 pointer-events-none" />
                <div className="absolute -inset-full top-0 block h-[200%] w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:animate-shine" />

                <div className="relative z-10 flex flex-col items-center h-full w-full">
                  <div style={{ marginTop: "10px" }} className="inline-flex items-center gap-2 mb-6 p-2 pr-4 rounded-full bg-[rgb(var(--color-accent)_/_0.1)] border border-[rgb(var(--color-accent)_/_0.2)]">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgb(var(--color-accent))] text-black">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span style={{ paddingRight: "20px" }} className="text-[rgb(var(--color-accent))] font-bold text-xs uppercase tracking-wider">A Solução Definitiva</span>
                  </div>

                  <h3 className="!text-[1.875rem] font-bold text-white mb-6">
                    Centralize. Engaje. <span className="text-[rgb(var(--color-accent))] drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">Domine.</span>
                  </h3>

                  <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                    Um único link inteligente. Design de elite. Carregamento instantâneo.
                    <strong className="block mt-4 text-white">Tudo organizado, DO SEU JEITO!</strong>
                  </p>

                  <button
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                    className="group/btn relative px-8 py-3 rounded-full bg-[rgb(var(--color-accent)_/_0.1)] border border-[rgb(var(--color-accent)_/_0.5)] text-[rgb(var(--color-accent))] font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-[rgb(var(--color-accent))] hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] w-full max-w-[280px]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <span className="relative flex items-center justify-center gap-3">
                      Teste Grátis
                      <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* Secondary Hero - Cinematic Conclusion */}
      <div id="funcionalidades">
        <SecondaryHero />
      </div>

      {/* Features & Pricing Comparison */}
      <div id="precos" className="relative z-10">
        <FeaturesComparison />
      </div>

      {/* Trust Section - No Credit Card */}
      <TrustHero />

      {/* Testimonials / Social Proof */}
      <div id="depoimentos">
        <Testimonials />
      </div>

      {/* Footer */}
      <Footer />

    </div >
  );
}
