import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

function parseDateOnly(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

type LeituraInput = {
  leituraPadrao: number;
  leituraInstrumento: number;
};

export async function GET() {
  try {
    const calibracoes = await prisma.calibracao.findMany({
      orderBy: {
        dataCalibracao: "desc",
      },
      include: {
        equipamento: true,
        empresa: true,
        leituras: true,
      },
    });

    return NextResponse.json(calibracoes);
  } catch (error) {
    console.error("Erro ao buscar calibrações:", error);

    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const dataCalibracao = formData.get("dataCalibracao") as string;
    const dataValidade = formData.get("dataValidade") as string;
    const numeroCertificado = (formData.get("numeroCertificado") as string)?.trim();

    const equipamentoId = Number(formData.get("equipamentoId"));
    const empresaId = Number(formData.get("empresaId"));

    const leiturasJson = formData.get("leituras") as string;
    const leituras = JSON.parse(leiturasJson) as LeituraInput[];

    const arquivo = formData.get("certificado") as File | null;

    let certificadoNome: string | null = null;

    // 👇 aqui entra o arquivo
    if (arquivo && arquivo.size > 0) {
      certificadoNome = arquivo.name;

      // 🔥 TEMPORÁRIO (Railway sem storage externo ainda)
      const bytes = await arquivo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${arquivo.name}`;
      const path = `./public/uploads/${fileName}`;

      const fs = await import("fs/promises");
      await fs.writeFile(path, buffer);
    }

    // ================= VALIDAÇÕES =================

    if (!dataCalibracao) {
      return Response.json({ message: "Data da calibração é obrigatória" }, { status: 400 });
    }

    if (!dataValidade) {
      return Response.json({ message: "Data de validade é obrigatória" }, { status: 400 });
    }

    if (!numeroCertificado) {
      return Response.json({ message: "Número do certificado é obrigatório" }, { status: 400 });
    }

    if (isNaN(equipamentoId)) {
      return Response.json({ message: "equipamentoId inválido" }, { status: 400 });
    }

    if (isNaN(empresaId)) {
      return Response.json({ message: "empresaId inválido" }, { status: 400 });
    }

    if (!Array.isArray(leituras) || leituras.length === 0) {
      return Response.json({ message: "Informe ao menos uma leitura" }, { status: 400 });
    }

    const certificadoExistente = await prisma.calibracao.findUnique({
      where: { numeroCertificado },
    });

    if (certificadoExistente) {
      return Response.json(
        { message: "Já existe uma calibração com esse número de certificado" },
        { status: 409 },
      );
    }

    const equipamentoExiste = await prisma.equipamento.findUnique({
      where: { id: equipamentoId },
    });

    if (!equipamentoExiste) {
      return Response.json({ message: "Equipamento não encontrado" }, { status: 404 });
    }

    if (equipamentoExiste.limiteErro === null) {
      return Response.json(
        { message: "Este equipamento não possui limite de erro cadastrado" },
        { status: 400 },
      );
    }

    const empresaExiste = await prisma.empresaCalibracao.findUnique({
      where: { id: empresaId },
    });

    if (!empresaExiste) {
      return Response.json({ message: "Empresa de calibração não encontrada" }, { status: 404 });
    }

    // ================= CÁLCULO =================

    const limiteErro = equipamentoExiste.limiteErro;

    const leiturasCalculadas = leituras.map((leitura) => {
      const leituraPadrao = Number(leitura.leituraPadrao);
      const leituraInstrumento = Number(leitura.leituraInstrumento);
      const erroEncontrado = leituraInstrumento - leituraPadrao;
      const toleranciaMinima = leituraPadrao - limiteErro;
      const toleranciaMaxima = leituraPadrao + limiteErro;
      const validado =
        leituraInstrumento >= toleranciaMinima && leituraInstrumento <= toleranciaMaxima;

      return {
        leituraPadrao,
        leituraInstrumento,
        erroEncontrado,
        toleranciaMinima,
        toleranciaMaxima,
        validado,
      };
    });

    // ================= TRANSACTION =================

    const resultado = await prisma.$transaction(async (tx) => {
      const novaCalibracao = await tx.calibracao.create({
        data: {
          dataCalibracao: parseDateOnly(dataCalibracao),
          dataValidade: parseDateOnly(dataValidade),
          numeroCertificado,
          equipamentoId,
          empresaId,
          certificadoNome,
          leituras: {
            create: leiturasCalculadas,
          },
        },
      });

      await tx.equipamento.update({
        where: { id: equipamentoId },
        data: { statusOperacional: "DISPONIVEL" },
      });

      await tx.historicoStatus.create({
        data: {
          statusAnterior: equipamentoExiste.statusOperacional,
          statusNovo: "DISPONIVEL",
          equipamentoId,
        },
      });

      return novaCalibracao;
    });

    return Response.json(resultado, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar calibração:", error);
    return Response.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
