import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { registrarAuditoria } from "@/lib/auditoria";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-010 — FR-008: listado de planes propios
export async function GET() {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "cliente") throw new ApiError(401, "UNAUTHORIZED", "No autorizado");

    const planes = await prisma.plan.findMany({
      where: { clienteId: sesion.sub },
      include: { producto: true },
      orderBy: { fechaCreacion: "desc" },
    });
    return Response.json(planes);
  } catch (error) {
    return errorResponse(error);
  }
}

// TASK-009 — FR-007, BR-007, AC-003
export async function POST(request: Request) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "cliente") throw new ApiError(401, "UNAUTHORIZED", "No autorizado");

    const { productoId, numeroCuotas } = (await request.json()) ?? {};
    if (!productoId || !numeroCuotas) {
      throw new ApiError(400, "VALIDATION_ERROR", "productoId y numeroCuotas son obligatorios");
    }

    const plan = await prisma.$transaction(async (tx) => {
      const producto = await tx.producto.findUnique({ where: { id: productoId } });
      if (!producto) throw new ApiError(404, "PRODUCT_NOT_FOUND", "Producto no encontrado");

      if (producto.stockLimitado) {
        if ((producto.cantidadDisponible ?? 0) <= 0) {
          throw new ApiError(409, "PRODUCT_NOT_AVAILABLE", "Producto sin disponibilidad");
        }
        await tx.producto.update({
          where: { id: productoId },
          data: { cantidadDisponible: { decrement: 1 } },
        });
      }

      const nuevoPlan = await tx.plan.create({
        data: {
          clienteId: sesion.sub,
          productoId,
          valorTotal: producto.precio,
          numeroCuotas,
          saldoPendiente: producto.precio,
        },
      });

      await registrarAuditoria(
        {
          entidad: "Plan",
          entidadId: nuevoPlan.id,
          accion: "CREAR_PLAN",
          actor: sesion.sub,
          valoresNuevos: { estado: nuevoPlan.estado, valorTotal: nuevoPlan.valorTotal },
        },
        tx
      );

      return nuevoPlan;
    });

    return Response.json(plan, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
