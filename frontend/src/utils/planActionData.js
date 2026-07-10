import { getDataset, listAvailableDatasets, listEmissionFactors, listImports } from "../services/api.js";
import {
  achatsProductionKg,
  achatsTransportKg,
  buildFactorIndex,
  emissionKg,
} from "./emissionCalculator.js";

const PIE_COLORS = {
  "Achats de biens": "#3b82f6",
  "Sous-traitance": "#0ea5e9",
  "Transport amont": "#22c55e",
  "Transport aval": "#64748b",
  "Achats de services": "#ec4899",
  "Sources mobiles": "#f59e0b",
  Autres: "#94a3b8",
};

const FLUX_RULES = {
  achats: [
    { label: "Tube", match: /tube|tuyau/i },
    { label: "Robinetterie", match: /robinet|vanne|robinetterie/i },
    { label: "Internes", match: /interne|metauxdapport|joint/i },
  ],
  sousTraitance: [
    { label: "GC VRD", match: /gc[\s-]*vrd/i },
    { label: "Travaux EIA", match: /travaux eia/i },
    { label: "STC", match: /chaudronnerie|stc/i },
  ],
  transportAmont: [
    { label: "Fouratch", match: /fouratch/i },
    { label: "Fitting", match: /fitting|raccord/i },
    { label: "Bride", match: /bride/i },
  ],
};

const DEFAULT_ACTIONS = [
  { id: 1, domaine: "Achats de biens", action: "Optimiser les achats de tubes et réduire les surstocks", gainAnnuel: 420 },
  { id: 2, domaine: "Achats de biens", action: "Sélectionner des fournisseurs à faible distance", gainAnnuel: 310 },
  { id: 3, domaine: "Sous-traitance", action: "Mutualiser les prestations GC VRD entre sites", gainAnnuel: 280 },
  { id: 4, domaine: "Sous-traitance", action: "Intégrer des critères carbone dans les appels d'offres", gainAnnuel: 195 },
  { id: 5, domaine: "Transport amont", action: "Regrouper les livraisons fournisseurs", gainAnnuel: 165 },
  { id: 6, domaine: "Énergie", action: "Piloter la consommation des procédés énergivores", gainAnnuel: 140 },
  { id: 7, domaine: "Climatisation", action: "Remplacer les fluides frigorigènes à fort GWP", gainAnnuel: 120 },
  { id: 8, domaine: "Déplacements", action: "Développer le covoiturage domicile-travail", gainAnnuel: 85 },
  { id: 9, domaine: "Achats de services", action: "Limiter les prestations à faible valeur ajoutée", gainAnnuel: 70 },
  { id: 10, domaine: "Déchets", action: "Augmenter le taux de valorisation des déchets", gainAnnuel: 45 },
];

const REPORT_FALLBACK = {
  period: "01/04/2022 au 31/03/2023",
  totalTCO2e: 15907.09,
  kgPerKeur: 864.52,
  tPerEmployee: 209.3,
  kgPerHour: 112.94,
  equivalences: {
    worldFlights: 1985,
    dieselLiters: 5957711,
    frenchAnnual: 1591,
  },
  pie: [
    { name: "Achats de biens", value: 49 },
    { name: "Sous-traitance", value: 19.1 },
    { name: "Transport amont", value: 14 },
    { name: "Transport aval", value: 6.1 },
    { name: "Achats de services", value: 4.8 },
    { name: "Sources mobiles", value: 2.6 },
    { name: "Autres", value: 4.4 },
  ],
  topPostes: [
    {
      title: "Achats de biens",
      percent: 49,
      tCO2e: 7793.67,
      flux: ["Tube", "Robinetterie", "Internes"],
      fluxKey: "achats",
    },
    {
      title: "Sous-traitance",
      percent: 19.1,
      tCO2e: 3039.62,
      flux: ["GC VRD", "Travaux EIA", "STC"],
      fluxKey: "sousTraitance",
    },
    {
      title: "Transport amont",
      percent: 14,
      tCO2e: 2226.99,
      flux: ["Fouratch", "Fitting", "Bride"],
      fluxKey: "transportAmont",
    },
  ],
  fluxCharts: {
    achats: [
      { label: "Tube", value: 3200 },
      { label: "Robinetterie", value: 2800 },
      { label: "Internes", value: 1793 },
    ],
    sousTraitance: [
      { label: "GC VRD", value: 1200 },
      { label: "Travaux EIA", value: 980 },
      { label: "STC", value: 860 },
    ],
    transportAmont: [
      { label: "Fouratch", value: 1100 },
      { label: "Fitting", value: 720 },
      { label: "Bride", value: 407 },
    ],
  },
  target2030: -24.6,
};

