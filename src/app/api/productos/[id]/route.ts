import { prisma } from "@/lib/db";
import { productoPublico } from "@/lib/productos";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-007 — FR-005
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const producto = await prisma.producto.findUnique({ where: { id: params.id } });
    if (!producto) {
      throw new ApiError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado");
    }
    return Response.json(productoPublico(producto));
  } catch (error) {
    return errorResponse(error);
  }
}
