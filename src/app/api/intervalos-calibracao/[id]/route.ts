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

    const intervalo = await prisma.intervaloCalibracao.findUnique({
      where: { id: idNumber },
    });

    if (!intervalo) {
      return NextResponse.json({ message: "Intervalo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(intervalo);
  } catch (error) {
    console.error("Erro ao buscar intervalo de calibração:", error);

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
    const nome = body.nome?.trim();
    const dias = Number(body.dias);
    const ativo = body.ativo;

    if (!nome) {
      return Response.json({ message: "Nome é obrigatório" }, { status: 400 });
    }

    if (isNaN(dias) || dias <= 0) {
      return Response.json({ message: "Dias deve ser um número maior que zero" }, { status: 400 });
    }

    const intervaloExistente = await prisma.intervaloCalibracao.findUnique({
      where: { id: idNumber },
    });

    if (!intervaloExistente) {
      return Response.json({ message: "Intervalo não encontrado" }, { status: 404 });
    }

    const nomeDuplicado = await prisma.intervaloCalibracao.findFirst({
      where: {
        nome,
        NOT: { id: idNumber },
      },
    });

    if (nomeDuplicado) {
      return Response.json({ message: "Já existe outro intervalo com esse nome" }, { status: 409 });
    }

    const intervaloAtualizado = await prisma.intervaloCalibracao.update({
      where: { id: idNumber },
      data: {
        nome,
        dias,
        ativo: typeof ativo === "boolean" ? ativo : intervaloExistente.ativo,
      },
    });

    return Response.json(intervaloAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar intervalo de calibração:", error);

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

    const intervaloExistente = await prisma.intervaloCalibracao.findUnique({
      where: { id: idNumber },
    });

    if (!intervaloExistente) {
      return Response.json({ message: "Intervalo não encontrado" }, { status: 404 });
    }

    const intervaloInativado = await prisma.intervaloCalibracao.update({
      where: { id: idNumber },
      data: {
        ativo: false,
      },
    });

    return Response.json(intervaloInativado);
  } catch (error) {
    console.error("Erro ao inativar intervalo de calibração:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
