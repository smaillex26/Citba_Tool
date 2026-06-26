from fastapi import APIRouter

from services.database import get_system_status

router = APIRouter(tags=["Paramètres"])

APP_VERSION = "1.0.0"


@router.get("/settings")
def get_settings():
    """Retourne les informations système utiles à l'exploitation locale."""
    status = get_system_status()
    return {
        "app": {
            "name": "CITBA - Outil Empreinte Carbone",
            "version": APP_VERSION,
        },
        **status,
    }
