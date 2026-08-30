# TASK-003 — Registro de cliente

## References
- FR-001, AC-001, TS-001 (POST /api/auth/registro)

## Objective
Implementar el endpoint y formulario de registro de clientes.

## Scope
### In Scope
- Formulario de registro (página pública).
- `POST /api/auth/registro`.
### Out of Scope
- Login (TASK-004).

## Technical Changes
### Files
- `src/app/(public)/registro/page.tsx`
- `src/app/api/auth/registro/route.ts`
- `src/lib/validation/registro.ts`

### Interfaces
```text
RegistroInput = {
  nombreCompleto, documentoIdentidad, celular, correo, password
}
```

## Behavior
1. Validar campos obligatorios y formato de correo.
2. Verificar que `correo` no exista (`EMAIL_ALREADY_IN_USE` si existe).
3. Hashear password con bcrypt.
4. Crear `Cliente`.
5. Retornar `201 { clienteId }`.

## Constraints
- Nunca persistir password en texto plano (BR de FS-001, sección seguridad TS-001).
- No revelar en el mensaje de error si el correo existe por otra vía que no sea el código `EMAIL_ALREADY_IN_USE` explícito de este endpoint.

## Acceptance Criteria
- [ ] AC-001 pasa: cuenta creada con hash, nunca texto plano.
- [ ] Correo duplicado retorna 409 `EMAIL_ALREADY_IN_USE`.
- [ ] Campos faltantes retornan 400 `VALIDATION_ERROR`.

## Tests
- [ ] Unit: validación de input.
- [ ] Integration: registro exitoso + registro duplicado.

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
