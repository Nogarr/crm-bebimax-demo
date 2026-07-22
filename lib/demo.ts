// El demo trabaja sobre un "hoy" congelado para que los datos de ejemplo
// se vean coherentes sin importar la fecha real en que se abra la demo.
export const DEMO_TODAY = "2026-07-22";

export function esHoy(iso: string): boolean {
  return iso.slice(0, 10) === DEMO_TODAY;
}
