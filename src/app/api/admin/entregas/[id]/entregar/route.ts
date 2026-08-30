import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { registrarAuditoria } from "@/lib/auditoria";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-021 — FR-020
export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "administrador") {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }

    const entrega = await prisma.$transaction(async (tx) => {
      const entregaActual = await tx.entrega.findUnique({ where: { id: params.id } });
      if (!entregaActual) throw new ApiError(404, "DELIVERY_NOT_FOUND", "Entrega no encontrada");

      const actualizada = await tx.entrega.update({
        where: { id: params.id },
        data: { estadoEntrega: "ENTREGADO" },
      });
      await tx.plan.update({ where: { id: entregaActual.planId }, data: { estado: "ENTREGADO" } });

      await registrarAuditoria(
        {
          entidad: "Entrega",
          entidadId: actualizada.id,
          accion: "MARCAR_ENTREGADO",
          actor: sesion.sub,
          valoresAnteriores: { estadoEntrega: entregaActual.estadoEntrega },
          valoresNuevos: { estadoEntrega: actualizada.estadoEntrega },
        },
        tx
      );

      return actualizada;
    });

    return Response.json(entrega);
  } catch (error) {
    return errorResponse(error);
  }
}
