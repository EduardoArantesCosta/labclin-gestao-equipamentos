"use client";

import { useState } from "react";

type EmpresaCalibracao = {
  id: number;
  nome: string;
  contato: string | null;
  ativo: boolean;
  createdAt: Date;
};

type Props = {
  initialEmpresas: EmpresaCalibracao[];
};

export function EmpresasCalibracaoManager({ initialEmpresas }: Props) {
  const [empresas, setEmpresas] = useState(initialEmpresas);
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [ativo, setAtivo] = useState(true);
  const [erro, setErro] = useState("");

  function iniciarEdicao(empresa: EmpresaCalibracao) {
    setEditandoId(empresa.id);
    setNome(empresa.nome);
    setContato(empresa.contato ?? "");
    setAtivo(empresa.ativo);
    setErro("");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNome("");
    setContato("");
    setAtivo(true);
    setErro("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const isEdicao = editandoId !== null;
      const url = isEdicao ? `/api/empresas-calibracao/${editandoId}` : "/api/empresas-calibracao";
      const method = isEdicao ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, contato, ativo }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao salvar empresa");
        setLoading(false);
        return;
      }

      if (isEdicao) {
        setEmpresas((prev) => prev.map((empresa) => (empresa.id === data.id ? data : empresa)));
      } else {
        setEmpresas((prev) => [data, ...prev]);
      }

      setNome("");
      setContato("");
      setAtivo(true);
      setEditandoId(null);
    } catch {
      setErro("Erro ao salvar empresa");
    } finally {
      setLoading(false);
    }
  }

  async function alternarStatusEmpresa() {
    if (!editandoId) return;

    setErro("");
    setLoading(true);

    try {
      const response = await fetch(`/api/empresas-calibracao/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          contato,
          ativo: !ativo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao alterar status da empresa");
        setLoading(false);
        return;
      }

      setEmpresas((prev) => prev.map((empresa) => (empresa.id === data.id ? data : empresa)));

      setNome("");
      setContato("");
      setAtivo(true);
      setEditandoId(null);
      setErro("");
    } catch {
      setErro("Erro ao alterar status da empresa");
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
              Empresas de calibração
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Cadastre, edite e acompanhe as empresas de calibração disponíveis no sistema.
            </p>
          </div>

          <div className="space-y-6 px-8 py-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {editandoId ? "Editar empresa" : "Dados da empresa"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editandoId
                    ? "Atualize as informações da empresa selecionada."
                    : "Preencha os dados para cadastrar uma nova empresa de calibração."}
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
                    <label htmlFor="contato" className="text-sm font-medium text-slate-700">
                      Contato
                    </label>
                    <input
                      id="contato"
                      type="text"
                      value={contato}
                      onChange={(e) => setContato(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                {erro ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                  </div>
                ) : null}

                <div className="flex gap-3 md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-[#583481] px-4 py-2 text-sm font-medium text-white"
                  >
                    {loading ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar"}
                  </button>

                  {editandoId ? (
                    <>
                      <button
                        type="button"
                        onClick={cancelarEdicao}
                        className="rounded-lg border px-4 py-2 text-sm"
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={alternarStatusEmpresa}
                        disabled={loading}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                          ativo ? "border-red-200 text-red-700" : "border-green-200 text-green-700"
                        }`}
                      >
                        {ativo ? "Inativar empresa" : "Reativar empresa"}
                      </button>
                    </>
                  ) : null}
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Empresas cadastradas</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Visualize as empresas registradas e gerencie seus dados.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Nome</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Contato</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Ativo</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-600">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {empresas.map((empresa) => (
                      <tr key={empresa.id}>
                        <td className="px-6 py-4 text-slate-700 uppercase">{empresa.nome}</td>
                        <td className="px-6 py-4 text-slate-700 uppercase">
                          {empresa.contato || "-"}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {empresa.ativo ? "Sim" : "Não"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => iniciarEdicao(empresa)}
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-100"
                            >
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {empresas.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                          Nenhuma empresa cadastrada até o momento.
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
