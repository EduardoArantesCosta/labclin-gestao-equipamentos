import Link from "next/link";

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
      return "inline-flex rounded-full bg-red-500 px-4 py-1 text-sm font-bold text-white";
    case "PROXIMO DO VENCIMENTO":
      return "inline-flex rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-black";
    case "CALIBRADO":
      return "inline-flex rounded-full bg-green-500 px-4 py-1 text-sm font-bold text-white";
    case "EM CALIBRACAO":
      return "inline-flex rounded-full bg-blue-500 px-4 py-1 text-sm font-bold text-white";
    default:
      return "inline-flex rounded-full bg-gray-400 px-4 py-1 text-sm font-bold text-white";
  }
}

export default async function EquipamentosPage() {
  const equipamentos = await getEquipamentos();

  const prioridadeSituacao: Record<string, number> = {
    VENCIDO: 1,
    PROXIMO_DO_VENCIMENTO: 2,
    EM_CALIBRACAO: 3,
    CALIBRADO: 4,
  };

  const equipamentosOrdenados = [...equipamentos].sort((a, b) => {
    const prioridadeA = prioridadeSituacao[a.situacao] ?? 99;
    const prioridadeB = prioridadeSituacao[b.situacao] ?? 99;

    return prioridadeA - prioridadeB;
  });

  return (
    <main className="p-6">
      <div className="flex justify-center">
        <h1 className="mb-6 text-center text-2xl font-bold">GESTÃO DE EQUIPAMENTOS</h1>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-gray-600 uppercase">
              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">Código</th>
              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                Número de Série
              </th>
              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                Localização
              </th>

              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                Situação
              </th>
              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                Status Operacional
              </th>
              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                Validade
              </th>

              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">Ações</th>
            </tr>
          </thead>

          <tbody>
            {equipamentosOrdenados.map((equipamento) => (
              <tr key={equipamento.id} className="hover:bg-gray-50">
                <td className="border px-4 py-3">{equipamento.codigo}</td>
                <td className="border px-4 py-3">{equipamento.numeroSerie}</td>
                <td className="border px-4 py-3">{equipamento.localizacao || "-"}</td>
                <td className="border px-4 py-3">
                  <span className={getSituacaoStyle(equipamento.situacao)}>
                    {equipamento.situacao}
                  </span>
                </td>
                <td className="border px-4 py-3">{equipamento.statusOperacional}</td>
                <td className="border px-4 py-3">
                  {equipamento.ultimaCalibracao
                    ? new Date(equipamento.ultimaCalibracao.dataValidade).toLocaleDateString(
                        "pt-BR",
                      )
                    : "-"}
                </td>
                <td className="border px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/equipamentos/${equipamento.id}`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Ver
                    </Link>

                    <Link
                      href={`/equipamentos/${equipamento.id}/editar`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Editar
                    </Link>

                    <Link
                      href={`/equipamentos/${equipamento.id}/calibracoes/nova`}
                      className="rounded-lg border border-[#7D55C7] bg-[#7D55C7] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                    >
                      Calibração
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
