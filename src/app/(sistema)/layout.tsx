import { ReactNode } from "react";
import { AppNavbar } from "../../components/layout/app-navbar";

type SistemaLayoutProps = {
  children: ReactNode;
};

export default function SistemaLayout({ children }: SistemaLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AppNavbar />

      <main className="mx-auto w-full px-6 py-6">{children}</main>
    </div>
  );
}
