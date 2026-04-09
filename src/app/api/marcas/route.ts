import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const marcas = await prisma.marca.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(marcas);
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);

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

    const marcaExistente = await prisma.marca.findUnique({
      where: { nome },
    });

    if (marcaExistente) {
      return Response.json({ message: "Já existe uma marca com esse nome" }, { status: 409 });
    }

    const novaMarca = await prisma.marca.create({
      data: {
        nome,
      },
    });

    return Response.json(novaMarca, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar marca:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
