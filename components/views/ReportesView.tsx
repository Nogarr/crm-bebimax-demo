"use client";

import ventasSemana from "@/data/ventasSemana.json";
import { TrendingUp, Receipt, Wallet, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatARS } from "@/lib/format";
import {
  conteoPorEstado,
  ticketPromedio,
  topProductos,
  totalPorCobrar,
  ventasPorCategoria,
  ventasTotales,
} from "@/lib/metrics";
import { estadoPedidoMeta } from "@/lib/labels";
import type { EstadoPedido } from "@/lib/types";
import { Card, PageHeader } from "@/components/ui";
import { BarChart, DonutChart, StatCard } from "@/components/charts";

export default function ReportesView() {
  const { pedidos, productos, clientes } = useStore();

  const barData = (ventasSemana as Array<{ dia: string; ventas: number }>).map(
    (d, i, arr) => ({
      label: d.dia,
      value: d.ventas,
      color: i === arr.length - 1 ? "#ea580c" : "#fdba74",
    })
  );

  const cat = ventasPorCategoria(pedidos, productos).map((c) => ({
    label: c.label,
    value: Math.round(c.monto / 1000),
    color: c.color,
  }));

  const top = topProductos(pedidos, 6);
  const maxCajas = Math.max(...top.map((t) => t.cajas), 1);
  const conteo = conteoPorEstado(pedidos);
  const estados = Object.keys(conteo) as EstadoPedido[];
  const maxEstado = Math.max(...estados.map((e) => conteo[e]), 1);

  return (
    <>
      <PageHeader
        title="Reportes"
        subtitle="Ventas, mix de productos y estado de la operación"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ventas (pedidos activos)"
          value={formatARS(ventasTotales(pedidos))}
          icon={<TrendingUp size={22} />}
          accent="brand"
        />
        <StatCard
          label="Ticket promedio"
          value={formatARS(ticketPromedio(pedidos))}
          icon={<Receipt size={22} />}
          accent="violet"
        />
        <StatCard
          label="Por cobrar (cta. cte.)"
          value={formatARS(totalPorCobrar(clientes))}
          icon={<Wallet size={22} />}
          accent="amber"
        />
        <StatCard
          label="Pedidos totales"
          value={String(pedidos.length)}
          icon={<ShoppingBag size={22} />}
          accent="emerald"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Ventas de la semana</h3>
              <p className="text-sm text-slate-400">Últimos 7 días</p>
            </div>
          </div>
          <BarChart data={barData} height={220} />
        </Card>

        <Card>
          <h3 className="mb-4 font-bold text-slate-800">Mix por categoría</h3>
          <p className="mb-4 text-xs text-slate-400">
            Participación en ventas (miles de $)
          </p>
          {cat.length > 0 ? (
            <DonutChart
              data={cat}
              centerValue={String(cat.reduce((a, c) => a + c.value, 0))}
              centerLabel="mil $"
            />
          ) : (
            <p className="text-sm text-slate-400">Sin datos</p>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-bold text-slate-800">
            Productos más vendidos
          </h3>
          <div className="space-y-3">
            {top.map((t) => (
              <div key={t.productoId} className="flex items-center gap-3">
                <span className="text-xl">{t.emoji}</span>
                <span className="w-40 shrink-0 truncate text-sm font-medium text-slate-700">
                  {t.nombre}
                </span>
                <div className="h-6 flex-1 overflow-hidden rounded-lg bg-slate-100">
                  <div
                    className="flex h-full items-center justify-end rounded-lg bg-brand-500 px-2 text-[11px] font-bold text-white"
                    style={{ width: `${(t.cajas / maxCajas) * 100}%` }}
                  >
                    {t.cajas}
                  </div>
                </div>
                <span className="w-24 shrink-0 text-right text-sm font-semibold text-slate-600">
                  {formatARS(t.monto)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-bold text-slate-800">Pedidos por estado</h3>
          <div className="space-y-3">
            {estados.map((e) => (
              <div key={e}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {estadoPedidoMeta[e].label}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {conteo[e]}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${estadoPedidoMeta[e].dot}`}
                    style={{ width: `${(conteo[e] / maxEstado) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
