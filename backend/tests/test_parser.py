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


def test_parse_energie_json_sauvegarde(tmp_path, monkeypatch):
    """Le JSON doit être écrit sur disque après le parse."""
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
    parse_excel(xlsx)

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
