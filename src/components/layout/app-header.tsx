"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Bell, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/equipamentos": "Equipamentos",
  "/calibracoes": "Calibrações",
  "/cadastros/tipos-equipamento": "Tipos de Equipamento",
  "/cadastros/marcas": "Marcas",
  "/cadastros/empresas": "Empresas de Calibração",
}

export function AppHeader() {
  const pathname = usePathname()
  
  const getPageTitle = () => {
    // Check exact match first
    if (pageTitles[pathname]) {
      return pageTitles[pathname]
    }
    
    // Check for detail pages
    if (pathname.startsWith("/equipamentos/")) {
      return "Detalhes do Equipamento"
    }
    
    // Fallback
    return "LABORCLIN"
  }

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-64 pl-9"
            />
          </div>

          <Separator orientation="vertical" className="mx-2 h-6" />

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                <span className="sr-only">Notificações</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notificações</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <User className="h-4 w-4" />
                <span className="sr-only">Usuário</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Usuário</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  )
}
