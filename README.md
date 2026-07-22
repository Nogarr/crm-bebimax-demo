# BebiMax CRM — Demo

Prototipo **visualmente funcional** de un CRM / ERP liviano para un **mayorista
de bebidas**. Su objetivo es servir de base de conversación con el cliente antes
de arrancar el desarrollo real: es un mockup navegable, no un sistema productivo.

> ⚠️ Datos ficticios. La información vive en memoria y se **reinicia al
> recargar** la página. No hay backend ni base de datos.

## Roles y accesos

En la pantalla de login se entra con un click, sin contraseña:

| Rol | Persona (demo) | Qué ve |
| --- | --- | --- |
| **Administrador** | Valentín Rossi | Dashboard completo, pedidos, envíos, clientes, productos/stock, equipo y reportes. |
| **Encargado** | Marina Duarte | Operación del día: confirmar pedidos y asignar repartos. |
| **Repartidor** | Diego Ferrari | Vista mobile con sus entregas del día, ruta, cobros y detalle de cada parada. |

## Qué se puede hacer (interacciones simuladas)

- Crear clientes y pedidos (con carrito de productos y total en vivo).
- Avanzar el estado de un pedido: pendiente → confirmado → preparación → en
  camino → entregado (o cancelarlo).
- Asignar pedidos a repartidores y ver el avance de cada ruta.
- Como repartidor, marcar entregas como **entregado** (con forma de cobro) o
  **no entregado** (con motivo). Los indicadores del dashboard se actualizan.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (tema CSS-first)
- **lucide-react** para íconos · gráficos en SVG propio (sin librería externa)
- Estado en memoria vía React Context, sesión en `localStorage`

## Correr localmente

```bash
npm install
npm run dev
# http://localhost:3000
```

## Estructura

```
app/            Rutas (login + shell por rol: admin / encargado / repartidor)
components/     UI compartida, gráficos, shell y vistas de cada módulo
lib/            Tipos, store en memoria, métricas, formateo y etiquetas
data/           Datos de ejemplo (JSON): clientes, productos, pedidos, envíos
openspec/       Artefactos SDD del cambio (proposal, spec, design, tasks)
```

## Nota de proceso (SDD)

El diseño se documentó con Spec-Driven Development. Ver
`openspec/changes/add-crm-demo/` para el proposal, la especificación de
requisitos, las decisiones de diseño y el checklist de tareas.
