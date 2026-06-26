from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.database import (
    create_emission_factor,
    list_emission_factors,
    recalculate_latest_import_with_factors,
    replace_emission_factors,
    seed_emission_factors,
    update_emission_factor,
)
from services.emission_factors import default_emission_factors

router = APIRouter(tags=["Facteurs d'émission"])


class EmissionFactorPayload(BaseModel):
    name: str = Field(min_length=1)
    factor_kg_co2e: float = Field(ge=0)
    category: str | None = None
    unit: str | None = None
    scope: str | None = None
    source: str | None = None
    year: int | None = None
    comment: str | None = None


@router.get("/emission-factors")
def get_emission_factors():
    """Liste les facteurs d'émission stockés en base."""
    seed_emission_factors(default_emission_factors())
    return {"factors": list_emission_factors()}


@router.post("/emission-factors/reset")
def reset_emission_factors():
    """Réinitialise la table avec les facteurs internes actuels."""
    count = replace_emission_factors(default_emission_factors())
    return {"status": "ok", "count": count}


@router.post("/emission-factors")
def create_factor(payload: EmissionFactorPayload):
    """Crée un nouveau facteur d'émission."""
    return {"factor": create_emission_factor(payload.model_dump())}


@router.put("/emission-factors/{factor_id}")
def update_factor(factor_id: int, payload: EmissionFactorPayload):
    """Modifie un facteur d'émission existant."""
    factor = update_emission_factor(factor_id, payload.model_dump())
    if factor is None:
        raise HTTPException(status_code=404, detail="Facteur d'émission introuvable.")
    return {"factor": factor}


@router.post("/emission-factors/recalculate-latest")
def recalculate_latest_import():
    """Recalcule le dernier import avec les facteurs d'émission actuellement en base."""
    result = recalculate_latest_import_with_factors()
    if result is None:
        raise HTTPException(status_code=404, detail="Aucun import disponible à recalculer.")
    return {"status": "ok", **result}
