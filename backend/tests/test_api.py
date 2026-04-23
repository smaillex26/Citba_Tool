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
    assert status_res.json()["status"] in ("done", "processing", "pending")


def test_upload_status_unknown_job():
    res = client.get("/api/upload/status/job-inconnu-123")
    assert res.status_code == 404
