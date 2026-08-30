# ADR-002 — 2FA de clientes vía TOTP, sin 2FA de administrador en MVP

## Context
BR-010 exige un segundo factor de autenticación para clientes. El documento de contexto deja abierto si el administrador también debería tenerlo.

## Decision
Implementar 2FA de clientes con TOTP (app autenticadora, RFC 6238) generado y verificado en el propio sistema. El administrador queda sin 2FA en este MVP.

## Rationale
TOTP no depende de un proveedor externo de SMS (sin costo ni integración adicional) y es suficientemente seguro para el MVP. Excluir 2FA de admin fue una decisión explícita de alcance (Non-Goal en FS-001) para no bloquear la entrega del MVP; el admin es un solo usuario interno de confianza en esta fase.

## Consequences
Positive: no depende de proveedores SMS de pago; implementación autocontenida.
Negative: el rol con mayor impacto financiero (aprobar pagos) queda con un solo factor — riesgo aceptado explícitamente, revisar antes de escalar a más de un administrador.
