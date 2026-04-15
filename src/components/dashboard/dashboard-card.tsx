import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

type DashboardCardProps = {
  titulo: string
  valor: number
  descricao: string
  icon?: LucideIcon
  variant?: "default" | "success" | "warning" | "danger" | "info"
}

const variantStyles = {
  default: {
    icon: "bg-primary/10 text-primary",
    accent: "bg-primary",
  },
  success: {
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    accent: "bg-emerald-500",
  },
  warning: {
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    accent: "bg-amber-500",
  },
  danger: {
    icon: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    accent: "bg-red-500",
  },
  info: {
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    accent: "bg-blue-500",
  },
}

export function DashboardCard({
  titulo,
  valor,
  descricao,
  icon: Icon,
  variant = "default",
}: DashboardCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className="relative overflow-hidden">
      <div className={cn("absolute left-0 top-0 h-full w-1", styles.accent)} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
            <h2 className="text-3xl font-bold text-foreground">{valor}</h2>
            <p className="text-xs text-muted-foreground">{descricao}</p>
          </div>
          {Icon && (
            <div className={cn("rounded-lg p-2.5", styles.icon)}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
