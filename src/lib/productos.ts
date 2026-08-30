import type { Producto } from "@prisma/client";

// Placeholder determinístico mientras no hay fotografías reales cargadas
// (fotos[] queda vacío en el seed) — mismo producto siempre muestra la misma imagen.
export function placeholderImageUrl(seed: string, size = 600) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;
}

export function productoPublico(p: Producto) {
  const disponible = p.stockLimitado ? (p.cantidadDisponible ?? 0) > 0 : true;
  return {
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    categoria: p.categoria,
    fotos: JSON.parse(p.fotos) as string[],
    disponible,
    stockLimitado: p.stockLimitado,
    opcionesPlan: JSON.parse(p.opcionesPlan) as number[],
    condiciones: p.condiciones,
  };
}
