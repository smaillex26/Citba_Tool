from services.calculator import FACTEURS_ENERGIE


def default_emission_factors() -> list[dict]:
    factors = []
    for name, data in FACTEURS_ENERGIE.items():
        factors.append({
            "name": name,
            "category": data.get("categorieEmission"),
            "unit": data.get("unite"),
            "factor_kg_co2e": float(data["fe"]),
            "scope": data.get("scope"),
            "source": data.get("facteurEmission"),
            "year": None,
            "comment": data.get("commentaire"),
        })
    return factors
