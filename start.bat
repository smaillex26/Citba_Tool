@echo off
title Citba - Outil Empreinte Carbone
color 0A
echo ============================================
echo   Citba - Outil Empreinte Carbone (local)
echo ============================================
echo.

REM --- Backend Python ---
echo [1/2] Demarrage du backend (FastAPI)...
cd /d "%~dp0backend"

REM Verifier si l'environnement virtuel existe, sinon le creer
if not exist ".venv\Scripts\activate.bat" (
    echo    Creation de l'environnement virtuel Python...
    python -m venv .venv
    echo    Installation des dependances...
    call .venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call .venv\Scripts\activate.bat
)

start "Backend FastAPI" cmd /k "uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
echo    Backend lance sur http://localhost:8000
echo.

REM --- Frontend React ---
echo [2/2] Demarrage du frontend (React/Vite)...
cd /d "%~dp0frontend"
start "Frontend Vite" cmd /k "npm run dev"
echo    Frontend lance sur http://localhost:5173
echo.

echo ============================================
echo   Ouvrez votre navigateur sur :
echo   http://localhost:5173
echo ============================================
echo.
pause
