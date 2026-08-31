# ADR-001 — Stack: Next.js monolito full-stack

## Context
El MVP necesita frontend mobile-first y backend con lógica de negocio (planes, pagos, auditoría) entregado rápido, sin equipo dedicado a infraestructura.

## Decision
Usar Next.js 14 (App Router) con TypeScript como monolito: páginas + API routes en el mismo proyecto. Prisma como ORM. Tailwind CSS para estilos.

## Rationale
Un solo repo/proceso reduce superficie operativa. Next.js da SSR/SSG mobile-first de fábrica y Route Handlers cubren la necesidad de backend sin levantar un servicio aparte.

## Consequences
Positive: menor tiempo de entrega, un solo despliegue, tipado compartido entre frontend y backend.
Negative: acopla frontend y backend; una migración a servicios separados en el futuro requerirá extraer la capa de application/use cases.
