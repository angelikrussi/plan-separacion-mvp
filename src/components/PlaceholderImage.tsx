// Imagen genérica local (SVG inline) mientras no hay fotografías reales de
// producto — no depende de una red externa, siempre se ve igual.
export function PlaceholderImage({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-brand-light ${className}`}>
      <svg viewBox="0 0 64 64" className="w-1/3 h-1/3 text-brand-dark/30" fill="none" stroke="currentColor">
        <rect x="6" y="10" width="52" height="44" rx="3" strokeWidth="2.5" />
        <circle cx="22" cy="24" r="5" strokeWidth="2.5" />
        <path d="M6 42l14-12 12 10 8-7 18 15" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}
