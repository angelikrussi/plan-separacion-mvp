# TASK-026 — Imagen placeholder local para productos

## References
- ADR-007

## Objective
Sustituir el placeholder externo (`picsum.photos`, no confiable en la red del usuario) por un ícono SVG local.

## Technical Changes
### Files
- `src/components/PlaceholderImage.tsx` (nuevo)
- `src/components/ProductCard.tsx`, `src/app/producto/[id]/page.tsx` (usan el componente en vez de `<img src="https://picsum.photos/...">`)
- `src/lib/productos.ts` (se elimina `placeholderImageUrl`, ya no se usa)

## Behavior
`PlaceholderImage` renderiza un `<svg>` (icono de foto genérica) centrado sobre `bg-brand-light`, sin ninguna petición de red.

## Acceptance Criteria
- [x] El catálogo y el detalle de producto muestran la imagen genérica sin depender de una red externa.
- [x] No quedan referencias a `picsum.photos` en el código.

## Definition of Done
- [x] Implementation complete.
- [x] Verificado visualmente en navegador.
- [x] No regression.
