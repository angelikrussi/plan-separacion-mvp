import { prisma } from "@/lib/db";
import { productoPublico } from "@/lib/productos";
import { errorResponse } from "@/lib/errors";

// TASK-006 — FR-004
export async function GET() {
  try {
    const productos = await prisma.producto.findMany({ orderBy: { nombre: "asc" } });
    return Response.json(productos.map(productoPublico));
  } catch (error) {
    return errorResponse(error);
  }
}
