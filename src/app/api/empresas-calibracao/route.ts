import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const empresas = await prisma.empresaCalibracao.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(empresas);
  } catch (error) {
    console.error("Erro ao buscar empresas de calibração:", error);

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nome = body.nome?.trim();
    const contato = body.contato?.trim() || null;

    if (!nome) {
      return Response.json({ message: "Nome é obrigatório" }, { status: 400 });
    }

    const empresaExistente = await prisma.empresaCalibracao.findUnique({
      where: { nome },
    });

    if (empresaExistente) {
      return Response.json({ message: "Já existe uma empresa com esse nome" }, { status: 409 });
    }

    const novaEmpresa = await prisma.empresaCalibracao.create({
      data: {
        nome,
        contato,
      },
    });

    return Response.json(novaEmpresa, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar empresa de calibração:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
