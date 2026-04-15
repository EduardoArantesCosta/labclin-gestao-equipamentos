import { EquipamentosTable } from "@/src/components/equipamentos/equipamentos-table";
import Link from "next/link";

type TipoEquipamento = {
  id: number;
  nome: string;
};

type Marca = {
  id: number;
  nome: string;
};

type IntervaloCalibracao = {
  id: number;
  nome: string;
  dias: number | null;
};

type Calibracao = {
  id: number;
  dataCalibracao: string;
  dataValidade: string;
  numeroCertificado: string;
};

type Equipamento = {
  id: number;
  codigo: string;
  numeroSerie: string | null;
  localizacao: string | null;
  observacao: string | null;
  statusOperacional: string;
  ativo: boolean;
  createdAt: string;
  situacao: string;
  tipo: TipoEquipamento;
  limiteErro: number | null;
  marca: Marca;
  intervalo: IntervaloCalibracao;
  ultimaCalibracao: Calibracao | null;
};

async function getEquipamentos(): Promise<Equipamento[]> {
  const response = await fetch("http://localhost:3000/api/equipamentos", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamentos");
  }

  return response.json();
}

export default async function EquipamentosPage() {
  const equipamentos = await getEquipamentos();

  return (
    <main className="p-6">
      <div className="flex justify-center">
        <h1 className="mb-6 text-center text-2xl font-bold">GESTÃO DE EQUIPAMENTOS</h1>
      </div>

      <EquipamentosTable equipamentos={equipamentos} />
    </main>
  );
}
