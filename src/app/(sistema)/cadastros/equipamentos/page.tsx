export const dynamic = "force-dynamic";

import { prisma } from "@/src/lib/prisma";
import { NovoEquipamentoForm } from "@/src/components/equipamentos/novo-equipamento-form";

type TipoEquipamento = {
  id: number;
  nome: string;
  ativo: boolean;
};

type Marca = {
  id: number;
  nome: string;
  ativo: boolean;
};

type IntervaloCalibracao = {
  id: number;
  nome: string;
  dias: number | null;
  ativo: boolean;
};

async function getTipos(): Promise<TipoEquipamento[]> {
  try {
    return await prisma.tipoEquipamento.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar tipos de equipamento:", error);
    throw new Error("Erro ao buscar tipos de equipamento");
  }
}

async function getMarcas(): Promise<Marca[]> {
  try {
    return await prisma.marca.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    throw new Error("Erro ao buscar marcas");
  }
}

async function getIntervalos(): Promise<IntervaloCalibracao[]> {
  try {
    return await prisma.intervaloCalibracao.findMany({
      where: {
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar intervalos de calibração:", error);
    throw new Error("Erro ao buscar intervalos de calibração");
  }
}

export default async function NovoEquipamentoPage() {
  const [tipos, marcas, intervalos] = await Promise.all([getTipos(), getMarcas(), getIntervalos()]);

  return (
    <main className="h-auto bg-slate-100">
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-8 py-4">
            <p className="text-xl font-bold tracking-[0.18em] text-purple-800 uppercase">
              LABORCLIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Cadastrar equipamento
            </h1>
            <p className="mt-2 text-sm text-slate-600">Cadastre um novo equipamento no sistema.</p>
          </div>

          <div className="px-8 py-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Dados do equipamento</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Preencha as informações principais para cadastro.
                </p>
              </div>

              <NovoEquipamentoForm tipos={tipos} marcas={marcas} intervalos={intervalos} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
