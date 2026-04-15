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

type Props = {
  tipos: TipoEquipamento[]
  marcas: Marca[]
  intervalos: IntervaloCalibracao[]
}

export function NovoEquipamentoForm({ tipos, marcas, intervalos }: Props) {
  const router = useRouter()

  const [codigo, setCodigo] = useState("")
  const [numeroSerie, setNumeroSerie] = useState("")
  const [localizacao, setLocalizacao] = useState("")
  const [observacao, setObservacao] = useState("")
  const [statusOperacional, setStatusOperacional] = useState("AGUARDANDO_CALIBRACAO")
  const [tipoId, setTipoId] = useState(tipos[0]?.id ? String(tipos[0].id) : "")
  const [marcaId, setMarcaId] = useState(marcas[0]?.id ? String(marcas[0].id) : "")
  const [intervaloId, setIntervaloId] = useState(intervalos[0]?.id ? String(intervalos[0].id) : "")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [limiteErro, setLimiteErro] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro("")
    setLoading(true)

    try {
      const response = await fetch("/api/equipamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo,
          numeroSerie,
          localizacao,
          observacao,
          statusOperacional,
          limiteErro: Number(limiteErro),
          tipoId: Number(tipoId),
          marcaId: Number(marcaId),
          intervaloId: Number(intervaloId),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.message || "Erro ao cadastrar equipamento")
        setLoading(false)
        return
      }

      router.push("/equipamentos")
      router.refresh()
    } catch (error) {
      console.error(error)
      setErro("Erro ao cadastrar equipamento")
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Equipamento</CardTitle>
        <CardDescription>Preencha os dados do equipamento para cadastrá-lo no sistema.</CardDescription>
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
                placeholder="Ex: TERM-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroSerie">Número de série</Label>
              <Input
                id="numeroSerie"
                type="text"
                value={numeroSerie}
                onChange={(event) => setNumeroSerie(event.target.value)}
                placeholder="Ex: SN123456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                type="text"
                value={localizacao}
                onChange={(event) => setLocalizacao(event.target.value)}
                placeholder="Ex: Sala 01"
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
                placeholder="Ex: 0.5"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacao">Observação</Label>
              <Input
                id="observacao"
                type="text"
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
                placeholder="Observações adicionais..."
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
              {loading ? "Cadastrando..." : "Cadastrar equipamento"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/equipamentos")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
