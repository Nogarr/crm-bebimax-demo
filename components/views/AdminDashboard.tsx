"use client";

import ventasSemana from "@/data/ventasSemana.json";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Wallet,
  PackageX,
  ArrowUpRight,
  Truck,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatARS } from "@/lib/format";
import {
  alertasStock,
  pedidosDeHoy,
  totalPorCobrar,
  ventasDeHoy,
} from "@/lib/metrics";
import { Card, PageHeader, EstadoPedidoChip } from "@/components/ui";
import { BarChart, StatCard } from "@/components/charts";

export default function AdminDashboard() {
  const { pedidos, envios, clientes, productos } = useStore();

  const hoy = pedidosDeHoy(pedidos);
  const alertas = alertasStock(productos);
  const recientes = [...pedidos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 6);

  const enviosEntregados = envios.filter((e) => e.estado === "entregado").length;
  const enviosEnRuta = envios.filter((e) => e.estado === "en_ruta").length;
  const enviosPendientes = envios.filter(
    (e) => e.estado === "pendiente"
  ).length;

  const cobrados = envios
    .filter((e) => e.cobrado)
    .reduce((a, e) => a + e.total, 0);

  const barData = (ventasSemana as Array<{ dia: string; ventas: number }>).map(
    (d, i, arr) => ({
      label: d.dia,
      value: d.ventas,
      color: i === arr.length - 1 ? "#ea580c" : "#fdba74",
    })
  );

  return (
    <>
      <PageHeader
        title="Hola, Valentín 👋"
        subtitle="Resumen del negocio · martes 22 de julio"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ventas de hoy"
          value={formatARS(ventasDeHoy(pedidos))}
          icon={<DollarSign size={22} />}
          accent="brand"
          hint={`${hoy.length} pedidos`}
        />
        <StatCard
          label="Pedidos de hoy"
          value={String(hoy.length)}
          icon={<ShoppingCart size={22} />}
          accent="violet"
          hint={`${enviosEnRuta + enviosPendientes} en reparto`}
        />
        <StatCard
          label="Por cobrar"
          value={formatARS(totalPorCobrar(clientes))}
          icon={<Wallet size={22} />}
          accent="amber"
          hint="Cuentas corrientes"
        />
        <StatCard
          label="Stock bajo"
          value={String(alertas.length)}
          icon={<PackageX size={22} />}
          accent="rose"
          hint="Productos a reponer"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Ventas semana */}
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Ventas de la semana</h3>
              <p className="text-sm text-slate-400">Evolución diaria</p>
            </div>
            <Link
              href="/admin/reportes"
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Ver reportes <ArrowUpRight size={15} />
            </Link>
          </div>
          <BarChart data={barData} height={200} />
        </Card>

        {/* Entregas hoy */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Truck size={18} className="text-brand-500" />
            <h3 className="font-bold text-slate-800">Entregas de hoy</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Entregadas", value: enviosEntregados, color: "bg-emerald-500" },
              { label: "En ruta", value: enviosEnRuta, color: "bg-cyan-500" },
              { label: "Pendientes", value: enviosPendientes, color: "bg-slate-300" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
                <span className="flex-1 text-sm text-slate-600">
                  {row.label}
                </span>
                <span className="font-bold text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-emerald-50 p-3">
            <p className="text-xs text-emerald-600">Cobrado en la calle</p>
            <p className="text-lg font-bold text-emerald-700">
              {formatARS(cobrados)}
            </p>
          </div>
        </Card>

        {/* Recientes */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-bold text-slate-800">Pedidos recientes</h3>
          <div className="space-y-1">
            {recientes.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {p.clienteNombre}
                  </p>
                  <p className="text-xs text-slate-400">
                    {p.zona} · {p.items.length} ítems
                  </p>
                </div>
                <EstadoPedidoChip estado={p.estado} />
                <span className="w-24 shrink-0 text-right text-sm font-bold text-slate-800">
                  {formatARS(p.total)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Alertas */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-bold text-slate-800">Alertas de stock</h3>
          </div>
          {alertas.length === 0 ? (
            <p className="text-sm text-slate-400">Todo en niveles óptimos.</p>
          ) : (
            <div className="space-y-2">
              {alertas.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2"
                >
                  <span className="text-lg">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {p.marca}
                    </p>
                    <p className="text-xs text-slate-400">{p.nombre}</p>
                  </div>
                  <span className="rounded-lg bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600">
                    {p.stockCajas}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
