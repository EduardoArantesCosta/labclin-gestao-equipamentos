export const dynamic = "force-dynamic";

import { prisma } from "@/src/lib/prisma";
import { EquipamentosTable } from "@/src/components/equipamentos/equipamentos-table";

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
  try {
    const equipamentos = await prisma.equipamento.findMany({
      orderBy: {
        codigo: "asc",
      },
      include: {
        tipo: true,
        marca: true,
        intervalo: true,
        calibracoes: {
          orderBy: {
            dataCalibracao: "desc",
          },
          take: 1,
        },
      },
    });

    const hoje = new Date();

    return equipamentos.map((equipamento) => {
      const ultima = equipamento.calibracoes[0] ?? null;

      let situacao = "OK";

      if (equipamento.statusOperacional === "EM_CALIBRACAO") {
        situacao = "EM_CALIBRACAO";
      } else if (ultima?.dataValidade) {
        const validade = new Date(ultima.dataValidade);

        if (validade < hoje) {
          situacao = "VENCIDO";
        } else {
          const diasRestantes = Math.ceil(
            (validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (diasRestantes <= 30) {
            situacao = "PROXIMO_DO_VENCIMENTO";
          }
        }
      }

      return {
        id: equipamento.id,
        codigo: equipamento.codigo,
        numeroSerie: equipamento.numeroSerie,
        localizacao: equipamento.localizacao,
        observacao: equipamento.observacao,
        statusOperacional: equipamento.statusOperacional,
        ativo: equipamento.ativo,
        createdAt: equipamento.createdAt.toISOString(),
        situacao,
        tipo: {
          id: equipamento.tipo.id,
          nome: equipamento.tipo.nome,
        },
        limiteErro: equipamento.limiteErro,
        marca: {
          id: equipamento.marca.id,
          nome: equipamento.marca.nome,
        },
        intervalo: {
          id: equipamento.intervalo.id,
          nome: equipamento.intervalo.nome,
          dias: equipamento.intervalo.dias,
        },
        ultimaCalibracao: ultima
          ? {
              id: ultima.id,
              dataCalibracao: ultima.dataCalibracao.toISOString(),
              dataValidade: ultima.dataValidade.toISOString(),
              numeroCertificado: ultima.numeroCertificado,
            }
          : null,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar equipamentos:", error);
    throw new Error("Erro ao buscar equipamentos");
  }
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
