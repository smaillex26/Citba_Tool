"""
Facteurs d'émission (Base Carbone ADEME + fournisseurs).
Toutes les valeurs sont en kg CO2e par unité consommée.
Ce fichier sera enrichi au fur et à mesure que de nouvelles
sources/catégories seront intégrées.
"""
import re
from datetime import datetime, timezone

CALCULATION_TRACE_KEYS = (
    "energie",
    "quantite",
    "unite",
    "facteurEmission",
    "feKgCO2eUnite",
    "categorieEmission",
    "scope",
    "kgCO2e",
    "transportKgCO2e",
    "montantEuro",
    "distanceFournisseur",
    "moyenTransport",
    "matiereConsommable",
    "pourcentage",
)

TRANSPORT_FE_TONNE_KM = {
    "camion": 0.102,
    "avion": 0.602,
    "default": 0.102,
}

# Valeurs ADEME (kg CO2e / €) pour les libellés de l'onglet « Facteur d'émission »
# lorsque la colonne FE du fichier Excel est vide.
DEFAULT_FE_REFERENCE: dict[str, dict] = {
    "métaux (aluminium, cuivre, acier, etc.)": {"fe": 0.98, "unit": "kgCO2e/EUR", "basis": "spend"},
    "produits métalliques, sauf machines et équipements": {"fe": 0.55, "unit": "kgCO2e/EUR", "basis": "spend"},
    "plastiques et caoutchouc": {"fe": 0.75, "unit": "kgCO2e/EUR", "basis": "spend"},
    "produit minéraux (ciment, verre, etc.)": {"fe": 0.45, "unit": "kgCO2e/EUR", "basis": "spend"},
    "produits chimiques": {"fe": 0.65, "unit": "kgCO2e/EUR", "basis": "spend"},
    "textile et habillement": {"fe": 0.40, "unit": "kgCO2e/EUR", "basis": "spend"},
    "machines et équipements": {"fe": 0.35, "unit": "kgCO2e/EUR", "basis": "spend"},
    "bois et article en bois": {"fe": 0.25, "unit": "kgCO2e/EUR", "basis": "spend"},
    "produits informatiques, électroniques et optiques": {"fe": 0.30, "unit": "kgCO2e/EUR", "basis": "spend"},
    "services (imprimerie, publicité, architecture et ingénierie, maintenance multi-technique des bâtiments)": {
        "fe": 0.20, "unit": "kgCO2e/EUR", "basis": "spend",
    },
    "papier et carton": {"fe": 0.35, "unit": "kgCO2e/EUR", "basis": "spend"},
    "construction": {"fe": 0.40, "unit": "kgCO2e/EUR", "basis": "spend"},
    "activités de nettoyage": {"fe": 0.25, "unit": "kgCO2e/EUR", "basis": "spend"},
    "entreposage et services auxiliaires des transports": {"fe": 0.30, "unit": "kgCO2e/EUR", "basis": "spend"},
    "assurance, services bancaires, conseil et honoraires": {"fe": 0.20, "unit": "kgCO2e/EUR", "basis": "spend"},
    "activités pour la santé humaine": {"fe": 0.25, "unit": "kgCO2e/EUR", "basis": "spend"},
}


def source_values_snapshot(row: dict) -> dict:
    """Capture les valeurs d'origine avant enrichissement/recalcul."""
    return {
        key: row.get(key)
        for key in CALCULATION_TRACE_KEYS
        if key in row
    }


def attach_calculation_metadata(
    row: dict,
    *,
    source_values: dict | None = None,
    kg_co2e: float | None,
    fe_kg_co2e_unite: float | None,
    factor_name: str | None,
    factor_source: str | None,
    method: str,
    calculated_by: str,
    factor_category: str | None = None,
    factor_scope: str | None = None,
    factor_unit: str | None = None,
) -> dict:
    """Ajoute les métadonnées qui distinguent brut Excel et calcul applicatif."""
    row["sourceValues"] = source_values if source_values is not None else row.get("sourceValues") or source_values_snapshot(row)
    row["calculation"] = {
        "kgCO2e": kg_co2e,
        "feKgCO2eUnite": fe_kg_co2e_unite,
        "factorName": factor_name,
        "factorSource": factor_source,
        "factorCategory": factor_category,
        "factorScope": factor_scope,
        "factorUnit": factor_unit,
        "method": method,
        "calculatedBy": calculated_by,
        "calculatedAt": datetime.now(timezone.utc).isoformat(),
    }
    return row

