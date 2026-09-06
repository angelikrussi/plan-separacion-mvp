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

## Update (2026-09-06) — Migrado a Postgres también en desarrollo

Al desplegar a Vercel se creó una base Postgres serverless en Neon (vía integración Neon del marketplace de Vercel, proyecto `luckyhouse`). En vez de mantener dos providers (SQLite local / Postgres prod), se simplificó a **un solo provider Postgres para ambos entornos**: `prisma/schema.prisma` ahora declara `provider = "postgresql"` con `url` (conexión pooled, runtime) y `directUrl` (conexión directa, para `prisma migrate`) — patrón recomendado por Prisma+Neon en Vercel. La migración `20260830202953_init` (SQLite) se eliminó y se regeneró como `20260906214511_init_postgres` contra Neon.

Consecuencia práctica: desarrollo local y producción comparten la misma base de datos Neon (no hay entorno de dev aislado todavía). `prisma/dev.db` queda en desuso. Variables `DATABASE_URL`/`DIRECT_URL` en `.env` (local, gitignored) y en Vercel (Production/Preview/Development) apuntan a Neon. Pendiente futuro: separar una base de desarrollo/staging si el equipo crece.
