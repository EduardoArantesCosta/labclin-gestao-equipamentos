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

    const equipamento = await prisma.equipamento.findUnique({
      where: { id: idNumber },
      include: {
        tipo: true,
        marca: true,
        intervalo: true,
        calibracoes: true,
        historicosStatus: true,
      },
    });

    if (!equipamento) {
      return NextResponse.json({ message: "Equipamento não encontrado" }, { status: 404 });
    }

    return NextResponse.json(equipamento);
  } catch (error) {
    console.error("Erro ao buscar equipamento:", error);

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

    const codigo = body.codigo?.trim();
    const numeroSerie = body.numeroSerie?.trim();
    const localizacao = body.localizacao?.trim();
    const observacao = body.observacao?.trim() || null;

    const tipoId = Number(body.tipoId);
    const marcaId = Number(body.marcaId);
    const intervaloId = Number(body.intervaloId);
    const ativo = body.ativo;

    if (!codigo) {
      return Response.json({ message: "Código é obrigatório" }, { status: 400 });
    }

    if (!numeroSerie) {
      return Response.json({ message: "Número de série é obrigatório" }, { status: 400 });
    }

    if (!localizacao) {
      return Response.json({ message: "Localização é obrigatória" }, { status: 400 });
    }

    if (isNaN(tipoId)) {
      return Response.json({ message: "tipoId inválido" }, { status: 400 });
    }

    if (isNaN(marcaId)) {
      return Response.json({ message: "marcaId inválido" }, { status: 400 });
    }

    if (isNaN(intervaloId)) {
      return Response.json({ message: "intervaloId inválido" }, { status: 400 });
    }

    const equipamentoExistente = await prisma.equipamento.findUnique({
      where: { id: idNumber },
    });

    if (!equipamentoExistente) {
      return Response.json({ message: "Equipamento não encontrado" }, { status: 404 });
    }

    const codigoDuplicado = await prisma.equipamento.findFirst({
      where: {
        codigo,
        NOT: { id: idNumber },
      },
    });

    if (codigoDuplicado) {
      return Response.json(
        { message: "Já existe outro equipamento com esse código" },
        { status: 409 },
      );
    }

    const tipoExiste = await prisma.tipoEquipamento.findUnique({
      where: { id: tipoId },
    });

    if (!tipoExiste) {
      return Response.json({ message: "Tipo de equipamento não encontrado" }, { status: 404 });
    }

    const marcaExiste = await prisma.marca.findUnique({
      where: { id: marcaId },
    });

    if (!marcaExiste) {
      return Response.json({ message: "Marca não encontrada" }, { status: 404 });
    }

    const intervaloExiste = await prisma.intervaloCalibracao.findUnique({
      where: { id: intervaloId },
    });

    if (!intervaloExiste) {
      return Response.json({ message: "Intervalo de calibração não encontrado" }, { status: 404 });
    }

    const equipamentoAtualizado = await prisma.equipamento.update({
      where: { id: idNumber },
      data: {
        codigo,
        numeroSerie,
        localizacao,
        observacao,
        tipoId,
        marcaId,
        intervaloId,
        ativo: typeof ativo === "boolean" ? ativo : equipamentoExistente.ativo,
      },
      include: {
        tipo: true,
        marca: true,
        intervalo: true,
      },
    });

    return Response.json(equipamentoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar equipamento:", error);

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

    const equipamentoExistente = await prisma.equipamento.findUnique({
      where: { id: idNumber },
    });

    if (!equipamentoExistente) {
      return Response.json({ message: "Equipamento não encontrado" }, { status: 404 });
    }

    const equipamentoInativado = await prisma.equipamento.update({
      where: { id: idNumber },
      data: {
        ativo: false,
      },
      include: {
        tipo: true,
        marca: true,
        intervalo: true,
      },
    });

    return Response.json(equipamentoInativado);
  } catch (error) {
    console.error("Erro ao inativar equipamento:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