# Alias d'énergie : variantes d'orthographe → clé exacte dans FACTEURS_ENERGIE
# Permet de tolérer les accents manquants, majuscules, espaces différents, etc.
ENERGIE_ALIASES: dict[str, str] = {
    # Électricité
    "electricite":          "Électricité",
    "electricité":          "Électricité",
    "électricite":          "Électricité",
    "electricity":          "Électricité",
    "elec":                 "Électricité",
    # Gaz naturel
    "gaz naturel":          "Gaz naturel",
    "gaz":                  "Gaz naturel",
    "natural gas":          "Gaz naturel",
    # Propane
    "propane":              "Propane",
    # Butane
    "butane":               "Butane",
    # Gasoil
    "gasoil":               "Gasoil",
    "gas-oil":              "Gasoil",
    "gazole":               "Gasoil",
    "diesel":               "Gasoil",
    # GNR
    "gnr":                  "GNR",
    "gazole non routier":   "GNR",
    # Essence
    "essence":              "Essence",
    "petrol":               "Essence",
    # Fioul
    "fioul":                "Fioul",
    "fuel":                 "Fioul",
    "fuel oil":             "Fioul",
    "fioul domestique":     "Fioul",
    # Eau
    "eau":                  "Eau",
    "water":                "Eau",
    "eau de réseau":        "Eau",
    "eau de reseau":        "Eau",
    # Oxygène
    "oxygène":              "Oxygène",
    "oxygene":              "Oxygène",
    "oxygen":               "Oxygène",
    "o2":                   "Oxygène",
    # Argon
    "argon":                "Argon",
    "ar":                   "Argon",
    # Acétylène
    "acétylène":            "Acétylène",
    "acetylene":            "Acétylène",
    "acétylene":            "Acétylène",
    # Azote
    "azote":                "Azote",
    "nitrogen":             "Azote",
    "n2":                   "Azote",
    # Gaz de mélange
    "ferromaxx 7":          "Ferromaxx 7",
    "ferromaxx7":           "Ferromaxx 7",
    "mison 2":              "Mison 2",
    "mison2":               "Mison 2",
    "corgon 18":            "Corgon 18",
    "corgon18":             "Corgon 18",
    # Climatiseur / frigorigène
    "climatiseur":          "Climatiseur",
    "frigorigène":          "Climatiseur",
    "frigorigene":          "Climatiseur",
    "r410a":                "Climatiseur",
    "r32":                  "Climatiseur",
}


def _normalise_energie(name: str) -> str:
    """Normalise un nom d'énergie en cherchant dans les alias."""
    if not name:
        return name
    key = re.sub(r"\s+", " ", str(name).strip().lower())
    # Correspondance exacte dans le référentiel (casse insensible)
    for ref_key in FACTEURS_ENERGIE:
        if key == ref_key.lower():
            return ref_key
    # Correspondance via alias
    return ENERGIE_ALIASES.get(key, name)


