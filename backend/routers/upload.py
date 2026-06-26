import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile
from services.auth import require_roles
from services.database import replace_latest_import
from services.parser import parse_excel, inspect_excel

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter(tags=["Upload"])

# Suivi d'état des traitements en cours  { job_id: "pending"|"processing"|"done"|"error" }
_jobs: dict[str, dict] = {}


DATASET_LABELS = {
    "energie": "Énergie et Process",
    "clim": "Clim",
    "achats_biens": "Achats de biens",
    "achats_services": "Achats de services",
    "biens_immobilises": "Biens immobilisés",
    "deplacements_pro": "Déplacements professionnels",
    "dechets": "Déchets",
    "transport_aval": "Transport aval & Fin de vie",
    "sous_traitance": "Sous-traitance",
    "deplacements_dt": "Déplacements domicile-travail",
    "actifs_leasing": "Actifs en leasing",
}

DATASET_REQUIRED_COLUMNS = {
    "energie": ["site", "energie", "quantite"],
    "clim": ["site", "energie", "quantite", "kgCO2e"],
    "achats_biens": ["site", "matiereConsommable", "quantite"],
    "achats_services": ["site", "typePrestation", "montantEuro"],
    "biens_immobilises": ["site", "surfaceTerre"],
    "deplacements_pro": ["site", "moyenDeplacement"],
    "dechets": ["site", "nomDechet", "quantite"],
    "transport_aval": ["site", "typeTransport"],
    "sous_traitance": ["site", "societe", "montantEuro"],
    "deplacements_dt": ["site", "distanceDomTravail", "nbJoursTravailles"],
    "actifs_leasing": ["site", "materielEquipement"],
}


@router.post("/upload")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user: dict = Depends(require_roles("contributor", "admin")),
):
    """Reçoit un fichier Excel et lance le traitement en arrière-plan."""
    filename = file.filename or ""
    if not filename.lower().endswith((".xlsx", ".xls")):
        raise HTTPException(
            status_code=400,
            detail="Format non supporté : importez un fichier Excel .xlsx ou .xls.",
        )

    job_id = str(uuid.uuid4())
    dest = UPLOAD_DIR / f"{job_id}_{filename}"

    with dest.open("wb") as buf:
        shutil.copyfileobj(file.file, buf)

    _jobs[job_id] = {"status": "pending", "filename": filename}
    background_tasks.add_task(_process, job_id, dest)

    return {"job_id": job_id, "status": "pending"}


@router.get("/upload/status/{job_id}")
def job_status(job_id: str):
    """Retourne l'état du traitement d'un fichier."""
    if job_id not in _jobs:
        raise HTTPException(status_code=404, detail="Job inconnu.")
    return _jobs[job_id]


@router.post("/debug/sheets")
async def debug_sheets(file: UploadFile = File(...)):
    """
    Diagnostic : retourne les onglets du fichier, la ligne d'en-tête détectée
    et les colonnes reconnues — sans modifier les données.
    """
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Seuls les fichiers Excel (.xlsx/.xls) sont acceptés.")

    tmp = UPLOAD_DIR / f"debug_{file.filename}"
    with tmp.open("wb") as buf:
        shutil.copyfileobj(file.file, buf)

    try:
        return inspect_excel(tmp)
    finally:
        tmp.unlink(missing_ok=True)


def _process(job_id: str, path: Path):
    """Traitement réel : parsing + sauvegarde JSON."""
    _jobs[job_id]["status"] = "processing"
    try:
        inspection = inspect_excel(path)
        results = parse_excel(path)
        summary = _build_summary(results, inspection)
        import_run = replace_latest_import(_jobs[job_id]["filename"], results, summary)
        _jobs[job_id]["status"] = "done"
        _jobs[job_id]["datasets"] = list(results.keys())
        _jobs[job_id]["import_id"] = import_run.id
        _jobs[job_id]["summary"] = summary
    except Exception as exc:
        _jobs[job_id]["status"] = "error"
        _jobs[job_id]["detail"] = (
            "Impossible d'analyser ce fichier Excel. Vérifiez qu'il respecte "
            "la structure attendue puis réessayez."
        )
        _jobs[job_id]["technical_detail"] = str(exc)
    finally:
        path.unlink(missing_ok=True)


def _build_summary(results: dict[str, list], inspection: dict | None = None) -> dict:
    datasets = [
        {
            "key": key,
            "label": DATASET_LABELS.get(key, key),
            "rows": len(rows),
        }
        for key, rows in results.items()
    ]
    sheets = inspection.get("sheets", []) if inspection else []
    recognized_sheets = [
        {
            "sheet": item["sheet"],
            "dataset": item["dataset"],
            "label": DATASET_LABELS.get(item["dataset"], item["dataset"]),
            "sites_detected": item.get("sites_detected", []),
            "columns_recognized": item.get("columns_recognized", []),
            "expected_columns": DATASET_REQUIRED_COLUMNS.get(item["dataset"], []),
            "missing_columns": [
                column
                for column in DATASET_REQUIRED_COLUMNS.get(item["dataset"], [])
                if column not in item.get("columns_recognized", [])
            ],
        }
        for item in sheets
        if item.get("dataset")
    ]
    for item in recognized_sheets:
        item["validation_status"] = "ok" if not item["missing_columns"] else "partial"

    ignored_sheets = [
        {"sheet": item["sheet"], "validation_status": "ignored"}
        for item in sheets
        if not item.get("dataset")
    ]
    return {
        "datasets": datasets,
        "total_rows": sum(item["rows"] for item in datasets),
        "dataset_count": len(datasets),
        "recognized_sheets": recognized_sheets,
        "ignored_sheets": ignored_sheets,
    }
