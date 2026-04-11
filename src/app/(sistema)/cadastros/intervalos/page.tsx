import { AppHeader } from "../../../../components/layout/app-header";

export default function CadastroIntervalosPage() {
  return (
    <div className="space-y-6">
      <AppHeader
        title="Cadastro de Intervalos"
        description="Cadastre os intervalos padrão de calibração utilizados pelos equipamentos."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Próxima implementação</h2>
          <p className="text-sm leading-6 text-slate-600">
            Nesta página vamos criar o cadastro de intervalos, como 6 meses, 12 meses e 24 meses.
          </p>
        </div>
      </section>
    </div>
  );
}
