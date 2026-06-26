import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from services.database import get_user_by_email, get_user_by_id, seed_admin_user

AUTH_SECRET = os.getenv("AUTH_SECRET", "citba-local-development-secret")
ADMIN_EMAIL = os.getenv("CITBA_ADMIN_EMAIL", "admin@citba.local")
ADMIN_PASSWORD = os.getenv("CITBA_ADMIN_PASSWORD", "admin")
TOKEN_TTL_HOURS = int(os.getenv("AUTH_TOKEN_TTL_HOURS", "8"))

bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 120_000)
    return f"pbkdf2_sha256${salt}${digest.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        _, salt, expected = password_hash.split("$", 2)
    except ValueError:
        return False
    candidate = hash_password(password, salt).split("$", 2)[2]
    return hmac.compare_digest(candidate, expected)


def bootstrap_admin_user() -> None:
    seed_admin_user(ADMIN_EMAIL, hash_password(ADMIN_PASSWORD))


def _sign(payload: str) -> str:
    return hmac.new(AUTH_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()


def create_token(user: dict) -> str:
    expires_at = int((datetime.now(timezone.utc) + timedelta(hours=TOKEN_TTL_HOURS)).timestamp())
    payload = f"{user['id']}:{user['role']}:{expires_at}"
    token = f"{payload}:{_sign(payload)}"
    return base64.urlsafe_b64encode(token.encode()).decode()


def decode_token(token: str) -> dict:
    try:
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        user_id, role, expires_at, signature = decoded.rsplit(":", 3)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Session invalide.") from exc

    payload = f"{user_id}:{role}:{expires_at}"
    if not hmac.compare_digest(_sign(payload), signature):
        raise HTTPException(status_code=401, detail="Session invalide.")
    if int(expires_at) < int(datetime.now(timezone.utc).timestamp()):
        raise HTTPException(status_code=401, detail="Session expirée.")

    user = get_user_by_id(int(user_id))
    if user is None or not user["is_active"] or user["role"] != role:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable ou inactif.")
    return user


def authenticate(email: str, password: str) -> dict | None:
    user = get_user_by_email(email)
    if user is None or not user["is_active"]:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    user.pop("password_hash", None)
    return user


def current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> dict:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentification requise.")
    return decode_token(credentials.credentials)


def require_roles(*roles: str):
    def dependency(user: dict = Depends(current_user)) -> dict:
        if user["role"] not in roles:
            raise HTTPException(status_code=403, detail="Droits insuffisants.")
        return user

    return dependency
