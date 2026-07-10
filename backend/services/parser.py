"""
Lecture et normalisation des fichiers Excel importés.

Stratégie :
- Chaque onglet du classeur correspond à une catégorie de données.
- Le parser scanne chaque onglet ligne par ligne pour détecter :
    1. Les noms de sites (cellule isolée contenant un nom de site connu)
    2. Les lignes d'en-tête (ligne avec ≥2 noms de colonnes reconnus)
    3. Les lignes de données
  Cela gère le format réel : site écrit au-dessus de chaque mini-tableau.
- Le résultat est retourné en mémoire. L'écriture JSON est optionnelle
  et réservée aux diagnostics/tests.
"""

import json
import re
from pathlib import Path

import pandas as pd

from services.calculator import (
    attach_calculation_metadata,
    build_fe_lookup,
    enrichir_ligne,
    enrichir_ligne_achat,
    source_values_snapshot,
)

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

# ── Constantes ────────────────────────────────────────────────────────────────

# Correspondance nom d'onglet (normalisé) → nom de dataset
ONGLET_MAP: dict[str, str] = {
    # Energie
    "energie":                          "energie",
    "energie et process":               "energie",
    "énergie":                          "energie",
    "énergie et process":               "energie",
    "energy":                           "energie",
    "clim":                             "clim",
    # Achats biens (Intrants par site)
    "achats biens":                     "achats_biens",
    "achats de biens":                  "achats_biens",
    "intrants - arthez":                "achats_biens",
    "intrants - palplast":              "achats_biens",
    "intrants - pontonx":               "achats_biens",
    "intrants - infautelec":            "achats_biens",
    "intrants":                         "achats_biens",
    # Achats services
    "achats services":                  "achats_services",
    "achats de services":               "achats_services",
    "achats de service":                "achats_services",
    # Biens immobilisés
    "biens immobilises":                "biens_immobilises",
    "biens immobilisés":                "biens_immobilises",
    # Déplacements pro
    "deplacements pro":                 "deplacements_pro",
    "déplacements pro":                 "deplacements_pro",
    "déplacements professionnels":      "deplacements_pro",
    "deplacements professionnels":      "deplacements_pro",
    "déplacement pro":                  "deplacements_pro",
    "deplacements pro ":                "deplacements_pro",
    # Déplacements domicile-travail
    "deplacements dt":                  "deplacements_dt",
    "déplacements dt":                  "deplacements_dt",
    "déplacements domicile-travail":    "deplacements_dt",
    "déplacements domicile travail":    "deplacements_dt",
    "déplacement domicile -travail":    "deplacements_dt",
    "déplacement domicile-travail":     "deplacements_dt",
    "déplacement domicile travail":     "deplacements_dt",
    "déplacement domicile -travail ":   "deplacements_dt",
    # Déchets
    "dechets":                          "dechets",
    "déchets":                          "dechets",
    # Transport aval
    "transport aval":                   "transport_aval",
    "fret":                             "transport_aval",
    # Sous-traitance
    "sous traitance":                   "sous_traitance",
    "sous-traitance":                   "sous_traitance",
    # Actifs leasing
    "actifs leasing":                   "actifs_leasing",
    "actifs en leasing":                "actifs_leasing",
}

OUTPUT_DATASETS = {
    "energie",
    "clim",
    "achats_biens",
    "achats_services",
    "biens_immobilises",
    "deplacements_pro",
    "dechets",
    "transport_aval",
    "sous_traitance",
    "deplacements_dt",
    "actifs_leasing",
}

