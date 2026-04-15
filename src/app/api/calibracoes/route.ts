import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

function parseDateOnly(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

type LeituraInput = {
  leituraPadrao: number;
  leituraInstrumento: number;
};

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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dataCalibracao = body.dataCalibracao;
    const dataValidade = body.dataValidade;
    const numeroCertificado = body.numeroCertificado?.trim();
    const certificadoUrl = body.certificadoUrl || null;
    const certificadoNome = body.certificadoNome || null;

    const equipamentoId = Number(body.equipamentoId);
    const empresaId = Number(body.empresaId);
    const leituras = body.leituras as LeituraInput[];

    if (!dataCalibracao) {
      return Response.json({ message: "Data da calibração é obrigatória" }, { status: 400 });
    }

    if (!dataValidade) {
      return Response.json({ message: "Data de validade é obrigatória" }, { status: 400 });
    }

    if (!numeroCertificado) {
      return Response.json({ message: "Número do certificado é obrigatório" }, { status: 400 });
    }

    if (isNaN(equipamentoId)) {
      return Response.json({ message: "equipamentoId inválido" }, { status: 400 });
    }

    if (isNaN(empresaId)) {
      return Response.json({ message: "empresaId inválido" }, { status: 400 });
    }

    if (!Array.isArray(leituras) || leituras.length === 0) {
      return Response.json({ message: "Informe ao menos uma leitura" }, { status: 400 });
    }

    const certificadoExistente = await prisma.calibracao.findUnique({
      where: { numeroCertificado },
    });

    if (certificadoExistente) {
      return Response.json(
        { message: "Já existe uma calibração com esse número de certificado" },
        { status: 409 },
      );
    }

    const equipamentoExiste = await prisma.equipamento.findUnique({
      where: { id: equipamentoId },
    });

    if (!equipamentoExiste) {
      return Response.json({ message: "Equipamento não encontrado" }, { status: 404 });
    }

    if (equipamentoExiste.limiteErro === null) {
      return Response.json(
        { message: "Este equipamento não possui limite de erro cadastrado" },
        { status: 400 },
      );
    }

    const empresaExiste = await prisma.empresaCalibracao.findUnique({
      where: { id: empresaId },
    });

    if (!empresaExiste) {
      return Response.json({ message: "Empresa de calibração não encontrada" }, { status: 404 });
    }

    const limiteErro = equipamentoExiste.limiteErro;

    const leiturasCalculadas = leituras.map((leitura) => {
      const leituraPadrao = Number(leitura.leituraPadrao);
      const leituraInstrumento = Number(leitura.leituraInstrumento);

      const erroEncontrado = leituraInstrumento - leituraPadrao;
      const toleranciaMinima = leituraPadrao - limiteErro;
      const toleranciaMaxima = leituraPadrao + limiteErro;
      const validado =
        leituraInstrumento >= toleranciaMinima && leituraInstrumento <= toleranciaMaxima;

      return {
        leituraPadrao,
        leituraInstrumento,
        erroEncontrado,
        toleranciaMinima,
        toleranciaMaxima,
        validado,
      };
    });

    const resultado = await prisma.$transaction(async (tx) => {
      const novaCalibracao = await tx.calibracao.create({
        data: {
          dataCalibracao: parseDateOnly(dataCalibracao),
          dataValidade: parseDateOnly(dataValidade),
          numeroCertificado,
          equipamentoId,
          certificadoUrl,
          certificadoNome,
          empresaId,
          leituras: {
            create: leiturasCalculadas,
          },
        },
        include: {
          equipamento: true,
          empresa: true,
          leituras: true,
        },
      });

      const statusAnterior = equipamentoExiste.statusOperacional;
      const statusNovo = "DISPONIVEL";

      await tx.equipamento.update({
        where: { id: equipamentoId },
        data: {
          statusOperacional: statusNovo,
        },
      });

      await tx.historicoStatus.create({
        data: {
          statusAnterior,
          statusNovo,
          equipamentoId,
        },
      });

      return novaCalibracao;
    });

    return Response.json(resultado, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar calibração:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
