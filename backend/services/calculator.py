"""
Facteurs d'émission (Base Carbone ADEME + fournisseurs).
Toutes les valeurs sont en kg CO2e par unité consommée.
Ce fichier sera enrichi au fur et à mesure que de nouvelles
sources/catégories seront intégrées.
"""

# --- Énergie et fluides de process ---
FACTEURS_ENERGIE: dict[str, dict] = {
    "Électricité": {
        "fe": 0.0599,
        "unite": "kWh",
        "facteurEmission": "Énergie - Électricité réseau",
        "categorieEmission": "Électricité achetée",
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


def enrichir_ligne(row: dict) -> dict:
    """
    Complète une ligne issue du parser avec le FE, la catégorie, le scope
    et les kg CO2e si l'énergie est connue dans le référentiel.
    """
    energie = row.get("energie", "")
    ref = FACTEURS_ENERGIE.get(energie)
    if ref:
        quantite = float(row.get("quantite", 0) or 0)
        row.setdefault("facteurEmission",   ref["facteurEmission"])
        row.setdefault("feKgCO2eUnite",     ref["fe"])
        row.setdefault("unite",             ref["unite"])
        row.setdefault("categorieEmission", ref["categorieEmission"])
        row.setdefault("scope",             ref["scope"])
        row.setdefault("commentaire",       ref.get("commentaire", ""))
        row["kgCO2e"] = round(quantite * ref["fe"], 2)
    return row
