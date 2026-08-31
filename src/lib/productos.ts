import type { Producto } from "@prisma/client";

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
