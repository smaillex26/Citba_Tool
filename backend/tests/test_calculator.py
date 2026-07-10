"""
Tests unitaires du module services/calculator.py.
"""
import pytest
from services.calculator import calcul_kg_co2e, enrichir_ligne, FACTEURS_ENERGIE


# ── calcul_kg_co2e ──────────────────────────────────────────────────────────

def test_calcul_eau():
    """Eau : 16 m3 × 0.13 = 2.08 kg CO2e"""
    result = calcul_kg_co2e("Eau", 16)
    assert result == pytest.approx(2.08, rel=1e-4)


def test_calcul_electricite():
    """Électricité : 1000 kWh × 0.0599 = 59.9 kg CO2e"""
    result = calcul_kg_co2e("Électricité", 1000)
    assert result == pytest.approx(59.9, rel=1e-4)


def test_calcul_energie_inconnue():
    """Une énergie absente du référentiel retourne None."""
    assert calcul_kg_co2e("Vapeur mystère", 100) is None


def test_calcul_quantite_zero():
    assert calcul_kg_co2e("Gasoil", 0) == 0.0


@pytest.mark.parametrize("energie", list(FACTEURS_ENERGIE.keys()))
def test_tous_les_facteurs_positifs(energie):
    """Chaque FE enregistré est strictement positif."""
    fe = FACTEURS_ENERGIE[energie]["fe"]
    assert fe > 0, f"FE de '{energie}' doit être > 0"


# ── enrichir_ligne ──────────────────────────────────────────────────────────

def test_enrichir_ligne_eau():
    row = enrichir_ligne({"energie": "Eau", "quantite": 16})
    assert row["kgCO2e"]           == pytest.approx(2.08, rel=1e-4)
    assert row["scope"]            == "3 amont"
    assert row["categorieEmission"] == "Produits et services achetés"
    assert row["feKgCO2eUnite"]    == pytest.approx(0.13)
    assert row["sourceValues"] == {"energie": "Eau", "quantite": 16}
    assert row["calculation"]["method"] == "internal_factor"
    assert row["calculation"]["kgCO2e"] == pytest.approx(2.08, rel=1e-4)
    assert row["calculation"]["factorName"] == "Eau"


def test_enrichir_ligne_electricite():
    row = enrichir_ligne({"energie": "Électricité", "quantite": 500})
    assert row["scope"] == "2"
    assert row["kgCO2e"] == pytest.approx(500 * 0.0599, rel=1e-4)


def test_enrichir_ligne_energie_inconnue():
    """Une ligne avec énergie inconnue est retournée sans modification."""
    row = {"energie": "Inconnu", "quantite": 10}
    result = enrichir_ligne(row.copy())
    assert "kgCO2e" not in result
    assert "scope"  not in result


def test_enrichir_ligne_ne_remplace_pas_valeurs_existantes():
    """Les valeurs déjà renseignées dans la ligne ne sont pas écrasées."""
    row = enrichir_ligne({
        "energie": "Eau",
        "quantite": 16,
        "scope": "custom-scope",
    })
    assert row["scope"] == "custom-scope"


def test_enrichir_ligne_trace_valeur_excel():
    row = enrichir_ligne({
        "energie": "Électricité",
        "quantite": 10,
        "feKgCO2eUnite": 0.5,
        "kgCO2e": 5,
    })
    assert row["sourceValues"]["feKgCO2eUnite"] == 0.5
    assert row["sourceValues"]["kgCO2e"] == 5
    assert row["calculation"]["method"] == "excel_value"
    assert row["calculation"]["feKgCO2eUnite"] == 0.5
    assert row["calculation"]["calculatedBy"] == "import"


def test_enrichir_ligne_achat_avec_lookup_excel():
    from services.calculator import build_fe_lookup, enrichir_ligne_achat

    fe_lookup = build_fe_lookup([
        ("Métaux (aluminium, cuivre, acier, etc.)", None, "kgCO2e/EUR"),
    ])
    row = enrichir_ligne_achat({
        "matiereConsommable": "Tube acier",
        "facteurEmission": "Métaux (aluminium, cuivre, acier, etc.)",
        "quantite": 1000,
        "unite": "kg",
        "montantEuro": 5000,
        "distanceFournisseur": 200,
        "moyenTransport": "Camion",
    }, fe_lookup, "achats_biens")

    assert row["feKgCO2eUnite"] == pytest.approx(0.98)
    assert row["kgCO2e"] == pytest.approx(4900.0)
    assert row["transportKgCO2e"] == pytest.approx(20.4)
    assert row["calculation"]["method"] == "excel_factor_lookup"


def test_enrichir_ligne_achat_sous_traitance_montant():
    from services.calculator import build_fe_lookup, enrichir_ligne_achat

    fe_lookup = build_fe_lookup([
        ("Machines et équipements", None, "kgCO2e/EUR"),
    ])
    row = enrichir_ligne_achat({
        "facteurEmission": "Machines et équipements",
        "montantEuro": 10000,
    }, fe_lookup, "sous_traitance")

    assert row["kgCO2e"] == pytest.approx(3500.0)
