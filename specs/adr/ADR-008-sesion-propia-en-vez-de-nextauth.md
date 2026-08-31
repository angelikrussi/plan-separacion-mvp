# ADR-008 — Sesión propia (jose + cookies) en vez de NextAuth

## Context
TS-001 v1.0 proponía NextAuth (Credentials provider) para autenticación. Al implementar el login de cliente en dos pasos (contraseña → TOTP, FR-002), el modelo de `authorize()` de NextAuth Credentials asume una sola llamada que resuelve la sesión completa, lo que encaja mal con un flujo de dos pasos con estado intermedio (`loginToken` de 5 minutos) y con la necesidad de dos roles de sesión distintos (cliente / administrador) con flujos de login separados.

## Decision
Implementar sesión propia: JWT firmado con `jose` (compatible con el runtime Edge que usa `src/middleware.ts`), guardado en una cookie `httpOnly` (`principal_session`). Un segundo JWT de corta duración (`principal_login_token`) representa el estado "contraseña validada, TOTP pendiente".

## Rationale
`jose` corre tanto en Node como en Edge runtime (necesario porque el middleware que protege rutas corre en Edge). Controlar el signing/verificación directamente da control total sobre el flujo de dos pasos sin pelear contra las convenciones de NextAuth, a costa de reimplementar lo que NextAuth da gratis (CSRF helpers, providers, etc.) — aceptable dado que el MVP solo tiene un provider (credentials) y ningún login social.

## Consequences
Positive: control total del flujo de dos pasos y de los dos roles de sesión; menos dependencias.
Negative: sin las protecciones/convenciones que trae NextAuth de fábrica (rotación de sesión, providers sociales, etc.) — si el producto necesita login social o SSO más adelante, esto se reevalúa.
