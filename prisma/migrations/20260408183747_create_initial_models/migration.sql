-- CreateEnum
CREATE TYPE "StatusOperacional" AS ENUM ('AGUARDANDO_CALIBRACAO', 'EM_CALIBRACAO', 'DISPONIVEL', 'EM_USO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_equipamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipos_equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervalos_calibracao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "dias" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intervalos_calibracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas_calibracao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "contato" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_calibracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipamentos" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "numeroSerie" TEXT,
    "localizacao" TEXT,
    "observacao" TEXT,
    "statusOperacional" "StatusOperacional" NOT NULL DEFAULT 'AGUARDANDO_CALIBRACAO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoId" INTEGER NOT NULL,
    "marcaId" INTEGER NOT NULL,
    "intervaloId" INTEGER NOT NULL,

    CONSTRAINT "equipamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calibracoes" (
    "id" SERIAL NOT NULL,
    "dataCalibracao" TIMESTAMP(3) NOT NULL,
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "numeroCertificado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipamentoId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "calibracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historicos_status" (
    "id" SERIAL NOT NULL,
    "statusAnterior" "StatusOperacional",
    "statusNovo" "StatusOperacional" NOT NULL,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipamentoId" INTEGER NOT NULL,

    CONSTRAINT "historicos_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_equipamento_nome_key" ON "tipos_equipamento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_nome_key" ON "marcas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "intervalos_calibracao_nome_key" ON "intervalos_calibracao"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_calibracao_nome_key" ON "empresas_calibracao"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "equipamentos_codigo_key" ON "equipamentos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "calibracoes_numeroCertificado_key" ON "calibracoes"("numeroCertificado");

-- AddForeignKey
ALTER TABLE "equipamentos" ADD CONSTRAINT "equipamentos_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipos_equipamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamentos" ADD CONSTRAINT "equipamentos_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamentos" ADD CONSTRAINT "equipamentos_intervaloId_fkey" FOREIGN KEY ("intervaloId") REFERENCES "intervalos_calibracao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calibracoes" ADD CONSTRAINT "calibracoes_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calibracoes" ADD CONSTRAINT "calibracoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas_calibracao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicos_status" ADD CONSTRAINT "historicos_status_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
