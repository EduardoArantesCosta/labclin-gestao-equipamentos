import Link from "next/link"
import { Package, AlertTriangle, Clock, CheckCircle, Wrench, ArrowRight } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { formatarDataBR } from "@/lib/dashboard"
import { DashboardResponse } from "@/types/dashboard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

async function buscarDashboard(): Promise<DashboardResponse | null> {
  try {
    const response = await fetch("http://localhost:3000/api/dashboard", {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch {
    return null
  }
}

function getSituacaoBadgeVariant(situacao: string) {
  if (situacao === "VENCIDO") {
    return "destructive"
  }
  if (situacao === "PROXIMO_DO_VENCIMENTO") {
    return "warning"
  }
  if (situacao === "EM_CALIBRACAO") {
    return "info"
  }
  return "success"
}

function getSituacaoLabel(situacao: string) {
  if (situacao === "PROXIMO_DO_VENCIMENTO") {
    return "Próximo do vencimento"
  }
  if (situacao === "EM_CALIBRACAO") {
    return "Em calibração"
  }
  if (situacao === "VENCIDO") {
    return "Vencido"
  }
  return "OK"
}

export default async function DashboardPage() {
  const data = await buscarDashboard()

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6">
          <h1 className="text-xl font-semibold text-destructive">
            Erro ao carregar dashboard
          </h1>
          <p className="mt-2 text-sm text-destructive/80">
            Não foi possível buscar os dados do painel.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardCard
          titulo="Equipamentos ativos"
          valor={data.totalAtivos}
          descricao="Total em uso no sistema"
          icon={Package}
          variant="default"
        />

        <DashboardCard
          titulo="Vencidos"
          valor={data.vencidos}
          descricao="Calibração vencida"
          icon={AlertTriangle}
          variant="danger"
        />

        <DashboardCard
          titulo="Próximos do vencimento"
          valor={data.proximosDoVencimento}
          descricao="Vencem em até 30 dias"
          icon={Clock}
          variant="warning"
        />

        <DashboardCard
          titulo="OK"
          valor={data.ok}
          descricao="Validade em dia"
          icon={CheckCircle}
          variant="success"
        />

        <DashboardCard
          titulo="Em calibração"
          valor={data.emCalibracao}
          descricao="Temporariamente indisponíveis"
          icon={Wrench}
          variant="info"
        />
      </section>

      {/* Sections */}
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardSection
          titulo="Equipamentos críticos"
          descricao="Equipamentos vencidos ou próximos do vencimento"
        >
          {data.vencendoEmBreve.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum equipamento crítico encontrado.
            </p>
          ) : (
            <div className="space-y-3">
              {data.vencendoEmBreve.map((equipamento) => (
                <div
                  key={equipamento.id}
                  className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {equipamento.codigo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Série: {equipamento.numeroSerie || "-"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Localização: {equipamento.localizacao || "-"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Validade: {formatarDataBR(equipamento.dataValidade)}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <Badge variant={getSituacaoBadgeVariant(equipamento.situacao)}>
                        {getSituacaoLabel(equipamento.situacao)}
                      </Badge>

                      <Button variant="link" size="sm" asChild className="h-auto p-0">
                        <Link href={`/equipamentos/${equipamento.id}`}>
                          Ver equipamento
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          titulo="Últimas calibrações"
          descricao="Registros mais recentes de calibração"
        >
          {data.ultimasCalibracoes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma calibração encontrada.
            </p>
          ) : (
            <div className="space-y-3">
              {data.ultimasCalibracoes.map((calibracao) => (
                <div
                  key={calibracao.id}
                  className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {calibracao.codigo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Certificado: {calibracao.numeroCertificado}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Empresa: {calibracao.empresa}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Data: {formatarDataBR(calibracao.dataCalibracao)}
                      </p>
                    </div>

                    <Button variant="link" size="sm" asChild className="h-auto p-0">
                      <Link href={`/equipamentos/${calibracao.equipamentoId}`}>
                        Ver equipamento
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>
      </section>
    </div>
  )
}
