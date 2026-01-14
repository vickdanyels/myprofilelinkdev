"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";
import { Card } from "@/components/ui";

const THEME = { primary: "236 72 153", accent: "6 182 212", background: "0 0 0" };

export default function PrivacyPage() {
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
                            Política de Privacidade
                        </h1>

                        <div className="text-gray-300 text-lg">
                            <p style={{ paddingBottom: "30px", opacity: 0.6 }}>
                                Última atualização: 13 de Janeiro de 2026
                            </p>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    1. Coleta de Informações
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Coletamos informações que você nos fornece diretamente ao criar uma conta, como seu nome, endereço de e-mail e informações de perfil público.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    2. Uso das Informações
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Usamos as informações coletadas para operar, manter e melhorar nossos serviços, bem como para nos comunicarmos com você sobre atualizações e ofertas.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    3. Compartilhamento de Dados
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Não vendemos seus dados pessoais a terceiros. Podemos compartilhar informações com prestadores de serviços que nos ajudam a operar nossa plataforma.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    4. Cookies e Rastreamento
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Utilizamos cookies e tecnologias semelhantes para rastrear a atividade em nosso serviço e manter certas informações para melhorar sua experiência.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    5. Segurança
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    A segurança dos seus dados é importante para nós, mas lembre-se de que nenhum método de transmissão pela Internet é 100% seguro.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    6. Contato
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através do nosso suporte.
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
