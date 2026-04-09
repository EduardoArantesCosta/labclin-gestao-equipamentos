type TipoEquipamento = {
  id: number;
  nome: string;
};

type Marca = {
  id: number;
  nome: string;
};

type IntervaloCalibracao = {
  id: number;
  nome: string;
  dias: number | null;
};

type Calibracao = {
  id: number;
  dataCalibracao: string;
  dataValidade: string;
  numeroCertificado: string;
};

type Equipamento = {
  id: number;
  codigo: string;
  numeroSerie: string | null;
  localizacao: string | null;
  observacao: string | null;
  statusOperacional: string;
  ativo: boolean;
  createdAt: string;
  situacao: string;
  tipo: TipoEquipamento;
  marca: Marca;
  intervalo: IntervaloCalibracao;
  ultimaCalibracao: Calibracao | null;
};

async function getEquipamentos(): Promise<Equipamento[]> {
  const response = await fetch("http://localhost:3000/api/equipamentos", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamentos");
  }

  return response.json();
}

function getSituacaoStyle(situacao: string) {
  switch (situacao) {
    case "VENCIDO":
      return "inline-flex min-w-[110px] justify-center rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold tracking-wide text-white";
    case "PROXIMO_DO_VENCIMENTO":
      return "inline-flex min-w-[170px] justify-center rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-bold tracking-wide text-black";
    case "OK":
      return "inline-flex min-w-[70px] justify-center rounded-full bg-green-500 px-4 py-1.5 text-xs font-bold tracking-wide text-white";
    case "EM_CALIBRACAO":
      return "inline-flex min-w-[130px] justify-center rounded-full bg-blue-500 px-4 py-1.5 text-xs font-bold tracking-wide text-white";
    default:
      return "inline-flex min-w-[90px] justify-center rounded-full bg-gray-400 px-4 py-1.5 text-xs font-bold tracking-wide text-white";
  }
}

function formatarSituacao(situacao: string) {
  switch (situacao) {
    case "PROXIMO_DO_VENCIMENTO":
      return "Próximo do vencimento";
    case "EM_CALIBRACAO":
      return "Em calibração";
    default:
      return situacao;
  }
}

function formatarStatusOperacional(status: string) {
  switch (status) {
    case "AGUARDANDO_CALIBRACAO":
      return "Aguardando calibração";
    case "EM_CALIBRACAO":
      return "Em calibração";
    case "DISPONIVEL":
      return "Disponível";
    case "EM_USO":
      return "Em uso";
    default:
      return status;
  }
}

export default async function EquipamentosPage() {
  const equipamentos = await getEquipamentos();

  const prioridadeSituacao: Record<string, number> = {
    VENCIDO: 1,
    PROXIMO_DO_VENCIMENTO: 2,
    EM_CALIBRACAO: 3,
    OK: 4,
  };

  const equipamentosOrdenados = [...equipamentos].sort((a, b) => {
    const prioridadeA = prioridadeSituacao[a.situacao] ?? 99;
    const prioridadeB = prioridadeSituacao[b.situacao] ?? 99;

    return prioridadeA - prioridadeB;
  });

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-8xl mx-auto w-full px-6 py-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-bold tracking-[0.2em] text-[#523178] uppercase">
                LABORCLIN
              </span>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Gestão de Equipamentos
              </h1>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Equipamentos cadastrados</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Visualização geral dos equipamentos monitorados no sistema.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Código
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Número de Série
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Situação
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Status Operacional
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Validade
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {equipamentosOrdenados.map((equipamento) => (
                      <tr key={equipamento.id} className="transition-colors hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {equipamento.codigo}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {equipamento.numeroSerie || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span className={getSituacaoStyle(equipamento.situacao)}>
                            {formatarSituacao(equipamento.situacao)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {formatarStatusOperacional(equipamento.statusOperacional)}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {equipamento.ultimaCalibracao
                            ? new Date(
                                equipamento.ultimaCalibracao.dataValidade,
                              ).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              Ver
                            </button>

                            <button
                              type="button"
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              className="rounded-lg border border-[#7D55C7] bg-[#7D55C7] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                            >
                              Calibração
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
