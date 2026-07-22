// ============================================================
// Domain types — BebiMax CRM
// ============================================================

export type Role = "admin" | "encargado" | "repartidor";

export interface User {
  id: string;
  nombre: string;
  email: string;
  role: Role;
  avatar: string; // iniciales
  telefono?: string;
  zona?: string; // para repartidores
}

export type ClienteTipo =
  | "kiosco"
  | "almacen"
  | "bar"
  | "restaurante"
  | "supermercado"
  | "distribuidor";

export interface Cliente {
  id: string;
  nombre: string; // nombre del comercio
  contacto: string; // persona de contacto
  tipo: ClienteTipo;
  telefono: string;
  email: string;
  direccion: string;
  zona: string;
  estado: "activo" | "inactivo";
  saldoCuentaCorriente: number; // positivo = nos debe
  limiteCredito: number;
  ultimaCompra: string; // ISO date
  totalComprado: number;
  notas?: string;
}

export type Categoria =
  | "cerveza"
  | "gaseosa"
  | "agua"
  | "vino"
  | "energizante"
  | "jugo"
  | "licor";

export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: Categoria;
  sku: string;
  precioCaja: number;
  unidadesPorCaja: number;
  stockCajas: number;
  stockMinimo: number;
  emoji: string;
}

export type EstadoPedido =
  | "pendiente"
  | "confirmado"
  | "preparacion"
  | "en_camino"
  | "entregado"
  | "cancelado";

export interface PedidoItem {
  productoId: string;
  nombre: string;
  emoji: string;
  cantidadCajas: number;
  precioCaja: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  clienteNombre: string;
  zona: string;
  fecha: string; // ISO datetime
  fechaEntrega: string; // ISO date
  items: PedidoItem[];
  total: number;
  estado: EstadoPedido;
  metodoPago: "efectivo" | "transferencia" | "cuenta_corriente";
  origen: "telefono" | "whatsapp" | "vendedor" | "web";
  repartidorId: string | null;
  notas?: string;
}

export type EstadoEntrega =
  | "pendiente"
  | "en_ruta"
  | "entregado"
  | "no_entregado"
  | "reprogramado";

export interface Envio {
  id: string;
  pedidoId: string;
  clienteNombre: string;
  direccion: string;
  zona: string;
  repartidorId: string | null;
  ordenRuta: number;
  ventana: string; // ej "09:00 - 12:00"
  estado: EstadoEntrega;
  total: number;
  cobrado: boolean;
  metodoCobro?: "efectivo" | "transferencia" | "cuenta_corriente";
  motivoNoEntrega?: string;
}
