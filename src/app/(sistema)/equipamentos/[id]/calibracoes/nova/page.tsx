import { NovaCalibracaoForm } from "@/src/components/calibracoes/nova-calibracao-form";

type Empresa = {
  id: number;
  nome: string;
};

type Equipamento = {
  id: number;
  codigo: string;
};

async function getEquipamento(id: string): Promise<Equipamento> {
  const response = await fetch(`http://localhost:3000/api/equipamentos/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamento");
  }

  return response.json();
}

async function getEmpresas(): Promise<Empresa[]> {
  const response = await fetch("http://localhost:3000/api/empresas-calibracao", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar empresas");
  }

  return response.json();
}

export default async function NovaCalibracaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [equipamento, empresas] = await Promise.all([getEquipamento(id), getEmpresas()]);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              LABORCLIN
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">Nova calibração</h1>

            <p className="mt-2 text-sm text-slate-600">
              Registrar nova calibração para o equipamento <strong>{equipamento.codigo}</strong>.
            </p>
          </div>

          <div className="px-8 py-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <NovaCalibracaoForm equipamentoId={equipamento.id} empresas={empresas} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
