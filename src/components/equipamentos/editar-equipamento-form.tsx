"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

type Equipamento = {
  id: number;
  codigo: string;
  numeroSerie: string | null;
  localizacao: string | null;
  observacao: string | null;
  statusOperacional: string;
  ativo: boolean;
  tipoId: number;
  marcaId: number;
  intervaloId: number;
};

type Props = {
  equipamento: Equipamento;
  tipos: TipoEquipamento[];
  marcas: Marca[];
  intervalos: IntervaloCalibracao[];
};

export function EditarEquipamentoForm({ equipamento, tipos, marcas, intervalos }: Props) {
  const router = useRouter();

  const [codigo, setCodigo] = useState(equipamento.codigo);
  const [numeroSerie, setNumeroSerie] = useState(equipamento.numeroSerie ?? "");
  const [localizacao, setLocalizacao] = useState(equipamento.localizacao ?? "");
  const [observacao, setObservacao] = useState(equipamento.observacao ?? "");
  const [tipoId, setTipoId] = useState(String(equipamento.tipoId));
  const [marcaId, setMarcaId] = useState(String(equipamento.marcaId));
  const [intervaloId, setIntervaloId] = useState(String(equipamento.intervaloId));
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await fetch(`/api/equipamentos/${equipamento.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo,
          numeroSerie,
          localizacao,
          observacao,
          tipoId: Number(tipoId),
          marcaId: Number(marcaId),
          intervaloId: Number(intervaloId),
          ativo: equipamento.ativo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao atualizar equipamento");
        setLoading(false);
        return;
      }

      router.push(`/equipamentos/${equipamento.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErro("Erro ao atualizar equipamento");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="codigo" className="text-sm font-medium text-slate-700">
            Código
          </label>
          <input
            id="codigo"
            type="text"
            value={codigo}
            onChange={(event) => setCodigo(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="numeroSerie" className="text-sm font-medium text-slate-700">
            Número de série
          </label>
          <input
            id="numeroSerie"
            type="text"
            value={numeroSerie}
            onChange={(event) => setNumeroSerie(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="localizacao" className="text-sm font-medium text-slate-700">
            Localização
          </label>
          <input
            id="localizacao"
            type="text"
            value={localizacao}
            onChange={(event) => setLocalizacao(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="observacao" className="text-sm font-medium text-slate-700">
            Observação
          </label>
          <input
            id="observacao"
            type="text"
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tipoId" className="text-sm font-medium text-slate-700">
            Tipo de equipamento
          </label>
          <select
            id="tipoId"
            value={tipoId}
            onChange={(event) => setTipoId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          >
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="marcaId" className="text-sm font-medium text-slate-700">
            Marca
          </label>
          <select
            id="marcaId"
            value={marcaId}
            onChange={(event) => setMarcaId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          >
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="intervaloId" className="text-sm font-medium text-slate-700">
            Intervalo de calibração
          </label>
          <select
            id="intervaloId"
            value={intervaloId}
            onChange={(event) => setIntervaloId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          >
            {intervalos.map((intervalo) => (
              <option key={intervalo.id} value={intervalo.id}>
                {intervalo.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {erro ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/equipamentos/${equipamento.id}`)}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
