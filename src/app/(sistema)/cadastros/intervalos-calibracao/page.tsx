import { IntervalosCalibracaoManager } from "@/src/components/cadastros/intervalos-calibracao-manager";

type IntervaloCalibracao = {
  id: number;
  nome: string;
  dias: number | null;
  ativo: boolean;
  createdAt: string;
};

async function getIntervalos(): Promise<IntervaloCalibracao[]> {
  const response = await fetch("http://localhost:3000/api/intervalos-calibracao", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar intervalos de calibração");
  }

  return response.json();
}

export default async function IntervalosCalibracaoPage() {
  const intervalos = await getIntervalos();

  return <IntervalosCalibracaoManager initialIntervalos={intervalos} />;
}
