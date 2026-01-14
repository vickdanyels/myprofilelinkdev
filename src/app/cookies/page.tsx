"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/home/Footer";
import { LiveBackgrounds } from "@/components/profile/LiveBackgrounds";
import { Card } from "@/components/ui";

const THEME = { primary: "236 72 153", accent: "6 182 212", background: "0 0 0" };

export default function CookiesPage() {
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
                            Política de Cookies
                        </h1>

                        <div className="text-gray-300 text-lg">
                            <p style={{ paddingBottom: "30px", opacity: 0.6 }}>
                                Última atualização: 13 de Janeiro de 2026
                            </p>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    1. O que são Cookies?
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de maneira mais eficiente e fornecer informações aos proprietários do site.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    2. Como usamos Cookies
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Utilizamos cookies para entender como você interage com nosso conteúdo e para melhorar sua experiência ao visitar o nosso site. Por exemplo, alguns cookies lembram o seu idioma ou preferências para que você não precise fazer essas escolhas repetidamente.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    3. Tipos de Cookies que utilizamos
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af", marginBottom: "15px" }}>
                                    <strong>Cookies Essenciais:</strong> Necessários para o funcionamento do site. Sem eles, o site não funcionaria corretamente.
                                </p>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af", marginBottom: "15px" }}>
                                    <strong>Cookies de Desempenho:</strong> Coletam informações sobre como você usa o site, como quais páginas você visitou e quais links clicou. Nenhuma dessas informações pode ser usada para identificá-lo.
                                </p>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    <strong>Cookies de Marketing:</strong> Rastreiam sua atividade online para ajudar os anunciantes a entregar publicidade mais relevante ou limitar quantas vezes você vê um anúncio.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    4. Gerenciando Cookies
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Você pode controlar e/ou excluir cookies como desejar. Você pode excluir todos os cookies que já estão no seu computador e pode configurar a maioria dos navegadores para impedir que eles sejam colocados.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    5. Alterações na Política de Cookies
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Podemos atualizar nossa Política de Cookies periodicamente. Recomendamos que você revise esta página regularmente para quaisquer alterações.
                                </p>
                            </section>

                            <section style={{ marginBottom: "60px" }}>
                                <h2 style={{ marginBottom: "25px", color: "white", fontWeight: "bold", fontSize: "1.5rem" }}>
                                    6. Contato
                                </h2>
                                <p style={{ lineHeight: "1.8", color: "#9ca3af" }}>
                                    Se você tiver dúvidas sobre o uso de cookies em nosso site, entre em contato conosco através do nosso suporte.
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
