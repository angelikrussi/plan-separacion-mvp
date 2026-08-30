import { cerrarSesion } from "@/lib/auth/session";

export async function POST() {
  cerrarSesion();
  return Response.json({ ok: true });
}
