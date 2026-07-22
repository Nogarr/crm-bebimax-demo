"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ClipboardList,
  Minus,
  Trash2,
  ArrowRight,
  X,
  PackageCheck,
} from "lucide-react";
import { useStore, type NuevoPedidoInput } from "@/lib/store";
import {
  estadoPedidoMeta,
  metodoPagoLabel,
  origenLabel,
} from "@/lib/labels";
import { formatARS, formatFecha } from "@/lib/format";
import { DEMO_TODAY } from "@/lib/demo";
import type { EstadoPedido, Pedido, PedidoItem } from "@/lib/types";
import {
  Button,
  EmptyState,
  EstadoPedidoChip,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Textarea,
} from "@/components/ui";

const SIGUIENTE: Partial<Record<EstadoPedido, EstadoPedido>> = {
  pendiente: "confirmado",
  confirmado: "preparacion",
  preparacion: "en_camino",
  en_camino: "entregado",
};

const TIMELINE: EstadoPedido[] = [
  "pendiente",
  "confirmado",
  "preparacion",
  "en_camino",
  "entregado",
];

const filtros: Array<{ value: EstadoPedido | "todos"; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendientes" },
  { value: "confirmado", label: "Confirmados" },
  { value: "preparacion", label: "En preparación" },
  { value: "en_camino", label: "En camino" },
  { value: "entregado", label: "Entregados" },
  { value: "cancelado", label: "Cancelados" },
];

