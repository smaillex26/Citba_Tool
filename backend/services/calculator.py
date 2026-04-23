"""
Facteurs d'émission (Base Carbone ADEME + fournisseurs).
Toutes les valeurs sont en kg CO2e par unité consommée.
Ce fichier sera enrichi au fur et à mesure que de nouvelles
sources/catégories seront intégrées.
"""
import re

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
            row["kgCO2e"] = round(kg_excel, 2)
        else:
            row["kgCO2e"] = round(quantite * fe_eff, 2)
    else:
        # Énergie non référencée : normaliser les valeurs numériques présentes
        if "kgCO2e" in row:
            row["kgCO2e"] = _to_float_safe(row["kgCO2e"])
        if "feKgCO2eUnite" in row:
            row["feKgCO2eUnite"] = _to_float_safe(row["feKgCO2eUnite"])
    return row
