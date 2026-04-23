"""
Configuration pytest : ajoute le dossier backend/ au sys.path pour que
les imports relatifs (from services.calculator import ...) fonctionnent
sans avoir à installer le package.
"""
import sys
from pathlib import Path

# Ajoute backend/ au chemin de recherche des modules
sys.path.insert(0, str(Path(__file__).parent.parent))
