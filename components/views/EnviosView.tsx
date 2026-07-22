"use client";

import { useMemo, useState } from "react";
import { Truck, MapPin, UserPlus, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatARS } from "@/lib/format";
import type { EstadoPedido } from "@/lib/types";
import {
  Avatar,
  Button,
  Chip,
  EmptyState,
  EstadoEntregaChip,
  PageHeader,
  Select,
} from "@/components/ui";
import { ProgressBar } from "@/components/charts";

const ASIGNABLES: EstadoPedido[] = ["pendiente", "confirmado", "preparacion"];

export default function EnviosView({
  subtitle,
}: {
  subtitle?: string;
}) {
  const { pedidos, envios, repartidores, asignarRepartidor } = useStore();
  const [seleccion, setSeleccion] = useState<Record<string, string>>({});

  const porAsignar = useMemo(
    () =>
      pedidos.filter(
        (p) => ASIGNABLES.includes(p.estado) && p.repartidorId === null
      ),
    [pedidos]
  );

  const rutas = useMemo(
    () =>
      repartidores
        .map((r) => ({
          repartidor: r,
          stops: envios
            .filter((e) => e.repartidorId === r.id)
            .sort((a, b) => a.ordenRuta - b.ordenRuta),
        }))
        .filter((x) => x.stops.length > 0),
    [repartidores, envios]
  );

  return (
    <>
      <PageHeader
        title="Envíos y repartos"
        subtitle={subtitle ?? "Asigná pedidos a repartidores y seguí las rutas del día"}
      />

      {/* Por asignar */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Pedidos por asignar
          </h2>
          <Chip tone="amber">{porAsignar.length}</Chip>
        </div>

        {porAsignar.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={36} />}
            title="Todo asignado"
            hint="No quedan pedidos esperando repartidor."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {porAsignar.map((p) => (
              <div key={p.id} className="card flex flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {p.clienteNombre}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} /> {p.zona} ·{" "}
                      {p.items.reduce((a, i) => a + i.cantidadCajas, 0)} cajas
                    </p>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatARS(p.total)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={seleccion[p.id] ?? ""}
                    onChange={(e) =>
                      setSeleccion({ ...seleccion, [p.id]: e.target.value })
                    }
                    className="flex-1"
                  >
                    <option value="">Elegir repartidor…</option>
                    {repartidores.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre} · {r.zona}
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant={seleccion[p.id] ? "primary" : "secondary"}
                    disabled={!seleccion[p.id]}
                    onClick={() => asignarRepartidor(p.id, seleccion[p.id])}
                  >
                    <UserPlus size={16} /> Asignar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rutas */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Rutas de hoy
        </h2>
        {rutas.length === 0 ? (
          <EmptyState icon={<Truck size={36} />} title="Sin rutas activas" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {rutas.map(({ repartidor, stops }) => {
              const entregados = stops.filter(
                (s) => s.estado === "entregado"
              ).length;
              const monto = stops.reduce((a, s) => a + s.total, 0);
              return (
                <div key={repartidor.id} className="card p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <Avatar
                      initials={repartidor.avatar}
                      seed={repartidor.nombre.length}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">
                        {repartidor.nombre}
                      </p>
                      <p className="text-xs text-slate-400">
                        Zona {repartidor.zona} · {stops.length} paradas ·{" "}
                        {formatARS(monto)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">
                        {entregados}/{stops.length}
                      </p>
                      <p className="text-[10px] uppercase text-slate-400">
                        entregados
                      </p>
                    </div>
                  </div>
                  <ProgressBar
                    value={entregados}
                    max={stops.length}
                    color="#10b981"
                  />
                  <div className="mt-4 space-y-2">
                    {stops.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                          {s.ordenRuta}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {s.clienteNombre}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {s.direccion} · {s.ventana}
                          </p>
                        </div>
                        <EstadoEntregaChip estado={s.estado} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
