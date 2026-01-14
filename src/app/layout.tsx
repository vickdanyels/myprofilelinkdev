import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyProfile - Sua Bio Digital Premium",
  description: "Crie sua página de links profissional e impulsione sua presença digital. A plataforma premium para criadores de conteúdo e profissionais digitais.",
  keywords: ["link in bio", "bio digital", "links", "criadores de conteúdo", "freelancers"],
  authors: [{ name: "MyProfile" }],
  openGraph: {
    title: "MyProfile - Sua Bio Digital Premium",
    description: "Crie sua página de links profissional e impulsione sua presença digital.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
