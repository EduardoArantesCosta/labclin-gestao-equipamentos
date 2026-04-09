import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const calibracao = await prisma.calibracao.findUnique({
      where: { id: idNumber },
      include: {
        equipamento: true,
        empresa: true,
      },
    });

    if (!calibracao) {
      return NextResponse.json({ message: "Calibração não encontrada" }, { status: 404 });
    }

    return NextResponse.json(calibracao);
  } catch (error) {
    console.error("Erro ao buscar calibração:", error);

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return Response.json({ message: "ID inválido" }, { status: 400 });
    }

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

    const calibracaoExistente = await prisma.calibracao.findUnique({
      where: { id: idNumber },
    });

    if (!calibracaoExistente) {
      return Response.json({ message: "Calibração não encontrada" }, { status: 404 });
    }

    const certificadoDuplicado = await prisma.calibracao.findFirst({
      where: {
        numeroCertificado,
        NOT: { id: idNumber },
      },
    });

    if (certificadoDuplicado) {
      return Response.json(
        { message: "Já existe outra calibração com esse certificado" },
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
      return Response.json({ message: "Empresa não encontrada" }, { status: 404 });
    }

    const calibracaoAtualizada = await prisma.calibracao.update({
      where: { id: idNumber },
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

    return Response.json(calibracaoAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar calibração:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return Response.json({ message: "ID inválido" }, { status: 400 });
    }

    const calibracaoExistente = await prisma.calibracao.findUnique({
      where: { id: idNumber },
    });

    if (!calibracaoExistente) {
      return Response.json({ message: "Calibração não encontrada" }, { status: 404 });
    }

    await prisma.calibracao.delete({
      where: { id: idNumber },
    });

    return Response.json({ message: "Calibração removida com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar calibração:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
