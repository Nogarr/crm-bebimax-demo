# Project — BebiMax CRM (visual demo)

## Purpose
Interactive, visually-functional prototype of a CRM/light-ERP for a **beverage
wholesaler**. Its goal is to drive a requirements conversation with the client
BEFORE real development starts. It is a mockup, not a production system.

## Scope
- Simulated authentication with three roles: **Administrador**, **Encargado**,
  **Repartidor**.
- Core domain: **clientes**, **productos**, **pedidos**, **envíos**.
- Simulated interactions (create order, change status, assign driver, mark
  delivered) backed by an in-memory store seeded from JSON. State resets on
  reload — this is intentional for the demo.

## Non-goals
- No backend, no database, no persistence beyond the browser session.
- No auth security (any password is accepted; roles are demo shortcuts).
- No real payments, invoicing or stock reconciliation.

## Tech stack
- Next.js 15 (App Router) + React 19 + TypeScript.
- Tailwind CSS v4 (CSS-first theme).
- lucide-react for icons. Charts are hand-rolled SVG (no chart lib).
- Deployed on Vercel.

## Conventions
- UI copy in Spanish (client-facing). Code/identifiers in English.
- Currency es-AR (ARS). Fictional company: **BebiMax** (Santa Fe, AR).
