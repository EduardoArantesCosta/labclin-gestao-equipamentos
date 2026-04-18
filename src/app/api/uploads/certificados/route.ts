import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { bucketName, s3 } from "@/src/lib/storage";

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fileName = String(body.fileName || "");
    const contentType = String(body.contentType || "");
    const equipamentoId = Number(body.equipamentoId || 0);

    if (!fileName) {
      return NextResponse.json({ message: "Nome do arquivo é obrigatório" }, { status: 400 });
    }

    if (!contentType) {
      return NextResponse.json({ message: "Tipo do arquivo é obrigatório" }, { status: 400 });
    }

    if (!equipamentoId) {
      return NextResponse.json({ message: "equipamentoId inválido" }, { status: 400 });
    }

    const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"];

    if (!tiposPermitidos.includes(contentType)) {
      return NextResponse.json({ message: "Tipo de arquivo não permitido" }, { status: 400 });
    }

    const safeName = sanitizeFileName(fileName);
    const key = `certificados/equipamento-${equipamentoId}/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error("Erro ao gerar URL de upload:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
