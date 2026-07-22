# Proposal — Add CRM visual demo (add-crm-demo)

## Why
The client (a beverage wholesaler) has not yet defined requirements. Instead of
starting development blind, we build a clickable, visually-functional prototype
to anchor the discovery conversation: "is this what you need? what's missing?".

## What changes
Introduce a Next.js demo application with:
- A simulated login screen with one-click role shortcuts (admin / encargado /
  repartidor) so the client can jump between perspectives instantly.
- **Administrador** view: full operational dashboard (KPIs, sales chart, top
  products, alerts), plus clientes, pedidos, envíos, productos, equipo and a
  reportes screen.
- **Encargado** view: operational dashboard focused on the day — orders to
  confirm/prepare and shipments to assign to drivers.
- **Repartidor** view: mobile-first "my deliveries today" list with route
  progress, per-delivery detail, and mark-delivered / not-delivered actions.
- An in-memory store (seeded from JSON) exposing mutations that make the demo
  feel alive: create order, advance order status, assign driver, register
  delivery + collection.

## Impact
- Affected capabilities: `auth`, `clientes`, `pedidos`, `envios`.
- New app; no existing code to migrate.
- Deliverable: source on GitHub + live URL on Vercel to share with the client.

## Out of scope
Real persistence, real auth, backend APIs, invoicing/AFIP, printing.
