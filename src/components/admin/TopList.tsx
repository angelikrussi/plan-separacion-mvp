// Lista simple tipo ranking (no gráfica) — nombre + valor, con el # de puesto.
export function TopList({
  items,
  formatoValor = (v: number) => v.toLocaleString("es-CO"),
}: {
  items: { nombre: string; valor: number }[];
  formatoValor?: (v: number) => string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-ink-secondary">Sin datos todavía.</p>;
  }
  return (
    <ol className="flex flex-col gap-1">
      {items.map((item, i) => (
        <li key={item.nombre + i} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
          <span className="flex items-center gap-2">
            <span className="text-ink-secondary w-5 text-right">{i + 1}.</span>
            {item.nombre}
          </span>
          <span className="font-medium">{formatoValor(item.valor)}</span>
        </li>
      ))}
    </ol>
  );
}
