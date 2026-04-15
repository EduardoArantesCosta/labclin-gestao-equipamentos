import { TiposEquipamentoManager } from "@/src/components/cadastros/tipos-equipamento-manager";

type TipoEquipamento = {
  id: number;
  nome: string;
  ativo: boolean;
  createdAt: string;
};

async function getTiposEquipamento(): Promise<TipoEquipamento[]> {
  const response = await fetch("http://localhost:3000/api/tipos-equipamento", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar tipos de equipamento");
  }

  return response.json();
}

export default async function TiposEquipamentoPage() {
  const tipos = await getTiposEquipamento();

  return <TiposEquipamentoManager initialTipos={tipos} />;
}
