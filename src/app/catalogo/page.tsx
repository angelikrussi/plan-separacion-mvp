import { prisma } from "@/lib/db";
import { productoPublico } from "@/lib/productos";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const categoria = searchParams.categoria;
  const productos = (
    await prisma.producto.findMany({
      where: categoria ? { categoria } : undefined,
      orderBy: { nombre: "asc" },
    })
  ).map(productoPublico);

  return (
    <>
      <StoreHeader categoriaActiva={categoria} />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">{categoria ?? "Todos los productos"}</h1>
        {productos.length === 0 ? (
          <p className="text-gray-500">No hay productos en esta categoría todavía.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
