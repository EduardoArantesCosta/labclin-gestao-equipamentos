export const dynamic = "force-dynamic";

import { prisma } from "@/src/lib/prisma";
import { TiposEquipamentoManager } from "@/src/components/cadastros/tipos-equipamento-manager";

type TipoEquipamento = {
  id: number;
  nome: string;
  ativo: boolean;
  createdAt: Date;
};

async function getTiposEquipamento(): Promise<TipoEquipamento[]> {
  try {
    return await prisma.tipoEquipamento.findMany({
      orderBy: {
        nome: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar tipos de equipamento:", error);
    throw new Error("Erro ao buscar tipos de equipamento");
  }
}

export default async function TiposEquipamentoPage() {
  const tipos = await getTiposEquipamento();

  return <TiposEquipamentoManager initialTipos={tipos} />;
}
