@echo off
title Installation backend Citba
echo Installation de l'environnement Python...
cd /d "%~dp0"
python -m venv .venv
call .venv\Scripts\activate.bat
pip install -r requirements.txt
echo.
echo Installation terminee.
pause
