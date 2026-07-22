"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import usuariosData from "@/data/usuarios.json";
import clientesData from "@/data/clientes.json";
import productosData from "@/data/productos.json";
import pedidosData from "@/data/pedidos.json";
import enviosData from "@/data/envios.json";
import { DEMO_TODAY } from "./demo";
import type {
  Cliente,
  Envio,
  EstadoEntrega,
  EstadoPedido,
  Pedido,
  PedidoItem,
  Producto,
  Role,
  User,
} from "./types";

const usuarios = usuariosData as unknown as User[];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const ORDEN_ESTADOS: EstadoPedido[] = [
  "pendiente",
  "confirmado",
  "preparacion",
  "en_camino",
  "entregado",
];

// ============================================================
// Auth
// ============================================================
interface AuthValue {
  user: User | null;
  loading: boolean;
  loginAs: (role: Role) => void;
  login: (email: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);
const SESSION_KEY = "bebimax_session";

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const id = JSON.parse(raw) as string;
        const found = usuarios.find((u) => u.id === id) ?? null;
        setUser(found);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  function persist(u: User | null) {
    setUser(u);
    try {
      if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u.id));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }

  const value: AuthValue = {
    user,
    loading,
    loginAs: (role) => {
      const primary: Record<Role, string> = {
        admin: "u-admin",
        encargado: "u-encargado",
        repartidor: "u-rep-1",
      };
      const u = usuarios.find((x) => x.id === primary[role]) ?? null;
      persist(u);
    },
    login: (email) => {
      const u = usuarios.find(
        (x) => x.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (u) {
        persist(u);
        return true;
      }
      return false;
    },
    logout: () => persist(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AppProviders");
  return ctx;
}

// ============================================================
// Store (datos en memoria)
// ============================================================
export interface NuevoClienteInput {
  nombre: string;
  contacto: string;
  tipo: Cliente["tipo"];
  telefono: string;
  email: string;
  direccion: string;
  zona: string;
  limiteCredito: number;
}

export interface NuevoPedidoInput {
  clienteId: string;
  items: PedidoItem[];
  metodoPago: Pedido["metodoPago"];
  fechaEntrega: string;
  notas?: string;
}

interface StoreValue {
  clientes: Cliente[];
  productos: Producto[];
  pedidos: Pedido[];
  envios: Envio[];
  repartidores: User[];
  crearCliente: (input: NuevoClienteInput) => void;
  crearPedido: (input: NuevoPedidoInput) => void;
  avanzarEstadoPedido: (pedidoId: string) => void;
  cambiarEstadoPedido: (pedidoId: string, estado: EstadoPedido) => void;
  cancelarPedido: (pedidoId: string) => void;
  asignarRepartidor: (pedidoId: string, repartidorId: string) => void;
  registrarEntrega: (
    envioId: string,
    data: {
      estado: Extract<EstadoEntrega, "entregado" | "no_entregado">;
      metodoCobro?: Envio["metodoCobro"];
      motivoNoEntrega?: string;
    }
  ) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function StoreProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(() =>
    clone(clientesData as unknown as Cliente[])
  );
  const [productos] = useState<Producto[]>(() =>
    clone(productosData as unknown as Producto[])
  );
  const [pedidos, setPedidos] = useState<Pedido[]>(() =>
    clone(pedidosData as unknown as Pedido[])
  );
  const [envios, setEnvios] = useState<Envio[]>(() =>
    clone(enviosData as unknown as Envio[])
  );

  const repartidores = useMemo(
    () => usuarios.filter((u) => u.role === "repartidor"),
    []
  );

  function nextId(prefix: string) {
    return `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(
      Math.random() * 90 + 10
    )}`;
  }

  const value: StoreValue = {
    clientes,
    productos,
    pedidos,
    envios,
    repartidores,

    crearCliente: (input) => {
      const nuevo: Cliente = {
        id: nextId("c"),
        nombre: input.nombre,
        contacto: input.contacto,
        tipo: input.tipo,
        telefono: input.telefono,
        email: input.email,
        direccion: input.direccion,
        zona: input.zona,
        estado: "activo",
        saldoCuentaCorriente: 0,
        limiteCredito: input.limiteCredito,
        ultimaCompra: DEMO_TODAY,
        totalComprado: 0,
      };
      setClientes((prev) => [nuevo, ...prev]);
    },

    crearPedido: (input) => {
      const cliente = clientes.find((c) => c.id === input.clienteId);
      if (!cliente) return;
      const total = input.items.reduce(
        (acc, it) => acc + it.cantidadCajas * it.precioCaja,
        0
      );
      const nuevo: Pedido = {
        id: nextId("o"),
        clienteId: cliente.id,
        clienteNombre: cliente.nombre,
        zona: cliente.zona,
        fecha: `${DEMO_TODAY}T${new Date().toTimeString().slice(0, 8)}`,
        fechaEntrega: input.fechaEntrega,
        items: input.items,
        total,
        estado: "pendiente",
        metodoPago: input.metodoPago,
        origen: "vendedor",
        repartidorId: null,
        notas: input.notas,
      };
      setPedidos((prev) => [nuevo, ...prev]);
    },

    avanzarEstadoPedido: (pedidoId) => {
      setPedidos((prev) =>
        prev.map((p) => {
          if (p.id !== pedidoId) return p;
          if (p.estado === "cancelado" || p.estado === "entregado") return p;
          const i = ORDEN_ESTADOS.indexOf(p.estado);
          const next = ORDEN_ESTADOS[Math.min(i + 1, ORDEN_ESTADOS.length - 1)];
          return { ...p, estado: next };
        })
      );
    },

    cambiarEstadoPedido: (pedidoId, estado) => {
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado } : p))
      );
    },

    cancelarPedido: (pedidoId) => {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId ? { ...p, estado: "cancelado" } : p
        )
      );
    },

    asignarRepartidor: (pedidoId, repartidorId) => {
      const pedido = pedidos.find((p) => p.id === pedidoId);
      if (!pedido) return;
      const cliente = clientes.find((c) => c.id === pedido.clienteId);
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedidoId
            ? { ...p, repartidorId, estado: "en_camino" }
            : p
        )
      );
      setEnvios((prev) => {
        const ruta = prev.filter((e) => e.repartidorId === repartidorId).length;
        const nuevo: Envio = {
          id: nextId("e"),
          pedidoId: pedido.id,
          clienteNombre: pedido.clienteNombre,
          direccion: cliente?.direccion ?? "—",
          zona: pedido.zona,
          repartidorId,
          ordenRuta: ruta + 1,
          ventana: "A coordinar",
          estado: "pendiente",
          total: pedido.total,
          cobrado: false,
        };
        return [...prev, nuevo];
      });
    },

    registrarEntrega: (envioId, data) => {
      let pedidoId: string | null = null;
      setEnvios((prev) =>
        prev.map((e) => {
          if (e.id !== envioId) return e;
          pedidoId = e.pedidoId;
          const cobrado =
            data.estado === "entregado" &&
            data.metodoCobro !== undefined &&
            data.metodoCobro !== "cuenta_corriente";
          return {
            ...e,
            estado: data.estado,
            metodoCobro: data.metodoCobro,
            cobrado,
            motivoNoEntrega: data.motivoNoEntrega,
          };
        })
      );
      if (pedidoId) {
        setPedidos((prev) =>
          prev.map((p) =>
            p.id === pedidoId
              ? {
                  ...p,
                  estado:
                    data.estado === "entregado" ? "entregado" : p.estado,
                }
              : p
          )
        );
      }
    },
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within AppProviders");
  return ctx;
}

// ============================================================
// Combined provider
// ============================================================
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>{children}</StoreProvider>
    </AuthProvider>
  );
}
