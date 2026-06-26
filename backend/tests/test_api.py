"""
Tests des endpoints FastAPI.
Utilise le TestClient de Starlette (synchrone, pas besoin d'asyncio).
"""
import json
import io
from pathlib import Path

import openpyxl
import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


# ── Health ─────────────────────────────────────────────────────────────────

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_settings_endpoint():
    res = client.get("/api/settings")
    assert res.status_code == 200
    body = res.json()
    assert body["app"]["version"]
    assert body["database"]["type"] in ("sqlite", "postgresql")
    assert "latest" in body["imports"]


# ── Données : dataset inexistant ────────────────────────────────────────────

def test_data_unknown_dataset():
    res = client.get("/api/data/inconnu")
    assert res.status_code == 404


def test_data_valid_dataset_no_file(tmp_path, monkeypatch):
    """Un dataset valide mais sans fichier JSON → 404."""
    import routers.data as data_router
    monkeypatch.setattr(data_router, "DATA_DIR", tmp_path)
    res = client.get("/api/data/energie")
    assert res.status_code == 404


def test_data_valid_dataset_with_file(tmp_path, monkeypatch):
    """Un dataset valide avec fichier JSON → 200 + contenu."""
    import routers.data as data_router
    monkeypatch.setattr(data_router, "DATA_DIR", tmp_path)

    sample = [{"id": 1, "site": "Arthez", "energie": "Eau", "kgCO2e": 2.08}]
    (tmp_path / "energie.json").write_text(json.dumps(sample), encoding="utf-8")

    res = client.get("/api/data/energie")
    assert res.status_code == 200
    assert res.json() == sample


def test_data_clim_dataset_with_file(tmp_path, monkeypatch):
    """Le dataset Clim est exposé comme un endpoint de données standard."""
    import routers.data as data_router
    monkeypatch.setattr(data_router, "DATA_DIR", tmp_path)

    sample = [{"id": 1, "site": "Arthez", "energie": "Climatiseur", "kgCO2e": 6264}]
    (tmp_path / "clim.json").write_text(json.dumps(sample), encoding="utf-8")

    res = client.get("/api/data/clim")
    assert res.status_code == 200
    assert res.json() == sample


def test_list_available_datasets(tmp_path, monkeypatch):
    """La route /api/data liste correctement les datasets présents."""
    import routers.data as data_router
    monkeypatch.setattr(data_router, "DATA_DIR", tmp_path)

    (tmp_path / "energie.json").write_text("[]", encoding="utf-8")
    (tmp_path / "dechets.json").write_text("[]",  encoding="utf-8")

    res = client.get("/api/data")
    assert res.status_code == 200
    body = res.json()
    assert "energie" in body["available"]
    assert "dechets"  in body["available"]


def test_import_history_endpoint():
    res = client.get("/api/imports")
    assert res.status_code == 200
    assert "imports" in res.json()


def test_delete_unknown_import():
    res = client.delete("/api/imports/999999")
    assert res.status_code == 404


def test_emission_factors_endpoint():
    res = client.get("/api/emission-factors")
    assert res.status_code == 200
    body = res.json()
    assert "factors" in body
    assert any(factor["name"] == "Électricité" for factor in body["factors"])


def test_create_and_update_emission_factor():
    create_res = client.post("/api/emission-factors", json={
        "name": "Test facteur",
        "factor_kg_co2e": 1.23,
        "category": "Test",
        "unit": "kg",
        "scope": "3 amont",
        "source": "Test",
        "year": 2026,
        "comment": "Créé par test",
    })
    assert create_res.status_code == 200
    factor = create_res.json()["factor"]

    update_res = client.put(f"/api/emission-factors/{factor['id']}", json={
        "name": "Test facteur modifié",
        "factor_kg_co2e": 2.34,
        "category": "Test",
        "unit": "kg",
        "scope": "3 amont",
        "source": "Test",
        "year": 2026,
        "comment": "Modifié par test",
    })
    assert update_res.status_code == 200
    updated = update_res.json()["factor"]
    assert updated["name"] == "Test facteur modifié"
    assert updated["factor_kg_co2e"] == 2.34


def test_recalculate_latest_import_with_current_factors():
    from services.database import delete_import, get_latest_dataset, replace_latest_import

    summary = {
        "total_rows": 1,
        "dataset_count": 1,
        "datasets": [{"key": "energie", "label": "Energie", "rows": 1}],
    }
    import_run = replace_latest_import(
        "test-recalcul.xlsx",
        {"energie": [{"site": "Arthez", "energie": "Électricité", "quantite": 10, "kgCO2e": 999}]},
        summary,
    )

    try:
        res = client.post("/api/emission-factors/recalculate-latest")
        assert res.status_code == 200
        body = res.json()
        assert body["updated_rows"] == 1

        rows = get_latest_dataset("energie")
        assert rows[0]["feKgCO2eUnite"] == 0.0599
        assert rows[0]["kgCO2e"] == 0.6
    finally:
        delete_import(import_run.id)


# ── Upload ──────────────────────────────────────────────────────────────────

def _make_excel_bytes(sheet_name: str = "Energie") -> bytes:
    """Crée un fichier Excel en mémoire avec un onglet minimal."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = sheet_name
    ws.append(["Site", "Energie", "Quantite", "Unite"])
    ws.append(["Arthez", "Eau", 16, "m3"])
    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


def test_upload_wrong_extension():
    res = client.post(
        "/api/upload",
        files={"file": ("data.csv", b"col1,col2\n1,2", "text/csv")},
    )
    assert res.status_code == 400
    assert "Excel" in res.json()["detail"]


def test_upload_valid_excel(tmp_path, monkeypatch):
    """Upload d'un .xlsx valide → job_id retourné, statut devient 'done'."""
    import routers.upload as upload_router
    import services.parser as parser_mod

    monkeypatch.setattr(upload_router, "UPLOAD_DIR", tmp_path)
    monkeypatch.setattr(parser_mod, "DATA_DIR", tmp_path)

    excel_bytes = _make_excel_bytes("Energie")
    res = client.post(
        "/api/upload",
        files={"file": ("test.xlsx", excel_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
    )
    assert res.status_code == 200
    body = res.json()
    assert "job_id" in body

    job_id = body["job_id"]

    # Attendre la fin du traitement en arrière-plan (le TestClient exécute les
    # BackgroundTasks de façon synchrone)
    status_res = client.get(f"/api/upload/status/{job_id}")
    assert status_res.status_code == 200
    body = status_res.json()
    assert body["status"] in ("done", "processing", "pending")
    if body["status"] == "done":
        assert body["summary"]["total_rows"] == 1
        assert body["summary"]["datasets"][0]["key"] == "energie"

        excel_res = client.get("/api/exports/excel")
        assert excel_res.status_code == 200
        assert excel_res.headers["content-type"].startswith(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        pdf_res = client.get("/api/exports/pdf")
        assert pdf_res.status_code == 200
        assert pdf_res.headers["content-type"].startswith("application/pdf")

        report_res = client.get(f"/api/exports/imports/{body['import_id']}/report")
        assert report_res.status_code == 200
        assert report_res.headers["content-type"].startswith("text/csv")
        assert "Rapport d'import" in report_res.text

        delete_res = client.delete(f"/api/imports/{body['import_id']}")
        assert delete_res.status_code == 200
        assert delete_res.json()["deleted"] == body["import_id"]


def test_upload_status_unknown_job():
    res = client.get("/api/upload/status/job-inconnu-123")
    assert res.status_code == 404
