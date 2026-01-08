import Link from "next/link";
import { Button } from "@/components/ui";
import {
  Zap,
  Link2,
  Palette,
  BarChart3,
  Smartphone,
  Shield,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

import { trackHomeVisit } from "@/actions/analytics";

export default function HomePage() {
  trackHomeVisit();

  return (
    <div className="min-h-screen relative">
      {/* Video Background */}
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="video-bg"
        >
          <source src="/background-video.mp4?v=2" type="video/mp4" />
        </video>
        <div className="video-overlay" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[rgb(var(--color-border))]/50 bg-[rgb(var(--color-background))]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center shadow-lg shadow-[rgb(var(--color-primary))]/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="gradient-text">MyProfile</span>
              <span className="text-[rgb(var(--color-text-primary))]">Pro</span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-accent))] transition-colors"
              >
                Recursos
              </a>
              <a
                href="#pricing"
                className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-accent))] transition-colors"
              >
                Preços
              </a>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors hidden sm:block"
              >
                Entrar
              </Link>
              <Link href="/register">
                <Button size="sm">Começar grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--color-surface))]/80 border border-[rgb(var(--color-border))] text-sm mb-8">
            <Sparkles className="w-4 h-4 text-[rgb(var(--color-accent))]" />
            <span className="text-[rgb(var(--color-text-secondary))]">
              A plataforma premium para criadores
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[rgb(var(--color-text-primary))] leading-tight mb-6">
            Todos os seus links em{" "}
            <span className="gradient-text">uma página incrível</span>
          </h1>

          <p className="text-lg sm:text-xl text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto mb-10">
            Crie sua bio digital profissional em minutos. Compartilhe links,
            destaque seu trabalho e converta seguidores em clientes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/register">
              <Button size="lg" className="shadow-lg shadow-[rgb(var(--color-primary))]/30">
                Criar minha página grátis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">
                Ver recursos
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[rgb(var(--color-text-muted))]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[rgb(var(--color-success))]" />
              Grátis para começar
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[rgb(var(--color-success))]" />
              Setup em 2 minutos
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[rgb(var(--color-success))]" />
              Sem cartão de crédito
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
              Tudo que você precisa para{" "}
              <span className="gradient-text">crescer online</span>
            </h2>
            <p className="text-[rgb(var(--color-text-secondary))] max-w-xl mx-auto">
              Recursos profissionais para impulsionar sua presença digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Link2 className="w-6 h-6" />}
              title="Links ilimitados"
              description="Adicione todos os seus links importantes em um só lugar"
            />
            <FeatureCard
              icon={<Palette className="w-6 h-6" />}
              title="Temas personalizados"
              description="Combine com sua marca usando cores e estilos únicos"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Analytics avançado"
              description="Acompanhe cliques e entenda seu público"
              badge="PRO"
            />
            <FeatureCard
              icon={<Smartphone className="w-6 h-6" />}
              title="Mobile-first"
              description="Experiência perfeita em qualquer dispositivo"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Seguro e rápido"
              description="Performance otimizada com proteção de dados"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Domínio próprio"
              description="Use seu próprio domínio para mais profissionalismo"
              badge="PRO"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-4 bg-[rgb(var(--color-surface))]/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
              Planos para cada necessidade
            </h2>
            <p className="text-[rgb(var(--color-text-secondary))]">
              Comece grátis e evolua conforme seu crescimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))]">
              <h3 className="text-xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                Free
              </h3>
              <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                Perfeito para começar
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[rgb(var(--color-text-primary))]">
                  R$0
                </span>
                <span className="text-[rgb(var(--color-text-muted))]">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>1 página pública</PricingFeature>
                <PricingFeature>Links para redes sociais</PricingFeature>
                <PricingFeature>Tema padrão</PricingFeature>
                <PricingFeature>URL personalizada</PricingFeature>
              </ul>
              <Link href="/register" className="block">
                <Button variant="secondary" fullWidth>
                  Começar grátis
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-accent))]/10 border border-[rgb(var(--color-primary))]/50 shadow-lg shadow-[rgb(var(--color-primary))]/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] text-white text-sm font-medium shadow-lg">
                Popular
              </div>
              <h3 className="text-xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                Pro
              </h3>
              <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                Para criadores sérios
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[rgb(var(--color-text-primary))]">
                  R$19
                </span>
                <span className="text-[rgb(var(--color-text-muted))]">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>Tudo do plano Free</PricingFeature>
                <PricingFeature>Temas premium</PricingFeature>
                <PricingFeature>Analytics de cliques</PricingFeature>
                <PricingFeature>Cores personalizadas</PricingFeature>
                <PricingFeature>Remoção da marca</PricingFeature>
                <PricingFeature>Domínio próprio</PricingFeature>
              </ul>
              <Link href="/register" className="block">
                <Button fullWidth>
                  Assinar Pro
                  <Sparkles className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
            Pronto para transformar sua presença digital?
          </h2>
          <p className="text-[rgb(var(--color-text-secondary))] mb-8">
            Junte-se a milhares de criadores que já usam MyProfile
          </p>
          <Link href="/register">
            <Button size="lg" className="shadow-lg shadow-[rgb(var(--color-primary))]/30">
              Criar minha página grátis
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-[rgb(var(--color-border))]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="gradient-text">MyProfile</span>
              <span className="text-[rgb(var(--color-text-primary))]">Pro</span>
            </Link>

            <div className="flex items-center gap-6 text-sm text-[rgb(var(--color-text-muted))]">
              <Link href="/terms" className="hover:text-[rgb(var(--color-accent))]">
                Termos
              </Link>
              <Link href="/privacy" className="hover:text-[rgb(var(--color-accent))]">
                Privacidade
              </Link>
              <Link href="/contact" className="hover:text-[rgb(var(--color-accent))]">
                Contato
              </Link>
            </div>

            <p className="text-sm text-[rgb(var(--color-text-muted))]">
              © 2026 MyProfile. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="group relative p-6 rounded-2xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))]/50 transition-all duration-300">
      {badge && (
        <span className="absolute top-4 right-4 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] text-white rounded-full">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))]/20 to-[rgb(var(--color-accent))]/20 flex items-center justify-center text-[rgb(var(--color-accent))] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-shadow duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-2">
        {title}
      </h3>
      <p className="text-[rgb(var(--color-text-secondary))] text-sm">
        {description}
      </p>
    </div>
  );
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))]">
      <Check className="w-4 h-4 text-[rgb(var(--color-accent))]" />
      {children}
    </li>
  );
}
