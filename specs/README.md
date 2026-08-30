# Principal — Especificaciones (SDD)

Este proyecto sigue el flujo de **Spec-Driven Development** descrito en [`00-GUIA-SDD.md`](./00-GUIA-SDD.md) (guía de referencia del proceso, versionada aquí para el equipo).

## Documento de contexto

[`Principal_Documento_Tecnico.md`](../Principal_Documento_Tecnico.md) (raíz del repo) es el insumo original con el que se armó la spec funcional. Queda ahí sin editar, como referencia histórica.

## Estructura

| Carpeta | Contenido | Regla |
|---|---|---|
| [`functional/`](./functional) | `FS-001` — comportamiento (WHAT), con `FR-XXX`/`BR-XXX`/`AC-XXX` | Sin código |
| [`technical/`](./technical) | `TS-001` — diseño (HOW): arquitectura, data model, contratos API | Diagramas + pseudocódigo, sin código ejecutable |
| [`adr/`](./adr) | Decisiones arquitectónicas registradas | — |
| [`tasks/`](./tasks) | `TASK-001` a `TASK-023` — trabajo concreto (WORK) | Pseudocódigo mínimo, sin implementación completa |

Implementación real (CODE) vive en `src/`, `prisma/`, `tests/` — fuera de `/specs`.

## Estado

| Fase | Estado |
|---|---|
| 1. Funcional (`FS-001`) | ✅ Hecha |
| 2. Técnica (`TS-001` + 4 ADRs) | ✅ Hecha |
| 3. Tasks (`TASK-001..023`) | ✅ Hecha |
| 4. Implementación | 🔄 En progreso |
