import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { guardarComprobante } from "@/lib/storage/comprobantes";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-011 — FR-009, BR-002, BR-003, BR-009, AC-004, AC-005, EF-001
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "cliente") throw new ApiError(401, "UNAUTHORIZED", "No autorizado");

    const plan = await prisma.plan.findUnique({ where: { id: params.id } });
    if (!plan) throw new ApiError(404, "PLAN_NOT_FOUND", "Plan no encontrado");
    if (plan.clienteId !== sesion.sub) throw new ApiError(403, "FORBIDDEN", "No es tu plan");
    if (plan.estado !== "ACTIVO") throw new ApiError(409, "INVALID_STATE", "El plan no está activo");

    const formData = await request.formData();
    const valor = Number(formData.get("valor"));
    const metodoPago = String(formData.get("metodoPago") ?? "");
    const fecha = String(formData.get("fecha") ?? "");
    const referencia = formData.get("referencia") ? String(formData.get("referencia")) : null;
    const archivo = formData.get("comprobante") as File | null;

    if (!valor || valor <= 0 || !metodoPago || !fecha) {
      throw new ApiError(400, "VALIDATION_ERROR", "Datos de abono incompletos");
    }
    if (!archivo) {
      throw new ApiError(400, "VALIDATION_ERROR", "El comprobante es obligatorio");
    }

    // BR-009 / AC-004 / EF-001
    if (valor > plan.saldoPendiente) {
      throw new ApiError(409, "OVERPAYMENT", "El abono supera el saldo pendiente");
    }

    let comprobanteUrl: string;
    try {
      comprobanteUrl = await guardarComprobante(archivo);
    } catch (e) {
      throw new ApiError(400, "INVALID_FILE", "Comprobante inválido (tipo o tamaño)");
    }

    // BR-003: no se toca plan.saldoPendiente aquí.
    const abono = await prisma.abono.create({
      data: {
        planId: plan.id,
        valor,
        metodoPago,
        fecha: new Date(fecha),
        referencia,
        comprobanteUrl,
        estado: "PENDIENTE",
      },
    });

    return Response.json(abono, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
