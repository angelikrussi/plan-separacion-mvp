# TASK-029 — Bypass temporal de 2FA y autocompletado de código en desarrollo

## References
- ADR-005

## Objective
Permitir avanzar la revisión manual del MVP sin depender de una app autenticadora física.

## Technical Changes
### Files
- `src/app/api/auth/login/route.ts` (`SKIP_2FA`, `codigoDev`)
- `src/app/login/page.tsx` (autocompleta el campo de código si `codigoDev` viene en la respuesta; QR real vía `qrcode`)
- `.env` (`SKIP_2FA="true"`, no versionado — ver `.env.example`)

## Behavior
Ver ADR-005 para el detalle de ambos mecanismos y su condición de activación.

## Constraints
- Ambos mecanismos están condicionados a no estar en `NODE_ENV=production` (o, para `SKIP_2FA`, a que la variable no esté definida).

## Acceptance Criteria
- [x] Con `SKIP_2FA=true`, el login de cliente no pide código TOTP.
- [x] Sin `SKIP_2FA`, el código aparece autocompletado en desarrollo pero sigue siendo requerido.
- [x] Ninguno de los dos aplica cuando `NODE_ENV=production`.

## Definition of Done
- [x] Implementation complete.
- [x] Verificado end-to-end.
- [x] No regression.
