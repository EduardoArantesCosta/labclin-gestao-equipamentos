"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Plus, Eye, Pencil, FileCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

type Calibracao = {
  id: number
  dataCalibracao: string
  dataValidade: string
  numeroCertificado: string
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
  situacao: string
  tipo: TipoEquipamento
  limiteErro: number | null
  marca: Marca
  intervalo: IntervaloCalibracao
  ultimaCalibracao: Calibracao | null
}

type Props = {
  equipamentos: Equipamento[]
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

export function EquipamentosTable({ equipamentos }: Props) {
  const [tipoSelecionado, setTipoSelecionado] = useState("TODOS")

  const tiposDisponiveis = useMemo(() => {
    const tiposUnicos = equipamentos.map((equipamento) => equipamento.tipo.nome)
    return ["TODOS", ...Array.from(new Set(tiposUnicos)).sort()]
  }, [equipamentos])

  const prioridadeSituacao: Record<string, number> = {
    VENCIDO: 1,
    PROXIMO_DO_VENCIMENTO: 2,
    EM_CALIBRACAO: 3,
    OK: 4,
  }

  const equipamentosFiltrados = useMemo(() => {
    const filtrados =
      tipoSelecionado === "TODOS"
        ? equipamentos
        : equipamentos.filter((equipamento) => equipamento.tipo.nome === tipoSelecionado)

    return [...filtrados].sort((a, b) => {
      const prioridadeA = prioridadeSituacao[a.situacao] ?? 99
      const prioridadeB = prioridadeSituacao[b.situacao] ?? 99
      return prioridadeA - prioridadeB
    })
  }, [equipamentos, tipoSelecionado])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Equipamentos cadastrados</CardTitle>
            <CardDescription>
              Visualização geral dos equipamentos monitorados.
            </CardDescription>
          </div>

          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposDisponiveis.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo === "TODOS" ? "Todos os tipos" : tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button asChild>
              <Link href="/cadastros/equipamentos">
                <Plus className="mr-2 h-4 w-4" />
                Novo equipamento
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <TooltipProvider>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Certificado</TableHead>
                  <TableHead className="font-semibold">Localização</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Situação</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Validade</TableHead>
                  <TableHead className="text-right font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {equipamentosFiltrados.map((equipamento) => (
                  <TableRow key={equipamento.id}>
                    <TableCell className="font-medium">{equipamento.codigo}</TableCell>
                    <TableCell>
                      {equipamento.ultimaCalibracao?.numeroCertificado || "-"}
                    </TableCell>
                    <TableCell>{equipamento.localizacao || "-"}</TableCell>
                    <TableCell>{equipamento.tipo.nome}</TableCell>
                    <TableCell>
                      <Badge variant={getSituacaoBadgeVariant(equipamento.situacao)}>
                        {formatarSituacao(equipamento.situacao)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatarStatusOperacional(equipamento.statusOperacional)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {equipamento.ultimaCalibracao
                        ? new Date(equipamento.ultimaCalibracao.dataValidade).toLocaleDateString(
                            "pt-BR"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                              <Link href={`/equipamentos/${equipamento.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver</span>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalhes</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                              <Link href={`/equipamentos/${equipamento.id}/editar`}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="default" size="icon" asChild className="h-8 w-8">
                              <Link href={`/equipamentos/${equipamento.id}/calibracoes/nova`}>
                                <FileCheck className="h-4 w-4" />
                                <span className="sr-only">Nova calibração</span>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Nova calibração</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {equipamentosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <p className="text-muted-foreground">
                        Nenhum equipamento encontrado para o tipo selecionado.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
