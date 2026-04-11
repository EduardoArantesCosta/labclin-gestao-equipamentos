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
        calibracoes: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            empresa: true,
          },
        },
        historicosStatus: {
          orderBy: {
            dataAlteracao: "desc",
          },
        },
      },
    });

    if (!equipamento) {
      return NextResponse.json({ message: "Equipamento não encontrado" }, { status: 404 });
    }

    const ultimaCalibracao = equipamento.calibracoes[0] || null;
    const hoje = new Date();

    let situacao = "OK";

    if (equipamento.statusOperacional === "EM_CALIBRACAO") {
      situacao = "EM_CALIBRACAO";
    } else if (!ultimaCalibracao) {
      situacao = "VENCIDO";
    } else {
      const dataValidade = new Date(ultimaCalibracao.dataValidade);

      if (dataValidade < hoje) {
        situacao = "VENCIDO";
      } else {
        const diferencaEmMs = dataValidade.getTime() - hoje.getTime();
        const diferencaEmDias = Math.ceil(diferencaEmMs / (1000 * 60 * 60 * 24));

        if (diferencaEmDias <= 30) {
          situacao = "PROXIMO_DO_VENCIMENTO";
        } else {
          situacao = "OK";
        }
      }
    }

    const equipamentoComSituacao = {
      ...equipamento,
      situacao,
      ultimaCalibracao,
    };

    return NextResponse.json(equipamentoComSituacao);
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
    const statusOperacional = body.statusOperacional;
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

    const statusPermitidos = ["AGUARDANDO_CALIBRACAO", "EM_CALIBRACAO", "DISPONIVEL", "EM_USO"];

    if (!statusPermitidos.includes(statusOperacional)) {
      return Response.json({ message: "Status operacional inválido" }, { status: 400 });
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

    const equipamentoAtualizado = await prisma.$transaction(async (tx) => {
      const equipamento = await tx.equipamento.update({
        where: { id: idNumber },
        data: {
          codigo,
          numeroSerie,
          localizacao,
          observacao,
          statusOperacional,
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

      if (equipamentoExistente.statusOperacional !== statusOperacional) {
        await tx.historicoStatus.create({
          data: {
            statusAnterior: equipamentoExistente.statusOperacional,
            statusNovo: statusOperacional,
            equipamentoId: idNumber,
          },
        });
      }

      return equipamento;
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
