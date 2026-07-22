# Tasks — add-crm-demo

## 1. Foundation
- [x] 1.1 Scaffold Next.js 15 + TS + Tailwind v4 config
- [x] 1.2 Design system / theme tokens (globals.css)
- [x] 1.3 Domain types (lib/types.ts)
- [x] 1.4 Seed data JSON (usuarios, clientes, productos, pedidos, envios)
- [x] 1.5 Format + label helpers (lib/format.ts, lib/labels.ts)

## 2. State & session
- [ ] 2.1 Auth context (login/logout, localStorage session, role guard helper)
- [ ] 2.2 In-memory store context (seed + mutations)
- [ ] 2.3 Root layout wiring providers + fonts

## 3. Shared UI
- [ ] 3.1 Primitives: Card, StatCard, Badge/StatusChip, Avatar, Button, Modal, EmptyState
- [ ] 3.2 Charts: BarChart, DonutChart, Sparkline (SVG)
- [ ] 3.3 App shell: Sidebar (role nav) + Topbar + role guard wrapper

## 4. Screens — Admin
- [ ] 4.1 Dashboard (KPIs, sales chart, top productos, alertas)
- [ ] 4.2 Clientes (list + filters + nuevo cliente)
- [ ] 4.3 Pedidos (list + filters + nuevo pedido + cambiar estado + detalle)
- [ ] 4.4 Envíos (board por estado / repartidor)
- [ ] 4.5 Productos (catálogo + stock + alertas)
- [ ] 4.6 Equipo (usuarios) + Reportes

## 5. Screens — Encargado
- [ ] 5.1 Dashboard operativo del día
- [ ] 5.2 Pedidos (confirmar / preparar)
- [ ] 5.3 Envíos (asignar repartidor)
- [ ] 5.4 Clientes (solo lectura + alta)

## 6. Screens — Repartidor (mobile-first)
- [ ] 6.1 Mis entregas de hoy + progreso de ruta
- [ ] 6.2 Detalle de entrega + marcar entregado / no entregado + cobro

## 7. Login & polish
- [ ] 7.1 Login screen with role shortcuts
- [ ] 7.2 README + demo credentials

## 8. Ship
- [ ] 8.1 `next build` passes (path with space verified)
- [ ] 8.2 Git init + conventional commit + push to GitHub
- [ ] 8.3 Deploy to Vercel (production) and capture URL
