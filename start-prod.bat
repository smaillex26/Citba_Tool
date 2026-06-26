@echo off
setlocal
title CITBA - Outil Empreinte Carbone
color 0A

echo ============================================
echo   CITBA - Outil Empreinte Carbone
echo ============================================
echo.

cd /d "%~dp0"

if not exist "backend\.venv\Scripts\python.exe" (
    echo ERREUR: environnement Python absent.
    echo Lancez install.bat avant de demarrer l'application.
    pause
    exit /b 1
)

if not exist "frontend\dist\index.html" (
    echo ERREUR: frontend production absent.
    echo Lancez install.bat pour generer le build React.
    pause
    exit /b 1
)

echo Demarrage du serveur local...
echo Application: http://127.0.0.1:8001
echo API:         http://127.0.0.1:8001/api/health
echo.
echo Fermez cette fenetre pour arreter l'application.
echo.

start "" "http://127.0.0.1:8001"
cd /d "%~dp0backend"
".venv\Scripts\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8001
