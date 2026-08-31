import { AdminShell } from "@/components/admin/AdminShell";
import { KpiCard } from "@/components/admin/KpiCard";
import { PlanesPorEstadoChart, AbonosPorDiaChart } from "@/components/admin/DashboardCharts";
import { TopList } from "@/components/admin/TopList";
import {
  calcularKpis,
  planesPorEstado,
  topProductos,
  topCategorias,
  topClientes,
  abonosPorDia,
} from "@/lib/admin/reportes";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [kpis, porEstado, productos, categorias, clientes, porDia] = await Promise.all([
    calcularKpis(),
    planesPorEstado(),
    topProductos(10),
    topCategorias(10),
    topClientes(10),
    abonosPorDia(),
  ]);

  return (
    <AdminShell title="Dashboard">
      <div className="flex justify-end mb-4">
        <a
          href="/api/admin/reportes/planes"
          className="rounded-lg bg-cta hover:bg-cta-hover text-white text-sm px-4 py-2 font-medium"
        >
          Descargar Excel (planes)
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Planes activos" value={kpis.planesActivos} />
        <KpiCard label="Próximos a entregar" value={kpis.proximosAEntregar} tone="warning" />
        <KpiCard label="En proceso de entrega" value={kpis.enProcesoEntrega} />
        <KpiCard label="Entregados" value={kpis.entregados} tone="success" />
        <KpiCard label="Pagos aprobados" value={kpis.abonosAprobados} tone="success" />
        <KpiCard label="Pagos rechazados" value={kpis.abonosRechazados} tone="danger" />
        <KpiCard label="Por revisar" value={kpis.abonosPorRevisar} tone="warning" />
        <KpiCard label="Planes cancelados" value={kpis.cancelados} tone="danger" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <KpiCard label="Recaudo total (aprobado)" value={`$${kpis.recaudoTotal.toLocaleString("es-CO")}`} tone="success" />
        <KpiCard label="Cartera pendiente (activos)" value={`$${kpis.carteraPendiente.toLocaleString("es-CO")}`} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-sm font-semibold mb-2">Planes por estado</h2>
          <PlanesPorEstadoChart datos={porEstado} />
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-sm font-semibold mb-2">Pagos aprobados vs. rechazados (últimos 14 días)</h2>
          <AbonosPorDiaChart datos={porDia} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-sm font-semibold mb-2">Top 10 productos</h2>
          <TopList items={productos.map((p) => ({ nombre: p.producto, valor: p.cantidad }))} />
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-sm font-semibold mb-2">Top 10 categorías</h2>
          <TopList items={categorias.map((c) => ({ nombre: c.categoria, valor: c.cantidad }))} />
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-sm font-semibold mb-2">Top 10 clientes (por # de planes)</h2>
          <TopList items={clientes.map((c) => ({ nombre: c.cliente, valor: c.planes }))} />
        </div>
      </div>

      <p className="text-xs text-ink-secondary">
        La columna &quot;Alerta&quot; del Excel es un indicador informativo (30+ días sin abono en un plan activo),
        no una política de mora definida — ver vacío pendiente en la spec funcional.
      </p>
    </AdminShell>
  );
}
