"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type IntervaloCalibracao = {
  id: number;
  nome: string;
  dias: number | null;
  ativo: boolean;
  createdAt: Date;
};

type Props = {
  initialIntervalos: IntervaloCalibracao[];
};

export function IntervalosCalibracaoManager({ initialIntervalos }: Props) {
  const router = useRouter();

  const [intervalos, setIntervalos] = useState(initialIntervalos);
  const [nome, setNome] = useState("");
  const [dias, setDias] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function iniciarEdicao(intervalo: IntervaloCalibracao) {
    setEditandoId(intervalo.id);
    setNome(intervalo.nome);
    setDias(intervalo.dias ? String(intervalo.dias) : "");
    setErro("");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNome("");
    setDias("");
    setErro("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const isEdicao = editandoId !== null;
      const url = isEdicao
        ? `/api/intervalos-calibracao/${editandoId}`
        : "/api/intervalos-calibracao";
      const method = isEdicao ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          dias: Number(dias),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao salvar intervalo");
        setLoading(false);
        return;
      }

      setIntervalos((prev) => [data, ...prev]);
      setNome("");
      setDias("");
      setEditandoId(null);
    } catch {
      setErro("Erro ao salvar intervalo");
    } finally {
      setLoading(false);
    }
  }

  async function inativarIntervalo(id: number) {
    const confirmed = window.confirm("Deseja inativar este intervalo?");
    if (!confirmed) return;

    await fetch(`/api/intervalos-calibracao/${id}`, {
      method: "DELETE",
    });

    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-8 py-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              LABORCLIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Intervalos de calibração
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Cadastre e gerencie os intervalos de calibração utilizados no sistema.
            </p>
          </div>

          <div className="space-y-6 px-8 py-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {editandoId ? "Editar intervalo" : "Dados do intervalo"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editandoId
                    ? "Atualize as informações do intervalo selecionado."
                    : "Preencha os dados para cadastrar um novo intervalo de calibração."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="nome" className="text-sm font-medium text-slate-700">
                      Nome
                    </label>
                    <input
                      id="nome"
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="dias" className="text-sm font-medium text-slate-700">
                      Dias
                    </label>
                    <input
                      id="dias"
                      type="number"
                      value={dias}
                      onChange={(e) => setDias(e.target.value)}
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
                    {loading
                      ? "Salvando..."
                      : editandoId
                        ? "Salvar alterações"
                        : "Cadastrar intervalo"}
                  </button>

                  {editandoId ? (
                    <button
                      type="button"
                      onClick={cancelarEdicao}
                      className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                  ) : null}
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Intervalos cadastrados</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Visualize os intervalos registrados e edite suas informações quando necessário.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Nome</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Dias</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {intervalos.map((intervalo) => (
                      <tr key={intervalo.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-700">{intervalo.nome}</td>
                        <td className="px-6 py-4 text-slate-700">{intervalo.dias ?? "-"}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => iniciarEdicao(intervalo)}
                              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {intervalos.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                          Nenhum intervalo cadastrado até o momento.
                        </td>
                      </tr>
                    ) : null}
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
