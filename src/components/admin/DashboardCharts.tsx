"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORES_ESTADO: Record<string, string> = {
  ACTIVO: "#0F5843",
  COMPLETAMENTE_PAGADO: "#2F8067",
  PENDIENTE_DE_ENTREGA: "#D99A22",
  ENTREGADO: "#208A5A",
  CANCELADO: "#C94343",
};

const ESTADO_LABEL: Record<string, string> = {
  ACTIVO: "Activo",
  COMPLETAMENTE_PAGADO: "Pagado",
  PENDIENTE_DE_ENTREGA: "Por entregar",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export function PlanesPorEstadoChart({ datos }: { datos: { estado: string; cantidad: number }[] }) {
  const data = datos.map((d) => ({ name: ESTADO_LABEL[d.estado] ?? d.estado, value: d.cantidad, estado: d.estado }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((d) => (
            <Cell key={d.estado} fill={COLORES_ESTADO[d.estado] ?? "#5F6F68"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AbonosPorDiaChart({
  datos,
}: {
  datos: { fecha: string; aprobados: number; rechazados: number }[];
}) {
  const data = datos.map((d) => ({ ...d, fecha: d.fecha.slice(5) }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#DCE5E0" />
        <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="aprobados" stroke="#208A5A" strokeWidth={2} name="Aprobados" />
        <Line type="monotone" dataKey="rechazados" stroke="#C94343" strokeWidth={2} name="Rechazados" />
      </LineChart>
    </ResponsiveContainer>
  );
}
