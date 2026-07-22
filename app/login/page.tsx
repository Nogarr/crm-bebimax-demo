"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GlassWater,
  ShieldCheck,
  ClipboardCheck,
  Truck,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/store";
import type { Role } from "@/lib/types";

interface RoleCard {
  role: Role;
  title: string;
  desc: string;
  user: string;
  icon: LucideIcon;
  accent: string;
}

const roleCards: RoleCard[] = [
  {
    role: "admin",
    title: "Administrador",
    desc: "Visión completa del negocio: ventas, stock, equipo y reportes.",
    user: "Valentín Rossi",
    icon: ShieldCheck,
    accent: "from-brand-500 to-rose-500",
  },
  {
    role: "encargado",
    title: "Encargado",
    desc: "Operación del día: confirmar pedidos y asignar repartos.",
    user: "Marina Duarte",
    icon: ClipboardCheck,
    accent: "from-violet-500 to-indigo-500",
  },
  {
    role: "repartidor",
    title: "Repartidor",
    desc: "Tus entregas de hoy, ruta y cobros. Pensado para el celular.",
    user: "Diego Ferrari",
    icon: Truck,
    accent: "from-cyan-500 to-emerald-500",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginAs } = useAuth();
  const [selecting, setSelecting] = useState<Role | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace(`/${user.role}`);
  }, [user, loading, router]);

  function enter(role: Role) {
    setSelecting(role);
    loginAs(role);
    router.push(`/${role}`);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Hero */}
      <div className="brand-gradient relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-black/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <GlassWater size={24} />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight">BebiMax</p>
            <p className="text-xs uppercase tracking-widest text-white/70">
              Distribuidora de bebidas
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight">
            El CRM que ordena tu mayorista, de la venta al reparto.
          </h1>
          <p className="mt-4 text-white/80">
            Clientes, pedidos, stock y envíos en un solo lugar. Cada rol ve
            exactamente lo que necesita para trabajar.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Pedidos y cuentas corrientes al día",
              "Asignación de repartos por zona",
              "Control de entregas y cobros en la calle",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <Check size={14} />
                </span>
                <span className="text-sm text-white/90">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          Prototipo de demostración · datos ficticios
        </p>
      </div>

      {/* Login panel */}
      <div className="flex flex-col justify-center bg-slate-50 px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white">
              <GlassWater size={22} />
            </div>
            <p className="text-lg font-extrabold tracking-tight text-slate-900">
              BebiMax
            </p>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Ingresá al sistema
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Elegí un rol para recorrer la demo. Cada uno tiene su propia vista.
          </p>

          <div className="mt-8 space-y-3">
            {roleCards.map((card) => {
              const Icon = card.icon;
              const isLoading = selecting === card.role;
              return (
                <button
                  key={card.role}
                  onClick={() => enter(card.role)}
                  disabled={selecting !== null}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-brand-300 hover:shadow-md disabled:opacity-60"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-sm`}
                  >
                    {isLoading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{card.title}</p>
                    <p className="text-xs text-slate-500">{card.desc}</p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500"
                  />
                </button>
              );
            })}
          </div>

          <p className="mt-8 rounded-xl bg-slate-100 px-4 py-3 text-center text-xs text-slate-500">
            No hace falta contraseña. Es un entorno de demostración con datos de
            ejemplo que se reinician al recargar.
          </p>
        </div>
      </div>
    </div>
  );
}
