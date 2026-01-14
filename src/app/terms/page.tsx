"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";
import { Card } from "@/components/ui";

const THEME = { primary: "236 72 153", accent: "6 182 212", background: "0 0 0" };

export default function TermsPage() {
    return (
        <div className="min-h-screen relative flex flex-col overflow-x-hidden bg-black">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <LiveBackgrounds type="warp-speed" enabled={true} themeColors={THEME} />
            </div>

            <Header />

            <main className="relative z-10 flex-grow pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-4xl" style={{ marginBottom: "200px" }}>
                    <Card
                        className="w-full bg-black/10 backdrop-blur-md border border-[rgb(var(--color-accent)_/_0.3)] shadow-2xl p-8 md:p-12"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white tracking-tight">
                            Termos de Uso
                        </h1>

                        <div className="text-gray-300 text-lg">
                            <p style={{ paddingBottom: "30px", opacity: 0.6 }}>
                                Última atualização: 13 de Janeiro de 2026
                            </p>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    1. Aceitação dos Termos
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Ao acessar e usar o MyProfile, você aceita e concorda em estar vinculado aos termos e disposições deste acordo.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    2. Descrição do Serviço
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    O MyProfile fornece uma plataforma para criar e gerenciar páginas de perfil personalizadas ("Link in Bio"). Reservamo-nos o direito de modificar, suspender ou descontinuar o serviço a qualquer momento.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    3. Responsabilidades do Usuário
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em não usar o serviço para qualquer finalidade ilegal ou não autorizada.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    4. Propriedade Intelectual
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Todo o conteúdo, marcas registradas e dados presentes no MyProfile são propriedade nossa ou de nossos licenciadores.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    5. Encerramento
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Podemos encerrar ou suspender seu acesso imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os Termos.
                                </p>
                            </section>
                        </div>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
