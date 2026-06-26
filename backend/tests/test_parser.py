"""
Tests d'intégration du module services/parser.py.
Crée des fichiers Excel en mémoire pour simuler un import réel.
"""
import io
import json
from pathlib import Path

import openpyxl
import pytest

from services.parser import parse_excel, _normalize, ONGLET_MAP, COLONNE_MAP


# ── Helpers ─────────────────────────────────────────────────────────────────

def make_excel(sheets: dict[str, list[list]], title_rows: int = 0) -> io.BytesIO:
    """
    Crée un fichier Excel en mémoire.
    sheets = { "Nom onglet": [[header1, header2], [val1, val2], ...] }
    title_rows : nombre de lignes de titre à insérer avant les en-têtes.
    """
    wb = openpyxl.Workbook()
    first = True
    for sheet_name, rows in sheets.items():
        if first:
            ws = wb.active
            ws.title = sheet_name
            first = False
        else:
            ws = wb.create_sheet(sheet_name)
        # Insérer des lignes de titre vides / avec texte quelconque
        for _ in range(title_rows):
            ws.append(["Calculette Carbone CITBA - Données internes"])
        for row in rows:
            ws.append(row)
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return buf


# ── _normalize ───────────────────────────────────────────────────────────────

def test_normalize_strips_whitespace():
    assert _normalize("  Eau  ") == "eau"


def test_normalize_lowercases():
    assert _normalize("Énergie et Process") == "énergie et process"


# ── ONGLET_MAP ───────────────────────────────────────────────────────────────

def test_onglet_map_energie_variants():
    assert ONGLET_MAP.get("énergie et process") == "energie"
    assert ONGLET_MAP.get("energie")             == "energie"


def test_onglet_map_dechets():
    assert ONGLET_MAP.get("déchets") == "dechets"


# ── parse_excel : onglet inconnu ─────────────────────────────────────────────

def test_parse_onglet_inconnu(tmp_path, monkeypatch):
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    buf = make_excel({"Onglet inconnu": [["Col1"], ["val1"]]})
    # Écrire dans un fichier temporaire (parse_excel attend un Path)
    xlsx = tmp_path / "test.xlsx"
    xlsx.write_bytes(buf.read())

    results = parse_excel(xlsx)
    assert results == {}


# ── parse_excel : onglet Energie ─────────────────────────────────────────────

def test_parse_energie_simple(tmp_path, monkeypatch):
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    buf = make_excel({
        "Energie": [
            ["Site", "Energie", "Quantite", "Unite"],
            ["Arthez", "Eau",         16,  "m3"],
            ["Arthez", "Électricité", 285000, "kWh"],
        ]
    })
    xlsx = tmp_path / "energie_test.xlsx"
    xlsx.write_bytes(buf.read())

    results = parse_excel(xlsx)

    assert "energie" in results
    rows = results["energie"]
    assert len(rows) == 2

    eau = next(r for r in rows if r["energie"] == "Eau")
    assert eau["kgCO2e"] == pytest.approx(16 * 0.13, rel=1e-4)
    assert eau["scope"]  == "3 amont"
    # pourcentage est désormais calculé côté frontend (GroupedDataTable), pas dans le parser
    assert "pourcentage" not in eau


def test_parse_energie_necrit_pas_json_par_defaut(tmp_path, monkeypatch):
    """Le parser retourne les lignes en mémoire sans écrire de JSON par défaut."""
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    buf = make_excel({
        "Energie": [
            ["Site", "Energie", "Quantite", "Unite"],
            ["Pontonx", "Gasoil", 1000, "L"],
        ]
    })
    xlsx = tmp_path / "test2.xlsx"
    xlsx.write_bytes(buf.read())
    results = parse_excel(xlsx)

    json_path = tmp_path / "energie.json"
    assert not json_path.exists()
    assert results["energie"][0]["energie"] == "Gasoil"


