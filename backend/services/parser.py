"""
Lecture et normalisation des fichiers Excel importés.

Stratégie :
- Chaque onglet du classeur correspond à une catégorie de données.
- Le parser scanne chaque onglet ligne par ligne pour détecter :
    1. Les noms de sites (cellule isolée contenant un nom de site connu)
    2. Les lignes d'en-tête (ligne avec ≥2 noms de colonnes reconnus)
    3. Les lignes de données
  Cela gère le format réel : site écrit au-dessus de chaque mini-tableau.
- Le résultat est sauvegardé en JSON dans backend/data/<dataset>.json.
"""

import json
import re
from pathlib import Path

import pandas as pd

from services.calculator import enrichir_ligne

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

# ── Constantes ────────────────────────────────────────────────────────────────

# Correspondance nom d'onglet (normalisé) → nom de dataset
ONGLET_MAP: dict[str, str] = {
    "energie":              "energie",
    "energie et process":   "energie",
    "énergie":              "energie",
    "énergie et process":   "energie",
    "energy":               "energie",
    "achats biens":         "achats_biens",
    "achats de biens":      "achats_biens",
    "achats services":      "achats_services",
    "achats de services":   "achats_services",
    "biens immobilises":    "biens_immobilises",
    "biens immobilisés":    "biens_immobilises",
    "deplacements pro":     "deplacements_pro",
    "déplacements pro":     "deplacements_pro",
    "déplacements professionnels": "deplacements_pro",
    "deplacements professionnels": "deplacements_pro",
    "dechets":              "dechets",
    "déchets":              "dechets",
    "transport aval":       "transport_aval",
    "sous traitance":       "sous_traitance",
    "sous-traitance":       "sous_traitance",
    "deplacements dt":      "deplacements_dt",
    "déplacements dt":      "deplacements_dt",
    "déplacements domicile-travail": "deplacements_dt",
    "actifs leasing":       "actifs_leasing",
    "actifs en leasing":    "actifs_leasing",
}

# Remapping des noms de colonnes : nom brut (normalisé) → clé interne
COLONNE_MAP: dict[str, str] = {
    "site":                    "site",
    "energie":                 "energie",
    "énergie":                 "energie",
    "quantite":                "quantite",
    "quantité":                "quantite",
    "unite":                   "unite",
    "unité":                   "unite",
    "facteurs d'emissions":    "facteurEmission",
    "facteurs d'émissions":    "facteurEmission",
    "facteur d'emission":      "facteurEmission",
    "facteur d'émission":      "facteurEmission",
    "fe kg co2e":              "feKgCO2eUnite",
    "fe (kg co2e/unité)":      "feKgCO2eUnite",
    "fe kg co2e/unite":        "feKgCO2eUnite",
    "fe":                      "feKgCO2eUnite",
    "facteur emission":        "feKgCO2eUnite",
    "facteur émission":        "feKgCO2eUnite",
    "facteur d'emission unitaire": "feKgCO2eUnite",
    "fe unitaire":             "feKgCO2eUnite",
    "fe kg co2e/kwh":          "feKgCO2eUnite",
    "fe kg co2e/m3":           "feKgCO2eUnite",
    "fe kg co2e/l":            "feKgCO2eUnite",
    "fe kg co2e/kg":           "feKgCO2eUnite",
    "categorie d'emission":    "categorieEmission",
    "catégorie d'émission":    "categorieEmission",
    "categories d'emission":   "categorieEmission",
    "catégories d'émission":   "categorieEmission",
    "categorie emission":      "categorieEmission",
    "catégorie":               "categorieEmission",
    "scope":                   "scope",
    "commentaire":             "commentaire",
    "kg co2e":                 "kgCO2e",
    "kg co2":                  "kgCO2e",
    "co2e":                    "kgCO2e",
    "total kg co2e":           "kgCO2e",
    "emissions co2e":          "kgCO2e",
    "émissions co2e":          "kgCO2e",
    "emissions kg co2e":       "kgCO2e",
    "émissions kg co2e":       "kgCO2e",
    "%":                       "pourcentage",
    "pourcentage":             "pourcentage",
    "% total":                 "pourcentage",
    # colonnes communes autres datasets
    "societe":                 "societe",
    "société":                 "societe",
    "montant":                 "montantEuro",
    "montant eur":             "montantEuro",
    "montant euro":            "montantEuro",
    "type prestation":         "typePrestation",
    "type de prestation":      "typePrestation",
    "fournisseur":             "fournisseur",
    "description":             "description",
    "date":                    "date",
}

