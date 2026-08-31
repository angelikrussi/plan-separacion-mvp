import Link from "next/link";
import { AccountMenu } from "@/components/AccountMenu";

const CATEGORIAS = [
  "Celulares",
  "Electrodomésticos",
  "Computadores",
  "Televisores",
  "Ventiladores",
  "Muebles",
];

export function StoreHeader({ categoriaActiva }: { categoriaActiva?: string }) {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          LuckyHouse
        </Link>
        <p className="hidden sm:block text-sm text-brand-light/90">Tu forma de comprar, separar y pagar.</p>
        <nav className="flex items-center gap-4 text-sm">
          <AccountMenu />
        </nav>
      </div>
      <div className="bg-brand-dark">
        <div className="mx-auto max-w-7xl px-4 flex gap-1 overflow-x-auto text-sm">
          <Link
            href="/catalogo"
            className={`px-3 py-2 whitespace-nowrap ${!categoriaActiva ? "bg-white/15 font-medium" : "hover:bg-white/10"}`}
          >
            Todo
          </Link>
          {CATEGORIAS.map((c) => (
            <Link
              key={c}
              href={`/catalogo?categoria=${encodeURIComponent(c)}`}
              className={`px-3 py-2 whitespace-nowrap ${categoriaActiva === c ? "bg-white/15 font-medium" : "hover:bg-white/10"}`}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
