// Formateo de moneda, fechas y helpers de presentación (es-AR)

export function formatARS(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function formatFecha(iso: string): string {
  // iso puede ser fecha o datetime
  const soloFecha = iso.length === 10 ? `${iso}T00:00:00` : iso;
  const d = new Date(soloFecha);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatFechaCorta(iso: string): string {
  const soloFecha = iso.length === 10 ? `${iso}T00:00:00` : iso;
  const d = new Date(soloFecha);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}

export function formatHora(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function iniciales(nombre: string): string {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}