const DATASET_KEYS = [
  { key: "achats_biens", label: "Achats de biens" },
  { key: "sous_traitance", label: "Sous-traitance" },
  { key: "achats_services", label: "Achats de services" },
  { key: "transport_aval", label: "Transport aval" },
  { key: "deplacements_pro", label: "Déplacements professionnels" },
  { key: "deplacements_dt", label: "Déplacements domicile-travail" },
  { key: "energie", label: "Énergie et Process" },
  { key: "clim", label: "Clim" },
  { key: "dechets", label: "Déchets" },
  { key: "biens_immobilises", label: "Biens immobilisés" },
];

const KNOWN_SITES = ["Arthez", "Palplast", "Pontonx", "Infautelec"];

/** Charge toutes les données brutes pour les 3 vues du plan d'action. */
export async function loadPlanActionRawData() {
  const [availableInfo, factors, importsPayload] = await Promise.all([
    listAvailableDatasets(),
    listEmissionFactors(),
    listImports(),
  ]);

  const available = availableInfo?.available ?? null;
  const fetchDataset = (name) => {
    if (Array.isArray(available) && !available.includes(name)) {
      return Promise.resolve(null);
    }
    return getDataset(name);
  };

  const datasetEntries = await Promise.all(
    DATASET_KEYS.map(async ({ key }) => [key, await fetchDataset(key)]),
  );
  const datasets = Object.fromEntries(datasetEntries);
  const hasData = Object.values(datasets).some((rows) => Array.isArray(rows) && rows.length > 0);

  const factorList = Array.isArray(factors)
    ? factors
    : Array.isArray(factors?.factors)
      ? factors.factors
      : [];

  const imports = importsPayload?.imports ?? [];
  const latestImport = imports[0] ?? null;

  return {
    hasData,
    fallback: REPORT_FALLBACK,
    datasets,
    factorIndex: buildFactorIndex(factorList),
    imports,
    latestImport,
    period: REPORT_FALLBACK.period,
    years: buildYearOptions(imports),
    sites: buildSiteOptions(datasets),
  };
}

/** Construit la vue synthèse (globale, ou filtrée par site / année). */
export function buildPlanActionView(raw, filters = {}) {
  if (!raw?.hasData) {
    return buildFallbackView(raw?.fallback ?? REPORT_FALLBACK);
  }

  const { site = "", year = "" } = filters;
  let datasets = raw.datasets;

  if (site) {
    datasets = filterDatasetsBySite(datasets, site);
  }

  const importForYear = resolveImportForYear(raw.imports, year);
  const period = year
    ? formatYearLabel(year, importForYear)
    : raw.period;

  const view = computePlanView(datasets, raw.factorIndex, { period });
  const hasRows = Object.values(datasets).some((rows) => Array.isArray(rows) && rows.length > 0);

  if (!hasRows) {
    return {
      ...view,
      totalTCO2e: 0,
      kgPerKeur: null,
      tPerEmployee: 0,
      kgPerHour: 0,
      equivalences: buildEquivalences(0),
      pie: [],
      topPostes: [],
      fluxCharts: { achats: [], sousTraitance: [], transportAmont: [] },
      actions: [],
      isLive: true,
      isEmpty: true,
      kpiHelper: site ? `Aucune donnée pour ${site}` : "Aucune donnée",
    };
  }

  const filterBits = [site, year].filter(Boolean);
  return {
    ...view,
    isLive: true,
    isEmpty: false,
    kpiHelper: filterBits.length
      ? `Filtre : ${filterBits.join(" · ")}`
      : "Toutes catégories confondues",
    actions: view.actions.map((row) => formatPlanActionRow(row)),
  };
}

