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

type Props = {
  tipos: TipoEquipamento[];
  marcas: Marca[];
  intervalos: IntervaloCalibracao[];
};

export function NovoEquipamentoForm({ tipos, marcas, intervalos }: Props) {
  const router = useRouter();

  const [codigo, setCodigo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [statusOperacional, setStatusOperacional] = useState("AGUARDANDO_CALIBRACAO");
  const [tipoId, setTipoId] = useState(tipos[0]?.id ? String(tipos[0].id) : "");
  const [marcaId, setMarcaId] = useState(marcas[0]?.id ? String(marcas[0].id) : "");
  const [intervaloId, setIntervaloId] = useState(intervalos[0]?.id ? String(intervalos[0].id) : "");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [limiteErro, setLimiteErro] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await fetch("/api/equipamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo,
          numeroSerie,
          localizacao,
          observacao,
          statusOperacional: "AGUARDANDO_CALIBRACAO",
          limiteErro: Number(limiteErro),
          tipoId: Number(tipoId),
          marcaId: Number(marcaId),
          intervaloId: Number(intervaloId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao cadastrar equipamento");
        setLoading(false);
        return;
      }

      router.push("/equipamentos");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErro("Erro ao cadastrar equipamento");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-0">
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
          <label htmlFor="statusOperacional" className="text-sm font-medium text-slate-700">
            Status operacional
          </label>

          <select
            id="statusOperacional"
            value={statusOperacional}
            onChange={(event) => setStatusOperacional(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          >
            <option value="AGUARDANDO_CALIBRACAO">Aguardando calibração</option>
            <option value="EM_CALIBRACAO">Em calibração</option>
            <option value="DISPONIVEL">Disponível</option>
            <option value="EM_USO">Em uso</option>
          </select>
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

        <div className="col-span-1 space-y-2">
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

        <div className="space-y-2">
          <label htmlFor="limiteErro" className="text-sm font-medium text-slate-700">
            Limite de erro
          </label>
          <input
            id="limiteErro"
            type="number"
            step="0.01"
            value={limiteErro}
            onChange={(event) => setLimiteErro(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
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
          {loading ? "Cadastrando..." : "Cadastrar equipamento"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/equipamentos")}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
