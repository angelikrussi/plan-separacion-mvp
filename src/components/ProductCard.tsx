import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";

type ProductoPublico = {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  disponible: boolean;
};

export function ProductCard({ producto: p }: { producto: ProductoPublico }) {
  return (
    <Link
      href={`/producto/${p.id}`}
      className="group rounded-lg border bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="aspect-square">
        <PlaceholderImage />
      </div>
      <div className="p-3 flex flex-col gap-1">
        <span className="text-xs text-gray-400">{p.categoria}</span>
        <span className="text-sm font-medium leading-snug line-clamp-2">{p.nombre}</span>
        <span className="text-brand-dark font-bold">${p.precio.toLocaleString("es-CO")}</span>
        {!p.disponible && <span className="text-xs text-danger">No disponible</span>}
      </div>
    </Link>
  );
}
