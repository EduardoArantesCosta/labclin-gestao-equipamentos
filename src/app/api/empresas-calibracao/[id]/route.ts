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

    const empresa = await prisma.empresaCalibracao.findUnique({
      where: { id: idNumber },
    });

    if (!empresa) {
      return NextResponse.json({ message: "Empresa não encontrada" }, { status: 404 });
    }

    return NextResponse.json(empresa);
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);

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
    const contato = body.contato?.trim() || null;
    const ativo = body.ativo;

    if (!nome) {
      return Response.json({ message: "Nome é obrigatório" }, { status: 400 });
    }

    const empresaExistente = await prisma.empresaCalibracao.findUnique({
      where: { id: idNumber },
    });

    if (!empresaExistente) {
      return Response.json({ message: "Empresa não encontrada" }, { status: 404 });
    }

    const nomeDuplicado = await prisma.empresaCalibracao.findFirst({
      where: {
        nome,
        NOT: { id: idNumber },
      },
    });

    if (nomeDuplicado) {
      return Response.json({ message: "Já existe outra empresa com esse nome" }, { status: 409 });
    }

    const empresaAtualizada = await prisma.empresaCalibracao.update({
      where: { id: idNumber },
      data: {
        nome,
        contato,
        ativo: typeof ativo === "boolean" ? ativo : empresaExistente.ativo,
      },
    });

    return Response.json(empresaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);

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

    const empresaExistente = await prisma.empresaCalibracao.findUnique({
      where: { id: idNumber },
    });

    if (!empresaExistente) {
      return Response.json({ message: "Empresa não encontrada" }, { status: 404 });
    }

    const empresaInativada = await prisma.empresaCalibracao.update({
      where: { id: idNumber },
      data: {
        ativo: false,
      },
    });

    return Response.json(empresaInativada);
  } catch (error) {
    console.error("Erro ao inativar empresa:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
