import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const intervalos = await prisma.intervaloCalibracao.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(intervalos);
  } catch (error) {
    console.error("Erro ao buscar intervalos de calibração:", error);

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nome = body.nome?.trim();
    const dias = Number(body.dias);

    if (!nome) {
      return Response.json({ message: "Nome é obrigatório" }, { status: 400 });
    }

    if (isNaN(dias) || dias <= 0) {
      return Response.json({ message: "Dias deve ser um número maior que zero" }, { status: 400 });
    }

    const intervaloExistente = await prisma.intervaloCalibracao.findUnique({
      where: { nome },
    });

    if (intervaloExistente) {
      return Response.json({ message: "Já existe um intervalo com esse nome" }, { status: 409 });
    }

    const novoIntervalo = await prisma.intervaloCalibracao.create({
      data: {
        nome,
        dias,
      },
    });

    return Response.json(novoIntervalo, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar intervalo de calibração:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
