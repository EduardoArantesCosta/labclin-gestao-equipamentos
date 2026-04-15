import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

/**
 * Corrige problema de timezone (evita -1 dia)
 */
function parseDateOnly(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

type LeituraInput = {
  leituraPadrao: number | string;
  leituraInstrumento: number | string;
};

/**
 * Calcula os valores da leitura
 */
function calcularLeitura(leituraPadrao: number, leituraInstrumento: number, limiteErro: number) {
  const erroEncontrado = leituraInstrumento - leituraPadrao;

  const toleranciaMinima = leituraPadrao - limiteErro;
  const toleranciaMaxima = leituraPadrao + limiteErro;

  const validado = leituraInstrumento >= toleranciaMinima && leituraInstrumento <= toleranciaMaxima;

  return {
    erroEncontrado,
    toleranciaMinima,
    toleranciaMaxima,
    validado,
  };
}

/**
 * GET - lista calibrações
 */
export async function GET() {
  try {
    const calibracoes = await prisma.calibracao.findMany({
      orderBy: {
        dataCalibracao: "desc",
      },
      include: {
        equipamento: true,
        empresa: true,
        leituras: true,
      },
    });

    return NextResponse.json(calibracoes);
  } catch (error) {
    console.error("Erro ao buscar calibrações:", error);

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

/**
 * POST - cria calibração com leituras
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dataCalibracao = body.dataCalibracao;
    const dataValidade = body.dataValidade;
    const numeroCertificado = body.numeroCertificado?.trim();

    const equipamentoId = Number(body.equipamentoId);
    const empresaId = Number(body.empresaId);

    const leituras = Array.isArray(body.leituras) ? body.leituras : [];

    // ===== VALIDAÇÕES =====

    if (!dataCalibracao) {
      return NextResponse.json({ message: "Data da calibração é obrigatória" }, { status: 400 });
    }

    if (!dataValidade) {
      return NextResponse.json({ message: "Data de validade é obrigatória" }, { status: 400 });
    }

    if (!numeroCertificado) {
      return NextResponse.json({ message: "Número do certificado é obrigatório" }, { status: 400 });
    }

    if (!equipamentoId || isNaN(equipamentoId)) {
      return NextResponse.json({ message: "Equipamento inválido" }, { status: 400 });
    }

    if (!empresaId || isNaN(empresaId)) {
      return NextResponse.json({ message: "Empresa inválida" }, { status: 400 });
    }

    if (leituras.length === 0) {
      return NextResponse.json({ message: "Informe ao menos uma leitura" }, { status: 400 });
    }

    // ===== VERIFICAR EQUIPAMENTO =====

    const equipamento = await prisma.equipamento.findUnique({
      where: { id: equipamentoId },
    });

    if (!equipamento) {
      return NextResponse.json({ message: "Equipamento não encontrado" }, { status: 404 });
    }

    if (equipamento.limiteErro === null || equipamento.limiteErro === undefined) {
      return NextResponse.json(
        { message: "Equipamento não possui limite de erro cadastrado" },
        { status: 400 },
      );
    }

    // ===== TRANSAÇÃO =====

    const resultado = await prisma.$transaction(async (tx) => {
      // cria calibração
      const novaCalibracao = await tx.calibracao.create({
        data: {
          dataCalibracao: parseDateOnly(dataCalibracao),
          dataValidade: parseDateOnly(dataValidade),
          numeroCertificado,
          equipamentoId,
          empresaId,
        },
        include: {
          equipamento: true,
          empresa: true,
        },
      });

      // calcula leituras
      const leiturasCalculadas = leituras.map((leitura: LeituraInput) => {
        const leituraPadrao = Number(leitura.leituraPadrao);
        const leituraInstrumento = Number(leitura.leituraInstrumento);

        if (isNaN(leituraPadrao) || isNaN(leituraInstrumento)) {
          throw new Error("Leitura inválida");
        }

        const calculo = calcularLeitura(
          leituraPadrao,
          leituraInstrumento,
          equipamento.limiteErro as number,
        );

        return {
          leituraPadrao,
          leituraInstrumento,
          ...calculo,
          calibracaoId: novaCalibracao.id,
        };
      });

      // salva leituras
      await tx.leituraCalibracao.createMany({
        data: leiturasCalculadas,
      });

      // atualiza status do equipamento
      const statusAnterior = equipamento.statusOperacional;
      const statusNovo = "DISPONIVEL";

      await tx.equipamento.update({
        where: { id: equipamentoId },
        data: {
          statusOperacional: statusNovo,
        },
      });

      // histórico
      await tx.historicoStatus.create({
        data: {
          statusAnterior,
          statusNovo,
          equipamentoId,
        },
      });

      return novaCalibracao;
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao criar calibração:", error);

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