/** Vue détail du fichier importé. */
export function buildPlanDetailView(raw) {
  if (!raw?.hasData) {
    return { importMeta: null, breakdown: [], topItems: [] };
  }

  const view = computePlanView(raw.datasets, raw.factorIndex, { period: raw.period });
  const latest = raw.latestImport;
  const sites = collectSites(raw.datasets);

  const breakdown = DATASET_KEYS.map(({ key, label }) => {
    const rows = raw.datasets[key] ?? [];
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const kg = datasetEmissionKg(rows, key, raw.factorIndex);
    return {
      key,
      label,
      rows: rows.length,
      tCO2e: kg / 1000,
      percent: view.totalTCO2e > 0 ? round((kg / 1000 / view.totalTCO2e) * 100, 1) : 0,
    };
  }).filter(Boolean);

  const topItems = buildTopItems(raw.datasets, raw.factorIndex);

  return {
    importMeta: latest
      ? {
          filename: latest.filename,
          createdAtDisplay: formatImportDate(latest.created_at),
          totalRows: latest.total_rows ?? 0,
          datasetCount: latest.dataset_count ?? breakdown.length,
          totalTCO2e: view.totalTCO2e,
          sitesCount: sites.length,
        }
      : {
          filename: "Import en cours",
          createdAtDisplay: "—",
          totalRows: breakdown.reduce((s, r) => s + r.rows, 0),
          datasetCount: breakdown.length,
          totalTCO2e: view.totalTCO2e,
          sitesCount: sites.length,
        },
    breakdown,
    topItems,
  };
}

export async function loadPlanActionData() {
  const raw = await loadPlanActionRawData();
  if (!raw.hasData) return { hasData: false, fallback: REPORT_FALLBACK };
  return { hasData: true, ...buildPlanActionView(raw) };
}

function computePlanView(datasets, factorIndex, meta = {}) {

  const achatsRows = datasets.achats_biens ?? [];
  const sousTraitance = datasets.sous_traitance ?? [];
  const achatsServices = datasets.achats_services ?? [];
  const transportAval = datasets.transport_aval ?? [];
  const deplacementsPro = datasets.deplacements_pro ?? [];
  const deplacementsDt = datasets.deplacements_dt ?? [];
  const energie = datasets.energie ?? [];
  const clim = datasets.clim ?? [];
  const dechets = datasets.dechets ?? [];
  const biensImmobilises = datasets.biens_immobilises ?? [];

  const categoryWeights = {
    "Achats de biens": sumRows(achatsRows, "achats_biens", factorIndex, achatsProductionKg),
    "Sous-traitance": sumEmission(sousTraitance, "sous_traitance", factorIndex),
    "Transport amont": sumRows(achatsRows, "achats_biens_transport", factorIndex, achatsTransportKg),
    "Transport aval": sumEmission(transportAval, "transport_aval", factorIndex),
    "Achats de services": sumEmission(achatsServices, "achats_services", factorIndex),
    "Sources mobiles":
      sumEmission(deplacementsPro, "deplacements_pro", factorIndex) +
      sumEmission(deplacementsDt, "deplacements_dt", factorIndex),
    Autres:
      sumEmission(energie, "energie", factorIndex) +
      sumEmission(clim, "clim", factorIndex) +
      sumEmission(dechets, "dechets", factorIndex) +
      sumEmission(biensImmobilises, "biens_immobilises", factorIndex),
  };

  const totalWeight = Object.values(categoryWeights).reduce((sum, value) => sum + value, 0) || 1;
  const totalKg = Object.values(categoryWeights).reduce((sum, value) => sum + value, 0);
  const totalTCO2e = totalKg / 1000;

  const pie = Object.entries(categoryWeights)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value: round((value / totalWeight) * 100, 1),
      color: PIE_COLORS[name] ?? "#64748b",
      kgCO2e: value,
    }))
    .sort((a, b) => b.value - a.value);

  const topKeys = ["Achats de biens", "Sous-traitance", "Transport amont"];
  const topPostes = topKeys.map((title) => {
    const weight = categoryWeights[title] ?? 0;
    const percent = round((weight / totalWeight) * 100, 1);
    const fluxKey =
      title === "Achats de biens"
        ? "achats"
        : title === "Sous-traitance"
          ? "sousTraitance"
          : "transportAmont";
    const sourceRows =
      title === "Sous-traitance" ? (sousTraitance ?? []) : achatsRows;
    const flux = FLUX_RULES[fluxKey].map((rule) => rule.label);
    const computeFn =
      title === "Transport amont"
        ? achatsTransportKg
        : title === "Achats de biens"
          ? achatsProductionKg
          : null;

    return {
      title,
      percent,
      tCO2e: weight / 1000,
      flux,
      fluxKey,
      fluxChart: buildFluxChart(
        sourceRows,
        fluxKey,
        title === "Sous-traitance" ? "typePrestation" : "famille",
        factorIndex,
        computeFn,
        title === "Sous-traitance" ? "sous_traitance" : "achats_biens",
      ),
    };
  });

  const totalMontantKeur =
    [...achatsRows, ...(sousTraitance ?? []), ...(achatsServices ?? [])].reduce(
      (sum, row) => sum + number(row.montantEuro),
      0,
    ) / 1000;

  const fluxCharts = {
    achats: topPostes.find((p) => p.fluxKey === "achats")?.fluxChart ?? [],
    sousTraitance: topPostes.find((p) => p.fluxKey === "sousTraitance")?.fluxChart ?? [],
    transportAmont: topPostes.find((p) => p.fluxKey === "transportAmont")?.fluxChart ?? [],
  };

  const actions = DEFAULT_ACTIONS.map((action) => ({
    ...action,
    gainAnnuel: scaleGain(action.gainAnnuel, totalTCO2e, REPORT_FALLBACK.totalTCO2e),
  }));

  return {
    period: meta.period ?? REPORT_FALLBACK.period,
    totalTCO2e,
    kgPerKeur: totalMontantKeur > 0 ? round(totalKg / totalMontantKeur, 2) : null,
    tPerEmployee: round(totalTCO2e / 76, 2),
    kgPerHour: round(totalKg / (76 * 1607), 2),
    equivalences: buildEquivalences(totalTCO2e),
    pie,
    topPostes,
    fluxCharts,
    target2030: REPORT_FALLBACK.target2030,
    actions,
  };
}

