"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Marca = {
  id: number;
  nome: string;
  ativo: boolean;
  createdAt: string;
};

type Props = {
  initialMarcas: Marca[];
};

export function MarcasManager({ initialMarcas }: Props) {
  const router = useRouter();

  const [marcas, setMarcas] = useState(initialMarcas);
  const [nome, setNome] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ativo, setAtivo] = useState(true);

  function iniciarEdicao(marca: Marca) {
    setEditandoId(marca.id);
    setNome(marca.nome);
    setAtivo(marca.ativo);
    setErro("");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNome("");
    setAtivo(true);
    setErro("");
  }

  async function alternarStatusMarca() {
    if (!editandoId) return;

    setErro("");
    setLoading(true);

    try {
      const response = await fetch(`/api/marcas/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          ativo: !ativo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao alterar status da marca");
        setLoading(false);
        return;
      }

      setMarcas((prev) => prev.map((marca) => (marca.id === data.id ? data : marca)));

      setNome("");
      setAtivo(true);
      setEditandoId(null);
      setErro("");
    } catch {
      setErro("Erro ao alterar status da marca");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const isEdicao = editandoId !== null;
      const url = isEdicao ? `/api/marcas/${editandoId}` : "/api/marcas";
      const method = isEdicao ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          ativo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao salvar marca");
        setLoading(false);
        return;
      }

      if (isEdicao) {
        setMarcas((prev) => prev.map((marca) => (marca.id === data.id ? data : marca)));
      } else {
        setMarcas((prev) => [data, ...prev]);
      }

      setNome("");
      setAtivo(true);
      setEditandoId(null);
      setErro("");
    } catch {
      setErro("Erro ao salvar marca");
    } finally {
      setLoading(false);
    }
  }

  async function inativarMarca(id: number) {
    const confirmed = window.confirm("Deseja inativar esta marca?");
    if (!confirmed) return;

    await fetch(`/api/marcas/${id}`, {
      method: "DELETE",
    });

    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* HEADER */}
          <div className="border-b border-slate-200 bg-slate-50 px-8 py-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              LABORCLIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Marcas</h1>
            <p className="mt-2 text-sm text-slate-600">
              Cadastre e gerencie as marcas dos equipamentos utilizados no sistema.
            </p>
          </div>

          <div className="space-y-6 px-8 py-4">
            {/* FORM */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {editandoId ? "Editar marca" : "Dados da marca"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editandoId
                    ? "Atualize as informações da marca selecionada."
                    : "Preencha os dados para cadastrar uma nova marca."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nome</label>
                  <input
                    type="text"
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
                    {loading ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar marca"}
                  </button>

                  {editandoId ? (
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
                        onClick={alternarStatusMarca}
                        disabled={loading}
                        className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
                          ativo
                            ? "border border-red-200 text-red-700 hover:bg-red-50"
                            : "border border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {ativo ? "Inativar marca" : "Reativar marca"}
                      </button>
                    </>
                  ) : null}
                </div>
              </form>
            </div>

            {/* TABELA */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Marcas cadastradas</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Visualize e gerencie as marcas disponíveis no sistema.
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
                    {marcas.map((marca) => (
                      <tr key={marca.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-700">{marca.nome}</td>
                        <td className="px-6 py-4 text-slate-700">
                          {marca.ativo ? "Ativa" : "Inativa"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => iniciarEdicao(marca)}
                            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}

                    {marcas.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                          Nenhuma marca cadastrada até o momento.
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
