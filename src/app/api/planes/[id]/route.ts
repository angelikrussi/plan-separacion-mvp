import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-010 — FR-008
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion) throw new ApiError(401, "UNAUTHORIZED", "No autorizado");

    const plan = await prisma.plan.findUnique({
      where: { id: params.id },
      include: { producto: true, abonos: { orderBy: { fecha: "desc" } }, entrega: true },
    });
    if (!plan) throw new ApiError(404, "PLAN_NOT_FOUND", "Plan no encontrado");

    if (sesion.rol === "cliente" && plan.clienteId !== sesion.sub) {
      throw new ApiError(403, "FORBIDDEN", "No puedes ver este plan");
    }

    const progreso = plan.valorTotal > 0 ? Math.round((plan.totalPagado / plan.valorTotal) * 100) : 0;
    return Response.json({ ...plan, progreso });
  } catch (error) {
    return errorResponse(error);
  }
}
