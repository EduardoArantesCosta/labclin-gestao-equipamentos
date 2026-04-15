-- AlterTable
ALTER TABLE "equipamentos" ADD COLUMN     "limiteErro" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "leituras_calibracao" (
    "id" SERIAL NOT NULL,
    "leituraPadrao" DOUBLE PRECISION NOT NULL,
    "leituraInstrumento" DOUBLE PRECISION NOT NULL,
    "erroEncontrado" DOUBLE PRECISION NOT NULL,
    "toleranciaMinima" DOUBLE PRECISION NOT NULL,
    "toleranciaMaxima" DOUBLE PRECISION NOT NULL,
    "validado" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calibracaoId" INTEGER NOT NULL,

    CONSTRAINT "leituras_calibracao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "leituras_calibracao" ADD CONSTRAINT "leituras_calibracao_calibracaoId_fkey" FOREIGN KEY ("calibracaoId") REFERENCES "calibracoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
