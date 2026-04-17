export const dynamic = "force-dynamic";

import { prisma } from "@/src/lib/prisma";
import { MarcasManager } from "@/src/components/cadastros/marcas-manager";

type Marca = {
  id: number;
  nome: string;
  ativo: boolean;
  createdAt: Date;
};

async function getMarcas(): Promise<Marca[]> {
  try {
    return await prisma.marca.findMany({
      orderBy: {
        nome: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    throw new Error("Erro ao buscar marcas");
  }
}

export default async function MarcasPage() {
  const marcas = await getMarcas();

  return <MarcasManager initialMarcas={marcas} />;
}
