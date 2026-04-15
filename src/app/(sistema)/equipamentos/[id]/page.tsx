import { Fragment } from "react"
import Link from "next/link"
import { ArrowLeft, Pencil, FileCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TipoEquipamento = {
  id: number
  nome: string
}

type Marca = {
  id: number
  nome: string
}

type IntervaloCalibracao = {
  id: number
  nome: string
  dias: number | null
}

type EmpresaCalibracao = {
  id: number
  nome: string
}

type LeituraCalibracao = {
  id: number
  leituraPadrao: number
  leituraInstrumento: number
  erroEncontrado: number
  toleranciaMinima: number
  toleranciaMaxima: number
  validado: boolean
}

type Calibracao = {
  id: number
  dataCalibracao: string
  dataValidade: string
  numeroCertificado: string
  empresa: EmpresaCalibracao
  leituras: LeituraCalibracao[]
}

type HistoricoStatus = {
  id: number
  statusAnterior: string | null
  statusNovo: string
  dataAlteracao: string
}

type Equipamento = {
  id: number
  codigo: string
  numeroSerie: string | null
  localizacao: string | null
  observacao: string | null
  statusOperacional: string
  ativo: boolean
  createdAt: string
  limiteErro: number | null
  situacao: string
  tipo: TipoEquipamento
  marca: Marca
  intervalo: IntervaloCalibracao
  ultimaCalibracao: Calibracao | null
  calibracoes: Calibracao[]
  historicosStatus: HistoricoStatus[]
}

async function getEquipamento(id: string): Promise<Equipamento> {
  const response = await fetch(`http://localhost:3000/api/equipamentos/${id}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamento")
  }

  return response.json()
}

function getSituacaoBadgeVariant(situacao: string) {
  switch (situacao) {
    case "VENCIDO":
      return "destructive"
    case "PROXIMO_DO_VENCIMENTO":
      return "warning"
    case "OK":
      return "success"
    case "EM_CALIBRACAO":
      return "info"
    default:
      return "secondary"
  }
}

function formatarSituacao(situacao: string) {
  switch (situacao) {
    case "PROXIMO_DO_VENCIMENTO":
      return "Próximo do vencimento"
    case "EM_CALIBRACAO":
      return "Em calibração"
    case "OK":
      return "Calibrado"
    case "VENCIDO":
      return "Vencido"
    default:
      return situacao
  }
}

function formatarStatusOperacional(status: string) {
  switch (status) {
    case "AGUARDANDO_CALIBRACAO":
      return "Aguardando calibração"
    case "EM_CALIBRACAO":
      return "Em calibração"
    case "DISPONIVEL":
      return "Disponível"
    case "EM_USO":
      return "Em uso"
    default:
      return status
  }
}

export default async function EquipamentoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const equipamento = await getEquipamento(id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/equipamentos">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{equipamento.codigo}</h1>
            <p className="text-sm text-muted-foreground">
              {equipamento.tipo.nome} - {equipamento.marca.nome}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/equipamentos/${equipamento.id}/editar`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/equipamentos/${equipamento.id}/calibracoes/nova`}>
              <FileCheck className="mr-2 h-4 w-4" />
              Nova Calibração
            </Link>
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações gerais</CardTitle>
            <CardDescription>Dados cadastrais do equipamento</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Código</dt>
                <dd className="font-medium">{equipamento.codigo}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Número de série</dt>
                <dd className="font-medium">{equipamento.numeroSerie || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Localização</dt>
                <dd className="font-medium">{equipamento.localizacao || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tipo</dt>
                <dd className="font-medium">{equipamento.tipo.nome}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Marca</dt>
                <dd className="font-medium">{equipamento.marca.nome}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Intervalo</dt>
                <dd className="font-medium">{equipamento.intervalo.nome}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Limite de erro</dt>
                <dd className="font-medium">{equipamento.limiteErro ?? "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Situação</dt>
                <dd>
                  <Badge variant={getSituacaoBadgeVariant(equipamento.situacao)}>
                    {formatarSituacao(equipamento.situacao)}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status operacional</dt>
                <dd className="font-medium">
                  {formatarStatusOperacional(equipamento.statusOperacional)}
                </dd>
              </div>
              {equipamento.observacao && (
                <div className="flex flex-col gap-1 pt-2">
                  <dt className="text-muted-foreground">Observação</dt>
                  <dd className="rounded-md bg-muted p-3 text-sm">{equipamento.observacao}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Última calibração</CardTitle>
            <CardDescription>Dados da calibração mais recente</CardDescription>
          </CardHeader>
          <CardContent>
            {equipamento.ultimaCalibracao ? (
              <dl className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Certificado</dt>
                  <dd className="font-medium">
                    {equipamento.ultimaCalibracao.numeroCertificado}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Data da calibração</dt>
                  <dd className="font-medium">
                    {new Date(equipamento.ultimaCalibracao.dataCalibracao).toLocaleDateString(
                      "pt-BR"
                    )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Validade</dt>
                  <dd className="font-medium">
                    {new Date(equipamento.ultimaCalibracao.dataValidade).toLocaleDateString(
                      "pt-BR"
                    )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Empresa</dt>
                  <dd className="font-medium">
                    {equipamento.ultimaCalibracao.empresa?.nome || "-"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                Este equipamento ainda não possui calibração cadastrada.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Calibrações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de calibrações</CardTitle>
          <CardDescription>Todas as calibrações realizadas neste equipamento</CardDescription>
        </CardHeader>
        <CardContent>
          {equipamento.calibracoes.length > 0 ? (
            <div className="space-y-6">
              {equipamento.calibracoes.map((calibracao) => (
                <div key={calibracao.id} className="rounded-lg border">
                  <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">
                        Certificado: {calibracao.numeroCertificado}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(calibracao.dataCalibracao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Empresa: {calibracao.empresa?.nome || "-"}
                    </span>
                  </div>

                  {calibracao.leituras.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow className="text-xs">
                          <TableHead>Leitura padrão</TableHead>
                          <TableHead>Leitura instrumento</TableHead>
                          <TableHead>Erro encontrado</TableHead>
                          <TableHead>Tolerância mín.</TableHead>
                          <TableHead>Tolerância máx.</TableHead>
                          <TableHead>Validação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calibracao.leituras.map((leitura) => (
                          <TableRow key={leitura.id}>
                            <TableCell>{leitura.leituraPadrao}</TableCell>
                            <TableCell>{leitura.leituraInstrumento}</TableCell>
                            <TableCell>{leitura.erroEncontrado}</TableCell>
                            <TableCell>{leitura.toleranciaMinima}</TableCell>
                            <TableCell>{leitura.toleranciaMaxima}</TableCell>
                            <TableCell>
                              <Badge variant={leitura.validado ? "success" : "destructive"}>
                                {leitura.validado ? "Validado" : "Não validado"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma calibração encontrada para este equipamento.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Status */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de status</CardTitle>
          <CardDescription>Alterações de status operacional do equipamento</CardDescription>
        </CardHeader>
        <CardContent>
          {equipamento.historicosStatus.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Status anterior</TableHead>
                  <TableHead>Novo status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipamento.historicosStatus.map((historico) => (
                  <TableRow key={historico.id}>
                    <TableCell>
                      {new Date(historico.dataAlteracao).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {historico.statusAnterior
                        ? formatarStatusOperacional(historico.statusAnterior)
                        : "-"}
                    </TableCell>
                    <TableCell>{formatarStatusOperacional(historico.statusNovo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum histórico de status encontrado.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
