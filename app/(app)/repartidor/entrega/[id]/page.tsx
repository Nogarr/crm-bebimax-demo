import EntregaDetalle from "@/components/views/EntregaDetalle";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EntregaDetalle envioId={id} />;
}