# --- Énergie et fluides de process ---
FACTEURS_ENERGIE: dict[str, dict] = {
    "Électricité": {
        "fe": 0.0599,
        "unite": "kWh",
        "facteurEmission": "Énergie - Électricité réseau",
        "categorieEmission": "Émissions indirectes liées à la consommation d'électricité",
        "scope": "2",
    },
    "Gaz naturel": {
        "fe": 2.202,
        "unite": "m3",
        "facteurEmission": "Énergie - Gaz naturel",
        "categorieEmission": "Combustion stationnaire",
        "scope": "1",
    },
    "Propane": {
        "fe": 1.613,
        "unite": "L",
        "facteurEmission": "Énergie - Propane",
        "categorieEmission": "Combustion stationnaire",
        "scope": "1",
    },
    "Butane": {
        "fe": 1.634,
        "unite": "L",
        "facteurEmission": "Énergie - Butane",
        "categorieEmission": "Combustion stationnaire",
        "scope": "1",
    },
    "Gasoil": {
        "fe": 2.663,
        "unite": "L",
        "facteurEmission": "Énergie - Gasoil",
        "categorieEmission": "Combustion stationnaire",
        "scope": "1",
    },
    "GNR": {
        "fe": 2.663,
        "unite": "L",
        "facteurEmission": "Énergie - GNR",
        "categorieEmission": "Combustion stationnaire",
        "scope": "1",
    },
    "Essence": {
        "fe": 2.289,
        "unite": "L",
        "facteurEmission": "Énergie - Essence",
        "categorieEmission": "Combustion stationnaire",
        "scope": "1",
    },
    "Fioul": {
        "fe": 2.764,
        "unite": "L",
        "facteurEmission": "Énergie - Fioul domestique",
        "categorieEmission": "Combustion stationnaire",
        "scope": "1",
    },
    "Eau": {
        "fe": 0.13,
        "unite": "m3",
        "facteurEmission": "Énergie - Eau de réseau",
        "categorieEmission": "Produits et services achetés",
        "scope": "3 amont",
    },
    "Oxygène": {
        "fe": 0.315,
        "unite": "m3",
        "facteurEmission": "Gaz industriel - Oxygène",
        "categorieEmission": "Produits et services achetés",
        "scope": "3 amont",
    },
    "Argon": {
        "fe": 0.440,
        "unite": "m3",
        "facteurEmission": "Gaz industriel - Argon",
        "categorieEmission": "Produits et services achetés",
        "scope": "3 amont",
    },
    "Acétylène": {
        "fe": 3.800,
        "unite": "m3",
        "facteurEmission": "Gaz industriel - Acétylène",
        "categorieEmission": "Produits et services achetés",
        "scope": "3 amont",
    },
    "Azote": {
        "fe": 0.560,
        "unite": "m3",
        "facteurEmission": "Gaz industriel - Azote",
        "categorieEmission": "Produits et services achetés",
        "scope": "3 amont",
    },
    "Ferromaxx 7": {
        "fe": 0.412,
        "unite": "m3",
        "facteurEmission": "Gaz de mélange - Ferromaxx 7",
        "categorieEmission": "Produits et services achetés",
        "scope": "3 amont",
        "commentaire": "Fournisseur Linde",
    },
    "Mison 2": {
        "fe": 0.445,
        "unite": "m3",
        "facteurEmission": "Gaz de mélange - Mison 2",
        "categorieEmission": "Produits et services achetés",
        "scope": "3 amont",
        "commentaire": "Fournisseur Linde",
    },
    "Corgon 18": {
        "fe": 0.520,
        "unite": "m3",
        "facteurEmission": "Gaz de mélange - Corgon 18",
        "categorieEmission": "Produits et services achetés",
        "scope": "3 amont",
        "commentaire": "Fournisseur Linde",
    },
    "Climatiseur": {
        "fe": 1630.0,
        "unite": "kg",
        "facteurEmission": "Frigorigène - R410A",
        "categorieEmission": "Fuites frigorigènes",
        "scope": "1",
    },
}


def calcul_kg_co2e(energie: str, quantite: float) -> float | None:
    """Retourne les kg CO2e pour une énergie et une quantité données."""
    ref = FACTEURS_ENERGIE.get(energie)
    if ref is None:
        return None
    return round(quantite * ref["fe"], 4)


def _normalize_fe_label(text) -> str:
    return re.sub(r"\s+", " ", str(text or "").strip().lower())


def _infer_fe_basis(unit: str | None) -> str:
    normalized = _normalize_fe_label(unit)
    if not normalized or "eur" in normalized:
        return "spend"
    if "tonne" in normalized:
        return "mass_tonne"
    if "kgco2/kg" in normalized.replace(" ", "") or normalized.endswith("/kg"):
        return "mass_kg"
    if any(token in normalized for token in ("/m3", "/l", "/kwh", "m3", "kwh")):
        return "quantity"
    return "spend"


