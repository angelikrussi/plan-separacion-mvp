// Botón flotante de contacto — WhatsApp queda fuera del alcance funcional del
// MVP (ver Non-Goals en FS-001); esto es solo un canal de contacto/ventas,
// no está conectado a ninguna lógica de negocio.
const NUMERO = "573000000000";
const MENSAJE = "Hola, quiero saber más sobre LuckyHouse";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAJE)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:brightness-95 transition"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.83 14.08c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.3-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.07 1.31 2.36 1.46.29.15.46.13.63-.08.17-.21.72-.84.91-1.13.19-.29.38-.24.63-.15.26.1 1.65.78 1.93.92.29.15.48.22.55.34.07.13.07.72-.17 1.4z" />
      </svg>
    </a>
  );
}
