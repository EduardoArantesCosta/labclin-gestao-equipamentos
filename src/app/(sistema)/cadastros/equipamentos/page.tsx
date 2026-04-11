import { AppHeader } from "../../../../components/layout/app-header";

export default function CadastroEquipamentosPage() {
  return (
    <div className="space-y-6">
      <AppHeader
        title="Cadastro de Equipamentos"
        description="Gerencie o cadastro dos equipamentos do laboratório. Nesta etapa vamos preparar a tela para criação, listagem e edição."
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Próxima implementação</h2>
          <p className="text-sm leading-6 text-slate-600">
            Aqui vamos construir o formulário de cadastro de equipamentos com os campos: código,
            número de série, localização, observação, tipo, marca e intervalo.
          </p>
        </div>
      </section>
    </div>
  );
}
