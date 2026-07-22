"use client";

import usuariosData from "@/data/usuarios.json";
import { Phone, Mail, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { roleLabel } from "@/lib/labels";
import type { Role, User } from "@/lib/types";
import { Avatar, Chip, PageHeader } from "@/components/ui";

const usuarios = usuariosData as unknown as User[];

const roleTone: Record<Role, "brand" | "violet" | "blue"> = {
  admin: "brand",
  encargado: "violet",
  repartidor: "blue",
};

export default function EquipoView() {
  const { envios } = useStore();

  return (
    <>
      <PageHeader
        title="Equipo"
        subtitle={`${usuarios.length} personas · administración, operación y reparto`}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {usuarios.map((u) => {
          const misEnvios = envios.filter((e) => e.repartidorId === u.id);
          const entregados = misEnvios.filter(
            (e) => e.estado === "entregado"
          ).length;
          return (
            <div key={u.id} className="card p-5">
              <div className="flex items-center gap-4">
                <Avatar initials={u.avatar} seed={u.nombre.length} size="lg" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-800">
                    {u.nombre}
                  </p>
                  <Chip tone={roleTone[u.role]}>{roleLabel[u.role]}</Chip>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" /> {u.email}
                </p>
                {u.telefono && (
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" /> {u.telefono}
                  </p>
                )}
                {u.zona && (
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" /> Zona {u.zona}
                  </p>
                )}
              </div>
              {u.role === "repartidor" && (
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                  <div className="flex-1 rounded-xl bg-slate-50 py-2 text-center">
                    <p className="text-lg font-bold text-slate-800">
                      {misEnvios.length}
                    </p>
                    <p className="text-[11px] uppercase text-slate-400">
                      paradas
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl bg-emerald-50 py-2 text-center">
                    <p className="text-lg font-bold text-emerald-600">
                      {entregados}
                    </p>
                    <p className="text-[11px] uppercase text-emerald-500/70">
                      entregados
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
