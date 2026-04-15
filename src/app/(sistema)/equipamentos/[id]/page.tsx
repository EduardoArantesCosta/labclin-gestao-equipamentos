import { Fragment } from "react";

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

type EmpresaCalibracao = {
  id: number;
  nome: string;
};

type LeituraCalibracao = {
  id: number;
  leituraPadrao: number;
  leituraInstrumento: number;
  erroEncontrado: number;
  toleranciaMinima: number;
  toleranciaMaxima: number;
  validado: boolean;
};

type Calibracao = {
  id: number;
  dataCalibracao: string;
  dataValidade: string;
  numeroCertificado: string;
  empresa: EmpresaCalibracao;
  leituras: LeituraCalibracao[];
};

type HistoricoStatus = {
  id: number;
  statusAnterior: string | null;
  statusNovo: string;
  dataAlteracao: string;
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
  limiteErro: number | null;
  situacao: string;
  tipo: TipoEquipamento;
  marca: Marca;
  intervalo: IntervaloCalibracao;
  ultimaCalibracao: Calibracao | null;
  calibracoes: Calibracao[];
  historicosStatus: HistoricoStatus[];
};

async function getEquipamento(id: string): Promise<Equipamento> {
  const response = await fetch(`http://localhost:3000/api/equipamentos/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamento");
  }

  return response.json();
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

export default async function EquipamentoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const equipamento = await getEquipamento(id);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              LABORCLIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Detalhes do Equipamento
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Visualização completa do equipamento, última calibração e histórico de status.
            </p>
          </div>

          <div className="grid gap-6 px-8 py-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">Informações gerais</h2>

              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  <strong>Código:</strong> {equipamento.codigo}
                </p>
                <p>
                  <strong>Número de série:</strong> {equipamento.numeroSerie || "-"}
                </p>
                <p>
                  <strong>Localização:</strong> {equipamento.localizacao || "-"}
                </p>
                <p>
                  <strong>Tipo:</strong> {equipamento.tipo.nome}
                </p>
                <p>
                  <strong>Marca:</strong> {equipamento.marca.nome}
                </p>
                <p>
                  <strong>Intervalo:</strong> {equipamento.intervalo.nome}
                </p>
                <p>
                  <strong>Limite de erro:</strong> {equipamento.limiteErro ?? "-"}
                </p>
                <p>
                  <strong>Situação:</strong> {formatarSituacao(equipamento.situacao)}
                </p>
                <p>
                  <strong>Status operacional:</strong>{" "}
                  {formatarStatusOperacional(equipamento.statusOperacional)}
                </p>
                <p>
                  <strong>Observação:</strong> {equipamento.observacao || "-"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">Última calibração</h2>

              {equipamento.ultimaCalibracao ? (
                <div className="space-y-3 text-sm text-slate-700">
                  <p>
                    <strong>Certificado:</strong> {equipamento.ultimaCalibracao.numeroCertificado}
                  </p>
                  <p>
                    <strong>Data da calibração:</strong>{" "}
                    {new Date(equipamento.ultimaCalibracao.dataCalibracao).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                  <p>
                    <strong>Validade:</strong>{" "}
                    {new Date(equipamento.ultimaCalibracao.dataValidade).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Este equipamento ainda não possui calibração cadastrada.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6 px-8 pb-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">
                Histórico de calibrações
              </h2>

              {equipamento.calibracoes.length > 0 ? (
                <div className="overflow-x-auto rounded-lg">
                  <table className="min-w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Data da calibração
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Validade
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Certificado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Empresa
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {equipamento.calibracoes.map((calibracao) => (
                        <Fragment key={calibracao.id}>
                          <tr>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {new Date(calibracao.dataCalibracao).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {new Date(calibracao.dataValidade).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {calibracao.numeroCertificado}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {calibracao.empresa?.nome || "-"}
                            </td>
                          </tr>

                          <tr>
                            <td colSpan={4} className="bg-slate-50 px-4 py-4">
                              <div className="overflow-x-auto">
                                <table className="min-w-full rounded-lg border">
                                  <thead>
                                    <tr className="bg-slate-100">
                                      <th className="border px-3 py-2 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Leitura padrão
                                      </th>
                                      <th className="border px-3 py-2 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Leitura instrumento
                                      </th>
                                      <th className="border px-3 py-2 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Erro encontrado
                                      </th>
                                      <th className="border px-3 py-2 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Tolerância mínima
                                      </th>
                                      <th className="border px-3 py-2 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Tolerância máxima
                                      </th>
                                      <th className="border px-3 py-2 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                        Validação
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {calibracao.leituras.map((leitura) => (
                                      <tr key={leitura.id}>
                                        <td className="border px-3 py-2 text-sm text-slate-700">
                                          {leitura.leituraPadrao}
                                        </td>
                                        <td className="border px-3 py-2 text-sm text-slate-700">
                                          {leitura.leituraInstrumento}
                                        </td>
                                        <td className="border px-3 py-2 text-sm text-slate-700">
                                          {leitura.erroEncontrado}
                                        </td>
                                        <td className="border px-3 py-2 text-sm text-slate-700">
                                          {leitura.toleranciaMinima}
                                        </td>
                                        <td className="border px-3 py-2 text-sm text-slate-700">
                                          {leitura.toleranciaMaxima}
                                        </td>
                                        <td className="border px-3 py-2 text-sm">
                                          <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                              leitura.validado
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                          >
                                            {leitura.validado ? "VALIDADO" : "NÃO VALIDADO"}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhuma calibração encontrada para este equipamento.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-800">Histórico de status</h2>

              {equipamento.historicosStatus.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Status anterior
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Novo status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {equipamento.historicosStatus.map((historico) => (
                        <tr key={historico.id}>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {new Date(historico.dataAlteracao).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {historico.statusAnterior
                              ? formatarStatusOperacional(historico.statusAnterior)
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {formatarStatusOperacional(historico.statusNovo)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Nenhum histórico de status encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
