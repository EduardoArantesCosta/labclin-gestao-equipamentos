import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { calcularSituacaoDashboard } from "../../../lib/dashboard";

export async function GET() {
  try {
    const equipamentos = await prisma.equipamento.findMany({
      where: {
        ativo: true,
      },
      include: {
        calibracoes: {
          include: {
            empresa: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    let vencidos = 0;
    let proximosDoVencimento = 0;
    let ok = 0;
    let emCalibracao = 0;

    const vencendoEmBreve: Array<{
      id: number;
      codigo: string;
      numeroSerie: string | null;
      localizacao: string | null;
      dataValidade: Date | null;
      situacao: "VENCIDO" | "PROXIMO_DO_VENCIMENTO" | "OK" | "EM_CALIBRACAO";
    }> = [];

    const ultimasCalibracoes: Array<{
      id: number;
      equipamentoId: number;
      codigo: string;
      numeroCertificado: string;
      dataCalibracao: Date;
      empresa: string;
    }> = [];

    const debugEquipamentos = equipamentos.map((equipamento) => {
      const ultimaCalibracao = equipamento.calibracoes[0] ?? null;

      return {
        id: equipamento.id,
        codigo: equipamento.codigo,
        ativo: equipamento.ativo,
        statusOperacional: equipamento.statusOperacional,
        totalCalibracoes: equipamento.calibracoes.length,
        ultimaCalibracao: ultimaCalibracao
          ? {
              id: ultimaCalibracao.id,
              dataCalibracao: ultimaCalibracao.dataCalibracao,
              dataValidade: ultimaCalibracao.dataValidade,
              numeroCertificado: ultimaCalibracao.numeroCertificado,
            }
          : null,
      };
    });

    for (const equipamento of equipamentos) {
      const ultimaCalibracao = equipamento.calibracoes[0] ?? null;

      const situacao = calcularSituacaoDashboard(
        equipamento.statusOperacional,
        ultimaCalibracao?.dataValidade,
      );

      if (situacao === "VENCIDO") vencidos++;
      if (situacao === "PROXIMO_DO_VENCIMENTO") proximosDoVencimento++;
      if (situacao === "OK") ok++;
      if (situacao === "EM_CALIBRACAO") emCalibracao++;

      if (ultimaCalibracao && (situacao === "VENCIDO" || situacao === "PROXIMO_DO_VENCIMENTO")) {
        vencendoEmBreve.push({
          id: equipamento.id,
          codigo: equipamento.codigo,
          numeroSerie: equipamento.numeroSerie,
          localizacao: equipamento.localizacao,
          dataValidade: ultimaCalibracao.dataValidade,
          situacao,
        });
      }

      if (ultimaCalibracao) {
        ultimasCalibracoes.push({
          id: ultimaCalibracao.id,
          equipamentoId: equipamento.id,
          codigo: equipamento.codigo,
          numeroCertificado: ultimaCalibracao.numeroCertificado,
          dataCalibracao: ultimaCalibracao.dataCalibracao,
          empresa: ultimaCalibracao.empresa.nome,
        });
      }
    }

    vencendoEmBreve.sort((a, b) => {
      if (!a.dataValidade) return 1;
      if (!b.dataValidade) return -1;
      return new Date(a.dataValidade).getTime() - new Date(b.dataValidade).getTime();
    });

    ultimasCalibracoes.sort((a, b) => {
      return new Date(b.dataCalibracao).getTime() - new Date(a.dataCalibracao).getTime();
    });

    return NextResponse.json({
      totalAtivos: equipamentos.length,
      vencidos,
      proximosDoVencimento,
      ok,
      emCalibracao,
      vencendoEmBreve: vencendoEmBreve.slice(0, 5),
      ultimasCalibracoes: ultimasCalibracoes.slice(0, 5),
      debug: {
        totalEquipamentosEncontrados: equipamentos.length,
        equipamentos: debugEquipamentos,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar dados do dashboard.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
