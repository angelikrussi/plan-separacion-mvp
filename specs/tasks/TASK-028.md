# TASK-028 — Migrar el mecanismo de sesión de NextAuth a `jose`

## References
- ADR-008, FR-002

## Objective
Formalizar como task retroactiva la desviación de TS-001 v1.0: implementar la sesión (y el login en dos pasos) sin NextAuth.

## Technical Changes
### Files
- `src/lib/auth/session.ts` (`crearSesion`, `obtenerSesion`, `crearLoginToken`, `verificarLoginToken`, `verificarSesionEdge`)
- `src/middleware.ts` (usa `verificarSesionEdge` — corre en Edge runtime)

## Behavior
Ver TASK-004 (login) — el mecanismo de firma/verificación es el que cambia, no el comportamiento funcional (FR-002 se mantiene igual).

## Acceptance Criteria
- [x] El middleware valida la sesión en Edge runtime sin depender de NextAuth.
- [x] El flujo de dos pasos (`loginToken` → `session`) funciona igual que lo especificado en TASK-004.

## Definition of Done
- [x] Implementation complete.
- [x] Verificado end-to-end (login cliente y admin).
- [x] No regression.
