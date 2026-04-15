import { EmpresasCalibracaoManager } from "@/src/components/cadastros/empresas-calibracao";

type EmpresaCalibracao = {
  id: number;
  nome: string;
  contato: string | null;
  ativo: boolean;
  createdAt: string;
};

async function getEmpresas(): Promise<EmpresaCalibracao[]> {
  const response = await fetch("http://localhost:3000/api/empresas-calibracao", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar empresas de calibração");
  }

  return response.json();
}

export default async function EmpresasCalibracaoPage() {
  const empresas = await getEmpresas();

  return <EmpresasCalibracaoManager initialEmpresas={empresas} />;
}
