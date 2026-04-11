import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "LABORCLIN",
  description: "Sistema de gestão de equipamentos",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
