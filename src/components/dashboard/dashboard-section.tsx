import { ReactNode } from "react";

type DashboardSectionProps = {
  titulo: string;
  descricao?: string;
  children: ReactNode;
};

export function DashboardSection({ titulo, descricao, children }: DashboardSectionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
        {descricao ? <p className="mt-1 text-sm text-gray-600">{descricao}</p> : null}
      </div>

      {children}
    </section>
  );
}
