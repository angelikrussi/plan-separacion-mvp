import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obtenerSesion } from "@/lib/auth/session";
import { AppShell } from "@/components/AppShell";
import { AbonoForm } from "./AbonoForm";

export const dynamic = "force-dynamic";

export default async function AbonarPage({ params }: { params: { id: string } }) {
  const sesion = await obtenerSesion();
  const plan = await prisma.plan.findUnique({ where: { id: params.id } });
  if (!plan) notFound();
  if (plan.clienteId !== sesion!.sub) redirect("/dashboard");

  return (
    <AppShell title="Registrar abono" back={`/planes/${plan.id}`}>
      <main className="p-4">
        <AbonoForm planId={plan.id} saldoPendiente={plan.saldoPendiente} />
      </main>
    </AppShell>
  );
}
