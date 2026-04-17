"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
  limiteErro: number | null;
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
    case "PRÓXIMO DO VENCIMENTO":
      return "inline-flex rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-black";
    case "CALIBRADO":
    case "OK":
      return "inline-flex rounded-full bg-green-500 px-4 py-1 text-sm font-bold text-white";
    case "EM CALIBRAÇÃO":
      return "inline-flex rounded-full bg-blue-500 px-4 py-1 text-sm font-bold text-white";
    default:
      return "inline-flex rounded-full bg-gray-400 px-4 py-1 text-sm font-bold text-white";
  }
}

function formatarSituacao(situacao: string) {
  switch (situacao) {
    case "PROXIMO_DO_VENCIMENTO":
      return "PRÓXIMO DO VENCIMENTO";
    case "EM_CALIBRACAO":
      return "EM CALIBRAÇÃO";
    case "OK":
      return "CALIBRADO";
    default:
      return situacao;
  }
}

function formatarStatusOperacional(status: string) {
  switch (status) {
    case "AGUARDANDO_CALIBRACAO":
      return "AGUARDANDO CALIBRAÇÃO";
    case "EM_CALIBRACAO":
      return "EM CALIBRAÇÃO";
    case "DISPONIVEL":
      return "DISPONÍVEL";
    case "EM_USO":
      return "EM USO";
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
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-wide text-gray-600 uppercase">
            Equipamentos cadastrados
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Visualização geral dos equipamentos monitorados.
          </p>
        </div>

        <div className="flex items-end gap-4">
          <Link
            href="/cadastros/equipamentos"
            className="inline-flex items-center rounded-xl bg-[#523178] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            + Novo equipamento
          </Link>

          <div className="min-w-[260px]">
            <label
              htmlFor="tipo"
              className="mb-2 block text-xs font-bold tracking-wide text-gray-600 uppercase"
            >
              Filtrar por tipo
            </label>
            <select
              id="tipo"
              value={tipoSelecionado}
              onChange={(event) => setTipoSelecionado(event.target.value)}
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            >
              {tiposDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo === "TODOS" ? "Todos" : tipo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-gray-600 uppercase">
              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">Código</th>
              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">
                Nº Certificado
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
              <th className="border px-6 py-4 text-left text-xs font-bold tracking-wide">Ações</th>
            </tr>
          </thead>

          <tbody>
            {equipamentosFiltrados.map((equipamento) => (
              <tr key={equipamento.id} className="hover:bg-gray-50">
                <td className="border px-4 py-3">{equipamento.codigo}</td>
                <td className="border px-4 py-3">
                  {equipamento.ultimaCalibracao?.numeroCertificado || "-"}
                </td>
                <td className="border px-4 py-3">{equipamento.localizacao || "-"}</td>
                <td className="border px-4 py-3">{equipamento.tipo.nome}</td>
                <td className="border px-4 py-3">
                  <span className={getSituacaoStyle(equipamento.situacao)}>
                    {formatarSituacao(equipamento.situacao)}
                  </span>
                </td>
                <td className="border px-4 py-3">
                  {formatarStatusOperacional(equipamento.statusOperacional)}
                </td>
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

            {equipamentosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} className="border px-4 py-6 text-center text-sm text-gray-500">
                  Nenhum equipamento encontrado para o tipo selecionado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
