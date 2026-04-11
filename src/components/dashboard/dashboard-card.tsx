type DashboardCardProps = {
  titulo: string;
  valor: number;
  descricao: string;
};

export function DashboardCard({ titulo, valor, descricao }: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500">{titulo}</p>
        <h2 className="text-3xl font-bold text-gray-900">{valor}</h2>
        <p className="text-sm text-gray-600">{descricao}</p>
      </div>
    </div>
  );
}
