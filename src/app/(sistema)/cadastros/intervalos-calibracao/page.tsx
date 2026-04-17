import { prisma } from "@/src/lib/prisma";
import { IntervalosCalibracaoManager } from "@/src/components/cadastros/intervalos-calibracao-manager";

type IntervaloCalibracao = {
  id: number;
  nome: string;
  dias: number | null;
  ativo: boolean;
  createdAt: Date;
};

async function getIntervalos(): Promise<IntervaloCalibracao[]> {
  try {
    return await prisma.intervaloCalibracao.findMany({
      orderBy: {
        nome: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar intervalos de calibração:", error);
    throw new Error("Erro ao buscar intervalos de calibração");
  }
}

export default async function IntervalosCalibracaoPage() {
  const intervalos = await getIntervalos();

  return <IntervalosCalibracaoManager initialIntervalos={intervalos} />;
}
