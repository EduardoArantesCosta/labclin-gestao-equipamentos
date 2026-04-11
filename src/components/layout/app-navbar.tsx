"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Gestão",
    href: "/equipamentos",
  },
  {
    label: "Equipamentos",
    href: "/cadastros/equipamentos",
  },
  {
    label: "Empresa",
    href: "/cadastros/empresas",
  },
  {
    label: "Marcas",
    href: "/cadastros/marcas",
  },
  {
    label: "Tipos",
    href: "/cadastros/tipos-equipamentos",
  },
  {
    label: "Intervalos",
    href: "/cadastros/intervalos",
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname.startsWith(href);
}

export function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/dashboard" className="shrink-0">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center">
              <Image
                src="../../logo.svg"
                alt="Logo da Laborclin"
                width={220}
                height={60}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>
        </Link>

        <nav className="flex flex-1 flex-wrap items-center justify-end gap-2">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
