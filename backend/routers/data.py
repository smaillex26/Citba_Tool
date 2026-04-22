import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

DATA_DIR = Path(__file__).parent.parent / "data"

router = APIRouter(tags=["Données"])

DATASETS = [
    "energie",
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
    Retourne les données JSON d'un jeu de données.
    Remplace les fichiers mock JS du frontend une fois le fichier importé.
    """
    if dataset not in DATASETS:
        raise HTTPException(status_code=404, detail=f"Jeu de données '{dataset}' inconnu.")

    data = _read(dataset)
    if data is None:
        raise HTTPException(
            status_code=404,
            detail=f"Aucune donnée disponible pour '{dataset}'. Importez d'abord un fichier Excel.",
        )
    return data


@router.get("/data")
def list_available():
    """Liste les jeux de données disponibles (fichier JSON présent)."""
    available = [name for name in DATASETS if (DATA_DIR / f"{name}.json").exists()]
    return {"available": available, "all": DATASETS}
