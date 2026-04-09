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

    const marca = await prisma.marca.findUnique({
      where: { id: idNumber },
    });

    if (!marca) {
      return NextResponse.json({ message: "Marca não encontrada" }, { status: 404 });
    }

    return NextResponse.json(marca);
  } catch (error) {
    console.error("Erro ao buscar marca:", error);

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

    const marcaExistente = await prisma.marca.findUnique({
      where: { id: idNumber },
    });

    if (!marcaExistente) {
      return Response.json({ message: "Marca não encontrada" }, { status: 404 });
    }

    const nomeDuplicado = await prisma.marca.findFirst({
      where: {
        nome,
        NOT: { id: idNumber },
      },
    });

    if (nomeDuplicado) {
      return Response.json({ message: "Já existe outra marca com esse nome" }, { status: 409 });
    }

    const marcaAtualizada = await prisma.marca.update({
      where: { id: idNumber },
      data: {
        nome,
        ativo: typeof ativo === "boolean" ? ativo : marcaExistente.ativo,
      },
    });

    return Response.json(marcaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar marca:", error);

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

    const marcaExistente = await prisma.marca.findUnique({
      where: { id: idNumber },
    });

    if (!marcaExistente) {
      return Response.json({ message: "Marca não encontrada" }, { status: 404 });
    }

    const marcaInativada = await prisma.marca.update({
      where: { id: idNumber },
      data: {
        ativo: false,
      },
    });

    return Response.json(marcaInativada);
  } catch (error) {
    console.error("Erro ao inativar marca:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
