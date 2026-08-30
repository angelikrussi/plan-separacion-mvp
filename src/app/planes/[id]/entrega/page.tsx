import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { AppShell } from "@/components/AppShell";
import { EntregaForm } from "./EntregaForm";

export const dynamic = "force-dynamic";

export default async function EntregaPage({ params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  const plan = await prisma.plan.findUnique({ where: { id: params.id } });
  if (!plan) notFound();
  if (plan.clienteId !== sesion!.sub) redirect("/dashboard");

  return (
    <AppShell title="Datos de entrega" back={`/planes/${plan.id}`}>
      <main className="p-4">
        <EntregaForm planId={plan.id} />
      </main>
    </AppShell>
  );
}
