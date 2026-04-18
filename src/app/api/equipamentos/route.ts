import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const equipamentos = await prisma.equipamento.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tipo: true,
        marca: true,
        intervalo: true,
        calibracoes: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    const equipamentosComSituacao = equipamentos.map((equipamento) => {
      const ultimaCalibracao = equipamento.calibracoes[0];
      const hoje = new Date();

      let situacao = "EM CALIBRAÇÃO";

      if (equipamento.statusOperacional === "EM_CALIBRACAO") {
        situacao = "EM CALIBRACAO";
      } else if (!ultimaCalibracao) {
        situacao = "EM CALIBRAÇÃO";
      } else {
        const dataValidade = new Date(ultimaCalibracao.dataValidade);

        if (dataValidade < hoje) {
          situacao = "VENCIDO";
        } else {
          const diferencaEmMs = dataValidade.getTime() - hoje.getTime();
          const diferencaEmDias = Math.ceil(diferencaEmMs / (1000 * 60 * 60 * 24));

          if (diferencaEmDias <= 30) {
            situacao = "PROXIMO DO VENCIMENTO";
          } else {
            situacao = "CALIBRADO";
          }
        }
      }

      return {
        ...equipamento,
        situacao,
        ultimaCalibracao: ultimaCalibracao || null,
      };
    });

    return NextResponse.json(equipamentosComSituacao);
  } catch (error) {
    console.error("Erro ao buscar equipamentos:", error);

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const codigo = body.codigo?.trim();
    const numeroSerie = body.numeroSerie?.trim();
    const localizacao = body.localizacao?.trim();
    const observacao = body.observacao?.trim() || null;
    const statusOperacional = body.statusOperacional;
    const limiteErro = Number(body.limiteErro);

    const tipoId = Number(body.tipoId);
    const marcaId = Number(body.marcaId);
    const intervaloId = Number(body.intervaloId);

    if (!codigo) {
      return Response.json({ message: "Código é obrigatório" }, { status: 400 });
    }

    if (!numeroSerie) {
      return Response.json({ message: "Número de série é obrigatório" }, { status: 400 });
    }

    if (!localizacao) {
      return Response.json({ message: "Localização é obrigatória" }, { status: 400 });
    }

    if (isNaN(limiteErro) || limiteErro < 0) {
      return Response.json({ message: "Limite de erro inválido" }, { status: 400 });
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
      where: { codigo },
    });

    if (equipamentoExistente) {
      return Response.json(
        { message: "Já existe um equipamento com esse código" },
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

    const novoEquipamento = await prisma.equipamento.create({
      data: {
        codigo,
        numeroSerie,
        localizacao,
        observacao,
        limiteErro,
        statusOperacional,
        tipoId,
        marcaId,
        intervaloId,
      },
      include: {
        tipo: true,
        marca: true,
        intervalo: true,
      },
    });

    return Response.json(novoEquipamento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar equipamento:", error);

    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
