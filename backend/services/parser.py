"""
Lecture et normalisation des fichiers Excel importés.

Stratégie :
- Chaque onglet du classeur correspond à une catégorie de données.
- Les noms d'onglets sont normalisés pour correspondre aux datasets connus.
- Les colonnes sont nettoyées (strip, lowercase) puis remappées.
- Le résultat est sauvegardé en JSON dans backend/data/<dataset>.json.
"""

import json
import re
from pathlib import Path

import pandas as pd

from services.calculator import enrichir_ligne

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

# Correspondance nom d'onglet (normalisé) → nom de dataset
ONGLET_MAP: dict[str, str] = {
    "energie":              "energie",
    "energie et process":   "energie",
    "énergie":              "energie",
    "énergie et process":   "energie",
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
    "fe kg co2e":              "feKgCO2eUnite",
    "fe (kg co2e/unité)":      "feKgCO2eUnite",
    "fe kg co2e/unite":        "feKgCO2eUnite",
    "categorie d'emission":    "categorieEmission",
    "catégorie d'émission":    "categorieEmission",
    "categories d'emission":   "categorieEmission",
    "catégories d'émission":   "categorieEmission",
    "scope":                   "scope",
    "commentaire":             "commentaire",
    "kg co2e":                 "kgCO2e",
    "kg co2":                  "kgCO2e",
    "%":                       "pourcentage",
    "pourcentage":             "pourcentage",
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


def _normalize(text: str) -> str:
    """Met en minuscules et supprime les espaces superflus."""
    return re.sub(r"\s+", " ", str(text).strip().lower())


def _remap_columns(df: pd.DataFrame) -> pd.DataFrame:
    renamed = {}
    for col in df.columns:
        key = _normalize(col)
        if key in COLONNE_MAP:
            renamed[col] = COLONNE_MAP[key]
    return df.rename(columns=renamed)


def parse_excel(path: Path) -> dict[str, list]:
    """
    Lit tous les onglets d'un fichier Excel et sauvegarde chaque dataset connu
    en JSON dans backend/data/.
    Retourne un dict { dataset_name: [lignes] }.
    """
    workbook: dict[str, pd.DataFrame] = pd.read_excel(
        path, sheet_name=None, engine="openpyxl"
    )

    results = {}

    for sheet_name, df in workbook.items():
        dataset = ONGLET_MAP.get(_normalize(sheet_name))
        if dataset is None:
            # Onglet inconnu : on ignore
            continue

        # Supprimer les lignes entièrement vides
        df = df.dropna(how="all").reset_index(drop=True)

        # Renommer les colonnes
        df = _remap_columns(df)

        # Convertir en liste de dicts et nettoyer les valeurs NaN
        rows = []
        for i, row in enumerate(df.to_dict(orient="records"), start=1):
            cleaned = {
                k: (None if pd.isna(v) else v)
                for k, v in row.items()
                if not str(k).startswith("Unnamed")
            }
            cleaned["id"] = i

            # Enrichissement automatique avec FE si dataset énergie
            if dataset == "energie":
                cleaned = enrichir_ligne(cleaned)

            rows.append(cleaned)

        # Calcul du pourcentage global pour le dataset énergie
        if dataset == "energie":
            total = sum(r.get("kgCO2e") or 0 for r in rows)
            for r in rows:
                kg = r.get("kgCO2e") or 0
                r["pourcentage"] = round((kg / total) * 100, 2) if total > 0 else 0

        results[dataset] = rows

        # Sauvegarde JSON
        out_path = DATA_DIR / f"{dataset}.json"
        with out_path.open("w", encoding="utf-8") as f:
            json.dump(rows, f, ensure_ascii=False, indent=2, default=str)

    return results
