import { prisma } from "@/lib/db";

const UN_DIA_MS = 1000 * 60 * 60 * 24;

export async function calcularKpis() {
  const [
    planesActivos,
    proximosAEntregar,
    entregados,
    cancelados,
    enProcesoEntrega,
    abonosAprobados,
    abonosRechazados,
    abonosPorRevisar,
    recaudo,
    carteraPendiente,
  ] = await Promise.all([
    prisma.plan.count({ where: { estado: "ACTIVO" } }),
    prisma.plan.count({ where: { estado: "PENDIENTE_DE_ENTREGA" } }),
    prisma.plan.count({ where: { estado: "ENTREGADO" } }),
    prisma.plan.count({ where: { estado: "CANCELADO" } }),
    prisma.entrega.count({ where: { estadoEntrega: { in: ["PENDIENTE_DE_PREPARACION", "PREPARADO", "DESPACHADO"] } } }),
    prisma.abono.count({ where: { estado: "APROBADO" } }),
    prisma.abono.count({ where: { estado: "RECHAZADO" } }),
    prisma.abono.count({ where: { estado: { in: ["PENDIENTE", "EN_REVISION"] } } }),
    prisma.abono.aggregate({ where: { estado: "APROBADO" }, _sum: { valor: true } }),
    prisma.plan.aggregate({ where: { estado: "ACTIVO" }, _sum: { saldoPendiente: true } }),
  ]);

  return {
    planesActivos,
    proximosAEntregar,
    entregados,
    cancelados,
    enProcesoEntrega,
    abonosAprobados,
    abonosRechazados,
    abonosPorRevisar,
    recaudoTotal: recaudo._sum.valor ?? 0,
    carteraPendiente: carteraPendiente._sum.saldoPendiente ?? 0,
  };
}

export async function planesPorEstado() {
  const grupos = await prisma.plan.groupBy({ by: ["estado"], _count: { estado: true } });
  return grupos.map((g) => ({ estado: g.estado, cantidad: g._count.estado }));
}

export async function topProductos(limite = 10) {
  const grupos = await prisma.plan.groupBy({
    by: ["productoId"],
    _count: { productoId: true },
    orderBy: { _count: { productoId: "desc" } },
    take: limite,
  });
  const productos = await prisma.producto.findMany({ where: { id: { in: grupos.map((g) => g.productoId) } } });
  return grupos.map((g) => ({
    producto: productos.find((p) => p.id === g.productoId)?.nombre ?? "—",
    cantidad: g._count.productoId,
  }));
}

export async function topCategorias(limite = 10) {
  const planes = await prisma.plan.findMany({ select: { producto: { select: { categoria: true } } } });
  const conteo = new Map<string, number>();
  for (const p of planes) {
    const cat = p.producto.categoria;
    conteo.set(cat, (conteo.get(cat) ?? 0) + 1);
  }
  return Array.from(conteo.entries())
    .map(([categoria, cantidad]) => ({ categoria, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, limite);
}

export async function topClientes(limite = 10) {
  const grupos = await prisma.plan.groupBy({
    by: ["clienteId"],
    _count: { clienteId: true },
    _sum: { totalPagado: true },
    orderBy: { _count: { clienteId: "desc" } },
    take: limite,
  });
  const clientes = await prisma.cliente.findMany({ where: { id: { in: grupos.map((g) => g.clienteId) } } });
  return grupos.map((g) => ({
    cliente: clientes.find((c) => c.id === g.clienteId)?.nombreCompleto ?? "—",
    planes: g._count.clienteId,
    totalPagado: g._sum.totalPagado ?? 0,
  }));
}

export async function abonosPorDia(dias = 14) {
  const desde = new Date(Date.now() - dias * UN_DIA_MS);
  const abonos = await prisma.abono.findMany({
    where: { fechaResolucion: { gte: desde }, estado: { in: ["APROBADO", "RECHAZADO"] } },
    select: { fechaResolucion: true, estado: true },
  });

  const porDia = new Map<string, { fecha: string; aprobados: number; rechazados: number }>();
  for (let i = dias - 1; i >= 0; i--) {
    const key = new Date(Date.now() - i * UN_DIA_MS).toISOString().slice(0, 10);
    porDia.set(key, { fecha: key, aprobados: 0, rechazados: 0 });
  }
  for (const a of abonos) {
    if (!a.fechaResolucion) continue;
    const key = a.fechaResolucion.toISOString().slice(0, 10);
    const bucket = porDia.get(key);
    if (!bucket) continue;
    if (a.estado === "APROBADO") bucket.aprobados++;
    else bucket.rechazados++;
  }
  return Array.from(porDia.values());
}

// Filas para exportación — ver specs/functional/FS-001 sección 8 ("Plazo del
// plan y mora"): el MVP no define una política de mora. "alerta" es un
// heurístico informativo (30 días sin abono en plan ACTIVO), no una regla
// de negocio validada; debe tratarse como referencia, no como mora real.
export async function filasReportePlanes() {
  const planes = await prisma.plan.findMany({
    include: {
      cliente: true,
      producto: true,
      abonos: { where: { estado: "APROBADO" }, orderBy: { fechaResolucion: "desc" }, take: 1 },
    },
    orderBy: { fechaCreacion: "desc" },
  });

  return planes.map((plan, index) => {
    const ultimoAbono = plan.abonos[0];
    const diasSinAbono = ultimoAbono?.fechaResolucion
      ? Math.floor((Date.now() - ultimoAbono.fechaResolucion.getTime()) / UN_DIA_MS)
      : null;

    let alerta = "Sin abonos aún";
    if (plan.estado !== "ACTIVO") {
      alerta = "N/A";
    } else if (diasSinAbono !== null) {
      alerta = diasSinAbono <= 30 ? "Al día" : "Revisar (30+ días sin abono)";
    }

    return {
      item: index + 1,
      planId: plan.id,
      fechaCreacion: plan.fechaCreacion,
      cliente: plan.cliente.nombreCompleto,
      correoCliente: plan.cliente.correo,
      producto: plan.producto.nombre,
      valorTotal: plan.valorTotal,
      totalPagado: plan.totalPagado,
      saldoPendiente: plan.saldoPendiente,
      estadoPlan: plan.estado,
      fechaUltimoAbono: ultimoAbono?.fechaResolucion ?? null,
      diasSinAbono,
      alerta,
    };
  });
}
