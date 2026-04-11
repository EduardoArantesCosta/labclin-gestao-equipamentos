import { EditarEquipamentoForm } from "@/src/components/equipamentos/editar-equipamento-form";

type TipoEquipamento = {
  id: number;
  nome: string;
};

type Marca = {
  id: number;
  nome: string;
};

type IntervaloCalibracao = {
  id: number;
  nome: string;
  dias: number | null;
};

type Equipamento = {
  id: number;
  codigo: string;
  numeroSerie: string | null;
  localizacao: string | null;
  observacao: string | null;
  statusOperacional: string;
  ativo: boolean;
  tipoId: number;
  marcaId: number;
  intervaloId: number;
  tipo: TipoEquipamento;
  marca: Marca;
  intervalo: IntervaloCalibracao;
};

async function getEquipamento(id: string): Promise<Equipamento> {
  const response = await fetch(`http://localhost:3000/api/equipamentos/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar equipamento");
  }

  return response.json();
}

async function getTipos(): Promise<TipoEquipamento[]> {
  const response = await fetch("http://localhost:3000/api/tipos-equipamento", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar tipos de equipamento");
  }

  return response.json();
}

async function getMarcas(): Promise<Marca[]> {
  const response = await fetch("http://localhost:3000/api/marcas", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar marcas");
  }

  return response.json();
}

async function getIntervalos(): Promise<IntervaloCalibracao[]> {
  const response = await fetch("http://localhost:3000/api/intervalos-calibracao", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar intervalos");
  }

  return response.json();
}

export default async function EditarEquipamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [equipamento, tipos, marcas, intervalos] = await Promise.all([
    getEquipamento(id),
    getTipos(),
    getMarcas(),
    getIntervalos(),
  ]);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              LABORCLIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Editar equipamento
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Atualize os dados do equipamento selecionado.
            </p>
          </div>

          <div className="px-8 py-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800">Dados do equipamento</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Atualize as informações principais do equipamento.
                </p>
              </div>

              <EditarEquipamentoForm
                equipamento={equipamento}
                tipos={tipos}
                marcas={marcas}
                intervalos={intervalos}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
