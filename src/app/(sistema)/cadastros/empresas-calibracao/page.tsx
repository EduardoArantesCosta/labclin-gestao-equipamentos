export const dynamic = "force-dynamic";

import { prisma } from "@/src/lib/prisma";
import { EmpresasCalibracaoManager } from "@/src/components/cadastros/empresas-calibracao";

type EmpresaCalibracao = {
  id: number;
  nome: string;
  contato: string | null;
  ativo: boolean;
  createdAt: Date;
};

async function getEmpresas(): Promise<EmpresaCalibracao[]> {
  try {
    return await prisma.empresaCalibracao.findMany({
      orderBy: {
        nome: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar empresas de calibração:", error);
    throw new Error("Erro ao buscar empresas de calibração");
  }
}

export default async function EmpresasCalibracaoPage() {
  const empresas = await getEmpresas();

  return <EmpresasCalibracaoManager initialEmpresas={empresas} />;
}
