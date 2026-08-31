# TASK-022 — Middleware de autenticación y autorización

## References
- TS-001 (Security), BR-001, BR-002

## Objective
Proteger rutas de cliente y de administrador según sesión y rol.

## Technical Changes
### Files
- `src/middleware.ts`
- `src/lib/auth/session.ts`

## Behavior
```text
middleware(request):
    si ruta empieza con /admin o /api/admin:
        si no hay sesión o sesión.rol != administrador: 401/403
    si ruta empieza con /dashboard, /planes, /perfil o equivalentes /api:
        si no hay sesión de cliente: 401
```

## Acceptance Criteria
- [ ] Cliente autenticado no puede acceder a rutas `/admin/**`.
- [ ] Usuario no autenticado es redirigido a login al intentar entrar a rutas privadas.

## Tests
- [ ] Integration: acceso cliente a /admin (403), acceso anónimo a /dashboard (redirect/401).

## Validation
```bash
npm run lint && npm run typecheck && npm test
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Tests passing.
- [ ] No regression.
