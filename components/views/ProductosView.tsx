"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { categoriaMeta } from "@/lib/labels";
import { formatARS, formatNumber } from "@/lib/format";
import { alertasStock } from "@/lib/metrics";
import type { Categoria } from "@/lib/types";
import { Chip, Input, PageHeader } from "@/components/ui";

const categorias: Array<Categoria | "todas"> = [
  "todas",
  "cerveza",
  "gaseosa",
  "agua",
  "vino",
  "energizante",
  "jugo",
  "licor",
];

export default function ProductosView() {
  const { productos } = useStore();
  const [cat, setCat] = useState<Categoria | "todas">("todas");
  const [q, setQ] = useState("");

  const alertas = alertasStock(productos);

  const filtrados = useMemo(
    () =>
      productos.filter((p) => {
        const okCat = cat === "todas" || p.categoria === cat;
        const okQ =
          q === "" ||
          p.nombre.toLowerCase().includes(q.toLowerCase()) ||
          p.marca.toLowerCase().includes(q.toLowerCase());
        return okCat && okQ;
      }),
    [productos, cat, q]
  );

  return (
    <>
      <PageHeader
        title="Productos"
        subtitle={`${productos.length} productos en catálogo · ${alertas.length} con stock bajo`}
      />

      {alertas.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {alertas.length} productos por debajo del stock mínimo
            </p>
            <p className="text-sm text-amber-700">
              {alertas.map((p) => `${p.emoji} ${p.marca}`).join(" · ")}
            </p>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar producto o marca…"
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${
                cat === c
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {c === "todas" ? "Todas" : categoriaMeta[c].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((p) => {
          const meta = categoriaMeta[p.categoria];
          const bajo = p.stockCajas <= p.stockMinimo;
          const pct = Math.min(
            (p.stockCajas / (p.stockMinimo * 3)) * 100,
            100
          );
          return (
            <div key={p.id} className="card p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                    style={{ background: `${meta.color}1a` }}
                  >
                    {p.emoji}
                  </div>
                  <div>
                    <p className="font-semibold leading-tight text-slate-800">
                      {p.marca}
                    </p>
                    <p className="text-xs text-slate-400">{p.nombre}</p>
                  </div>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize"
                  style={{ background: `${meta.color}1a`, color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>

              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400">Precio caja</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatARS(p.precioCaja)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {p.unidadesPorCaja} u. · {p.sku}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Stock</p>
                  <p
                    className={`text-lg font-bold ${
                      bajo ? "text-rose-600" : "text-slate-900"
                    }`}
                  >
                    {formatNumber(p.stockCajas)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    mín. {p.stockMinimo}
                  </p>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(pct, 4)}%`,
                    background: bajo ? "#f43f5e" : meta.color,
                  }}
                />
              </div>
              {bajo && (
                <div className="mt-2">
                  <Chip tone="rose">
                    <AlertTriangle size={11} /> Reponer stock
                  </Chip>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
