type Params = {
  params: { id: string };
};

export default async function EquipamentoDetalhePage({ params }: Params) {
  const { id } = params;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Detalhes do equipamento</h1>

          <p className="mt-4 text-sm text-slate-600">ID do equipamento: {id}</p>
        </div>
      </div>
    </main>
  );
}
