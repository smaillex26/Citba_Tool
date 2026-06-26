# CITBA - Outil Empreinte Carbone

Application locale pour importer la calculette carbone Excel CITBA, analyser les onglets métier et consulter les résultats par catégorie, site et dashboard.

## Prérequis

- Windows 10/11
- Python 3.11 ou plus récent
- Node.js LTS avec npm
- Accès au dossier du projet sur le poste de l'entreprise

## Installation locale production

Depuis la racine du projet, lancer :

```bat
install.bat
```

Le script effectue les actions suivantes :

- crée l'environnement Python `backend\.venv` si nécessaire ;
- installe les dépendances backend depuis `backend\requirements.txt` ;
- installe les dépendances frontend avec `npm install` ;
- génère le build React de production dans `frontend\dist`.

Cette étape est à faire lors de la première installation, puis après chaque mise à jour du code.

## Configuration PostgreSQL

En entreprise, configurez une base PostgreSQL et exposez l'URL de connexion dans la variable d'environnement `DATABASE_URL`.

Exemple :

```bat
set DATABASE_URL=postgresql+psycopg://citba_user:mot_de_passe@localhost:5432/citba_tool
```

Format attendu :

```text
postgresql+psycopg://UTILISATEUR:MOT_DE_PASSE@HOTE:PORT/NOM_BASE
```

Au démarrage, l'application crée automatiquement les tables nécessaires :

- `import_runs` : historique des imports ;
- `dataset_rows` : lignes importées par dataset ;
- `emission_factors` : référentiel des facteurs d'émission ;
- `export_runs` : traces des exports générés.

Si `DATABASE_URL` n'est pas défini, l'application utilise une base locale SQLite dans `backend\data\citba.db`. C'est pratique pour le développement, mais PostgreSQL est recommandé pour l'installation entreprise.

## Lancement production

Après installation, lancer :

```bat
start-prod.bat
```

L'application est disponible à l'adresse :

```text
http://127.0.0.1:8001
```

En production locale, FastAPI sert à la fois :

- l'API sous `/api` ;
- l'interface React buildée depuis `frontend\dist`.

Le frontend Vite n'est pas lancé en production.

## Mode développement

Pour développer l'application avec le rechargement Vite côté React :

```bat
start.bat
```

Adresses utilisées :

- Frontend Vite : `http://localhost:5173`
- Backend FastAPI : `http://localhost:8001`

Le proxy Vite redirige les appels `/api` vers le backend local.

## Tests et validations

Backend :

```bat
cd backend
.venv\Scripts\python.exe -m pytest -q
```

Frontend :

```bat
cd frontend
npm test
npm run lint
npm run build
```

## Données locales

Les fichiers Excel uploadés sont temporaires et supprimés après traitement.

Les JSON générés après import sont stockés dans :

```text
backend\data
```

Ils ne sont pas versionnés dans Git.

Le stockage applicatif principal est désormais la base configurée par `DATABASE_URL`. Les JSON restent uniquement une compatibilité technique du parser.

## Exports

Après import, le tableau de bord propose :

- export Excel multi-onglets ;
- export PDF de synthèse.

## Dépannage

Si `start-prod.bat` indique que le frontend production est absent, relancer :

```bat
install.bat
```

Si le port `8001` est déjà utilisé, fermer l'autre application qui utilise ce port ou modifier le port dans `start-prod.bat`, `start.bat` et `frontend\vite.config.js`.

Si l'import échoue, vérifier que le fichier est bien un `.xlsx` ou `.xls` et qu'il respecte la structure de la calculette CITBA attendue.
