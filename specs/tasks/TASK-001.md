# TASK-001 — Scaffold del proyecto

## References
- TS-001, ADR-001, ADR-004

## Objective
Crear el proyecto Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma, con SQLite configurado para desarrollo local.

## Scope
### In Scope
- Inicialización del proyecto, dependencias, configuración de Tailwind, configuración de Prisma con SQLite.
### Out of Scope
- Cualquier modelo de datos (TASK-002).

## Technical Changes
### Files
- `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.js`
- `prisma/schema.prisma` (datasource únicamente)
- `.env` (`DATABASE_URL="file:./dev.db"`)
- `src/app/layout.tsx`, `src/app/page.tsx` (placeholder)

## Behavior
1. Inicializar proyecto Next.js con TypeScript y App Router.
2. Instalar y configurar Tailwind CSS.
3. Instalar Prisma + `@prisma/client`, configurar datasource `sqlite`.
4. Verificar que `npm run dev` levanta un servidor local funcional.

## Constraints
- No agregar librerías de UI pesadas (mantener Tailwind puro para el MVP).

## Acceptance Criteria
- [ ] `npm run dev` levanta el servidor sin errores.
- [ ] La página raíz renderiza sin errores en el navegador.

## Tests
- [ ] N/A (setup)

## Validation
```bash
npm run dev
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Servidor local corriendo.
- [ ] No regression.
