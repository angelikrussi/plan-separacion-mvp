# TASK-004 — Login de cliente con 2FA (TOTP)

## References
- FR-002, BR-010, AC-002, TS-001 (POST /api/auth/login, /api/auth/login/totp), ADR-002

## Objective
Implementar login de cliente en dos pasos: credenciales, luego código TOTP.

## Scope
### In Scope
- Generación/activación de secreto TOTP en primer login (o registro).
- `POST /api/auth/login`, `POST /api/auth/login/totp`.
- Sesión vía NextAuth (JWT).
### Out of Scope
- 2FA de administrador (fuera de alcance del MVP, ADR-002).

## Technical Changes
### Files
- `src/app/(public)/login/page.tsx`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/login/totp/route.ts`
- `src/lib/auth/totp.ts`

## Behavior
1. `login`: validar correo/password contra hash. Si es válido, emitir `loginToken` de corta duración y responder `requiereTotp: true`. Si no, `401 INVALID_CREDENTIALS` (sin indicar cuál dato falló).
2. `login/totp`: validar `loginToken` + `codigo` TOTP contra `totpSecret` del cliente. Si es válido, crear sesión. Si no, `401 INVALID_TOTP`.
3. Si el cliente no tiene `totpHabilitado`, el flujo de login debe primero guiarlo a configurar el TOTP (mostrar secreto/QR) antes de completar el login.

## Constraints
- El mensaje de error de login nunca debe distinguir "correo no existe" de "password incorrecta".
- El `loginToken` debe expirar (p. ej. 5 minutos).

## Acceptance Criteria
- [ ] AC-002 pasa: sin completar TOTP no hay acceso al dashboard.
- [ ] Login con credenciales inválidas retorna 401 sin filtrar cuál campo falló.
- [ ] TOTP incorrecto no otorga sesión.

## Tests
- [ ] Unit: verificación TOTP (código válido/expirado/incorrecto).
- [ ] Integration: flujo completo login → totp → sesión.

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