def test_parse_energie_json_sauvegarde_mode_diagnostic(tmp_path, monkeypatch):
    """Le JSON reste disponible si le mode diagnostic est explicitement demandé."""
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    buf = make_excel({
        "Energie": [
            ["Site", "Energie", "Quantite", "Unite"],
            ["Pontonx", "Gasoil", 1000, "L"],
        ]
    })
    xlsx = tmp_path / "test2_debug.xlsx"
    xlsx.write_bytes(buf.read())
    parse_excel(xlsx, write_json=True)

    json_path = tmp_path / "energie.json"
    assert json_path.exists()
    data = json.loads(json_path.read_text(encoding="utf-8"))
    assert len(data) == 1
    assert data[0]["energie"] == "Gasoil"


def test_parse_plusieurs_onglets(tmp_path, monkeypatch):
    """Un fichier avec plusieurs onglets reconnus remplit plusieurs datasets."""
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    buf = make_excel({
        "Energie":   [["Site", "Energie", "Quantite", "Unite"], ["Arthez", "Eau", 16, "m3"]],
        "Déchets":   [["Site", "Type déchet", "Quantite"], ["Arthez", "Carton", 200]],
    })
    xlsx = tmp_path / "multi.xlsx"
    xlsx.write_bytes(buf.read())

    results = parse_excel(xlsx)
    assert "energie" in results
    assert "dechets" in results


def test_parse_lignes_vides_ignorees(tmp_path, monkeypatch):
    """Les lignes entièrement vides ne doivent pas apparaître dans les résultats."""
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    buf = make_excel({
        "Energie": [
            ["Site", "Energie", "Quantite", "Unite"],
            ["Arthez", "Eau", 16, "m3"],
            [None, None, None, None],
            ["Arthez", "Argon", 100, "m3"],
        ]
    })
    xlsx = tmp_path / "vides.xlsx"
    xlsx.write_bytes(buf.read())

    results = parse_excel(xlsx)
    assert len(results["energie"]) == 2


def test_parse_avec_lignes_titre_avant_entetes(tmp_path, monkeypatch):
    """
    Cas réel : le fichier contient des lignes de titre avant les vrais en-têtes.
    Le parser doit détecter automatiquement la bonne ligne d'en-tête.
    """
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    # 3 lignes de titre avant les vraies colonnes
    buf = make_excel(
        {
            "Energie": [
                ["Site", "Energie", "Quantite", "Unite"],
                ["Arthez", "Eau", 16, "m3"],
                ["Pontonx", "Gasoil", 500, "L"],
            ]
        },
        title_rows=3,
    )
    xlsx = tmp_path / "avec_titre.xlsx"
    xlsx.write_bytes(buf.read())

    results = parse_excel(xlsx)

    assert "energie" in results
    rows = results["energie"]
    assert len(rows) == 2
    assert rows[0]["energie"] == "Eau"
    assert rows[1]["energie"] == "Gasoil"


def test_inspect_excel(tmp_path, monkeypatch):
    """inspect_excel retourne le bon rapport de diagnostic."""
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    buf = make_excel({
        "Energie": [
            ["Arthez"],
            ["Energie", "Quantite", "Unite"],
            ["Eau", 16, "m3"],
        ]
    })
    xlsx = tmp_path / "inspect.xlsx"
    xlsx.write_bytes(buf.read())

    from services.parser import inspect_excel
    report = inspect_excel(xlsx)

    assert "sheets" in report
    sheet = report["sheets"][0]
    assert sheet["dataset"] == "energie"
    assert "Arthez" in sheet["sites_detected"]
    assert "energie" in sheet["columns_recognized"]


def test_parse_site_au_dessus_du_tableau(tmp_path, monkeypatch):
    """
    Format réel : nom du site écrit seul au-dessus de chaque mini-tableau,
    sans colonne 'Site' dans les données.
    """
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    buf = make_excel({
        "Energie": [
            ["Arthez"],
            ["Energie", "Quantite", "Unite"],
            ["Eau", 16, "m3"],
            ["Gasoil", 500, "L"],
            [],
            ["Palplast"],
            ["Energie", "Quantite", "Unite"],
            ["Eau", 20, "m3"],
        ]
    })
    xlsx = tmp_path / "multi_site.xlsx"
    xlsx.write_bytes(buf.read())

    results = parse_excel(xlsx)

    assert "energie" in results
    rows = results["energie"]
    assert len(rows) == 3

    sites = {r["site"] for r in rows}
    assert "Arthez" in sites
    assert "Palplast" in sites

    arthez_eau = next(r for r in rows if r["site"] == "Arthez" and r["energie"] == "Eau")
    assert arthez_eau["kgCO2e"] == pytest.approx(16 * 0.13, rel=1e-3)


