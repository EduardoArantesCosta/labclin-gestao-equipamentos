import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tipos = await prisma.tipoEquipamento.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(tipos);
  } catch (error) {
    console.error("Erro ao buscar tipos de equipamento:", error);

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nome = body.nome?.trim();

    if (!nome) {
      return Response.json({ message: "Nome é obrigatório" }, { status: 400 });
    }

    const tipoExistente = await prisma.tipoEquipamento.findUnique({
      where: { nome },
    });

    if (tipoExistente) {
      return Response.json({ message: "Já existe um tipo com esse nome" }, { status: 409 });
    }

    const novoTipo = await prisma.tipoEquipamento.create({
      data: {
        nome,
      },
    });

    return Response.json(novoTipo, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tipo de equipamento:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
