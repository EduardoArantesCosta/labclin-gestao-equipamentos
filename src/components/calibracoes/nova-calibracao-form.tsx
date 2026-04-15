"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Empresa = {
  id: number;
  nome: string;
};

type Props = {
  equipamentoId: number;
  empresas: Empresa[];
};

type LinhaLeitura = {
  leituraPadrao: string;
  leituraInstrumento: string;
};

export function NovaCalibracaoForm({ equipamentoId, empresas }: Props) {
  const router = useRouter();

  const [dataCalibracao, setDataCalibracao] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [numeroCertificado, setNumeroCertificado] = useState("");
  const [empresaId, setEmpresaId] = useState(empresas[0]?.id ? String(empresas[0].id) : "");

  const [certificadoNome, setCertificadoNome] = useState("");
  const [certificadoUrl, setCertificadoUrl] = useState("");

  const [leituras, setLeituras] = useState<LinhaLeitura[]>([
    { leituraPadrao: "", leituraInstrumento: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function atualizarLeitura(index: number, campo: keyof LinhaLeitura, valor: string) {
    setLeituras((prev) =>
      prev.map((linha, i) => (i === index ? { ...linha, [campo]: valor } : linha)),
    );
  }

  function adicionarLinha() {
    setLeituras((prev) => [...prev, { leituraPadrao: "", leituraInstrumento: "" }]);
  }

  function removerLinha(index: number) {
    setLeituras((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await fetch("/api/calibracoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataCalibracao,
          dataValidade,
          numeroCertificado,
          certificadoNome,
          certificadoUrl,
          equipamentoId,
          empresaId: Number(empresaId),
          leituras: leituras.map((leitura) => ({
            leituraPadrao: Number(leitura.leituraPadrao),
            leituraInstrumento: Number(leitura.leituraInstrumento),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao criar calibração");
        setLoading(false);
        return;
      }

      router.push(`/equipamentos/${equipamentoId}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErro("Erro ao criar calibração");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="dataCalibracao" className="text-sm font-medium text-slate-700">
            Data da calibração
          </label>
          <input
            id="dataCalibracao"
            type="date"
            value={dataCalibracao}
            onChange={(e) => setDataCalibracao(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="dataValidade" className="text-sm font-medium text-slate-700">
            Data de validade
          </label>
          <input
            id="dataValidade"
            type="date"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="numeroCertificado" className="text-sm font-medium text-slate-700">
            Número do certificado
          </label>
          <input
            id="numeroCertificado"
            type="text"
            value={numeroCertificado}
            onChange={(e) => setNumeroCertificado(e.target.value)}
            placeholder="Digite o número do certificado"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="empresaId" className="text-sm font-medium text-slate-700">
            Empresa de calibração
          </label>
          <select
            id="empresaId"
            value={empresaId}
            onChange={(e) => setEmpresaId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
          >
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3">
          <h2 className="text-base font-semibold text-slate-800">Anexo do certificado</h2>
          <p className="mt-1 text-sm text-slate-500">
            Selecione o arquivo do certificado em PDF ou imagem.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="certificado" className="text-sm font-medium text-slate-700">
            Arquivo
          </label>
          <input
            id="certificado"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setCertificadoNome(file.name);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
        </div>

        {certificadoNome ? (
          <p className="mt-3 text-sm text-slate-500">Arquivo selecionado: {certificadoNome}</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-800">Leituras da calibração</h2>
          <p className="mt-1 text-sm text-slate-500">
            Informe os valores de leitura padrão e do instrumento.
          </p>
        </div>

        <div className="space-y-4">
          {leituras.map((leitura, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3"
            >
              <div className="space-y-2">
                <label
                  htmlFor={`leituraPadrao-${index}`}
                  className="text-sm font-medium text-slate-700"
                >
                  Leitura padrão
                </label>
                <input
                  id={`leituraPadrao-${index}`}
                  type="number"
                  placeholder="Ex.: 10.00"
                  value={leitura.leituraPadrao}
                  onChange={(e) => atualizarLeitura(index, "leituraPadrao", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`leituraInstrumento-${index}`}
                  className="text-sm font-medium text-slate-700"
                >
                  Leitura do instrumento
                </label>
                <input
                  id={`leituraInstrumento-${index}`}
                  type="number"
                  placeholder="Ex.: 9.98"
                  value={leitura.leituraInstrumento}
                  onChange={(e) => atualizarLeitura(index, "leituraInstrumento", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removerLinha(index)}
                  disabled={leituras.length === 1}
                  className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Remover leitura
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={adicionarLinha}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            + Adicionar leitura
          </button>
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
          {loading ? "Salvando..." : "Salvar calibração"}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/equipamentos/${equipamentoId}`)}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