def test_parse_tous_les_onglets_metier_importants(tmp_path, monkeypatch):
    """Chaque onglet métier attendu doit alimenter son dataset dédié."""
    import services.parser as parser_mod
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    clim_row = [None] * 17
    clim_row[0] = "Climatiseur R410A"
    clim_row[9] = 3
    clim_row[11] = "R410A"
    clim_row[12] = 2088
    clim_row[13] = 6264
    clim_row[14] = 1
    clim_row[15] = "Émissions fugitives"
    clim_row[16] = "Scope 1"

    buf = make_excel({
        "Energie": [
            ["Site", "Energie", "Quantite", "Unite"],
            ["Arthez", "Eau", 16, "m3"],
        ],
        "Clim": [
            ["Arthez"],
            ["Climatiseur fonctionnement"],
            clim_row,
        ],
        "Intrants - Pontonx": [
            ["Matières premières / Consommables", "Famille", "Quantite", "Unite"],
            ["Acier", "Métal", 10, "kg"],
        ],
        "Achats services": [
            ["Site", "Société", "Type prestation", "Montant"],
            ["Arthez", "Bureau Conseil", "Audit", 1200],
        ],
        "Déplacements professionnels": [
            ["Site", "Moyen de déplacement", "Nombre de km réalisés par an"],
            ["Palplast", "Voiture", 3500],
        ],
        "Déplacements DT": [
            [
                "Site",
                "Distance moyenne domicile travail (km)",
                "Nombre de fois que vous réalisez cette distance par jour",
                "Nb de jours travaillés sur la période",
                "Avez-vous un second moyen de déplacement pour ces aller-retours ? Si oui, dans quelle propotion l'utilisez-vous ?",
            ],
            ["Infautelec", 12, 2, 210, "Vélo", 0.2],
        ],
        "Déchets": [
            ["Site", "Nom du déchet", "Code déchet", "Quantite", "Unite", "Mode de traitement"],
            ["Pontonx", "Carton", "15 01 01", 2, "t", "Recyclage"],
        ],
        "Fret": [
            ["Site", "Nom du transporteur", "Transport aval ou intersite ?", "Lieu de départ", "Lieu d'arrivée", "Distance parcourue (km)", "Quantite"],
            ["Arthez", "Transport Sud", "Aval", "Arthez", "Paris", 780, 4],
        ],
        "Sous-traitance": [
            ["Site", "Nom de la société de sous-traitance", "Type de prestation réalisée", "Montant"],
            ["Palplast", "Maintenance Plus", "Maintenance", 2500],
        ],
        "Biens immobilisés": [
            ["Site", "Surface de terre convertie", "Durée d'amortissement"],
            ["Arthez", 100, 20],
            [],
            ["Actif en leasing"],
            ["Site", "Matériel/Equipement", "Durée de la LLD", "Quantite", "Unite"],
            ["Arthez", "Chariot élévateur", 36, 1, "unité"],
        ],
    })
    xlsx = tmp_path / "citba_complet.xlsx"
    xlsx.write_bytes(buf.read())

    results = parse_excel(xlsx)

    expected = {
        "energie",
        "clim",
        "achats_biens",
        "achats_services",
        "deplacements_pro",
        "deplacements_dt",
        "dechets",
        "transport_aval",
        "sous_traitance",
        "biens_immobilises",
        "actifs_leasing",
    }
    assert expected.issubset(results.keys())
    assert all(len(results[key]) >= 1 for key in expected)
    assert results["achats_biens"][0]["site"] == "Pontonx"
    assert results["clim"][0]["scope"] == "1"
    assert results["actifs_leasing"][0]["materielEquipement"] == "Chariot élévateur"
