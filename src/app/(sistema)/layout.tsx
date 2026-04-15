"use client"

import { ReactNode, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { cn } from "@/lib/utils";

type SistemaLayoutProps = {
  children: ReactNode;
};

export default function SistemaLayout({ children }: SistemaLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          sidebarCollapsed ? "pl-16" : "pl-64"
        )}
      >
        <AppHeader />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
