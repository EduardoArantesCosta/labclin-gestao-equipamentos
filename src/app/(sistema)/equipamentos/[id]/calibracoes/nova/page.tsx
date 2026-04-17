import { prisma } from "@/src/lib/prisma";
import { NovaCalibracaoForm } from "@/src/components/calibracoes/nova-calibracao-form";

type Empresa = {
  id: number;
  nome: string;
};

type Equipamento = {
  id: number;
  codigo: string;
  limiteErro: number | null;
};

async function getEquipamento(id: string): Promise<Equipamento> {
  try {
    const equipamento = await prisma.equipamento.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        codigo: true,
        limiteErro: true,
      },
    });

    if (!equipamento) {
      throw new Error("Equipamento não encontrado");
    }

    return equipamento;
  } catch (error) {
    console.error("Erro ao buscar equipamento:", error);
    throw new Error("Erro ao buscar equipamento");
  }
}

async function getEmpresas(): Promise<Empresa[]> {
  try {
    return await prisma.empresaCalibracao.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
      select: {
        id: true,
        nome: true,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    throw new Error("Erro ao buscar empresas");
  }
}

export default async function NovaCalibracaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [equipamento, empresas] = await Promise.all([getEquipamento(id), getEmpresas()]);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
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
