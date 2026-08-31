import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { ApiError, errorResponse } from "@/lib/errors";

// TASK-003 — FR-001, AC-001
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombreCompleto, documentoIdentidad, celular, correo, password } = body ?? {};

    if (!nombreCompleto || !documentoIdentidad || !celular || !correo || !password) {
      throw new ApiError(400, "VALIDATION_ERROR", "Todos los campos son obligatorios");
    }
    if (typeof password !== "string" || password.length < 8) {
      throw new ApiError(400, "VALIDATION_ERROR", "La contraseña debe tener al menos 8 caracteres");
    }
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Correo inválido");
    }

    const existente = await prisma.cliente.findUnique({ where: { correo } });
    if (existente) {
      throw new ApiError(409, "EMAIL_ALREADY_IN_USE", "Este correo ya está registrado");
    }

    const passwordHash = await hashPassword(password);
    const cliente = await prisma.cliente.create({
      data: { nombreCompleto, documentoIdentidad, celular, correo, passwordHash },
    });

    return Response.json({ clienteId: cliente.id }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
