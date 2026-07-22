"use client";

import Link from "next/link";
import { MapPin, Clock, ChevronRight, CheckCircle2, Navigation } from "lucide-react";
import { useAuth, useStore } from "@/lib/store";
import { formatARS } from "@/lib/format";
import { EstadoEntregaChip } from "@/components/ui";

export default function RepartidorHome() {
  const { user } = useAuth();
  const { envios } = useStore();
  if (!user) return null;

  const misEntregas = envios
    .filter((e) => e.repartidorId === user.id)
    .sort((a, b) => a.ordenRuta - b.ordenRuta);

  const entregados = misEntregas.filter((e) => e.estado === "entregado").length;
  const pendientes = misEntregas.filter(
    (e) => e.estado === "pendiente" || e.estado === "en_ruta"
  ).length;
  const cobrado = misEntregas
    .filter((e) => e.cobrado)
    .reduce((a, e) => a + e.total, 0);
  const total = misEntregas.length;
  const pct = total === 0 ? 0 : Math.round((entregados / total) * 100);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Ruta de hoy</h1>
        <p className="text-sm text-slate-500">
          {total} entregas · Zona {user.zona}
        </p>
      </div>

      {/* Progreso */}
      <div className="brand-gradient rounded-2xl p-5 text-white shadow-lg shadow-brand-600/20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-white/80">Progreso</p>
            <p className="text-3xl font-extrabold">
              {entregados}
              <span className="text-xl font-semibold text-white/70">
                /{total}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Cobrado</p>
            <p className="text-xl font-bold">{formatARS(cobrado)}</p>
          </div>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-white/80">
          {pendientes} entregas pendientes · {pct}% completado
        </p>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {misEntregas.map((e) => {
          const done = e.estado === "entregado" || e.estado === "no_entregado";
          return (
            <Link key={e.id} href={`/repartidor/entrega/${e.id}`}>
              <div
                className={`card flex items-center gap-3 p-4 transition active:scale-[0.99] ${
                  done ? "opacity-70" : ""
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                    e.estado === "entregado"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-brand-50 text-brand-600"
                  }`}
                >
                  {e.estado === "entregado" ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    e.ordenRuta
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">
                    {e.clienteNombre}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-slate-400">
                    <MapPin size={12} /> {e.direccion}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} /> {e.ventana}
                    </span>
                    <EstadoEntregaChip estado={e.estado} />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-slate-800">
                    {formatARS(e.total)}
                  </span>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm text-slate-500">
        <Navigation size={15} /> Tocá una entrega para registrar la visita
      </div>
    </div>
  );
}
