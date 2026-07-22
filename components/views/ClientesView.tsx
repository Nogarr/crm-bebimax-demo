"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Users, MapPin, Phone, Mail } from "lucide-react";
import { useStore, type NuevoClienteInput } from "@/lib/store";
import { clienteTipoLabel } from "@/lib/labels";
import { formatARS, formatFecha } from "@/lib/format";
import type { Cliente, ClienteTipo } from "@/lib/types";
import {
  Avatar,
  Button,
  Chip,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Textarea,
} from "@/components/ui";

const tipos: ClienteTipo[] = [
  "kiosco",
  "almacen",
  "bar",
  "restaurante",
  "supermercado",
  "distribuidor",
];

const emptyForm: NuevoClienteInput = {
  nombre: "",
  contacto: "",
  tipo: "kiosco",
  telefono: "",
  email: "",
  direccion: "",
  zona: "Centro",
  limiteCredito: 300000,
};

export default function ClientesView() {
  const { clientes, pedidos, crearCliente } = useStore();
  const [q, setQ] = useState("");
  const [zona, setZona] = useState("todas");
  const [nuevo, setNuevo] = useState(false);
  const [detalle, setDetalle] = useState<Cliente | null>(null);
  const [form, setForm] = useState<NuevoClienteInput>(emptyForm);

  const zonas = useMemo(
    () => ["todas", ...Array.from(new Set(clientes.map((c) => c.zona)))],
    [clientes]
  );

  const filtrados = useMemo(() => {
    return clientes.filter((c) => {
      const okZona = zona === "todas" || c.zona === zona;
      const okQ =
        q === "" ||
        c.nombre.toLowerCase().includes(q.toLowerCase()) ||
        c.contacto.toLowerCase().includes(q.toLowerCase());
      return okZona && okQ;
    });
  }, [clientes, q, zona]);

  function guardar() {
    if (!form.nombre.trim()) return;
    crearCliente(form);
    setForm(emptyForm);
    setNuevo(false);
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle={`${clientes.length} comercios en la cartera`}
        action={
          <Button onClick={() => setNuevo(true)}>
            <Plus size={18} /> Nuevo cliente
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
            placeholder="Buscar comercio o contacto…"
            className="pl-10"
          />
        </div>
        <Select value={zona} onChange={(e) => setZona(e.target.value)} className="sm:w-44">
          {zonas.map((z) => (
            <option key={z} value={z}>
              {z === "todas" ? "Todas las zonas" : z}
            </option>
          ))}
        </Select>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState
          icon={<Users size={40} />}
          title="Sin clientes"
          hint="Probá con otro filtro o cargá uno nuevo."
        />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold">Comercio</th>
                  <th className="px-5 py-3 font-semibold">Tipo</th>
                  <th className="px-5 py-3 font-semibold">Zona</th>
                  <th className="px-5 py-3 font-semibold">Última compra</th>
                  <th className="px-5 py-3 text-right font-semibold">Cta. corriente</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setDetalle(c)}
                    className="cursor-pointer border-b border-slate-50 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={c.nombre.slice(0, 2).toUpperCase()}
                          seed={c.nombre.length}
                          size="sm"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {c.nombre}
                          </p>
                          <p className="text-xs text-slate-400">{c.contacto}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Chip tone="slate">{clienteTipoLabel[c.tipo]}</Chip>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{c.zona}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatFecha(c.ultimaCompra)}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">
                      <span
                        className={
                          c.saldoCuentaCorriente > 0
                            ? "text-rose-600"
                            : "text-slate-400"
                        }
                      >
                        {formatARS(c.saldoCuentaCorriente)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {c.estado === "activo" ? (
                        <Chip tone="green">Activo</Chip>
                      ) : (
                        <Chip tone="rose">Inactivo</Chip>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nuevo cliente */}
      <Modal open={nuevo} onClose={() => setNuevo(false)} title="Nuevo cliente">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nombre del comercio">
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Kiosco La Estrella"
              />
            </Field>
          </div>
          <Field label="Persona de contacto">
            <Input
              value={form.contacto}
              onChange={(e) => setForm({ ...form, contacto: e.target.value })}
            />
          </Field>
          <Field label="Tipo">
            <Select
              value={form.tipo}
              onChange={(e) =>
                setForm({ ...form, tipo: e.target.value as ClienteTipo })
              }
            >
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {clienteTipoLabel[t]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Teléfono">
            <Input
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Dirección">
              <Input
                value={form.direccion}
                onChange={(e) =>
                  setForm({ ...form, direccion: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Zona">
            <Input
              value={form.zona}
              onChange={(e) => setForm({ ...form, zona: e.target.value })}
            />
          </Field>
          <Field label="Límite de crédito (ARS)">
            <Input
              type="number"
              value={form.limiteCredito}
              onChange={(e) =>
                setForm({ ...form, limiteCredito: Number(e.target.value) })
              }
            />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setNuevo(false)}>
            Cancelar
          </Button>
          <Button onClick={guardar}>Guardar cliente</Button>
        </div>
      </Modal>

      {/* Detalle cliente */}
      <Modal
        open={detalle !== null}
        onClose={() => setDetalle(null)}
        title={detalle?.nombre ?? ""}
      >
        {detalle && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Chip tone="slate">{clienteTipoLabel[detalle.tipo]}</Chip>
              <Chip tone="brand">{detalle.zona}</Chip>
              {detalle.estado === "activo" ? (
                <Chip tone="green">Activo</Chip>
              ) : (
                <Chip tone="rose">Inactivo</Chip>
              )}
            </div>
            <div className="grid gap-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Users size={15} className="text-slate-400" /> {detalle.contacto}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-slate-400" /> {detalle.telefono}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-slate-400" /> {detalle.email}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-slate-400" />{" "}
                {detalle.direccion}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-400">Comprado histórico</p>
                <p className="font-bold text-slate-800">
                  {formatARS(detalle.totalComprado)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-400">Saldo cta. cte.</p>
                <p
                  className={`font-bold ${
                    detalle.saldoCuentaCorriente > 0
                      ? "text-rose-600"
                      : "text-slate-800"
                  }`}
                >
                  {formatARS(detalle.saldoCuentaCorriente)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-400">Límite crédito</p>
                <p className="font-bold text-slate-800">
                  {formatARS(detalle.limiteCredito)}
                </p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Últimos pedidos
              </p>
              <div className="space-y-2">
                {pedidos
                  .filter((p) => p.clienteId === detalle.id)
                  .slice(0, 4)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
                    >
                      <span className="text-slate-500">
                        {formatFecha(p.fecha)} · {p.items.length} ítems
                      </span>
                      <span className="font-semibold text-slate-800">
                        {formatARS(p.total)}
                      </span>
                    </div>
                  ))}
                {pedidos.filter((p) => p.clienteId === detalle.id).length ===
                  0 && (
                  <p className="text-sm text-slate-400">Sin pedidos aún.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
