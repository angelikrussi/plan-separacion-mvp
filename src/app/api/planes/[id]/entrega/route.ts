import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-021 — FR-019
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "cliente") throw new ApiError(401, "UNAUTHORIZED", "No autorizado");

    const plan = await prisma.plan.findUnique({ where: { id: params.id } });
    if (!plan) throw new ApiError(404, "PLAN_NOT_FOUND", "Plan no encontrado");
    if (plan.clienteId !== sesion.sub) throw new ApiError(403, "FORBIDDEN", "No es tu plan");
    if (plan.estado !== "PENDIENTE_DE_ENTREGA") {
      throw new ApiError(409, "INVALID_STATE", "El plan no está listo para entrega");
    }

    const body = (await request.json()) ?? {};
    const { tipo, nombreReceptor, telefono, ciudad, direccion, barrio, puntoReferencia, fechaPreferida } = body;
    if (tipo !== "recogida" && tipo !== "envio") {
      throw new ApiError(400, "VALIDATION_ERROR", "tipo debe ser recogida o envio");
    }
    if (tipo === "envio" && (!nombreReceptor || !telefono || !ciudad || !direccion)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Datos de envío incompletos");
    }

    const entrega = await prisma.entrega.create({
      data: {
        planId: plan.id,
        tipo,
        nombreReceptor: nombreReceptor ?? null,
        telefono: telefono ?? null,
        ciudad: ciudad ?? null,
        direccion: direccion ?? null,
        barrio: barrio ?? null,
        puntoReferencia: puntoReferencia ?? null,
        fechaPreferida: fechaPreferida ?? null,
      },
    });

    return Response.json(entrega, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
