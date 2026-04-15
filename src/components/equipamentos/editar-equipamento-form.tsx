"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

type Equipamento = {
  id: number
  codigo: string
  numeroSerie: string | null
  localizacao: string | null
  observacao: string | null
  statusOperacional: string
  ativo: boolean
  tipoId: number
  marcaId: number
  intervaloId: number
  limiteErro: number | null
}

type Props = {
  equipamento: Equipamento
  tipos: TipoEquipamento[]
  marcas: Marca[]
  intervalos: IntervaloCalibracao[]
}

export function EditarEquipamentoForm({ equipamento, tipos, marcas, intervalos }: Props) {
  const router = useRouter()

  const [codigo, setCodigo] = useState(equipamento.codigo)
  const [numeroSerie, setNumeroSerie] = useState(equipamento.numeroSerie ?? "")
  const [localizacao, setLocalizacao] = useState(equipamento.localizacao ?? "")
  const [observacao, setObservacao] = useState(equipamento.observacao ?? "")
  const [statusOperacional, setStatusOperacional] = useState(equipamento.statusOperacional)
  const [tipoId, setTipoId] = useState(String(equipamento.tipoId))
  const [marcaId, setMarcaId] = useState(String(equipamento.marcaId))
  const [intervaloId, setIntervaloId] = useState(String(equipamento.intervaloId))
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [limiteErro, setLimiteErro] = useState(
    equipamento.limiteErro !== null ? String(equipamento.limiteErro) : ""
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro("")
    setLoading(true)

    try {
      const response = await fetch(`/api/equipamentos/${equipamento.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo,
          numeroSerie,
          limiteErro: Number(limiteErro),
          localizacao,
          observacao,
          statusOperacional,
          tipoId: Number(tipoId),
          marcaId: Number(marcaId),
          intervaloId: Number(intervaloId),
          ativo: equipamento.ativo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.message || "Erro ao atualizar equipamento")
        setLoading(false)
        return
      }

      router.push(`/equipamentos/${equipamento.id}`)
      router.refresh()
    } catch (error) {
      console.error(error)
      setErro("Erro ao atualizar equipamento")
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Equipamento</CardTitle>
        <CardDescription>Atualize os dados do equipamento {equipamento.codigo}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(event) => setCodigo(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroSerie">Número de série</Label>
              <Input
                id="numeroSerie"
                type="text"
                value={numeroSerie}
                onChange={(event) => setNumeroSerie(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                type="text"
                value={localizacao}
                onChange={(event) => setLocalizacao(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusOperacional">Status operacional</Label>
              <Select value={statusOperacional} onValueChange={setStatusOperacional}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGUARDANDO_CALIBRACAO">Aguardando calibração</SelectItem>
                  <SelectItem value="EM_CALIBRACAO">Em calibração</SelectItem>
                  <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                  <SelectItem value="EM_USO">Em uso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoId">Tipo de equipamento</Label>
              <Select value={tipoId} onValueChange={setTipoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tipos.map((tipo) => (
                    <SelectItem key={tipo.id} value={String(tipo.id)}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marcaId">Marca</Label>
              <Select value={marcaId} onValueChange={setMarcaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {marcas.map((marca) => (
                    <SelectItem key={marca.id} value={String(marca.id)}>
                      {marca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intervaloId">Intervalo de calibração</Label>
              <Select value={intervaloId} onValueChange={setIntervaloId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o intervalo" />
                </SelectTrigger>
                <SelectContent>
                  {intervalos.map((intervalo) => (
                    <SelectItem key={intervalo.id} value={String(intervalo.id)}>
                      {intervalo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limiteErro">Limite de erro</Label>
              <Input
                id="limiteErro"
                type="number"
                step="0.01"
                value={limiteErro}
                onChange={(event) => setLimiteErro(event.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacao">Observação</Label>
              <Input
                id="observacao"
                type="text"
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
              />
            </div>
          </div>

          {erro && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {erro}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/equipamentos/${equipamento.id}`)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
