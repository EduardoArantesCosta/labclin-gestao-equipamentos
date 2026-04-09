import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const calibracoes = await prisma.calibracao.findMany({
      orderBy: {
        dataCalibracao: "desc",
      },
      include: {
        equipamento: true,
        empresa: true,
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

    const equipamentoId = Number(body.equipamentoId);
    const empresaId = Number(body.empresaId);

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

    const empresaExiste = await prisma.empresaCalibracao.findUnique({
      where: { id: empresaId },
    });

    if (!empresaExiste) {
      return Response.json({ message: "Empresa de calibração não encontrada" }, { status: 404 });
    }

    const novaCalibracao = await prisma.calibracao.create({
      data: {
        dataCalibracao: new Date(dataCalibracao),
        dataValidade: new Date(dataValidade),
        numeroCertificado,
        equipamentoId,
        empresaId,
      },
      include: {
        equipamento: true,
        empresa: true,
      },
    });

    return Response.json(novaCalibracao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar calibração:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
