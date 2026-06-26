from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import backup, data, emission_factors, exports, settings, upload
from services.database import init_db, seed_emission_factors
from services.emission_factors import default_emission_factors

PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"
FRONTEND_ASSETS = FRONTEND_DIST / "assets"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_emission_factors(default_emission_factors())
    yield

app = FastAPI(
    title="Citba – Outil Empreinte Carbone",
    description="API locale de traitement des données carbone",
    version="1.0.0",
    lifespan=lifespan,
)

# Autoriser le frontend Vite (localhost:5173) à appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(data.router,   prefix="/api")
app.include_router(emission_factors.router, prefix="/api")
app.include_router(exports.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(backup.router, prefix="/api")

if FRONTEND_ASSETS.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_ASSETS), name="assets")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/{full_path:path}", include_in_schema=False)
def serve_frontend(full_path: str):
    """Sert l'application React buildée en production."""
    if not FRONTEND_DIST.exists():
        raise HTTPException(
            status_code=404,
            detail="Frontend non buildé. Lancez install.bat ou npm run build dans frontend.",
        )

    dist_root = FRONTEND_DIST.resolve()
    requested_file = (FRONTEND_DIST / full_path).resolve()
    if full_path and requested_file.is_file() and dist_root in requested_file.parents:
        return FileResponse(requested_file)

    return FileResponse(FRONTEND_DIST / "index.html")
