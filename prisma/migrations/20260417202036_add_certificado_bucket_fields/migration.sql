/*
  Warnings:

  - You are about to drop the `calibracoes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "calibracoes" DROP CONSTRAINT "calibracoes_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "calibracoes" DROP CONSTRAINT "calibracoes_equipamentoId_fkey";

-- DropForeignKey
ALTER TABLE "leituras_calibracao" DROP CONSTRAINT "leituras_calibracao_calibracaoId_fkey";

-- DropTable
DROP TABLE "calibracoes";

-- CreateTable
CREATE TABLE "Calibracao" (
    "id" SERIAL NOT NULL,
    "dataCalibracao" TIMESTAMP(3) NOT NULL,
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "numeroCertificado" TEXT NOT NULL,
    "certificadoKey" TEXT,
    "certificadoNome" TEXT,
    "certificadoMimeType" TEXT,
    "certificadoTamanho" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipamentoId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Calibracao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Calibracao_numeroCertificado_key" ON "Calibracao"("numeroCertificado");

-- AddForeignKey
ALTER TABLE "Calibracao" ADD CONSTRAINT "Calibracao_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calibracao" ADD CONSTRAINT "Calibracao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas_calibracao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leituras_calibracao" ADD CONSTRAINT "leituras_calibracao_calibracaoId_fkey" FOREIGN KEY ("calibracaoId") REFERENCES "Calibracao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
