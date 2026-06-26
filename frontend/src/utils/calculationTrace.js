function fmtNumber(value) {
  if (value === null || value === undefined || value === "") return "n/a";
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return number.toLocaleString("fr-FR", { maximumFractionDigits: 4 });
}

function fmtDate(value) {
  if (!value) return "date inconnue";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "date inconnue";
  return date.toLocaleString("fr-FR");
}

export function formatCalculationTrace(row) {
  const source = row.sourceValues ?? {};
  const calculation = row.calculation ?? {};
  const sourceKg = source.kgCO2e ?? row.kgCO2e;
  const calculatedKg = calculation.kgCO2e ?? row.kgCO2e;
  const factor = calculation.factorName ?? row.energie ?? row.facteurEmission ?? "facteur inconnu";
  const calculatedAt = fmtDate(calculation.calculatedAt);

  return `Excel: ${fmtNumber(sourceKg)} kg | Calcul: ${fmtNumber(calculatedKg)} kg | FE: ${factor} | ${calculatedAt}`;
}
