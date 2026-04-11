import Link from "next/link";
import { DashboardCard } from "../../components/dashboard/dashboard-card";
import { DashboardSection } from "../../components/dashboard/dashboard-section";
import { formatarDataBR } from "../../lib/dashboard";
import { DashboardResponse } from "../../types/dashboard";

async function buscarDashboard(): Promise<DashboardResponse | null> {
  try {
    const response = await fetch("http://localhost:3000/api/dashboard", {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

function getSituacaoBadgeClasses(situacao: string) {
  if (situacao === "VENCIDO") {
    return "bg-red-100 text-red-700";
  }

  if (situacao === "PROXIMO_DO_VENCIMENTO") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (situacao === "EM_CALIBRACAO") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-green-100 text-green-700";
}

function getSituacaoLabel(situacao: string) {
  if (situacao === "PROXIMO_DO_VENCIMENTO") {
    return "Próximo do vencimento";
  }

  if (situacao === "EM_CALIBRACAO") {
    return "Em calibração";
  }

  if (situacao === "VENCIDO") {
    return "Vencido";
  }

  return "OK";
}

export default async function DashboardPage() {
  const data = await buscarDashboard();

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-xl font-semibold text-red-700">Erro ao carregar dashboard</h1>
            <p className="mt-2 text-sm text-red-600">Não foi possível buscar os dados do painel.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Equipamentos</h1>
          <p className="text-sm text-gray-600">
            Visão geral do controle de calibração e situação dos equipamentos.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <DashboardCard
            titulo="Equipamentos ativos"
            valor={data.totalAtivos}
            descricao="Total de equipamentos em uso no sistema"
          />

          <DashboardCard
            titulo="Vencidos"
            valor={data.vencidos}
            descricao="Equipamentos com calibração vencida"
          />

          <DashboardCard
            titulo="Próximos do vencimento"
            valor={data.proximosDoVencimento}
            descricao="Equipamentos que vencem em até 30 dias"
          />

          <DashboardCard titulo="OK" valor={data.ok} descricao="Equipamentos com validade em dia" />

          <DashboardCard
            titulo="Em calibração"
            valor={data.emCalibracao}
            descricao="Equipamentos temporariamente indisponíveis"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardSection
            titulo="Equipamentos críticos"
            descricao="Equipamentos vencidos ou próximos do vencimento"
          >
            {data.vencendoEmBreve.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum equipamento crítico encontrado.</p>
            ) : (
              <div className="space-y-3">
                {data.vencendoEmBreve.map((equipamento) => (
                  <div key={equipamento.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900">{equipamento.codigo}</p>
                        <p className="text-sm text-gray-600">Série: {equipamento.numeroSerie}</p>
                        <p className="text-sm text-gray-600">
                          Localização: {equipamento.localizacao || "-"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Validade: {formatarDataBR(equipamento.dataValidade)}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-2 md:items-end">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getSituacaoBadgeClasses(
                            equipamento.situacao,
                          )}`}
                        >
                          {getSituacaoLabel(equipamento.situacao)}
                        </span>

                        <Link
                          href={`/equipamentos/${equipamento.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Ver equipamento
                        </Link>
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
              <p className="text-sm text-gray-500">Nenhuma calibração encontrada.</p>
            ) : (
              <div className="space-y-3">
                {data.ultimasCalibracoes.map((calibracao) => (
                  <div key={calibracao.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900">{calibracao.codigo}</p>
                        <p className="text-sm text-gray-600">
                          Certificado: {calibracao.numeroCertificado}
                        </p>
                        <p className="text-sm text-gray-600">Empresa: {calibracao.empresa}</p>
                        <p className="text-sm text-gray-600">
                          Data da calibração: {formatarDataBR(calibracao.dataCalibracao)}
                        </p>
                      </div>

                      <Link
                        href={`/equipamentos/${calibracao.equipamentoId}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Ver equipamento
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardSection>
        </section>
      </div>
    </main>
  );
}
