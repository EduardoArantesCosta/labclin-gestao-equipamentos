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
      <body>{children}</body>
    </html>
  );
}
