import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { registrarAuditoria } from "@/lib/auditoria";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-016 — FR-014, BR-008, AC-009
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "administrador") {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }

    const { motivo } = (await request.json()) ?? {};
    if (!motivo) throw new ApiError(400, "VALIDATION_ERROR", "El motivo es obligatorio");

    const plan = await prisma.$transaction(async (tx) => {
      const planActual = await tx.plan.findUnique({ where: { id: params.id } });
      if (!planActual) throw new ApiError(404, "PLAN_NOT_FOUND", "Plan no encontrado");
      if (planActual.estado !== "ACTIVO") {
        throw new ApiError(409, "INVALID_STATE", "Solo un plan ACTIVO puede cancelarse");
      }

      const actualizado = await tx.plan.update({
        where: { id: params.id },
        data: { estado: "CANCELADO", motivoCancelacion: motivo },
      });

      const producto = await tx.producto.findUnique({ where: { id: planActual.productoId } });
      if (producto?.stockLimitado) {
        await tx.producto.update({
          where: { id: producto.id },
          data: { cantidadDisponible: { increment: 1 } },
        });
      }

      await registrarAuditoria(
        {
          entidad: "Plan",
          entidadId: actualizado.id,
          accion: "CANCELAR_PLAN",
          actor: sesion.sub,
          valoresAnteriores: { estado: planActual.estado },
          valoresNuevos: { estado: actualizado.estado, motivo },
        },
        tx
      );

      return actualizado;
    });

    return Response.json(plan);
  } catch (error) {
    return errorResponse(error);
  }
}