def build_fe_lookup(rows: list[tuple]) -> dict[str, dict]:
    """
    Construit un index {libellé normalisé: {fe, unit, basis, label}}
    à partir de l'onglet « Facteur d'émission » du fichier Excel.
    """
    lookup = {
        key: dict(value)
        for key, value in DEFAULT_FE_REFERENCE.items()
    }

    for label, fe_value, unit in rows:
        if label is None or str(label).strip() == "":
            continue
        key = _normalize_fe_label(label)
        entry = {
            "label": str(label).strip(),
            "unit": str(unit or "").strip(),
            "basis": _infer_fe_basis(unit),
        }
        fe = _to_float_safe(fe_value)
        if fe > 0:
            entry["fe"] = fe
        elif key in lookup:
            entry["fe"] = lookup[key]["fe"]
        else:
            continue
        lookup[key] = entry

    return lookup


def lookup_fe_factor(label, fe_lookup: dict[str, dict]) -> dict | None:
    if not label:
        return None
    key = _normalize_fe_label(label)
    if key in fe_lookup:
        return fe_lookup[key]

    partial = next(
        (
            factor
            for factor_key, factor in fe_lookup.items()
            if factor_key and (factor_key in key or key in factor_key)
        ),
        None,
    )
    return partial


def _quantity_in_tonnes(quantite: float, unite) -> float:
    normalized = _normalize_fe_label(unite)
    if quantite <= 0:
        return 0.0
    if normalized == "kg":
        return quantite / 1000
    if normalized in {"t", "tonne", "tonnes"} or "tonne" in normalized:
        return quantite
    return 0.0


def calcul_transport_kg(row: dict) -> float:
    tonnes = _quantity_in_tonnes(_to_float_safe(row.get("quantite")), row.get("unite"))
    distance = _to_float_safe(row.get("distanceFournisseur"))
    if tonnes <= 0 or distance <= 0:
        return 0.0
    mode = _normalize_fe_label(row.get("moyenTransport"))
    fe_tkm = TRANSPORT_FE_TONNE_KM["avion"] if "avion" in mode else TRANSPORT_FE_TONNE_KM["default"]
    return tonnes * distance * fe_tkm


def calcul_production_kg(row: dict, factor: dict | None) -> float:
    if factor is None:
        return 0.0

    fe = _to_float_safe(factor.get("fe"))
    if fe <= 0:
        return 0.0

    quantite = _to_float_safe(row.get("quantite"))
    montant = _to_float_safe(row.get("montantEuro"))
    basis = factor.get("basis", "spend")

    if basis == "mass_tonne" and quantite > 0:
        return _quantity_in_tonnes(quantite, row.get("unite")) * fe
    if basis == "mass_kg" and quantite > 0:
        normalized = _normalize_fe_label(row.get("unite"))
        kg = quantite if normalized == "kg" else quantite * 1000
        return kg * fe
    if basis == "quantity" and quantite > 0:
        return quantite * fe
    if montant > 0:
        return montant * fe
    if quantite > 0:
        return quantite * fe
    return 0.0


def enrichir_ligne_achat(row: dict, fe_lookup: dict[str, dict], dataset: str) -> dict:
    """Calcule kgCO2e et transport à partir du libellé FE Excel et des quantités."""
    source_values = source_values_snapshot(row)
    existing_kg = _to_float_safe(row.get("kgCO2e"))
    if existing_kg > 0:
        attach_calculation_metadata(
            row,
            source_values=source_values,
            kg_co2e=existing_kg,
            fe_kg_co2e_unite=row.get("feKgCO2eUnite"),
            factor_name=row.get("facteurEmission"),
            factor_source=row.get("facteurEmission"),
            factor_category=row.get("categorieEmission"),
            factor_scope=row.get("scope"),
            factor_unit=row.get("unite"),
            method="excel_value",
            calculated_by="import",
        )
        return row

    factor = lookup_fe_factor(row.get("facteurEmission"), fe_lookup)
    production_kg = calcul_production_kg(row, factor)
    transport_kg = calcul_transport_kg(row) if dataset == "achats_biens" else 0.0

    if factor is not None:
        row["feKgCO2eUnite"] = factor.get("fe")

    row["kgCO2e"] = round(production_kg, 2)
    if transport_kg > 0:
        row["transportKgCO2e"] = round(transport_kg, 2)

    attach_calculation_metadata(
        row,
        source_values=source_values,
        kg_co2e=row["kgCO2e"],
        fe_kg_co2e_unite=row.get("feKgCO2eUnite"),
        factor_name=factor.get("label") if factor else row.get("facteurEmission"),
        factor_source=row.get("facteurEmission"),
        factor_category=row.get("categorieEmission"),
        factor_scope=row.get("scope"),
        factor_unit=factor.get("unit") if factor else row.get("unite"),
        method="excel_factor_lookup" if factor else "unresolved",
        calculated_by="import",
    )
    return row


