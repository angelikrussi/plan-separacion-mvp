"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarcarEntregadoButton({ entregaId }: { entregaId: string }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  async function marcar() {
    setCargando(true);
    await fetch(`/api/admin/entregas/${entregaId}/entregar`, { method: "POST" });
    setCargando(false);
    router.refresh();
  }

  return (
    <button onClick={marcar} disabled={cargando} className="rounded-lg bg-cta hover:bg-cta-hover px-4 py-2 text-white text-sm disabled:opacity-50">
      {cargando ? "Guardando..." : "Marcar como entregado"}
    </button>
  );
}
