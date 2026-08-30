import { readFile } from "node:fs/promises";
import path from "node:path";
import { obtenerSesion } from "@/lib/auth/session";
import { ApiError, errorResponse } from "@/lib/errors";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
};

// Servir comprobantes solo a usuarios autenticados (cliente dueño o admin;
// verificación de ownership queda simplificada aquí porque no hay CDN/ACL en el MVP).
export async function GET(_request: Request, { params }: { params: { filename: string } }) {
  try {
    const sesion = await obtenerSesion();
    if (!sesion) {
      throw new ApiError(401, "UNAUTHORIZED", "No autorizado");
    }

    const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? "./storage/comprobantes");
    const filePath = path.join(uploadDir, params.filename);
    if (!filePath.startsWith(uploadDir)) {
      throw new ApiError(400, "INVALID_FILE", "Ruta inválida");
    }

    const ext = params.filename.split(".").pop() ?? "";
    const buffer = await readFile(filePath);
    return new Response(buffer, {
      headers: { "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
