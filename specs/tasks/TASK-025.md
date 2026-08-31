# TASK-025 — Carrusel de promociones y botón flotante de WhatsApp

## References
- FS-001 (Non-Goals: WhatsApp es solo contacto, sin lógica de negocio)

## Objective
Agregar un carrusel de promociones en el home (tipo e-commerce) y un botón flotante de contacto por WhatsApp visible en todo el sitio.

## Technical Changes
### Files
- `src/components/PromoSlider.tsx` (auto-rotación cada 5s, dots de navegación)
- `src/components/WhatsAppButton.tsx` (enlace `wa.me`, fijo `bottom-5 right-5`)
- `src/app/page.tsx`, `src/app/layout.tsx`

## Behavior
- `PromoSlider`: 3 slides hardcoded (plan separe general, celulares, muebles), `setInterval` de 5000ms.
- `WhatsAppButton`: sin backend, sin estado — un `<a>` a `https://wa.me/<numero>?text=...`.

## Constraints
- El número de WhatsApp es un placeholder (`573000000000`) — reemplazar por el número real del negocio antes de producción.

## Acceptance Criteria
- [x] El carrusel rota automáticamente y los dots permiten saltar a un slide.
- [x] El botón de WhatsApp abre `wa.me` con mensaje prellenado en una pestaña nueva.

## Definition of Done
- [x] Implementation complete.
- [x] Verificado visualmente en navegador.
- [x] No regression.
