# ADR-003 — Bloqueo optimista en revisión de pagos

## Context
Dos administradores pueden abrir el mismo abono pendiente al mismo tiempo (EF-003 en FS-001). Sin control, ambos podrían intentar aprobar/rechazar el mismo pago.

## Decision
Al abrir el detalle de un abono `PENDIENTE`, se transiciona a `EN_REVISION` y se graba `revisadoPor` (admin) y `revisadoEn` (timestamp), solo si el estado seguía siendo `PENDIENTE` en ese instante (transición atómica en la base de datos). Aprobar/rechazar exige que `revisadoPor` coincida con el admin autenticado.

## Rationale
No hay necesidad de locks pesimistas (`SELECT ... FOR UPDATE`) para un volumen bajo de revisiones concurrentes; una transición condicional atómica es suficiente y más simple de operar.

## Consequences
Positive: evita doble procesamiento sin infraestructura adicional.
Negative: un admin puede "colgarse" un abono en revisión sin resolverlo, bloqueando a otros. Fuera de alcance del MVP: liberar automáticamente revisiones abandonadas por timeout.