function buildFluxChart(
  rows,
  fluxKey,
  groupField = "famille",
  factorIndex,
  computeFn = null,
  datasetKey = "achats_biens",
) {
  const rules = FLUX_RULES[fluxKey];
  const matched = new Set();

  const items = rules.map((rule, index) => {
    const subset = rows.filter((row) => {
      const text = `${row[groupField] ?? ""} ${row.matiereConsommable ?? ""} ${row.typePrestation ?? ""} ${row.societe ?? ""}`;
      return rule.match.test(text);
    });
    subset.forEach((row) => matched.add(row.id ?? row));
    const value = sumRows(subset, datasetKey, factorIndex, computeFn);
    return {
      label: rule.label,
      value: value / 1000,
      color: ["#3b82f6", "#0ea5e9", "#22c55e"][index],
    };
  });

  const others = rows.filter((row) => !matched.has(row.id ?? row));
  const otherValue = sumRows(others, datasetKey, factorIndex, computeFn);
  if (otherValue > 0) {
    items.push({ label: "Autres", value: otherValue / 1000, color: "#94a3b8" });
  }

  return items.filter((item) => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);
}

function buildEquivalences(totalTCO2e) {
  return {
    worldFlights: Math.round(totalTCO2e / 8.01),
    dieselLiters: Math.round((totalTCO2e * 1000) / 2.67),
    frenchAnnual: Math.round(totalTCO2e / 10),
  };
}

function buildFallbackView(fallback) {
  return {
    period: fallback.period,
    totalTCO2e: fallback.totalTCO2e,
    kgPerKeur: fallback.kgPerKeur,
    tPerEmployee: fallback.tPerEmployee,
    kgPerHour: fallback.kgPerHour,
    equivalences: fallback.equivalences,
    pie: fallback.pie.map((item) => ({
      ...item,
      color: PIE_COLORS[item.name] ?? "#64748b",
    })),
    topPostes: fallback.topPostes,
    fluxCharts: fallback.fluxCharts,
    target2030: fallback.target2030,
    actions: DEFAULT_ACTIONS.map((action) => formatPlanActionRow(action)),
    isLive: false,
    isEmpty: false,
  };
}

function filterDatasetsBySite(datasets, site) {
  const normalized = normalizeSite(site);
  const filtered = {};
  for (const [key, rows] of Object.entries(datasets)) {
    if (!Array.isArray(rows)) {
      filtered[key] = rows;
      continue;
    }
    filtered[key] = rows.filter((row) => normalizeSite(row.site) === normalized);
  }
  return filtered;
}

function buildSiteOptions(datasets) {
  const sites = collectSites(datasets);
  return ["", ...sites];
}

function collectSites(datasets) {
  const found = new Set();
  for (const rows of Object.values(datasets)) {
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      const site = normalizeSite(row.site);
      if (site) found.add(site);
    }
  }
  const ordered = KNOWN_SITES.filter((s) => found.has(s));
  for (const site of found) {
    if (!ordered.includes(site)) ordered.push(site);
  }
  return ordered;
}

