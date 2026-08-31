import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { productoPublico } from "@/lib/productos";
import { StoreHeader } from "@/components/StoreHeader";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { SimuladorYPlan } from "./SimuladorYPlan";

export const dynamic = "force-dynamic";

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const producto = await prisma.producto.findUnique({ where: { id: params.id } });
  if (!producto) notFound();
  const p = productoPublico(producto);

  return (
    <>
      <StoreHeader categoriaActiva={p.categoria} />
      <main className="mx-auto max-w-7xl px-4 py-6 grid md:grid-cols-2 gap-8">
        <div className="rounded-xl aspect-square overflow-hidden">
          <PlaceholderImage />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs text-gray-400">{p.categoria}</span>
            <h1 className="text-2xl font-bold">{p.nombre}</h1>
          </div>
          <p className="text-gray-700">{p.descripcion}</p>
          <p className="text-3xl font-bold text-brand-dark">${p.precio.toLocaleString("es-CO")}</p>
          <p className="text-sm text-gray-500">{p.condiciones}</p>

          <SimuladorYPlan productoId={p.id} precio={p.precio} opciones={p.opcionesPlan} disponible={p.disponible} />
        </div>
      </main>
    </>
  );
}
