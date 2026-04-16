import { EmpresasCalibracaoManager } from "@/src/components/cadastros/empresas-calibracao";

type EmpresaCalibracao = {
  id: number;
  nome: string;
  contato: string | null;
  ativo: boolean;
  createdAt: string;
};

async function getEmpresas(): Promise<EmpresaCalibracao[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL não está configurada");
  }

  const response = await fetch(`${baseUrl}/api/empresas-calibracao`, {
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
