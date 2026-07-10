/**
 * Calcul des émissions (kg CO₂e) à partir des lignes importées.
 * Priorité : kgCO₂e calculé > quantité × FE > montant × FE monétaire ADEME > transport.
 */

const TRANSPORT_FE_TONNE_KM = {
  camion: 0.102,
  avion: 0.602,
  default: 0.102,
};

/** Facteurs monétaires ADEME approximatifs (kg CO₂e / €) par libellé de catégorie. */
const SPEND_FACTORS_KG_PER_EUR = [
  { match: /métaux|metaux/i, factor: 0.98 },
  { match: /produits métalliques|produits metalliques/i, factor: 0.55 },
  { match: /plastiques/i, factor: 0.75 },
  { match: /minéraux|mineraux/i, factor: 0.45 },
  { match: /chimiques/i, factor: 0.65 },
  { match: /textile/i, factor: 0.4 },
  { match: /machines/i, factor: 0.35 },
  { match: /bois/i, factor: 0.25 },
  { match: /informatiques|électroniques|electroniques/i, factor: 0.3 },
  { match: /services/i, factor: 0.2 },
  { match: /papier/i, factor: 0.35 },
];

const DEFAULT_SPEND_FACTOR = 0.5;

export function resolveKgCO2e(row) {
  const fromCalc = number(row?.calculation?.kgCO2e);
  if (fromCalc > 0) return fromCalc;

  const direct = number(row?.kgCO2e);
  if (direct > 0) return direct;

  return 0;
}

export function emissionKg(row, datasetKey, factorIndex = null) {
  const resolved = resolveKgCO2e(row);
  if (resolved > 0) return resolved;

  if (datasetKey === "achats_biens") {
    return achatsProductionKg(row, factorIndex);
  }

  if (datasetKey === "achats_biens_transport") {
    return achatsTransportKg(row);
  }

  if (datasetKey === "sous_traitance" || datasetKey === "achats_services") {
    return spendEmissionKg(row, factorIndex);
  }

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
    const multiplier = String(row.unite ?? "").toLowerCase() === "t" ? 1000 : 1;
    return number(row.quantite) * multiplier;
  }

  if (datasetKey === "transport_aval") {
    return number(row.quantite) * Math.max(number(row.distanceKm), 1);
  }

  if (datasetKey === "energie" || datasetKey === "clim") {
    const fe = number(row.feKgCO2eUnite);
    const qty = number(row.quantite);
    if (fe > 0 && qty > 0) return qty * fe;
  }

  return spendEmissionKg(row, factorIndex);
}

export function achatsProductionKg(row, factorIndex = null) {
  const resolved = resolveKgCO2e(row);
  if (resolved > 0) return resolved;

  const fe = number(row.feKgCO2eUnite);
  const qty = number(row.quantite);
  if (fe > 0 && qty > 0) {
    const basis = String(row.calculation?.factorUnit ?? row.unite ?? "").toLowerCase();
    if (basis.includes("eur") || basis.includes("€")) {
      return number(row.montantEuro) * fe;
    }
    if (basis.includes("tonne")) {
      return quantityInTonnes(row) * fe;
    }
    if (basis.includes("/kg") || basis === "kg") {
      const unite = String(row.unite ?? "").toLowerCase();
      const kg = unite === "kg" ? qty : qty * 1000;
      return kg * fe;
    }
    return qty * fe;
  }

  const matched = matchFactor(row, factorIndex);
  if (matched && qty > 0) {
    return qty * number(matched.factor_kg_co2e);
  }

  return spendEmissionKg(row, factorIndex);
}

export function achatsTransportKg(row) {
  const fromRow = number(row.transportKgCO2e);
  if (fromRow > 0) return fromRow;

  const tonnes = quantityInTonnes(row);
  const distance = number(row.distanceFournisseur);
  if (tonnes <= 0 || distance <= 0) return 0;

  const mode = String(row.moyenTransport ?? "").toLowerCase();
  const feTkm = mode.includes("avion") ? 0.602 : 0.102;
  return tonnes * distance * feTkm;
}

export function spendEmissionKg(row, factorIndex = null) {
  const montant = number(row.montantEuro);
  if (montant <= 0) return 0;

  const matched = matchFactor(row, factorIndex);
  if (matched) return montant * number(matched.factor_kg_co2e);

  const spendFe = matchSpendFactor(row.facteurEmission);
  return montant * spendFe;
}

export function buildFactorIndex(factors = []) {
  const list = Array.isArray(factors) ? factors : (factors?.factors ?? []);
  return list
    .filter((factor) => factor?.is_active !== false)
    .map((factor) => ({
      ...factor,
      key: String(factor.name ?? "").trim().toLowerCase(),
      sourceKey: String(factor.source ?? "").trim().toLowerCase(),
    }));
}

function matchFactor(row, factorIndex) {
  if (!Array.isArray(factorIndex) || factorIndex.length === 0) return null;

  const candidates = [
    row.facteurEmission,
    row.energie,
    row.nomDechet,
    row.modeTraitement,
    row.moyenDeplacement,
    row.typePrestation,
  ]
    .map((value) => String(value ?? "").trim().toLowerCase())
    .filter(Boolean);

  for (const candidate of candidates) {
    const exact = factorIndex.find(
      (factor) => factor.key === candidate || factor.sourceKey === candidate,
    );
    if (exact) return exact;

    const partial = factorIndex.find(
      (factor) =>
        (factor.key && (factor.key.includes(candidate) || candidate.includes(factor.key))) ||
        (factor.sourceKey &&
          (factor.sourceKey.includes(candidate) || candidate.includes(factor.sourceKey))),
    );
    if (partial) return partial;
  }

  return null;
}

function matchSpendFactor(label) {
  const text = String(label ?? "");
  const rule = SPEND_FACTORS_KG_PER_EUR.find((entry) => entry.match.test(text));
  return rule?.factor ?? DEFAULT_SPEND_FACTOR;
}

function quantityInTonnes(row) {
  const qty = number(row.quantite);
  const unite = String(row.unite ?? "").toLowerCase().trim();
  if (!qty) return 0;
  if (unite === "kg") return qty / 1000;
  if (unite === "t" || unite.includes("tonne")) return qty;
  return 0;
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
