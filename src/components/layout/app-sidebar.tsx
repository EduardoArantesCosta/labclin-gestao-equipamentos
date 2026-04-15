"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  Settings2, 
  ChevronLeft,
  FlaskConical,
  Building2,
  Tag,
  Boxes,
  CalendarClock
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Equipamentos",
    href: "/equipamentos",
    icon: Package,
  },
  {
    title: "Calibrações",
    href: "/calibracoes",
    icon: CalendarClock,
  },
]

const cadastroNavItems = [
  {
    title: "Tipos de Equipamento",
    href: "/cadastros/tipos-equipamento",
    icon: Boxes,
  },
  {
    title: "Marcas",
    href: "/cadastros/marcas",
    icon: Tag,
  },
  {
    title: "Empresas de Calibração",
    href: "/cadastros/empresas",
    icon: Building2,
  },
]

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <FlaskConical className="h-8 w-8" />
              <span className="text-xl font-bold">LABORCLIN</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <FlaskConical className="h-8 w-8" />
            </Link>
          )}
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Principal
              </p>
            )}
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const NavItem = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return NavItem
            })}
          </div>

          <Separator className="my-4 bg-sidebar-border" />

          {/* Cadastros */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Cadastros
              </p>
            )}
            {cadastroNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const NavItem = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return NavItem
            })}
          </div>
        </nav>

        {/* Footer with toggle button */}
        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "w-full justify-center text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              !collapsed && "justify-start"
            )}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
            {!collapsed && <span className="ml-2">Recolher</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
