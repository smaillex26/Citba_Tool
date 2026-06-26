import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from services.database import (
    delete_import,
    get_latest_dataset,
    list_import_history,
    list_latest_available_datasets,
)

DEFAULT_DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR = DEFAULT_DATA_DIR

router = APIRouter(tags=["Données"])

DATASETS = [
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
]


def _read(name: str):
    path = DATA_DIR / f"{name}.json"
    if not path.exists():
        return None
    with path.open(encoding="utf-8") as f:
        return json.load(f)


@router.get("/data/{dataset}")
def get_dataset(dataset: str):
    """
    Retourne les données du dernier import pour un jeu de données.
    """
    if dataset not in DATASETS:
        raise HTTPException(status_code=404, detail=f"Jeu de données '{dataset}' inconnu.")

    # En application normale, la base est la source de vérité.
    # Le fallback JSON ne sert que pour les tests/compatibilité quand DATA_DIR est monkeypatché.
    data = get_latest_dataset(dataset) if DATA_DIR == DEFAULT_DATA_DIR else _read(dataset)
    if data is None:
        raise HTTPException(
            status_code=404,
            detail=f"Aucune donnée disponible pour '{dataset}'. Importez d'abord un fichier Excel.",
        )
    return data


@router.get("/data")
def list_available():
    """Liste les jeux de données disponibles dans le dernier import."""
    available = (
        list_latest_available_datasets(DATASETS)
        if DATA_DIR == DEFAULT_DATA_DIR
        else [name for name in DATASETS if (DATA_DIR / f"{name}.json").exists()]
    )
    return {"available": available, "all": DATASETS}


@router.get("/imports")
def imports_history():
    """Retourne l'historique des imports Excel."""
    return {"imports": list_import_history()}


@router.delete("/imports/{import_id}")
def remove_import(import_id: int):
    """Supprime un import et toutes ses lignes de données associées."""
    deleted = delete_import(import_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Import introuvable.")
    return {"status": "ok", "deleted": import_id}
