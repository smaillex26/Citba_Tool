from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from services.auth import authenticate, create_token, current_user

router = APIRouter(tags=["Authentification"])


class LoginPayload(BaseModel):
    email: str = Field(min_length=3)
    password: str


@router.post("/auth/login")
def login(payload: LoginPayload):
    user = authenticate(payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Identifiants invalides.")
    return {"token": create_token(user), "user": user}


@router.get("/auth/me")
def me(user: dict = Depends(current_user)):
    return {"user": user}
