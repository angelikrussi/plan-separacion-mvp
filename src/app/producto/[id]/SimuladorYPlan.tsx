"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SimuladorYPlan({
  productoId,
  precio,
  opciones,
  disponible,
}: {
  productoId: string;
  precio: number;
  opciones: number[];
  disponible: boolean;
}) {
  const router = useRouter();
  const [cuotas, setCuotas] = useState(opciones[0] ?? 1);
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valorPorCuota = Math.floor(precio / cuotas);
  const residuo = precio - valorPorCuota * cuotas;

  async function crearPlan() {
    setCreando(true);
    setError(null);
    try {
      const res = await fetch("/api/planes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productoId, numeroCuotas: cuotas }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(data.error?.message ?? "No se pudo crear el plan");
      }
      router.push(`/planes/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCreando(false);
    }
  }

  return (
    <div className="rounded-lg border p-4 flex flex-col gap-3">
      <h2 className="font-semibold">Simula tu plan</h2>
      <div className="flex gap-2 flex-wrap">
        {opciones.map((c) => (
          <button
            key={c}
            onClick={() => setCuotas(c)}
            className={`rounded-full px-3 py-1 text-sm border ${
              c === cuotas ? "bg-brand text-white border-brand" : "border-gray-300"
            }`}
          >
            {c} cuotas
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Cuota aproximada:{" "}
        <span className="font-semibold text-gray-900">${valorPorCuota.toLocaleString("es-CO")}</span>
        {residuo > 0 && <span> (última cuota: ${(valorPorCuota + residuo).toLocaleString("es-CO")})</span>}
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={crearPlan}
        disabled={!disponible || creando}
        className="rounded-lg bg-cta hover:bg-cta-hover px-4 py-3 text-white font-medium disabled:opacity-50"
      >
        {disponible ? (creando ? "Creando plan..." : "Crear este plan") : "No disponible"}
      </button>
    </div>
  );
}
