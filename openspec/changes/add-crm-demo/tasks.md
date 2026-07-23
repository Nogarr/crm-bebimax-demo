# Tasks — add-crm-demo

## 1. Foundation
- [x] 1.1 Scaffold Next.js 15 + TS + Tailwind v4 config
- [x] 1.2 Design system / theme tokens (globals.css)
- [x] 1.3 Domain types (lib/types.ts)
- [x] 1.4 Seed data JSON (usuarios, clientes, productos, pedidos, envios)
- [x] 1.5 Format + label helpers (lib/format.ts, lib/labels.ts)

## 2. State & session
- [x] 2.1 Auth context (login/logout, localStorage session, role guard helper)
- [x] 2.2 In-memory store context (seed + mutations)
- [x] 2.3 Root layout wiring providers + fonts

## 3. Shared UI
- [x] 3.1 Primitives: Card, StatCard, Badge/StatusChip, Avatar, Button, Modal, EmptyState
- [x] 3.2 Charts: BarChart, DonutChart, ProgressBar (SVG)
- [x] 3.3 App shell: Sidebar (role nav) + Topbar + role guard wrapper

## 4. Screens — Admin
- [x] 4.1 Dashboard (KPIs, sales chart, top productos, alertas)
- [x] 4.2 Clientes (list + filters + nuevo cliente)
- [x] 4.3 Pedidos (list + filters + nuevo pedido + cambiar estado + detalle)
- [x] 4.4 Envíos (board por estado / repartidor)
- [x] 4.5 Productos (catálogo + stock + alertas)
- [x] 4.6 Equipo (usuarios) + Reportes

## 5. Screens — Encargado
- [x] 5.1 Dashboard operativo del día
- [x] 5.2 Pedidos (confirmar / preparar)
- [x] 5.3 Envíos (asignar repartidor)
- [x] 5.4 Clientes (solo lectura + alta)

## 6. Screens — Repartidor (mobile-first)
- [x] 6.1 Mis entregas de hoy + progreso de ruta
- [x] 6.2 Detalle de entrega + marcar entregado / no entregado + cobro

## 7. Login & polish
- [x] 7.1 Login screen with role shortcuts
- [x] 7.2 README + demo credentials

## 8. Ship
- [x] 8.1 `next build` passes (path with space verified) — 17 routes, no type errors
- [x] 8.2 Git init + conventional commit + push to GitHub
      → https://github.com/Nogarr/crm-bebimax-demo
- [ ] 8.3 Deploy to Vercel — BLOCKED: the claude.ai Vercel connector token
      lacks "create project" permission (HTTP 403) and no Vercel CLI token is
      available locally. Needs one of: import the GitHub repo from the Vercel
      dashboard, a Vercel access token, or re-granting the integration with
      project-create scope.
