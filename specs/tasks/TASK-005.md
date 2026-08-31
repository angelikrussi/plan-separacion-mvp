# TASK-005 — Perfil del cliente

## References
- FR-003, TS-001

## Objective
Permitir a un cliente autenticado consultar y actualizar su perfil.

## Scope
### In Scope
- `GET /api/clientes/me`, `PATCH /api/clientes/me`.
- Página `/perfil`.
### Out of Scope
- Cambio de correo/contraseña (no definido en FS-001, queda fuera de este task).

## Technical Changes
### Files
- `src/app/(cliente)/perfil/page.tsx`
- `src/app/api/clientes/me/route.ts`

## Behavior
1. `GET`: retornar datos del cliente autenticado (sin `passwordHash`/`totpSecret`).
2. `PATCH`: actualizar campos editables (nombreCompleto, celular); validar formato.

## Constraints
- Nunca exponer `passwordHash` ni `totpSecret` en la respuesta.

## Acceptance Criteria
- [ ] Cliente autenticado ve sus datos.
- [ ] Cliente no autenticado recibe 401.
- [ ] Actualización de celular persiste correctamente.

## Tests
- [ ] Integration: consulta y actualización de perfil.

## Validation
```bash
npm run lint
npm run typecheck
npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
