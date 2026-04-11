export default async function NovaCalibracaoPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Editar equipamentos {params.id}</h1>
    </main>
  );
}
