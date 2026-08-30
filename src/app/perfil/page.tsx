import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const sesion = await obtenerSesion();
  const cliente = await prisma.cliente.findUniqueOrThrow({ where: { id: sesion!.sub } });

  return (
    <AppShell title="Mi perfil" back="/dashboard">
      <main className="flex flex-col gap-3 p-4 text-sm">
        <Campo label="Nombre completo" valor={cliente.nombreCompleto} />
        <Campo label="Documento" valor={cliente.documentoIdentidad} />
        <Campo label="Celular" valor={cliente.celular} />
        <Campo label="Correo" valor={cliente.correo} />
        <Campo label="Miembro desde" valor={cliente.fechaRegistro.toLocaleDateString("es-CO")} />
      </main>
    </AppShell>
  );
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded border p-3">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-medium">{valor}</div>
    </div>
  );
}