function buildYearOptions(imports) {
  const years = new Set(["2022-2023"]);
  for (const imp of imports) {
    if (imp?.created_at) {
      years.add(String(new Date(imp.created_at).getFullYear()));
    }
  }
  return ["", ...[...years].sort().reverse()];
}

function resolveImportForYear(imports, year) {
  if (!year || year === "2022-2023") return imports[0] ?? null;
  return imports.find((imp) => {
    if (!imp?.created_at) return false;
    return String(new Date(imp.created_at).getFullYear()) === year;
  }) ?? imports[0] ?? null;
}

function formatYearLabel(year, importRow) {
  if (year === "2022-2023") return REPORT_FALLBACK.period;
  if (importRow?.created_at) {
    return `Exercice ${year} · import du ${formatImportDate(importRow.created_at)}`;
  }
  return `Exercice ${year}`;
}

function formatImportDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function normalizeSite(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return "";
  if (raw.includes("arthez")) return "Arthez";
  if (raw.includes("palplast") || raw.includes("palpalst")) return "Palplast";
  if (raw.includes("pontonx")) return "Pontonx";
  if (raw.includes("infautelec")) return "Infautelec";
  return String(value ?? "").trim();
}

function datasetEmissionKg(rows, key, factorIndex) {
  if (key === "achats_biens") {
    return (
      sumRows(rows, "achats_biens", factorIndex, achatsProductionKg) +
      sumRows(rows, "achats_biens_transport", factorIndex, achatsTransportKg)
    );
  }
  return sumEmission(rows, key, factorIndex);
}

function buildTopItems(datasets, factorIndex) {
  const items = [];

  const achats = datasets.achats_biens ?? [];
  groupByField(achats, "famille").forEach(([label, rows]) => {
    if (!label) return;
    const kg = sumRows(rows, "achats_biens", factorIndex, achatsProductionKg);
    if (kg > 0) items.push({ label, dataset: "Achats de biens", tCO2e: kg / 1000 });
  });

  const sous = datasets.sous_traitance ?? [];
  groupByField(sous, "typePrestation").forEach(([label, rows]) => {
    if (!label) return;
    const kg = sumEmission(rows, "sous_traitance", factorIndex);
    if (kg > 0) items.push({ label, dataset: "Sous-traitance", tCO2e: kg / 1000 });
  });

  const energie = datasets.energie ?? [];
  groupByField(energie, "energie").forEach(([label, rows]) => {
    if (!label) return;
    const kg = sumEmission(rows, "energie", factorIndex);
    if (kg > 0) items.push({ label, dataset: "Énergie", tCO2e: kg / 1000 });
  });

  return items.sort((a, b) => b.tCO2e - a.tCO2e).slice(0, 15);
}

function groupByField(rows, field) {
  const map = new Map();
  for (const row of rows) {
    const key = String(row[field] ?? "").trim() || "Non renseigné";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  return [...map.entries()];
}

function sumEmission(rows, datasetKey, factorIndex) {
  if (!Array.isArray(rows)) return 0;
  return rows.reduce((sum, row) => sum + emissionKg(row, datasetKey, factorIndex), 0);
}

function sumRows(rows, datasetKey, factorIndex, computeFn = null) {
  if (!Array.isArray(rows)) return 0;
  return rows.reduce((sum, row) => {
    if (computeFn) return sum + computeFn(row, factorIndex);
    return sum + emissionKg(row, datasetKey, factorIndex);
  }, 0);
}

function scaleGain(gain, totalTCO2e, referenceTotal) {
  if (!referenceTotal) return gain;
  return Math.max(1, Math.round(gain * (totalTCO2e / referenceTotal)));
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function displayPlanField(row, keys) {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "—";
}

export function formatPlanActionRow(row) {
  return {
    ...row,
    gainDisplay: row.gainDisplay ?? `${formatNumber(row.gainAnnuel, 0)} tCO₂e`,
    budget: displayPlanField(row, ["budget", "Budget"]),
    responsable: displayPlanField(row, ["responsable", "responsables", "Responsable", "Responsables"]),
    etatAvancement: displayPlanField(row, [
      "etatAvancement",
      "etat_avancement",
      "etatAvancementAffaire",
      "statut",
      "Statut",
    ]),
  };
}

export function formatTCO2e(value) {
  return `${value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tCO₂e`;
}

export function formatNumber(value, digits = 2) {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export { REPORT_FALLBACK };
