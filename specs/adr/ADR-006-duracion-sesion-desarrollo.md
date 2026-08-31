# ADR-006 — Sesión de 2h en producción, 30 días en desarrollo

## Context
Con la sesión fija en 2 horas (igual en todos los entornos), una sesión de revisión manual larga expiraba a mitad de camino: cualquier navegación después de las 2h mostraba el login de nuevo, indistinguible a simple vista de un bug real (se reportó como "Volver cierra la sesión").

## Decision
`crearSesion` usa `maxAge`/`exp` de 2 horas cuando `NODE_ENV === "production"`, y 30 días en cualquier otro entorno.

## Rationale
2 horas es razonable para un sistema que aprueba movimientos de dinero en producción. Para desarrollo/pruebas manuales, una sesión larga evita falsos positivos de "bug" que en realidad son expiración esperada, sin tocar la política de seguridad real.

## Consequences
Positive: elimina el falso bug de "se cierra la sesión" durante pruebas prolongadas.
Negative: ninguna en producción (la duración de prod no cambió). En desarrollo, una sesión robada de 30 días es más peligrosa que una de 2h — aceptable porque el entorno de desarrollo no maneja datos reales.