# Remapping des noms de colonnes : nom brut (normalisé) → clé interne
COLONNE_MAP: dict[str, str] = {
    # Communs
    "site":                             "site",
    "nom du site":                      "site",
    "quantite":                         "quantite",
    "quantité":                         "quantite",
    "unite":                            "unite",
    "unité":                            "unite",
    "commentaire":                      "commentaire",
    "scope":                            "scope",
    "date":                             "date",
    "description":                      "description",

    # Energie
    "energie":                          "energie",
    "énergie":                          "energie",
    "facteurs d'emissions":             "facteurEmission",
    "facteurs d'émissions":             "facteurEmission",
    "facteur d'emission":               "facteurEmission",
    "facteur d'émission":               "facteurEmission",
    "facteurs d'émission":              "facteurEmission",
    "facteurs d'emission":              "facteurEmission",
    "fe kg co2e":                       "feKgCO2eUnite",
    "fe (kg co2e/unité)":               "feKgCO2eUnite",
    "fe kg co2e/unite":                 "feKgCO2eUnite",
    "fe":                               "feKgCO2eUnite",
    "facteur emission":                 "feKgCO2eUnite",
    "facteur émission":                 "feKgCO2eUnite",
    "facteur d'emission unitaire":      "feKgCO2eUnite",
    "fe unitaire":                      "feKgCO2eUnite",
    "fe kg co2e/kwh":                   "feKgCO2eUnite",
    "fe kg co2e/m3":                    "feKgCO2eUnite",
    "fe kg co2e/l":                     "feKgCO2eUnite",
    "fe kg co2e/kg":                    "feKgCO2eUnite",
    "categorie d'emission":             "categorieEmission",
    "catégorie d'émission":             "categorieEmission",
    "categories d'emission":            "categorieEmission",
    "catégories d'émission":            "categorieEmission",
    "categorie emission":               "categorieEmission",
    "catégorie":                        "categorieEmission",
    "catégorie d'émissions":            "categorieEmission",
    "kg co2e":                          "kgCO2e",
    "kg co2":                           "kgCO2e",
    "co2e":                             "kgCO2e",
    "total kg co2e":                    "kgCO2e",
    "emissions co2e":                   "kgCO2e",
    "émissions co2e":                   "kgCO2e",
    "emissions kg co2e":                "kgCO2e",
    "émissions kg co2e":                "kgCO2e",
    "teqco2":                           "kgCO2e",   # variante PALPLAST/PONTONX
    "%":                                "pourcentage",
    "pourcentage":                      "pourcentage",
    "% total":                          "pourcentage",

    # Achats biens / Intrants
    "matières premières / consommables": "matiereConsommable",
    "matières premières":               "matiereConsommable",
    "matieres premieres / consommables":"matiereConsommable",
    "famille":                          "famille",
    "distance moyenne entre le fournisseur et le site de réception de la matière première":
                                        "distanceFournisseur",
    "distance moyenne entre le fournisseur et le site de reception de la matiere premiere":
                                        "distanceFournisseur",
    "moyen de transport":               "moyenTransport",
    "moyen de transport utilisé":       "moyenTransport",
    "moyen de transport utilise":       "moyenTransport",

    # Achats services / Sous-traitance
    "societe":                          "societe",
    "société":                          "societe",
    "nom de la société de sous-traitance": "societe",
    "nom de la societe de sous-traitance": "societe",
    "type prestation":                  "typePrestation",
    "type de prestation":               "typePrestation",
    "type de prestation réalisée":      "typePrestation",
    "type de prestation realisee":      "typePrestation",
    "montant":                          "montantEuro",
    "montant eur":                      "montantEuro",
    "montant euro":                     "montantEuro",
    "montant (€)":                      "montantEuro",
    "montant facturé par le sous-traitant (€)": "montantEuro",
    "montant facture par le sous-traitant (€)": "montantEuro",
    "fournisseur":                      "fournisseur",

    # Déplacements professionnels
    "moyen de déplacement":             "moyenDeplacement",
    "moyen de deplacement":             "moyenDeplacement",
    "info complémentaire":              "infoComplementaire",
    "info complementaire":              "infoComplementaire",
    "nombre de km réalisés par an":     "kmParAn",
    "nombre de km realises par an":     "kmParAn",
    "frais de restauration":            "fraisRestauration",
    "frais d'hébergement":              "fraisHebergement",
    "frais d'hebergement":              "fraisHebergement",
    "consommation de carburant si moteur thermique": "consomCarburant",

    # Déplacements domicile-travail
    "distance moyenne domicile travail (km)": "distanceDomTravail",
    "nombre de fois que vous réalisez cette distance par jour": "nbAllerRetour",
    "nombre de fois que vous realisez cette distance par jour": "nbAllerRetour",
    "nb de jours travaillés sur la période": "nbJoursTravailles",
    "nb de jours travailles sur la periode": "nbJoursTravailles",
    "avez-vous un second moyen de déplacement pour ces aller-retours ? si oui, dans quelle propotion l'utilisez-vous ?":
                                        "secondMoyen",
    "travaillez-vous en télétravail ? si oui, combien de jours par semaine ?":
                                        "teletravail",
    # NB: les sous-en-têtes R01 de la feuille DT ("Type de moyen", "Proportion")
    # restent volontairement absents : ils ne sont pas une vraie ligne de header.

    # Biens immobilisés (UTCF)
    "surface de terre convertie":       "surfaceTerre",
    "durée d'amortissement":            "dureeAmortissement",
    "duree d'amortissement":            "dureeAmortissement",

    # Actifs leasing
    "matériel/equipement":              "materielEquipement",
    "materiel/equipement":              "materielEquipement",
    "durée de la lld":                  "dureeLLD",
    "duree de la lld":                  "dureeLLD",

    # Déchets
    "nom du déchet":                    "nomDechet",
    "nom du dechet":                    "nomDechet",
    "code déchet":                      "codeDechet",
    "code dechet":                      "codeDechet",
    "mode de traitement":               "modeTraitement",

    # Fret / Transport aval
    "nom du transporteur":              "nomTransporteur",
    "transport aval ou intersite ?":    "typeTransport",
    "transport aval ou intersite":      "typeTransport",
    "lieu de départ":                   "lieuDepart",
    "lieu de depart":                   "lieuDepart",
    "lieu d'arrivée":                   "lieuArrivee",
    "lieu d'arrivee":                   "lieuArrivee",
    "distance parcourue (km)":          "distanceKm",
}

