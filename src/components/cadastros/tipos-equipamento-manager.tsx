"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tipo = {
  id: number;
  nome: string;
  ativo: boolean;
};

type Props = {
  initialTipos: Tipo[];
};

export function TiposEquipamentoManager({ initialTipos }: Props) {
  const router = useRouter();

  const [tipos, setTipos] = useState(initialTipos);
  const [nome, setNome] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function iniciarEdicao(tipo: Tipo) {
    setEditandoId(tipo.id);
    setNome(tipo.nome);
    setAtivo(tipo.ativo);
    setErro("");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNome("");
    setAtivo(true);
    setErro("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const isEdicao = editandoId !== null;

      const response = await fetch(
        isEdicao ? `/api/tipos-equipamento/${editandoId}` : "/api/tipos-equipamento",
        {
          method: isEdicao ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, ativo }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao salvar tipo de equipamento");
        return;
      }

      if (isEdicao) {
        setTipos((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      } else {
        setTipos((prev) => [data, ...prev]);
      }

      cancelarEdicao();
    } catch {
      setErro("Erro ao salvar tipo de equipamento");
    } finally {
      setLoading(false);
    }
  }

  async function alternarStatus() {
    if (!editandoId) return;

    setErro("");
    setLoading(true);

    try {
      const response = await fetch(`/api/tipos-equipamento/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, ativo: !ativo }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao alterar status");
        setLoading(false);
        return;
      }

      setTipos((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      cancelarEdicao();
    } catch {
      setErro("Erro ao alterar status");
    } finally {
      setLoading(false);
    }
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
              Tipos de equipamentos
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Cadastre e gerencie os tipos de equipamentos utilizados no sistema.
            </p>
          </div>

          <div className="space-y-6 px-8 py-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {editandoId ? "Editar tipo de equipamento" : "Dados do tipo de equipamento"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editandoId
                    ? "Atualize as informações do tipo selecionado."
                    : "Preencha os dados para cadastrar um novo tipo de equipamento."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-sm font-medium text-slate-700">
                    Nome
                  </label>
                  <input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
                  />
                </div>

                {erro ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar tipo"}
                  </button>

                  {editandoId && (
                    <>
                      <button
                        type="button"
                        onClick={cancelarEdicao}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={alternarStatus}
                        disabled={loading}
                        className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
                          ativo
                            ? "border border-red-200 text-red-700 hover:bg-red-50"
                            : "border border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {ativo ? "Inativar tipo" : "Reativar tipo"}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Tipos de equipamentos cadastrados
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Visualize e gerencie os tipos disponíveis no sistema.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Nome</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {tipos.map((t) => (
                      <tr key={t.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-700">{t.nome}</td>
                        <td className="px-6 py-4 text-slate-700">
                          {t.ativo ? "Ativo" : "Inativo"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => iniciarEdicao(t)}
                            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}

                    {tipos.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                          Nenhum tipo de equipamento cadastrado até o momento.
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
