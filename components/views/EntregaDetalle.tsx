"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Banknote,
  CreditCard,
  Wallet,
  PackageCheck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatARS } from "@/lib/format";
import { EstadoEntregaChip } from "@/components/ui";
import type { Envio } from "@/lib/types";

const cobros: Array<{
  value: NonNullable<Envio["metodoCobro"]>;
  label: string;
  icon: typeof Banknote;
}> = [
  { value: "efectivo", label: "Efectivo", icon: Banknote },
  { value: "transferencia", label: "Transferencia", icon: CreditCard },
  { value: "cuenta_corriente", label: "Cuenta corriente", icon: Wallet },
];

const motivos = [
  "Comercio cerrado",
  "Cliente ausente",
  "Rechazó el pedido",
  "Dirección incorrecta",
  "Sin dinero para pagar",
];

export default function EntregaDetalle({ envioId }: { envioId: string }) {
  const router = useRouter();
  const { envios, pedidos, registrarEntrega } = useStore();
  const [panel, setPanel] = useState<"none" | "entregar" | "fallo">("none");
  const [cobro, setCobro] =
    useState<NonNullable<Envio["metodoCobro"]>>("efectivo");
  const [motivo, setMotivo] = useState(motivos[0]);

  const envio = envios.find((e) => e.id === envioId);

  if (!envio) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Entrega no encontrada.</p>
        <Link href="/repartidor" className="mt-3 inline-block text-brand-600">
          Volver a la ruta
        </Link>
      </div>
    );
  }

  const pedido = pedidos.find((p) => p.id === envio.pedidoId);
  const resuelto =
    envio.estado === "entregado" || envio.estado === "no_entregado";

  function confirmarEntrega() {
    registrarEntrega(envio!.id, { estado: "entregado", metodoCobro: cobro });
    router.push("/repartidor");
  }

  function confirmarFallo() {
    registrarEntrega(envio!.id, {
      estado: "no_entregado",
      motivoNoEntrega: motivo,
    });
    router.push("/repartidor");
  }

  return (
    <div className="space-y-4">
      <Link
        href="/repartidor"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500"
      >
        <ArrowLeft size={16} /> Ruta de hoy
      </Link>

      {/* Cabecera */}
      <div className="card p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-brand-500">
              Parada {envio.ordenRuta}
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              {envio.clienteNombre}
            </h1>
          </div>
          <EstadoEntregaChip estado={envio.estado} />
        </div>
        <div className="space-y-1.5 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <MapPin size={15} className="text-slate-400" /> {envio.direccion} ·{" "}
            {envio.zona}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={15} className="text-slate-400" /> Ventana{" "}
            {envio.ventana}
          </p>
        </div>
      </div>

      {/* Items */}
      {pedido && (
        <div className="card p-5">
          <p className="mb-3 text-sm font-bold text-slate-700">
            Pedido {pedido.id.toUpperCase()}
          </p>
          <div className="space-y-2">
            {pedido.items.map((it) => (
              <div
                key={it.productoId}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-600">
                  <span className="mr-1">{it.emoji}</span>
                  {it.cantidadCajas}× {it.nombre}
                </span>
                <span className="font-medium text-slate-700">
                  {formatARS(it.cantidadCajas * it.precioCaja)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm font-medium text-slate-500">
              Total a cobrar
            </span>
            <span className="text-xl font-bold text-brand-600">
              {formatARS(envio.total)}
            </span>
          </div>
        </div>
      )}

      {/* Estado resuelto */}
      {resuelto && (
        <div
          className={`rounded-2xl p-4 text-center ${
            envio.estado === "entregado"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {envio.estado === "entregado" ? (
            <>
              <PackageCheck size={28} className="mx-auto mb-1" />
              <p className="font-bold">Entrega registrada</p>
              {envio.cobrado && (
                <p className="text-sm">Cobrado · {formatARS(envio.total)}</p>
              )}
            </>
          ) : (
            <>
              <XCircle size={28} className="mx-auto mb-1" />
              <p className="font-bold">No entregado</p>
              {envio.motivoNoEntrega && (
                <p className="text-sm">{envio.motivoNoEntrega}</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Acciones */}
      {!resuelto && panel === "none" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPanel("fallo")}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-rose-200 bg-white py-4 font-semibold text-rose-600 active:scale-[0.98]"
          >
            <XCircle size={24} /> No pude entregar
          </button>
          <button
            onClick={() => setPanel("entregar")}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-emerald-600 py-4 font-semibold text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98]"
          >
            <CheckCircle2 size={24} /> Marcar entregado
          </button>
        </div>
      )}

      {/* Panel entregar */}
      {!resuelto && panel === "entregar" && (
        <div className="card space-y-3 p-5">
          <p className="text-sm font-bold text-slate-700">
            ¿Cómo cobró el cliente?
          </p>
          <div className="space-y-2">
            {cobros.map((c) => {
              const Icon = c.icon;
              const active = cobro === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => setCobro(c.value)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-medium transition ${
                    active
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  <Icon size={20} />
                  {c.label}
                  {active && (
                    <CheckCircle2 size={18} className="ml-auto text-brand-500" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setPanel("none")}
              className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-600"
            >
              Volver
            </button>
            <button
              onClick={confirmarEntrega}
              className="flex-[2] rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25"
            >
              Confirmar entrega
            </button>
          </div>
        </div>
      )}

      {/* Panel fallo */}
      {!resuelto && panel === "fallo" && (
        <div className="card space-y-3 p-5">
          <p className="text-sm font-bold text-slate-700">
            ¿Por qué no se pudo entregar?
          </p>
          <div className="space-y-2">
            {motivos.map((m) => {
              const active = motivo === m;
              return (
                <button
                  key={m}
                  onClick={() => setMotivo(m)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-medium transition ${
                    active
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {m}
                  {active && (
                    <CheckCircle2 size={18} className="ml-auto text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setPanel("none")}
              className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-600"
            >
              Volver
            </button>
            <button
              onClick={confirmarFallo}
              className="flex-[2] rounded-xl bg-rose-600 py-3 font-semibold text-white"
            >
              Registrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