# Sites connus : clé normalisée → nom affiché
SITES_MAP: dict[str, str] = {
    "arthez":      "Arthez",
    "palplast":    "Palplast",
    "pontonx":     "Pontonx",
    "infautelec":  "Infautelec",
}

SITE_ALIASES: dict[str, str] = {
    "arthez": "Arthez",
    "arthez-de-bearn": "Arthez",
    "arthez-de-béarn": "Arthez",
    "arthez de bearn": "Arthez",
    "arthez de béarn": "Arthez",
    "palplast": "Palplast",
    "palpalst": "Palplast",
    "pontonx": "Pontonx",
    "infautelec": "Infautelec",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def _normalize(text: str) -> str:
    """Met en minuscules et supprime les espaces superflus."""
    return re.sub(r"\s+", " ", str(text).strip().lower())


def _normalize_site(value) -> str | None:
    """Normalise les variantes de noms de sites du fichier Excel CITBA."""
    if value is None:
        return None
    raw = str(value).strip()
    if not raw or raw.lower() in ("nan", "none"):
        return None
    key = _normalize(raw)
    return SITE_ALIASES.get(key, raw.title() if raw.isupper() else raw)


def _normalize_scope(value) -> str | None:
    """Normalise 'Scope 1'/'Scope 2'/'Scope 3 Amont' vers les clés utilisées côté UI."""
    if value is None:
        return None
    raw = str(value).strip()
    if not raw or raw.lower() in ("nan", "none"):
        return None
    key = _normalize(raw)
    key = key.replace("scope", "").strip()
    if key in ("1", "2"):
        return key
    if "3" in key and "amont" in key:
        return "3 amont"
    if "3" in key and "aval" in key:
        return "3 aval"
    return raw


def _site_from_sheet_name(sheet_name: str) -> str | None:
    """Déduit le site depuis les onglets du type 'Intrants - PALPLAST'."""
    normalized = _normalize(sheet_name)
    for key, site in SITE_ALIASES.items():
        if key in normalized:
            return site
    return None


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


def _safe_value(value):
    """Convertit les NaN pandas/numpy en None pour produire du JSON strict."""
    if isinstance(value, dict):
        return {key: _safe_value(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_safe_value(item) for item in value]
    if isinstance(value, float) and value != value:
        return None
    return value


def _clean_record(record: dict) -> dict:
    """Nettoie un enregistrement avant exposition API / écriture JSON."""
    return {key: _safe_value(value) for key, value in record.items()}


# ── Référentiel FE Excel ─────────────────────────────────────────────────────

def _build_fe_lookup_from_workbook(raw_sheets: dict[str, pd.DataFrame]) -> dict[str, dict]:
    """Lit l'onglet « Facteur d'émission » pour résoudre les libellés FE des achats."""
    fe_rows: list[tuple] = []
    for sheet_name, df_raw in raw_sheets.items():
        norm = _normalize(sheet_name)
        if "facteur" not in norm or "emission" not in norm:
            continue
        for _, raw_row in df_raw.iterrows():
            values = list(raw_row)
            if not values or values[0] is None or str(values[0]).strip() == "":
                continue
            fe_rows.append((
                values[0],
                values[1] if len(values) > 1 else None,
                values[2] if len(values) > 2 else None,
            ))
        break
    return build_fe_lookup(fe_rows)


ACHATS_DATASETS = frozenset({"achats_biens", "sous_traitance", "achats_services"})


def _parse_sheet_raw(
    df_raw: pd.DataFrame,
    dataset: str,
    start_id: int = 0,
    forced_site: str | None = None,
) -> list[dict]:
    """
    Parse un onglet ligne par ligne en détectant :
    - les noms de sites (cellule isolée = nom d'un site connu)
    - les lignes d'en-tête (≥2 colonnes reconnues)
    - les lignes de données

    Gère le format : site écrit AU-DESSUS de chaque mini-tableau.
    Si aucun site n'est détecté dans la feuille, utilise le fallback
    d'une seule passe avec la première ligne d'en-tête trouvée.
    """
    current_site: str | None = forced_site
    header_map: dict[int, str] = {}
    rows: list[dict] = []
    id_counter = start_id

    for _, raw_row in df_raw.iterrows():
        values = list(raw_row)
        non_null = _row_non_null(values)

        # Ligne entièrement vide → ignorer
        if not non_null:
            continue

        # Détection d'un nom de site
        site = _detect_site(values)
        if site:
            if not forced_site:
                current_site = site
            header_map = {}
            continue

        # Détection d'une ligne d'en-tête
        score = _score_header(values)
        if score >= 2:
            header_map = {}
            for i, v in enumerate(values):
                key = _normalize(str(v))
                if key in COLONNE_MAP:
                    header_map[i] = COLONNE_MAP[key]

            # Pour le dataset énergie : la colonne Scope n'a pas d'en-tête dans l'Excel.
            # Elle se trouve juste après la colonne Catégorie d'émissions.
            if dataset == "energie":
                facteur_idx = next(
                    (i for i, k in header_map.items() if k == "facteurEmission"), None
                )
                if facteur_idx is not None and (facteur_idx + 1) not in header_map:
                    header_map[facteur_idx + 1] = "feKgCO2eUnite"

                cat_idx = next(
                    (i for i, k in header_map.items() if k == "categorieEmission"), None
                )
                if cat_idx is not None and (cat_idx + 1) not in header_map:
                    header_map[cat_idx + 1] = "scope"

            # Feuille domicile-travail : la proportion du second moyen est en colonne
            # suivante, sous un sous-en-tête séparé sur R01.
            if dataset == "deplacements_dt":
                second_idx = next(
                    (i for i, k in header_map.items() if k == "secondMoyen"), None
                )
                if second_idx is not None and (second_idx + 1) not in header_map:
                    header_map[second_idx + 1] = "proportionSecondMoyen"

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
        _text_vals = " ".join(
            str(v) for v in record.values()
            if v is not None and isinstance(v, str)
        ).lower()
        if (
            "type de moyen de déplacement" in _text_vals
            or "type de moyen de deplacement" in _text_vals
            or "proportion d'utilisation" in _text_vals
        ):
            continue
        if re.search(r"\btotal\b|\bsous.total\b|\btotaux\b|\bsomme\b", _text_vals):
            continue

        # Injecter le site détecté (sauf si la colonne site est déjà dans le fichier)
        if current_site and "site" not in record:
            record["site"] = current_site
        elif "site" in record:
            record["site"] = _normalize_site(record.get("site"))

        if "scope" in record:
            record["scope"] = _normalize_scope(record.get("scope"))

        # L'onglet Fret contient parfois des lignes de choix ("Aval", "Intersite")
        # sans quantité, transporteur, lieu ni distance : elles ne doivent pas créer
        # de lignes métier.
        if dataset == "transport_aval":
            meaningful = [
                k for k, v in record.items()
                if v is not None and str(v).strip() not in ("", "nan", "None")
            ]
            if meaningful == ["typeTransport"]:
                continue

        id_counter += 1
        record["id"] = id_counter

        # Enrichissement CO2e pour le dataset énergie
        if dataset == "energie":
            record = enrichir_ligne(record)

        # Pour le dataset énergie, ignorer les lignes sans quantité ni kgCO2e utile
        if dataset == "energie":
            quantite_val = _to_float(record.get("quantite"))
            kg_val       = _to_float(record.get("kgCO2e"))
            if quantite_val == 0 and kg_val == 0:
                id_counter -= 1
                continue

        rows.append(_clean_record(record))

    # Normaliser kgCO2e en float pour le dataset énergie
    if dataset == "energie":
        for r in rows:
            r["kgCO2e"] = _to_float(r.get("kgCO2e"))

    return rows


def _parse_biens_two_sections(df_raw: pd.DataFrame) -> tuple[list[dict], list[dict]]:
    """
    Parse l'onglet "Biens immobilisés" qui contient deux sections :
    1. UTCF – Changement d'affectation des sols → dataset biens_immobilises
    2. Actif en leasing → dataset actifs_leasing
    Retourne (rows_biens, rows_leasing).
    """
    split_idx = None
    for i, row in df_raw.iterrows():
        values = list(row)
        non_null = _row_non_null(values)
        if len(non_null) == 1:
            norm = _normalize(str(non_null[0]))
            if "actif en leasing" in norm or "actifs en leasing" in norm:
                split_idx = i
                break

    if split_idx is None:
        return _parse_sheet_raw(df_raw, "biens_immobilises"), []

    df_biens  = df_raw[df_raw.index < split_idx].reset_index(drop=True)
    df_leasing = df_raw[df_raw.index > split_idx].reset_index(drop=True)

    rows_biens  = _parse_sheet_raw(df_biens,   "biens_immobilises")
    rows_leasing = _parse_sheet_raw(df_leasing, "actifs_leasing", start_id=len(rows_biens))

    return rows_biens, rows_leasing


def _parse_clim_sheet(df_raw: pd.DataFrame, start_id: int = 0) -> list[dict]:
    """
    Parse l'onglet Clim, dont la structure ne suit pas les en-têtes classiques.
    Les valeurs utiles sont déjà calculées dans les colonnes de droite :
    facteur d'émission, FE, kg CO2e, %, catégorie, scope.
    """
    rows: list[dict] = []
    current_site: str | None = None
    current_section: str | None = None
    id_counter = start_id

    for _, raw_row in df_raw.iterrows():
        values = list(raw_row)
        non_null = _row_non_null(values)
        if not non_null:
            continue

        site = _detect_site(values)
        if site:
            current_site = site
            current_section = None
            continue

        first = str(values[0]).strip() if values and values[0] is not None else ""
        first_norm = _normalize(first)
        if "climatiseur fonctionnement" in first_norm:
            current_section = "Climatiseur fonctionnement"
            continue
        if "climatiseur fin de vie" in first_norm:
            current_section = "Climatiseur fin de vie"
            continue
        if first_norm.startswith("total"):
            continue

        if not current_site or not current_section:
            continue
        if not (
            first_norm.startswith("climatiseur")
            or first_norm.startswith("climatisation")
        ):
            continue

        kg_co2e = _to_float(values[13] if len(values) > 13 else None)
        quantite = _to_float(values[9] if len(values) > 9 else None)
        if kg_co2e == 0 and quantite == 0:
            continue

        id_counter += 1
        record = {
            "id": id_counter,
            "site": current_site,
            "energie": f"{current_section} - {first}",
            "quantite": quantite,
            "unite": "kg fluide",
            "facteurEmission": values[11] if len(values) > 11 else None,
            "feKgCO2eUnite": _to_float(values[12] if len(values) > 12 else None),
            "categorieEmission": values[15] if len(values) > 15 else None,
            "scope": _normalize_scope(values[16] if len(values) > 16 else "Scope 1"),
            "commentaire": current_section,
            "kgCO2e": kg_co2e,
            "pourcentage": _to_float(values[14] if len(values) > 14 else None),
        }
        attach_calculation_metadata(
            record,
            source_values=source_values_snapshot(record),
            kg_co2e=record["kgCO2e"],
            fe_kg_co2e_unite=record["feKgCO2eUnite"],
            factor_name=record["energie"],
            factor_source=record.get("facteurEmission"),
            factor_category=record.get("categorieEmission"),
            factor_scope=record.get("scope"),
            factor_unit=record.get("unite"),
            method="excel_value",
            calculated_by="import",
        )
        rows.append(_clean_record(record))

    return rows


# ── Fonctions publiques ────────────────────────────────────────────────────────

def parse_excel(path: Path, write_json: bool = False) -> dict[str, list]:
    """
    Lit tous les onglets d'un fichier Excel, détecte les sites et les données,
    Retourne un dict { dataset_name: [lignes] }.

    write_json=True conserve un mode diagnostic historique. En production, la
    persistance applicative passe par la base de données.
    """
    raw_sheets: dict[str, pd.DataFrame] = pd.read_excel(
        path, sheet_name=None, engine="openpyxl", header=None
    )
    fe_lookup = _build_fe_lookup_from_workbook(raw_sheets)

    if write_json:
        # Mode diagnostic : le JSON reflète uniquement le fichier parsé.
        for dataset in OUTPUT_DATASETS:
            (DATA_DIR / f"{dataset}.json").unlink(missing_ok=True)

    results: dict[str, list] = {}

    for sheet_name, df_raw in raw_sheets.items():
        dataset = ONGLET_MAP.get(_normalize(sheet_name))
        if dataset is None:
            continue

        if _normalize(sheet_name) == "clim":
            start = len(results.get("clim", []))
            rows = _parse_clim_sheet(df_raw, start_id=start)
            if rows:
                results.setdefault("clim", []).extend(rows)
            continue

        df_raw = df_raw.dropna(axis=1, how="all")

        # Cas spécial : Biens immobilisés contient 2 sections
        if dataset == "biens_immobilises":
            rows_biens, rows_leasing = _parse_biens_two_sections(df_raw)
            if rows_biens:
                # Ré-numéroter pour éviter les doublons si plusieurs appels
                start = len(results.get("biens_immobilises", []))
                for i, r in enumerate(rows_biens):
                    r["id"] = start + i + 1
                results.setdefault("biens_immobilises", []).extend(rows_biens)
            if rows_leasing:
                start = len(results.get("actifs_leasing", []))
                for i, r in enumerate(rows_leasing):
                    r["id"] = start + i + 1
                results.setdefault("actifs_leasing", []).extend(rows_leasing)
            continue

        # Parsing standard
        start_id = len(results.get(dataset, []))
        forced_site = _site_from_sheet_name(sheet_name) if dataset == "achats_biens" else None
        rows = _parse_sheet_raw(
            df_raw,
            dataset,
            start_id=start_id,
            forced_site=forced_site,
        )

        if dataset in ACHATS_DATASETS:
            rows = [enrichir_ligne_achat(row, fe_lookup, dataset) for row in rows]

        if not rows:
            continue

        # Ré-numéroter les IDs de façon continue si plusieurs feuilles → même dataset
        offset = len(results.get(dataset, []))
        for i, r in enumerate(rows):
            r["id"] = offset + i + 1

        results.setdefault(dataset, []).extend(rows)

    for dataset, rows in results.items():
        rows = [_clean_record(row) for row in rows]
        results[dataset] = rows

        if write_json:
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
