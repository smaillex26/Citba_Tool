import { getDataset } from "../services/api.js";

export const DASHBOARD_EMISSIONS_SERIES = [
  { key: "energie", label: "Énergie & Process", color: "#10b981" },
  { key: "clim", label: "Clim", color: "#14b8a6" },
  { key: "achats_biens", label: "Achats de biens", color: "#3b82f6" },
  { key: "sous_traitance", label: "Sous-traitance", color: "#0ea5e9" },
  { key: "achats_services", label: "Achats de services", color: "#ec4899" },
  { key: "deplacements_pro", label: "Déplacements pro", color: "#f59e0b" },
  { key: "deplacements_dt", label: "Déplacements dom.-trav.", color: "#8b5cf6" },
  { key: "dechets", label: "Déchets", color: "#ef4444" },
  { key: "transport_aval", label: "Transport aval", color: "#64748b" },
];

const SITES = ["Arthez", "Palplast", "Pontonx", "Infautelec"];

export async function loadDashboardEmissions() {
  const entries = await Promise.all(
    DASHBOARD_EMISSIONS_SERIES.map(async (series) => [
      series.key,
      await getDataset(series.key),
    ]),
  );

  const datasets = Object.fromEntries(entries);
  const hasImportedData = entries.some(([, rows]) => Array.isArray(rows) && rows.length > 0);

  if (!hasImportedData) return null;

  return SITES.map((site) => ({
    label: site,
    values: DASHBOARD_EMISSIONS_SERIES.map((series) =>
      sumDatasetForSite(datasets[series.key], site, series.key),
    ),
  }));
}

function sumDatasetForSite(rows, site, datasetKey) {
  if (!Array.isArray(rows)) return 0;
  return rows
    .filter((row) => normalizeSite(row.site) === site)
    .reduce((sum, row) => sum + getEmissionValue(row, datasetKey), 0);
}

function getEmissionValue(row, datasetKey) {
  if (Number.isFinite(Number(row.kgCO2e))) {
    return Number(row.kgCO2e);
  }

  // Tant que tous les FE ne sont pas numériques dans le fichier, ces catégories
  // utilisent le meilleur indicateur disponible pour alimenter le dashboard.
  if (datasetKey === "deplacements_dt") {
    return (
      number(row.distanceDomTravail) *
      number(row.nbAllerRetour) *
      number(row.nbJoursTravailles)
    );
  }

  if (datasetKey === "deplacements_pro") {
    return number(row.kmParAn) + number(row.consomCarburant);
  }

  if (datasetKey === "dechets") {
    const multiplier = String(row.unite).toLowerCase() === "t" ? 1000 : 1;
    return number(row.quantite) * multiplier;
  }

  if (datasetKey === "transport_aval") {
    return number(row.quantite) * Math.max(number(row.distanceKm), 1);
  }

  return number(row.montantEuro) || number(row.quantite);
}

function normalizeSite(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return "";
  if (raw.includes("arthez")) return "Arthez";
  if (raw.includes("palplast") || raw.includes("palpalst")) return "Palplast";
  if (raw.includes("pontonx")) return "Pontonx";
  if (raw.includes("infautelec")) return "Infautelec";
  return value;
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
