"use client";

import { useMemo, useState } from "react";
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

type Props = {
  equipamentos: Equipamento[];
};

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

export function EquipamentosTable({ equipamentos }: Props) {
  const [tipoSelecionado, setTipoSelecionado] = useState("TODOS");

  const tiposDisponiveis = useMemo(() => {
    const tiposUnicos = equipamentos.map((equipamento) => equipamento.tipo.nome);

    return ["TODOS", ...Array.from(new Set(tiposUnicos)).sort()];
  }, [equipamentos]);

  const prioridadeSituacao: Record<string, number> = {
    VENCIDO: 1,
    PROXIMO_DO_VENCIMENTO: 2,
    EM_CALIBRACAO: 3,
    OK: 4,
  };

  const equipamentosFiltrados = useMemo(() => {
    const filtrados =
      tipoSelecionado === "TODOS"
        ? equipamentos
        : equipamentos.filter((equipamento) => equipamento.tipo.nome === tipoSelecionado);

    return [...filtrados].sort((a, b) => {
      const prioridadeA = prioridadeSituacao[a.situacao] ?? 99;
      const prioridadeB = prioridadeSituacao[b.situacao] ?? 99;

      return prioridadeA - prioridadeB;
    });
  }, [equipamentos, tipoSelecionado]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Equipamentos cadastrados</h2>
          <p className="mt-1 text-sm text-slate-500">
            Visualização geral dos equipamentos monitorados no sistema.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <label htmlFor="tipo" className="mb-2 block text-sm font-medium text-slate-700">
            Filtrar por tipo
          </label>
          <select
            id="tipo"
            value={tipoSelecionado}
            onChange={(event) => setTipoSelecionado(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          >
            {tiposDisponiveis.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo === "TODOS" ? "Todos os tipos" : tipo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <h1 className="mb-6 text-center text-2xl font-bold">GESTÃO DE EQUIPAMENTOS</h1>
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-gray-600 uppercase">
                <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                  Código
                </th>
                <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                  Número de Série
                </th>
                <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                  Localização
                </th>
                <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">Tipo</th>
                <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                  Situação
                </th>
                <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                  Status Operacional
                </th>
                <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                  Validade
                </th>
                <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {equipamentosFiltrados.map((equipamento) => (
                <tr
                  key={equipamento.id}
                  className={`transition-colors hover:bg-slate-50 ${
                    equipamento.situacao === "VENCIDO" ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {equipamento.codigo}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {equipamento.numeroSerie || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {equipamento.localizacao || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">{equipamento.tipo.nome}</td>

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
                      ? new Date(equipamento.ultimaCalibracao.dataValidade).toLocaleDateString(
                          "pt-BR",
                        )
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
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
      </div>
    </>
  );
}
