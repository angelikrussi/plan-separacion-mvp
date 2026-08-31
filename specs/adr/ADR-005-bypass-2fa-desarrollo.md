# ADR-005 — Bypass de 2FA y autocompletado de TOTP en desarrollo

## Context
Durante la revisión manual del MVP, el usuario no tenía a mano una app autenticadora para escanear el QR de TOTP y necesitaba recorrer el resto de las vistas (cliente y admin) sin fricción. BR-010 exige 2FA para clientes; esto no cambia como regla de negocio.

## Decision
Dos ayudas exclusivas de desarrollo, ambas condicionadas por variables/entorno, nunca activas por defecto en producción:

1. `SKIP_2FA=true` (variable de entorno, `.env`): si está presente, `POST /api/auth/login` crea la sesión directamente tras validar la contraseña, sin pedir TOTP.
2. Cuando `SKIP_2FA` no está activo pero `NODE_ENV !== "production"`, el endpoint de login devuelve `codigoDev` (el código TOTP válido en ese instante) y el frontend lo autocompleta en el campo de código.

## Rationale
Permitir avanzar en la revisión funcional del resto del sistema sin bloquear todo el trabajo en instalar una app autenticadora, sin modificar la regla de negocio BR-010 en sí (el código sigue existiendo e implementado correctamente).

## Consequences
Positive: desbloqueó la revisión de todas las vistas sin fricción.
Negative: si `SKIP_2FA` quedara activo en un entorno real, anularía completamente el segundo factor. Mitigación: la variable no tiene valor por defecto (ausente = 2FA activo), y `codigoDev` nunca se envía en `NODE_ENV=production`. Acción pendiente antes de cualquier despliegue: confirmar que `SKIP_2FA` no esté definido y considerar eliminar el bloque de código si ya no se necesita.
