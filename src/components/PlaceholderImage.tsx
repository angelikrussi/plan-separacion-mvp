// Imagen genérica local mientras no hay fotografías reales por producto —
// no depende de una red externa, siempre se ve igual (provista por el usuario).
export function PlaceholderImage({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/producto-placeholder.avif"
      alt="Imagen genérica de producto"
      className={`w-full h-full object-cover bg-brand-light ${className}`}
    />
  );
}
