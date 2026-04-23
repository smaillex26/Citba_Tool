import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile
from services.parser import parse_excel, inspect_excel

UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

router = APIRouter(tags=["Upload"])

# Suivi d'état des traitements en cours  { job_id: "pending"|"processing"|"done"|"error" }
_jobs: dict[str, dict] = {}


@router.post("/upload")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
):
    """Reçoit un fichier Excel et lance le traitement en arrière-plan."""
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Seuls les fichiers Excel (.xlsx/.xls) sont acceptés.")

    job_id = str(uuid.uuid4())
    dest = UPLOAD_DIR / f"{job_id}_{file.filename}"

    with dest.open("wb") as buf:
        shutil.copyfileobj(file.file, buf)

    _jobs[job_id] = {"status": "pending", "filename": file.filename}
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
        results = parse_excel(path)
        _jobs[job_id]["status"] = "done"
        _jobs[job_id]["datasets"] = list(results.keys())
    except Exception as exc:
        _jobs[job_id]["status"] = "error"
        _jobs[job_id]["detail"] = str(exc)