# Sites connus : clé normalisée → nom affiché
SITES_MAP: dict[str, str] = {
    "arthez":      "Arthez",
    "palplast":    "Palplast",
    "pontonx":     "Pontonx",
    "infautelec":  "Infautelec",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def _normalize(text: str) -> str:
    """Met en minuscules et supprime les espaces superflus."""
    return re.sub(r"\s+", " ", str(text).strip().lower())


def _to_float(v) -> float:
    """Conversion robuste vers float (virgule européenne, unités, None, NaN)."""
    if v is None:
        return 0.0
    if isinstance(v, (int, float)):
        try:
            f = float(v)
            return 0.0 if (f != f) else f
        except (ValueError, TypeError):
            return 0.0
    s = str(v).strip()
    if not s:
        return 0.0
    s = s.replace(",", ".")
    s = s.split()[0] if s.split() else s
    s = s.replace(" ", "")
    try:
        return float(s)
    except (ValueError, TypeError):
        return 0.0


def _detect_site(row_values: list) -> str | None:
    """
    Retourne le nom du site si la ligne semble être un indicateur de site :
    - au plus 2 cellules non vides (ex. "Arthez" seul, ou "Site : Arthez")
    - au moins une correspond exactement à un site connu

    Une ligne de données avec le site en 1ère colonne (type "Arthez | Eau | 16 | m3")
    n'est PAS détectée comme indicateur car elle a trop de cellules non vides.
    """
    non_null = [str(v).strip() for v in row_values
                if v is not None and str(v).strip() not in ("", "nan", "None")]
    # Plus de 2 valeurs non nulles → c'est une ligne de données, pas un indicateur
    if len(non_null) == 0 or len(non_null) > 2:
        return None
    for cell in non_null:
        normalized = _normalize(cell)
        for key, name in SITES_MAP.items():
            if key == normalized or normalized.endswith(key):
                return name
    return None


def _score_header(row_values: list) -> int:
    """Compte combien de cellules de la ligne sont des noms de colonnes connus."""
    return sum(
        1 for v in row_values
        if _normalize(str(v)) in COLONNE_MAP
    )


def _row_non_null(row_values: list) -> list:
    """Retourne les valeurs non nulles/vides d'une ligne."""
    return [v for v in row_values
            if v is not None and str(v).strip() not in ("", "nan", "None")]


# ── Parsing principal ─────────────────────────────────────────────────────────

def _parse_sheet_raw(df_raw: pd.DataFrame, dataset: str) -> list[dict]:
    """
    Parse un onglet ligne par ligne en détectant :
    - les noms de sites (cellule isolée = nom d'un site connu)
    - les lignes d'en-tête (≥2 colonnes reconnues)
    - les lignes de données

    Gère le format : site écrit AU-DESSUS de chaque mini-tableau.
    Si aucun site n'est détecté dans la feuille, utilise le fallback
    d'une seule passe avec la première ligne d'en-tête trouvée.
    """
    current_site: str | None = None
    header_map: dict[int, str] = {}   # index colonne → clé interne
    rows: list[dict] = []
    id_counter = 0

    for _, raw_row in df_raw.iterrows():
        values = list(raw_row)
        non_null = _row_non_null(values)

        # Ligne entièrement vide → ignorer
        if not non_null:
            continue

        # Détection d'un nom de site
        site = _detect_site(values)
        if site:
            current_site = site
            header_map = {}   # reset : on s'attend à de nouveaux en-têtes
            continue

        # Détection d'une ligne d'en-tête
        score = _score_header(values)
        if score >= 2:
            header_map = {}
            for i, v in enumerate(values):
                key = _normalize(str(v))
                if key in COLONNE_MAP:
                    header_map[i] = COLONNE_MAP[key]
            continue

        # Ligne de données (on doit avoir un header_map actif)
        if not header_map:
            continue

        # Construire l'enregistrement
        record: dict = {}
        for col_idx, col_key in header_map.items():
            v = values[col_idx] if col_idx < len(values) else None
            record[col_key] = None if (isinstance(v, float) and v != v) else v

        # Ignorer les lignes qui n'ont aucune donnée utile
        if not any(v is not None and str(v).strip() not in ("", "nan") for v in record.values()):
            continue

        # Ignorer les lignes résumé insérées dans l'Excel (TOTAL, Sous-total, etc.)
        # Ces lignes doublent les valeurs car elles répètent des sommes déjà comptées.
        _text_vals = " ".join(
            str(v) for v in record.values()
            if v is not None and isinstance(v, str)
        ).lower()
        if re.search(r"\btotal\b|\bsous.total\b|\btotaux\b|\bsomme\b", _text_vals):
            continue

        # Injecter le site détecté (sauf si la colonne site est déjà dans le fichier)
        if current_site and "site" not in record:
            record["site"] = current_site

        id_counter += 1
        record["id"] = id_counter

        # Enrichissement CO2e pour le dataset énergie
        if dataset == "energie":
            record = enrichir_ligne(record)

        # Pour le dataset énergie, ignorer les lignes sans quantité ni kgCO2e utile
        # (ex. : énergie listée dans le fichier mais sans données chiffrées)
        if dataset == "energie":
            quantite_val = _to_float(record.get("quantite"))
            kg_val       = _to_float(record.get("kgCO2e"))
            if quantite_val == 0 and kg_val == 0:
                id_counter -= 1   # annuler l'incrément
                continue

        rows.append(record)

    # Normaliser kgCO2e en float pour le dataset énergie
    # (le pourcentage est calculé côté frontend par GroupedDataTable, groupe par groupe)
    if dataset == "energie":
        for r in rows:
            r["kgCO2e"] = _to_float(r.get("kgCO2e"))

    return rows


# ── Fonctions publiques ────────────────────────────────────────────────────────

def parse_excel(path: Path) -> dict[str, list]:
    """
    Lit tous les onglets d'un fichier Excel, détecte les sites et les données,
    sauvegarde chaque dataset en JSON dans backend/data/.
    Retourne un dict { dataset_name: [lignes] }.
    """
    raw_sheets: dict[str, pd.DataFrame] = pd.read_excel(
        path, sheet_name=None, engine="openpyxl", header=None
    )

    results: dict[str, list] = {}

    for sheet_name, df_raw in raw_sheets.items():
        dataset = ONGLET_MAP.get(_normalize(sheet_name))
        if dataset is None:
            continue

        # Supprimer les colonnes entièrement vides
        df_raw = df_raw.dropna(axis=1, how="all")

        rows = _parse_sheet_raw(df_raw, dataset)

        if not rows:
            continue

        results[dataset] = rows

        out_path = DATA_DIR / f"{dataset}.json"
        with out_path.open("w", encoding="utf-8") as f:
            json.dump(rows, f, ensure_ascii=False, indent=2, default=str)

    return results


def inspect_excel(path: Path) -> dict:
    """
    Diagnostic : retourne les onglets trouvés, les sites détectés et
    les colonnes reconnues — sans modifier les données.
    """
    try:
        raw_sheets: dict[str, pd.DataFrame] = pd.read_excel(
            path, sheet_name=None, engine="openpyxl", header=None
        )
    except Exception as e:
        return {"error": str(e)}

    report = []
    for sheet_name, df_raw in raw_sheets.items():
        dataset = ONGLET_MAP.get(_normalize(sheet_name))
        df_raw = df_raw.dropna(axis=1, how="all")

        sites_found: list[str] = []
        cols_found: list[str] = []

        for _, raw_row in df_raw.iterrows():
            values = list(raw_row)
            site = _detect_site(values)
            if site and site not in sites_found:
                sites_found.append(site)
            if _score_header(values) >= 2:
                for v in values:
                    k = _normalize(str(v))
                    if k in COLONNE_MAP and COLONNE_MAP[k] not in cols_found:
                        cols_found.append(COLONNE_MAP[k])

        report.append({
            "sheet":              sheet_name,
            "dataset":            dataset,
            "sites_detected":     sites_found,
            "columns_recognized": cols_found,
        })

    return {"sheets": report}
