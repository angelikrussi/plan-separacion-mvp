import { prisma } from "@/lib/db";
import { simular } from "@/lib/simulador";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-008 — FR-006
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const producto = await prisma.producto.findUnique({ where: { id: params.id } });
    if (!producto) {
      throw new ApiError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado");
    }

    const cuotasParam = new URL(request.url).searchParams.get("cuotas");
    const cuotas = Number(cuotasParam);
    const opciones = JSON.parse(producto.opcionesPlan) as number[];
    if (!cuotasParam || !opciones.includes(cuotas)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Número de cuotas no disponible para este producto");
    }

    return Response.json(simular(producto.precio, cuotas));
  } catch (error) {
    return errorResponse(error);
  }
}
