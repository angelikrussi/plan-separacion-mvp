import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/errors";

// TASK-013 — lógica compartida entre la página de detalle (que dispara la
// revisión al abrirse, FR-011) y el endpoint /api/admin/abonos/[id]/revisar.
export async function revisarAbono(abonoId: string, adminId: string) {
  const resultado = await prisma.abono.updateMany({
    where: { id: abonoId, estado: "PENDIENTE" },
    data: { estado: "EN_REVISION", revisadoPor: adminId, revisadoEn: new Date() },
  });

  if (resultado.count === 0) {
    const actual = await prisma.abono.findUnique({ where: { id: abonoId } });
    if (!actual) throw new ApiError(404, "PAYMENT_NOT_FOUND", "Abono no encontrado");
    if (actual.estado === "EN_REVISION" && actual.revisadoPor !== adminId) {
      const revisor = actual.revisadoPor
        ? await prisma.administrador.findUnique({ where: { id: actual.revisadoPor } })
        : null;
      throw new ApiError(409, "ALREADY_IN_REVIEW", `Ya está en revisión por ${revisor?.usuario ?? "otro administrador"}`);
    }
    return actual;
  }

  return prisma.abono.findUniqueOrThrow({ where: { id: abonoId } });
}