def _to_float_safe(v) -> float:
    """Conversion robuste vers float (virgule européenne, unités, None, NaN)."""
    if v is None:
        return 0.0
    if isinstance(v, (int, float)):
        try:
            f = float(v)
            return 0.0 if (f != f) else f
        except (ValueError, TypeError):
            return 0.0
    s = str(v).strip().replace(",", ".").split()[0] if str(v).strip() else ""
    try:
        return float(s)
    except (ValueError, TypeError):
        return 0.0


def enrichir_ligne(row: dict) -> dict:
    """
    Complète une ligne issue du parser avec le FE, la catégorie, le scope
    et les kg CO2e si l'énergie est connue dans le référentiel.

    Priorité pour kgCO2e (du plus prioritaire au moins) :
      1. Valeur kgCO2e déjà présente dans le fichier Excel (> 0) → on la
         respecte telle quelle (l'utilisateur a pré-calculé avec son propre FE).
      2. feKgCO2eUnite présent dans le fichier Excel (> 0) → on calcule
         quantite × FE_excel.
      3. FE du référentiel interne → on calcule quantite × FE_ref.
    """
    source_values = source_values_snapshot(row)
    energie_raw = row.get("energie", "") or ""
    energie = _normalise_energie(str(energie_raw))
    if energie != energie_raw:
        row["energie"] = energie
    ref = FACTEURS_ENERGIE.get(energie)
    if ref:
        quantite = _to_float_safe(row.get("quantite", 0))

        # Métadonnées : on n'écrase jamais ce qui vient déjà du fichier
        row.setdefault("facteurEmission",   ref["facteurEmission"])
        row.setdefault("unite",             ref["unite"])
        row.setdefault("categorieEmission", ref["categorieEmission"])
        row.setdefault("scope",             ref["scope"])
        row.setdefault("commentaire",       ref.get("commentaire", ""))

        # FE effectif : fichier Excel en priorité, sinon référentiel
        fe_excel = _to_float_safe(row.get("feKgCO2eUnite", 0))
        fe_eff   = fe_excel if fe_excel > 0 else ref["fe"]
        row["feKgCO2eUnite"] = fe_eff

        # kgCO2e : valeur Excel en priorité (si présente et > 0)
        kg_excel = _to_float_safe(row.get("kgCO2e", 0))
        if kg_excel > 0:
            method = "excel_value"
            row["kgCO2e"] = round(kg_excel, 2)
        else:
            method = "excel_factor" if fe_excel > 0 else "internal_factor"
            row["kgCO2e"] = round(quantite * fe_eff, 2)
        attach_calculation_metadata(
            row,
            source_values=source_values,
            kg_co2e=row["kgCO2e"],
            fe_kg_co2e_unite=fe_eff,
            factor_name=energie,
            factor_source=row.get("facteurEmission"),
            factor_category=row.get("categorieEmission"),
            factor_scope=row.get("scope"),
            factor_unit=row.get("unite"),
            method=method,
            calculated_by="import",
        )
    else:
        # Énergie non référencée : normaliser les valeurs numériques présentes
        if "kgCO2e" in row:
            row["kgCO2e"] = _to_float_safe(row["kgCO2e"])
        if "feKgCO2eUnite" in row:
            row["feKgCO2eUnite"] = _to_float_safe(row["feKgCO2eUnite"])
        attach_calculation_metadata(
            row,
            source_values=source_values,
            kg_co2e=row.get("kgCO2e"),
            fe_kg_co2e_unite=row.get("feKgCO2eUnite"),
            factor_name=energie or None,
            factor_source=row.get("facteurEmission"),
            factor_category=row.get("categorieEmission"),
            factor_scope=row.get("scope"),
            factor_unit=row.get("unite"),
            method="excel_value" if "kgCO2e" in row else "unresolved",
            calculated_by="import",
        )
    return row
