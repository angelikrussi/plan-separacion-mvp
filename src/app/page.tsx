import Link from "next/link";
import { prisma } from "@/lib/db";
import { productoPublico } from "@/lib/productos";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductCard } from "@/components/ProductCard";
import { PromoSlider } from "@/components/PromoSlider";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const destacados = (await prisma.producto.findMany({ take: 8, orderBy: { nombre: "asc" } })).map(
    productoPublico
  );

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 flex flex-col gap-8">
        <PromoSlider />

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Productos destacados</h2>
            <Link href="/catalogo" className="text-sm text-brand">Ver todo →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {destacados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
