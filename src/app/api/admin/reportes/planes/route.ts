import * as XLSX from "xlsx";
import { obtenerSesion } from "@/lib/auth/session";
import { filasReportePlanes } from "@/lib/admin/reportes";
import { ApiError, errorResponse } from "@/lib/errors";

// Exporta el detalle de planes a Excel para el dashboard gerencial.
// "alerta" es un heurístico informativo, no una política de mora validada
// (ver nota en src/lib/admin/reportes.ts y FS-001 sección 8).
export async function GET() {
  try {
    const sesion = await obtenerSesion();
    if (!sesion || sesion.rol !== "administrador") {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }

    const filas = await filasReportePlanes();
    const datos = filas.map((f) => ({
      Item: f.item,
      "ID Plan": f.planId,
      "Fecha creación": f.fechaCreacion.toISOString().slice(0, 10),
      Cliente: f.cliente,
      Correo: f.correoCliente,
      Producto: f.producto,
      "Valor total": f.valorTotal,
      "Total pagado": f.totalPagado,
      "Saldo pendiente": f.saldoPendiente,
      "Estado del plan": f.estadoPlan,
      "Fecha último abono": f.fechaUltimoAbono ? f.fechaUltimoAbono.toISOString().slice(0, 10) : "",
      "Días sin abonar": f.diasSinAbono ?? "",
      Alerta: f.alerta,
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    hoja["!cols"] = [
      { wch: 6 }, { wch: 26 }, { wch: 14 }, { wch: 24 }, { wch: 26 }, { wch: 24 },
      { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 20 }, { wch: 16 }, { wch: 14 }, { wch: 22 },
    ];
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Planes");

    const buffer = XLSX.write(libro, { type: "buffer", bookType: "xlsx" }) as Buffer;
    const fecha = new Date().toISOString().slice(0, 10);

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="luckyhouse-planes-${fecha}.xlsx"`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
