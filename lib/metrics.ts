import { DEMO_TODAY } from "./demo";
import { categoriaMeta } from "./labels";
import type {
  Categoria,
  Cliente,
  EstadoPedido,
  Pedido,
  Producto,
} from "./types";

const VIVOS: EstadoPedido[] = [
  "pendiente",
  "confirmado",
  "preparacion",
  "en_camino",
  "entregado",
];

export function pedidosDeHoy(pedidos: Pedido[]): Pedido[] {
  return pedidos.filter(
    (p) => p.fecha.slice(0, 10) === DEMO_TODAY && p.estado !== "cancelado"
  );
}

export function ventasDeHoy(pedidos: Pedido[]): number {
  return pedidosDeHoy(pedidos).reduce((a, p) => a + p.total, 0);
}

export function ventasTotales(pedidos: Pedido[]): number {
  return pedidos
    .filter((p) => VIVOS.includes(p.estado))
    .reduce((a, p) => a + p.total, 0);
}

export function ticketPromedio(pedidos: Pedido[]): number {
  const vivos = pedidos.filter((p) => VIVOS.includes(p.estado));
  if (vivos.length === 0) return 0;
  return Math.round(ventasTotales(pedidos) / vivos.length);
}

export function conteoPorEstado(pedidos: Pedido[]): Record<EstadoPedido, number> {
  const base: Record<EstadoPedido, number> = {
    pendiente: 0,
    confirmado: 0,
    preparacion: 0,
    en_camino: 0,
    entregado: 0,
    cancelado: 0,
  };
  for (const p of pedidos) base[p.estado] += 1;
  return base;
}

export interface ProductoRanking {
  productoId: string;
  nombre: string;
  emoji: string;
  cajas: number;
  monto: number;
}

export function topProductos(pedidos: Pedido[], n = 5): ProductoRanking[] {
  const map = new Map<string, ProductoRanking>();
  for (const p of pedidos) {
    if (p.estado === "cancelado") continue;
    for (const it of p.items) {
      const cur =
        map.get(it.productoId) ?? {
          productoId: it.productoId,
          nombre: it.nombre,
          emoji: it.emoji,
          cajas: 0,
          monto: 0,
        };
      cur.cajas += it.cantidadCajas;
      cur.monto += it.cantidadCajas * it.precioCaja;
      map.set(it.productoId, cur);
    }
  }
  return [...map.values()].sort((a, b) => b.cajas - a.cajas).slice(0, n);
}

export interface CategoriaVenta {
  categoria: Categoria;
  label: string;
  color: string;
  monto: number;
}

export function ventasPorCategoria(
  pedidos: Pedido[],
  productos: Producto[]
): CategoriaVenta[] {
  const catDe = new Map(productos.map((p) => [p.id, p.categoria]));
  const totals = new Map<Categoria, number>();
  for (const p of pedidos) {
    if (p.estado === "cancelado") continue;
    for (const it of p.items) {
      const cat = catDe.get(it.productoId);
      if (!cat) continue;
      totals.set(cat, (totals.get(cat) ?? 0) + it.cantidadCajas * it.precioCaja);
    }
  }
  return [...totals.entries()]
    .map(([categoria, monto]) => ({
      categoria,
      label: categoriaMeta[categoria].label,
      color: categoriaMeta[categoria].color,
      monto,
    }))
    .sort((a, b) => b.monto - a.monto);
}

export function alertasStock(productos: Producto[]): Producto[] {
  return productos
    .filter((p) => p.stockCajas <= p.stockMinimo)
    .sort((a, b) => a.stockCajas - b.stockCajas);
}

export function totalPorCobrar(clientes: Cliente[]): number {
  return clientes.reduce((a, c) => a + c.saldoCuentaCorriente, 0);
}

export function clientesActivos(clientes: Cliente[]): number {
  return clientes.filter((c) => c.estado === "activo").length;
}
