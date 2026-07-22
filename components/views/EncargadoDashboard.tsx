"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  UserPlus,
  Truck,
  PackageCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatARS } from "@/lib/format";
import { origenLabel } from "@/lib/labels";
import { Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { StatCard, ProgressBar } from "@/components/charts";

export default function EncargadoDashboard() {
  const { pedidos, envios, repartidores, avanzarEstadoPedido } = useStore();

  const porConfirmar = pedidos.filter((p) => p.estado === "pendiente");
  const porAsignar = pedidos.filter(
    (p) =>
      ["confirmado", "preparacion"].includes(p.estado) &&
      p.repartidorId === null
  );
  const enRuta = pedidos.filter((p) => p.estado === "en_camino");
  const entregadosHoy = envios.filter((e) => e.estado === "entregado").length;

  const rutas = repartidores
    .map((r) => {
      const stops = envios.filter((e) => e.repartidorId === r.id);
      return {
        repartidor: r,
        total: stops.length,
        entregados: stops.filter((s) => s.estado === "entregado").length,
      };
    })
    .filter((x) => x.total > 0);

  return (
    <>
      <PageHeader
        title="Operación del día"
        subtitle="Hola, Marina · martes 22 de julio"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Por confirmar"
          value={String(porConfirmar.length)}
          icon={<ClipboardCheck size={22} />}
          accent="amber"
        />
        <StatCard
          label="Por asignar"
          value={String(porAsignar.length)}
          icon={<UserPlus size={22} />}
          accent="violet"
        />
        <StatCard
          label="En ruta"
          value={String(enRuta.length)}
          icon={<Truck size={22} />}
          accent="blue"
        />
        <StatCard
          label="Entregados hoy"
          value={String(entregadosHoy)}
          icon={<PackageCheck size={22} />}
          accent="emerald"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Cola por confirmar */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Pedidos por confirmar</h3>
            <Link
              href="/encargado/pedidos"
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Ver todos <ArrowRight size={15} />
            </Link>
          </div>
          {porConfirmar.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 size={36} />}
              title="Nada pendiente de confirmar"
            />
          ) : (
            <div className="space-y-2">
              {porConfirmar.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {p.clienteNombre}
                    </p>
                    <p className="text-xs text-slate-400">
                      {p.zona} · {origenLabel[p.origen]} ·{" "}
                      {p.items.reduce((a, i) => a + i.cantidadCajas, 0)} cajas
                    </p>
                  </div>
                  <span className="hidden text-sm font-bold text-slate-800 sm:block">
                    {formatARS(p.total)}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => avanzarEstadoPedido(p.id)}
                  >
                    <CheckCircle2 size={16} /> Confirmar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Rutas + CTA asignar */}
        <div className="space-y-5">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Rutas de hoy</h3>
              <Link
                href="/encargado/envios"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Gestionar
              </Link>
            </div>
            <div className="space-y-4">
              {rutas.map(({ repartidor, total, entregados }) => (
                <div key={repartidor.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {repartidor.nombre}
                    </span>
                    <span className="text-slate-400">
                      {entregados}/{total}
                    </span>
                  </div>
                  <ProgressBar
                    value={entregados}
                    max={total}
                    color="#10b981"
                  />
                </div>
              ))}
            </div>
          </Card>

          {porAsignar.length > 0 && (
            <Link href="/encargado/envios" className="block">
              <div className="brand-gradient flex items-center gap-3 rounded-2xl p-4 text-white shadow-lg shadow-brand-600/20 transition hover:brightness-105">
                <UserPlus size={22} />
                <div className="flex-1">
                  <p className="font-bold">{porAsignar.length} pedidos por asignar</p>
                  <p className="text-sm text-white/80">
                    Asigná repartidores ahora
                  </p>
                </div>
                <ArrowRight size={20} />
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
