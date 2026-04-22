from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, data

app = FastAPI(
    title="Citba – Outil Empreinte Carbone",
    description="API locale de traitement des données carbone",
    version="1.0.0",
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


@app.get("/api/health")
def health():
    return {"status": "ok"}
