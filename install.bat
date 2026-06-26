@echo off
setlocal
title CITBA - Installation locale
color 0A

echo ============================================
echo   CITBA - Installation locale production
echo ============================================
echo.

cd /d "%~dp0"

echo [1/4] Verification de Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas installe ou n'est pas dans le PATH.
    echo Installez Python 3.11+ puis relancez ce script.
    pause
    exit /b 1
)

echo [2/4] Installation backend Python...
cd /d "%~dp0backend"
if not exist ".venv\Scripts\python.exe" (
    python -m venv .venv
)
".venv\Scripts\python.exe" -m pip install --upgrade pip
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
    echo ERREUR: installation des dependances Python impossible.
    pause
    exit /b 1
)

echo [3/4] Verification de Node.js...
cd /d "%~dp0frontend"
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js / npm n'est pas installe ou n'est pas dans le PATH.
    echo Installez Node.js LTS puis relancez ce script.
    pause
    exit /b 1
)

echo [4/4] Installation frontend et build React...
npm install
if errorlevel 1 (
    echo ERREUR: npm install a echoue.
    pause
    exit /b 1
)
npm run build
if errorlevel 1 (
    echo ERREUR: build React impossible.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Installation terminee avec succes.
echo   Lancez start-prod.bat pour demarrer l'application.
echo ============================================
echo.
pause
