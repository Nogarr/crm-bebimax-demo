import type {
  Categoria,
  ClienteTipo,
  EstadoEntrega,
  EstadoPedido,
  Role,
} from "./types";

// Tono de color por chip: define clases de tailwind (bg / text / border)
export interface ChipTone {
  label: string;
  bg: string;
  text: string;
  dot: string;
}

export const estadoPedidoMeta: Record<EstadoPedido, ChipTone> = {
  pendiente: {
    label: "Pendiente",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  confirmado: {
    label: "Confirmado",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  preparacion: {
    label: "En preparación",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  en_camino: {
    label: "En camino",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    dot: "bg-cyan-500",
  },
  entregado: {
    label: "Entregado",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  cancelado: {
    label: "Cancelado",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
};

export const estadoEntregaMeta: Record<EstadoEntrega, ChipTone> = {
  pendiente: {
    label: "Pendiente",
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
  en_ruta: {
    label: "En ruta",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    dot: "bg-cyan-500",
  },
  entregado: {
    label: "Entregado",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  no_entregado: {
    label: "No entregado",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
  reprogramado: {
    label: "Reprogramado",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
};

export const categoriaMeta: Record<Categoria, { label: string; color: string; emoji: string }> = {
  cerveza: { label: "Cerveza", color: "#f59e0b", emoji: "🍺" },
  gaseosa: { label: "Gaseosa", color: "#ef4444", emoji: "🥤" },
  agua: { label: "Agua", color: "#0ea5e9", emoji: "💧" },
  vino: { label: "Vino", color: "#be123c", emoji: "🍷" },
  energizante: { label: "Energizante", color: "#7c3aed", emoji: "⚡" },
  jugo: { label: "Jugo", color: "#fb923c", emoji: "🧃" },
  licor: { label: "Licor", color: "#10b981", emoji: "🥃" },
};

export const clienteTipoLabel: Record<ClienteTipo, string> = {
  kiosco: "Kiosco",
  almacen: "Almacén",
  bar: "Bar",
  restaurante: "Restaurante",
  supermercado: "Supermercado",
  distribuidor: "Distribuidor",
};

export const roleLabel: Record<Role, string> = {
  admin: "Administrador",
  encargado: "Encargado",
  repartidor: "Repartidor",
};

export const metodoPagoLabel: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  cuenta_corriente: "Cuenta corriente",
};

export const origenLabel: Record<string, string> = {
  telefono: "Teléfono",
  whatsapp: "WhatsApp",
  vendedor: "Vendedor",
  web: "Web",
};
