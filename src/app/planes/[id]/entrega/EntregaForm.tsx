"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EntregaForm({ planId }: { planId: string }) {
  const router = useRouter();
  const [tipo, setTipo] = useState<"recogida" | "envio">("recogida");
  const [form, setForm] = useState({
    nombreReceptor: "",
    telefono: "",
    ciudad: "",
    direccion: "",
    barrio: "",
    puntoReferencia: "",
    fechaPreferida: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  function set(campo: string, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`/api/planes/${planId}/entrega`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, ...(tipo === "envio" ? form : {}) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "No se pudo registrar la entrega");
      router.push(`/planes/${planId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTipo("recogida")}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm ${tipo === "recogida" ? "bg-brand text-white border-brand" : ""}`}
        >
          Recogida
        </button>
        <button
          type="button"
          onClick={() => setTipo("envio")}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm ${tipo === "envio" ? "bg-brand text-white border-brand" : ""}`}
        >
          Envío
        </button>
      </div>

      {tipo === "envio" && (
        <>
          <input className="rounded border px-3 py-2" placeholder="Nombre del receptor" value={form.nombreReceptor} onChange={(e) => set("nombreReceptor", e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Teléfono" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Ciudad" value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Dirección" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Barrio" value={form.barrio} onChange={(e) => set("barrio", e.target.value)} />
          <input className="rounded border px-3 py-2" placeholder="Punto de referencia" value={form.puntoReferencia} onChange={(e) => set("puntoReferencia", e.target.value)} />
          <input className="rounded border px-3 py-2" type="date" value={form.fechaPreferida} onChange={(e) => set("fechaPreferida", e.target.value)} />
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={cargando} className="rounded-lg bg-cta hover:bg-cta-hover px-4 py-3 text-white font-medium disabled:opacity-50">
        {cargando ? "Guardando..." : "Confirmar entrega"}
      </button>
    </form>
  );
}
