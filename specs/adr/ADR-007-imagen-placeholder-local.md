# ADR-007 — Imagen placeholder local (SVG) en vez de servicio externo

## Context
`Producto.fotos` queda vacío en el seed (sin fotografías reales todavía). La primera implementación usaba `picsum.photos/seed/{id}/...` como placeholder determinístico, pero en la máquina del usuario esas imágenes no cargaban de forma confiable (red/firewall), dejando el catálogo con huecos rotos.

## Decision
Reemplazar la dependencia externa por un componente `PlaceholderImage` (SVG inline, icono de foto genérica sobre fondo de marca), usado en `ProductCard` y en el detalle de producto.

## Rationale
Un ícono local no depende de conectividad ni de un tercero, es instantáneo, y sigue comunicando visualmente "esto es una imagen de producto pendiente" sin necesidad de variedad por producto — que tampoco era un requisito real (el usuario solo pidió que "se viera bien" mientras no hay fotos).

## Consequences
Positive: el catálogo siempre se ve completo, sin depender de la red del usuario.
Negative: todos los productos muestran el mismo ícono (sin variedad visual) hasta que se carguen fotografías reales — aceptable para el MVP.
