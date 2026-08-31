import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-018 — FR-016
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "cliente") throw new ApiError(401, "UNAUTHORIZED", "No autorizado");

    const plan = await prisma.plan.findUnique({ where: { id: params.id } });
    if (!plan) throw new ApiError(404, "PLAN_NOT_FOUND", "Plan no encontrado");
    if (plan.clienteId !== sesion.sub) throw new ApiError(403, "FORBIDDEN", "No es tu plan");

    const abonos = await prisma.abono.findMany({
      where: { planId: params.id },
      orderBy: { fecha: "desc" },
    });
    return Response.json(abonos);
  } catch (error) {
    return errorResponse(error);
  }
}
