import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guia Interativo — Anúncios no Instagram",
  description:
    "Guia interativo passo a passo para criar seus primeiros anúncios profissionais no Instagram.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