export default function PedidosView() {
  const { pedidos } = useStore();
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState<EstadoPedido | "todos">("todos");
  const [nuevo, setNuevo] = useState(false);
  const [detalleId, setDetalleId] = useState<string | null>(null);

  const detalle = pedidos.find((p) => p.id === detalleId) ?? null;

  const filtrados = useMemo(() => {
    return pedidos
      .filter((p) => (estado === "todos" ? true : p.estado === estado))
      .filter((p) =>
        q === ""
          ? true
          : p.clienteNombre.toLowerCase().includes(q.toLowerCase()) ||
            p.id.toLowerCase().includes(q.toLowerCase())
      );
  }, [pedidos, estado, q]);

  return (
    <>
      <PageHeader
        title="Pedidos"
        subtitle={`${pedidos.length} pedidos registrados`}
        action={
          <Button onClick={() => setNuevo(true)}>
            <Plus size={18} /> Nuevo pedido
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por cliente o N° de pedido…"
            className="pl-10"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.value}
            onClick={() => setEstado(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              estado === f.value
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={40} />}
          title="No hay pedidos con este filtro"
        />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Pedido</th>
                  <th className="px-5 py-3 font-semibold">Cliente</th>
                  <th className="px-5 py-3 font-semibold">Entrega</th>
                  <th className="px-5 py-3 font-semibold">Ítems</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setDetalleId(p.id)}
                    className="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <p className="font-mono text-xs font-semibold text-slate-700">
                        {p.id.toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-400">
                        {origenLabel[p.origen]}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">
                        {p.clienteNombre}
                      </p>
                      <p className="text-xs text-slate-400">{p.zona}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatFecha(p.fechaEntrega)}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {p.items.reduce((a, i) => a + i.cantidadCajas, 0)} cajas
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-slate-900">
                      {formatARS(p.total)}
                    </td>
                    <td className="px-5 py-3">
                      <EstadoPedidoChip estado={p.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <NuevoPedidoModal open={nuevo} onClose={() => setNuevo(false)} />
      <DetallePedidoModal
        pedido={detalle}
        onClose={() => setDetalleId(null)}
      />
    </>
  );
}

// ---------- Detalle ----------
function DetallePedidoModal({
  pedido,
  onClose,
}: {
  pedido: Pedido | null;
  onClose: () => void;
}) {
  const { avanzarEstadoPedido, cancelarPedido } = useStore();
  if (!pedido) return null;
  const siguiente = SIGUIENTE[pedido.estado];
  const cerrado = pedido.estado === "entregado" || pedido.estado === "cancelado";
  const activeIdx = TIMELINE.indexOf(pedido.estado);

  return (
    <Modal
      open={pedido !== null}
      onClose={onClose}
      title={`Pedido ${pedido.id.toUpperCase()}`}
      wide
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {pedido.clienteNombre}
            </p>
            <p className="text-sm text-slate-400">
              {pedido.zona} · Entrega {formatFecha(pedido.fechaEntrega)} ·{" "}
              {origenLabel[pedido.origen]}
            </p>
          </div>
          <EstadoPedidoChip estado={pedido.estado} />
        </div>

        {/* Timeline */}
        {pedido.estado !== "cancelado" && (
          <div className="flex items-center">
            {TIMELINE.map((s, i) => (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      i <= activeIdx
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="mt-1 hidden text-[10px] text-slate-400 sm:block">
                    {estadoPedidoMeta[s].label}
                  </span>
                </div>
                {i < TIMELINE.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      i < activeIdx ? "bg-brand-500" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Items */}
        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-2 font-semibold">Producto</th>
                <th className="px-4 py-2 text-center font-semibold">Cajas</th>
                <th className="px-4 py-2 text-right font-semibold">Precio</th>
                <th className="px-4 py-2 text-right font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((it) => (
                <tr key={it.productoId} className="border-t border-slate-50">
                  <td className="px-4 py-2.5">
                    <span className="mr-1.5">{it.emoji}</span>
                    {it.nombre}
                  </td>
                  <td className="px-4 py-2.5 text-center">{it.cantidadCajas}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">
                    {formatARS(it.precioCaja)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold">
                    {formatARS(it.cantidadCajas * it.precioCaja)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-100 bg-slate-50">
                <td className="px-4 py-3 font-semibold" colSpan={3}>
                  Total · {metodoPagoLabel[pedido.metodoPago]}
                </td>
                <td className="px-4 py-3 text-right text-lg font-bold text-brand-600">
                  {formatARS(pedido.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {pedido.notas && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong>Nota:</strong> {pedido.notas}
          </p>
        )}

        {/* Acciones */}
        {!cerrado && (
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                cancelarPedido(pedido.id);
                onClose();
              }}
            >
              <X size={16} /> Cancelar pedido
            </Button>
            {siguiente && (
              <Button onClick={() => avanzarEstadoPedido(pedido.id)}>
                {siguiente === "entregado" ? (
                  <PackageCheck size={16} />
                ) : (
                  <ArrowRight size={16} />
                )}
                Avanzar a {estadoPedidoMeta[siguiente].label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ---------- Nuevo pedido ----------
function NuevoPedidoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { clientes, productos, crearPedido } = useStore();
  const [clienteId, setClienteId] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [metodoPago, setMetodoPago] =
    useState<NuevoPedidoInput["metodoPago"]>("efectivo");
  const [fechaEntrega, setFechaEntrega] = useState(DEMO_TODAY);
  const [notas, setNotas] = useState("");
  const [buscar, setBuscar] = useState("");

  const items: PedidoItem[] = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const p = productos.find((x) => x.id === id)!;
      return {
        productoId: p.id,
        nombre: p.nombre,
        emoji: p.emoji,
        cantidadCajas: qty,
        precioCaja: p.precioCaja,
      };
    });

  const total = items.reduce((a, i) => a + i.cantidadCajas * i.precioCaja, 0);

  const productosFiltrados = productos.filter((p) =>
    buscar === ""
      ? true
      : p.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
        p.marca.toLowerCase().includes(buscar.toLowerCase())
  );

  function setQty(id: string, qty: number) {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, qty) }));
  }

  function reset() {
    setClienteId("");
    setCart({});
    setMetodoPago("efectivo");
    setFechaEntrega(DEMO_TODAY);
    setNotas("");
    setBuscar("");
  }

  function guardar() {
    if (!clienteId || items.length === 0) return;
    crearPedido({ clienteId, items, metodoPago, fechaEntrega, notas });
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuevo pedido" wide>
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Catálogo */}
        <div className="lg:col-span-3">
          <div className="relative mb-3">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar producto…"
              className="pl-10"
            />
          </div>
          <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
            {productosFiltrados.map((p) => {
              const qty = cart[p.id] ?? 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2"
                >
                  <span className="text-xl">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {p.nombre}
                    </p>
                    <p className="text-xs text-slate-400">
                      {p.marca} · {formatARS(p.precioCaja)}/caja
                    </p>
                  </div>
                  {qty === 0 ? (
                    <button
                      onClick={() => setQty(p.id, 1)}
                      className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-brand-600 hover:bg-brand-100"
                    >
                      <Plus size={16} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setQty(p.id, qty - 1)}
                        className="rounded-lg bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(p.id, qty + 1)}
                        className="rounded-lg bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-2">
          <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
            <Field label="Cliente">
              <Select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
              >
                <option value="">Seleccioná un cliente…</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              {items.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-400">
                  Agregá productos del catálogo
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((it) => (
                    <div
                      key={it.productoId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate text-slate-600">
                        {it.emoji} {it.cantidadCajas}× {it.nombre}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {formatARS(it.cantidadCajas * it.precioCaja)}
                        </span>
                        <button
                          onClick={() => setQty(it.productoId, 0)}
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Pago">
                <Select
                  value={metodoPago}
                  onChange={(e) =>
                    setMetodoPago(
                      e.target.value as NuevoPedidoInput["metodoPago"]
                    )
                  }
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="cuenta_corriente">Cta. corriente</option>
                </Select>
              </Field>
              <Field label="Entrega">
                <Input
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
              </Field>
            </div>

            <Field label="Notas (opcional)">
              <Textarea
                rows={2}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej: entregar por la puerta de atrás"
              />
            </Field>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-sm font-medium text-slate-500">Total</span>
              <span className="text-xl font-bold text-brand-600">
                {formatARS(total)}
              </span>
            </div>

            <Button
              className="w-full"
              onClick={guardar}
              disabled={!clienteId || items.length === 0}
            >
              Confirmar pedido
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
