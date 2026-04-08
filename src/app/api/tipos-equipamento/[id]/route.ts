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

    const tipo = await prisma.tipoEquipamento.findUnique({
      where: { id: idNumber },
    });

    if (!tipo) {
      return NextResponse.json({ message: "Tipo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(tipo);
  } catch (error) {
    console.error("Erro ao buscar tipo:", error);

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
    const ativo = body.ativo;

    if (!nome) {
      return Response.json({ message: "Nome é obrigatório" }, { status: 400 });
    }

    const tipoExistente = await prisma.tipoEquipamento.findUnique({
      where: { id: idNumber },
    });

    if (!tipoExistente) {
      return Response.json({ message: "Tipo não encontrado" }, { status: 404 });
    }

    const nomeDuplicado = await prisma.tipoEquipamento.findFirst({
      where: {
        nome,
        NOT: { id: idNumber },
      },
    });

    if (nomeDuplicado) {
      return Response.json({ message: "Já existe outro tipo com esse nome" }, { status: 409 });
    }

    const atualizado = await prisma.tipoEquipamento.update({
      where: { id: idNumber },
      data: {
        nome,
        ativo: typeof ativo === "boolean" ? ativo : tipoExistente.ativo,
      },
    });

    return Response.json(atualizado);
  } catch (error) {
    console.error("Erro ao atualizar tipo:", error);

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

    const tipoExistente = await prisma.tipoEquipamento.findUnique({
      where: { id: idNumber },
    });

    if (!tipoExistente) {
      return Response.json({ message: "Tipo não encontrado" }, { status: 404 });
    }

    const tipoInativado = await prisma.tipoEquipamento.update({
      where: { id: idNumber },
      data: {
        ativo: false,
      },
    });

    return Response.json(tipoInativado);
  } catch (error) {
    console.error("Erro ao inativar tipo:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
