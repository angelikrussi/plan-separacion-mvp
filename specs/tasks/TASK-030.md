# TASK-030 — Extender duración de sesión en desarrollo

## References
- ADR-006

## Objective
Evitar que una sesión de prueba larga expire a las 2 horas y se confunda con un bug de "cierre de sesión".

## Technical Changes
### Files
- `src/lib/auth/session.ts` (`SESSION_MAX_AGE_SECONDS`, `SESSION_JWT_EXPIRATION` condicionados por `NODE_ENV`)

## Behavior
`NODE_ENV === "production"` → 2h (igual que TS-001 v1.0). Cualquier otro entorno → 30 días.

## Acceptance Criteria
- [x] Una sesión de cliente o admin permanece válida por 30 días en desarrollo.
- [x] La duración en producción no cambió (2h).

## Definition of Done
- [x] Implementation complete.
- [x] Verificado (login → navegación prolongada sin expirar).
- [x] No regression.
