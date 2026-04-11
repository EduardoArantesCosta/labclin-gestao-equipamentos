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

export function NovaCalibracaoForm({ equipamentoId, empresas }: Props) {
  const router = useRouter();

  const [dataCalibracao, setDataCalibracao] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [numeroCertificado, setNumeroCertificado] = useState("");
  const [empresaId, setEmpresaId] = useState(empresas[0]?.id ? String(empresas[0].id) : "");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

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
          equipamentoId,
          empresaId: Number(empresaId),
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
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Data da calibração</label>
          <input
            type="date"
            value={dataCalibracao}
            onChange={(e) => setDataCalibracao(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Data de validade</label>
          <input
            type="date"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Número do certificado</label>
          <input
            type="text"
            value={numeroCertificado}
            onChange={(e) => setNumeroCertificado(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Empresa de calibração</label>
          <select
            value={empresaId}
            onChange={(e) => setEmpresaId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
          >
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
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

      <div className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-6">
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="submit"
              disabled={loading}
              value={loading ? "Salvando..." : "Registrar calibração"}
              style={{
                height: "44px",
                padding: "0 24px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "#523178",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            />

            <button
              type="button"
              onClick={() => router.back()}
              style={{
                height: "44px",
                padding: "0 24px",
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                color: "#334155",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
