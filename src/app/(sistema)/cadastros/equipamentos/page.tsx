import { NovoEquipamentoForm } from "@/src/components/equipamentos/novo-equipamento-form";

type TipoEquipamento = {
  id: number;
  nome: string;
  ativo: boolean;
};

type Marca = {
  id: number;
  nome: string;
  ativo: boolean;
};

type IntervaloCalibracao = {
  id: number;
  nome: string;
  dias: number | null;
  ativo: boolean;
};

async function getTipos(): Promise<TipoEquipamento[]> {
  const response = await fetch("http://localhost:3000/api/tipos-equipamento", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar tipos de equipamento");
  }

  const tipos = await response.json();
  return tipos.filter((tipo: TipoEquipamento) => tipo.ativo);
}

async function getMarcas(): Promise<Marca[]> {
  const response = await fetch("http://localhost:3000/api/marcas", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar marcas");
  }

  const marcas = await response.json();
  return marcas.filter((marca: Marca) => marca.ativo);
}

async function getIntervalos(): Promise<IntervaloCalibracao[]> {
  const response = await fetch("http://localhost:3000/api/intervalos-calibracao", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar intervalos de calibração");
  }

  const intervalos = await response.json();
  return intervalos.filter((intervalo: IntervaloCalibracao) => intervalo.ativo);
}

export default async function NovoEquipamentoPage() {
  const [tipos, marcas, intervalos] = await Promise.all([getTipos(), getMarcas(), getIntervalos()]);

  return (
    <main className="h-auto bg-slate-100">
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-8 py-4">
            <p className="text-xl font-bold tracking-[0.18em] text-purple-800 uppercase">
              LABORCLIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Cadastrar equipamento
            </h1>
            <p className="mt-2 text-sm text-slate-600">Cadastre um novo equipamento no sistema.</p>
          </div>

          <div className="px-8 py-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Dados do equipamento</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Preencha as informações principais para cadastro.
                </p>
              </div>

              <NovoEquipamentoForm tipos={tipos} marcas={marcas} intervalos={intervalos} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
