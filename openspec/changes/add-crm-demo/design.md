# Design — add-crm-demo

## Context
Throwaway-quality is acceptable for logic, but visual quality is the product:
this demo exists to impress and to provoke feedback. Optimize for coherent,
vibrant UI and "feels alive" interactions over architectural purity.

## Key decisions

### State: single in-memory store via React Context
- One `StoreProvider` (client component) seeds `clientes / productos / pedidos /
  envios` from JSON on mount and exposes typed mutations.
- Rationale: the client explicitly asked for in-memory simulation that resets on
  reload. No persistence layer, no server actions — keeps the surface tiny.
- Session (which role is logged in) is kept in `localStorage` so a refresh does
  not kick the presenter back to login, while business data still resets.

### Routing: one role-adaptive shell, not three parallel trees
- `app/(app)/*` renders a shared shell (sidebar + topbar). Navigation entries
  and the dashboard adapt to `role`. A client-side guard redirects disallowed
  routes to the role's home.
- Repartidor gets a dedicated mobile-first layout under `app/(app)/repartidor`.
- Rationale: DRY. Screens like pedidos/clientes differ by permissions, not by
  fundamentally different code — except the driver experience, which is mobile.

### Visuals: "vibrante marca bebidas"
- Brand = energetic orange; dark ink sidebar; category/status colors give pop.
- Login uses a full brand gradient. Charts are hand-rolled SVG on the palette to
  avoid a chart dependency and control the look.

### Data derivation
- Envíos are seeded for "today" and also created on driver assignment. KPIs and
  charts are derived from the live store so mutations visibly move the numbers.

## Risks / trade-offs
- No persistence → refresh resets data. Accepted (demo requirement).
- Path contains a space → verified with `next build` before deploy.
- Client-only auth guard → fine for a demo; not a security boundary.
