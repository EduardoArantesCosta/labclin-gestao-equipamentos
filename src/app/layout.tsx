import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LABORCLIN Gestão de Equipamentos",
  description: "Sistema interno para controle de equipamentos e calibrações",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
