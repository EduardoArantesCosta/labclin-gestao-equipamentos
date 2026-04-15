import { MarcasManager } from "@/src/components/cadastros/marcas-manager";

type Marca = {
  id: number;
  nome: string;
  ativo: boolean;
  createdAt: string;
};

async function getMarcas(): Promise<Marca[]> {
  const response = await fetch("http://localhost:3000/api/marcas", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar marcas");
  }

  return response.json();
}

export default async function MarcasPage() {
  const marcas = await getMarcas();

  return <MarcasManager initialMarcas={marcas} />;
}
