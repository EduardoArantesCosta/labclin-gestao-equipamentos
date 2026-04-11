import { AppHeader } from "../../../../components/layout/app-header";

export default function CadastroTiposEquipamentoPage() {
  return (
    <div className="space-y-6">
      <AppHeader
        title="Cadastro de Tipos de Equipamento"
        description="Cadastre os tipos disponíveis para classificação dos equipamentos."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Próxima implementação</h2>
          <p className="text-sm leading-6 text-slate-600">
            Nesta página vamos criar o cadastro de tipos, como balança, centrífuga, micropipeta e
            outros.
          </p>
        </div>
      </section>
    </div>
  );
}
