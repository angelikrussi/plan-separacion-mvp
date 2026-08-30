# TASK-002 — Schema Prisma, migración inicial y seed

## References
- TS-001 (Data Model), FR-001 a FR-020

## Objective
Definir las 7 entidades del modelo de datos en Prisma, generar la migración inicial y crear un script de seed con productos demo.

## Scope
### In Scope
- `Cliente, Producto, Plan, Abono, Administrador, Entrega, Auditoria` con los campos de TS-001.
- Seed: 3-4 productos (uno con stock limitado, otro ilimitado), 1 administrador demo.
### Out of Scope
- Lógica de negocio (se implementa en tasks posteriores).

## Technical Changes
### Files
- `prisma/schema.prisma`
- `prisma/seed.ts`

## Behavior
1. Declarar los 7 modelos con los campos y relaciones de TS-001 (sección Data Model).
2. Como SQLite no soporta enums nativos (ADR-004), representar `estado` como `String` y validar valores permitidos en la capa de aplicación (no en el schema).
3. Correr `prisma migrate dev` para generar la migración inicial.
4. Escribir seed: productos demo, un administrador con contraseña hasheada.

## Constraints
- Los campos de estado deben documentarse con comentario listando los valores válidos, ya que SQLite no los fuerza.

## Acceptance Criteria
- [ ] `prisma migrate dev` corre sin errores y crea `dev.db`.
- [ ] `prisma db seed` puebla productos y un administrador.
- [ ] `Plan.clienteId`, `Plan.estado`, `Abono.planId`, `Abono.estado` tienen índice.

## Tests
- [ ] N/A (infraestructura de datos)

## Validation
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

## Definition of Done
- [ ] Implementation complete.
- [ ] Seed ejecuta sin errores.
- [ ] Migration revisada.
