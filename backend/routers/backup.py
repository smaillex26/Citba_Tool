import shutil
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from services.database import DATABASE_URL, DEFAULT_DATABASE_URL, DATA_DIR, engine, init_db

router = APIRouter(tags=["Sauvegarde"])


def _sqlite_db_path() -> Path:
    if DATABASE_URL != DEFAULT_DATABASE_URL:
        raise HTTPException(
            status_code=400,
            detail="Sauvegarde directe disponible uniquement en mode SQLite local.",
        )
    return DATA_DIR / "citba.db"


@router.get("/backup/download")
def download_backup():
    """Télécharge une copie de la base SQLite locale."""
    db_path = _sqlite_db_path()
    if not db_path.exists():
        raise HTTPException(status_code=404, detail="Base SQLite locale introuvable.")

    stamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    return FileResponse(
        db_path,
        media_type="application/octet-stream",
        filename=f"citba_backup_{stamp}.db",
    )


@router.post("/backup/restore")
async def restore_backup(file: UploadFile = File(...)):
    """Remplace la base SQLite locale par une sauvegarde fournie."""
    db_path = _sqlite_db_path()
    filename = file.filename or ""
    if not filename.lower().endswith((".db", ".sqlite", ".sqlite3")):
        raise HTTPException(status_code=400, detail="Importez une sauvegarde SQLite .db/.sqlite/.sqlite3.")

    tmp_path = DATA_DIR / f"restore_{filename}"
    with tmp_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        engine.dispose()
        shutil.copyfile(tmp_path, db_path)
        init_db()
    finally:
        tmp_path.unlink(missing_ok=True)

    return {"status": "ok", "restored": filename}
