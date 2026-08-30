# ADR-004 — SQLite en desarrollo local, PostgreSQL en producción

## Context
La máquina de desarrollo no tiene Docker ni PostgreSQL instalados. El MVP necesita poder ejecutarse en local (`npm run dev`) sin dependencias externas para poder probarse de inmediato.

## Decision
Usar SQLite (`prisma/dev.db`) como base de datos de desarrollo local. Producción sigue usando PostgreSQL (cambio de `provider` en `schema.prisma` y de `DATABASE_URL`).

## Rationale
Prisma soporta ambos providers con el mismo modelo de datos declarado en TS-001; el subconjunto de features usado (relaciones, enums vía string+check, índices) es compatible entre ambos. Esto evita instalar y operar un servidor Postgres solo para desarrollo local.

## Consequences
Positive: `npm run dev` funciona sin instalar nada adicional.
Negative: SQLite no soporta enums nativos ni algunos tipos de PostgreSQL — se modelan como `String` con validación en la capa de aplicación. Antes de desplegar a producción, correr `prisma migrate` contra Postgres real y verificar el esquema generado.
