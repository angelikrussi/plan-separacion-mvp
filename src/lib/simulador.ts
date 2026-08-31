// TASK-008 — cálculo del simulador, redondeo ajustado en la última cuota
// (ver specs/technical/TS-001, sección "Decisiones derivadas de vacíos funcionales").
export function simular(precio: number, cuotas: number) {
  if (cuotas <= 0) {
    throw new Error("INVALID_CUOTAS");
  }
  const valorPorCuota = Math.floor(precio / cuotas);
  const residuo = precio - valorPorCuota * cuotas;
  const cuotaFinal = valorPorCuota + residuo;
  return { valorPorCuota, valorTotal: precio, cuotaFinal, cuotas };
}
