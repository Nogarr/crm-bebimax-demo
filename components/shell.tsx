"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Truck,
  Package,
  UserCog,
  BarChart3,
  GlassWater,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/store";
import { roleLabel } from "@/lib/labels";
import type { Role, User } from "@/lib/types";
import { Avatar } from "./ui";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navByRole: Record<Role, NavItem[]> = {
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
    { href: "/admin/envios", label: "Envíos", icon: Truck },
    { href: "/admin/clientes", label: "Clientes", icon: Users },
    { href: "/admin/productos", label: "Productos", icon: Package },
    { href: "/admin/equipo", label: "Equipo", icon: UserCog },
    { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
  ],
  encargado: [
    { href: "/encargado", label: "Dashboard", icon: LayoutDashboard },
    { href: "/encargado/pedidos", label: "Pedidos", icon: ClipboardList },
    { href: "/encargado/envios", label: "Envíos", icon: Truck },
    { href: "/encargado/clientes", label: "Clientes", icon: Users },
  ],
  repartidor: [],
};

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg shadow-brand-600/30">
        <GlassWater size={20} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold tracking-tight text-white">
            BebiMax
          </p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
            Distribuidora
          </p>
        </div>
      )}
    </div>
  );
}

function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== `/${item.href.split("/")[1]}` &&
            pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserCard({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
      <Avatar initials={user.avatar} seed={user.nombre.length} size="sm" />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-semibold text-white">
          {user.nombre}
        </p>
        <p className="truncate text-xs text-slate-400">
          {roleLabel[user.role]}
        </p>
      </div>
      <button
        onClick={onLogout}
        title="Cerrar sesión"
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}

export function DeskShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = navByRole[user.role];

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink px-4 py-5 lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <div className="mt-8 flex-1">
          <NavList items={items} pathname={pathname} />
        </div>
        <UserCard user={user} onLogout={handleLogout} />
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="animate-in absolute inset-y-0 left-0 flex w-72 flex-col bg-ink px-4 py-5">
            <div className="flex items-center justify-between px-2">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-8 flex-1">
              <NavList
                items={items}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
            <UserCard user={user} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <Brand compact />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 pulse-dot" />
              Demo · datos de ejemplo
            </span>
            <div className="flex items-center gap-2.5">
              <Avatar
                initials={user.avatar}
                seed={user.nombre.length}
                size="sm"
              />
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {user.nombre}
                </p>
                <p className="text-xs text-slate-400">{roleLabel[user.role]}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function MobileShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-ink px-4 py-3.5 text-white">
        <Brand compact />
        <div className="ml-auto flex items-center gap-2">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold">{user.nombre}</p>
            <p className="text-[11px] text-slate-400">Repartidor · {user.zona}</p>
          </div>
          <Avatar initials={user.avatar} seed={user.nombre.length} size="sm" />
          <button
            onClick={handleLogout}
            title="Salir"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="px-4 py-5">{children}</main>
    </div>
  );
}
