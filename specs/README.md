# LuckyHouse (Principal) — Especificaciones (SDD)

Este proyecto sigue el flujo de **Spec-Driven Development** descrito en [`00-GUIA-SDD.md`](./00-GUIA-SDD.md) (guía de referencia del proceso, versionada aquí para el equipo).

## Documento de contexto

[`Principal_Documento_Tecnico.md`](../Principal_Documento_Tecnico.md) (raíz del repo) es el insumo original con el que se armó la spec funcional. Queda ahí sin editar, como referencia histórica.

## Estructura

| Carpeta | Contenido | Regla |
|---|---|---|
| [`functional/`](./functional) | `FS-001` (v1.1) — comportamiento (WHAT), con `FR-XXX`/`BR-XXX`/`AC-XXX` | Sin código |
| [`technical/`](./technical) | `TS-001` (v1.1) — diseño (HOW): arquitectura, stack real, data model, contratos API | Diagramas + pseudocódigo, sin código ejecutable |
| [`adr/`](./adr) | 8 decisiones arquitectónicas registradas (`ADR-001`..`ADR-008`) | — |
| [`tasks/`](./tasks) | `TASK-001` a `TASK-033` — trabajo concreto (WORK) | Pseudocódigo mínimo, sin implementación completa |

Implementación real (CODE) vive en `src/`, `prisma/`, `tests/` — fuera de `/specs`.

## Estado

| Fase | Estado |
|---|---|
| 1. Funcional (`FS-001` v1.1) | ✅ Hecha — E01 a E10 (incluye panel gerencial) |
| 2. Técnica (`TS-001` v1.1 + 8 ADRs) | ✅ Hecha — documenta lo realmente implementado |
| 3. Tasks (`TASK-001..033`) | ✅ Hechas y verificadas end-to-end |
| 4. Implementación | ✅ MVP funcional corriendo en local (`npm run dev`) y desplegado en Vercel (https://luckyhouse-zeta.vercel.app) |

## Alcance implementado más allá del MVP original

Durante la revisión con el usuario se agregó una épica completa (E10 — panel gerencial: KPIs, rankings, exportación a Excel) y varios ajustes de UI/UX (rediseño storefront, marca LuckyHouse, carrusel de promociones, botón de WhatsApp, menú de cuenta). También se registraron 4 desviaciones técnicas respecto al diseño original (ADR-005 a ADR-008): sesión propia en vez de NextAuth, bypass temporal de 2FA en desarrollo, sesión extendida en desarrollo, e imagen placeholder local. Todo documentado en su ADR/TASK correspondiente — nada quedó implementado sin su spec al día.

## Pendiente antes de producción

- ~~Revertir `SKIP_2FA` (ADR-005)~~ — hecho: la variable no se configuró en Vercel (Production/Preview/Development), solo existe en `.env` local.
- **Comprobantes de pago se pierden en producción**: `UPLOAD_DIR` (`./storage/comprobantes`) escribe al filesystem local, que en Vercel es de solo lectura y efímero — el registro de un abono con comprobante probablemente falle o el archivo se pierda. Pendiente migrar a un storage real (Vercel Blob, S3, etc.) antes de usar el flujo de abonos en serio.
- Resolver el vacío de política de mora antes de tratar la columna "Alerta" del reporte como regla de negocio real (FR-023).
- Evaluar el salto a Next 16 / xlsx alternativo por los advisories de seguridad conocidos (ver TS-001, sección Risks).
- Cambiar el número de WhatsApp placeholder por el real del negocio (TASK-025).
- Separar base de datos de desarrollo/staging de la de producción (hoy comparten la misma Neon, ver ADR-004 update 2026-09-06).
