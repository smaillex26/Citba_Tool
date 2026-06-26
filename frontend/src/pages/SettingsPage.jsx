import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { getSettings } from "../services/api.js";

function formatDate(value) {
  if (!value) return "Aucun import";
  return new Date(value).toLocaleString("fr-FR");
}

function SettingsPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  return (
    <PageContainer
      title="Paramètres"
      description="État technique de l'application locale, base de données utilisée et dernier import actif."
      actions={
        settings
          ? <span className="data-source-badge data-source-badge--live">Backend connecté</span>
          : <span className="data-source-badge data-source-badge--mock">Backend indisponible</span>
      }
    >
      {!settings ? (
        <ImportRequiredState
          title="Paramètres indisponibles"
          message="Le backend ne répond pas. Vérifiez que l'application est bien démarrée."
        />
      ) : (
        <>
          <div className="summary-grid">
            <SummaryCard label="Version" value={settings.app.version} helper={settings.app.name} accent="blue" />
            <SummaryCard
              label="Base utilisée"
              value={settings.database.type === "postgresql" ? "PostgreSQL" : "SQLite"}
              helper={settings.database.is_default_sqlite ? "Mode local par défaut" : "DATABASE_URL configurée"}
              accent={settings.database.type === "postgresql" ? "green" : "amber"}
            />
            <SummaryCard label="Imports" value={String(settings.imports.count)} helper="Historique en base" accent="slate" />
            <SummaryCard label="Facteurs FE" value={String(settings.emission_factors.count)} helper="Référentiel disponible" accent="green" />
          </div>

          <div className="settings-grid">
            <article className="settings-card">
              <h3>Base de données</h3>
              <dl>
                <div>
                  <dt>Type</dt>
                  <dd>{settings.database.type}</dd>
                </div>
                <div>
                  <dt>URL</dt>
                  <dd>{settings.database.url}</dd>
                </div>
              </dl>
            </article>

            <article className="settings-card">
              <h3>Dernier import actif</h3>
              {settings.imports.latest ? (
                <dl>
                  <div>
                    <dt>Fichier</dt>
                    <dd>{settings.imports.latest.filename}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{formatDate(settings.imports.latest.created_at)}</dd>
                  </div>
                  <div>
                    <dt>Lignes</dt>
                    <dd>{settings.imports.latest.total_rows.toLocaleString("fr-FR")}</dd>
                  </div>
                  <div>
                    <dt>Pages alimentées</dt>
                    <dd>{settings.imports.latest.dataset_count}</dd>
                  </div>
                </dl>
              ) : (
                <p>Aucun import actif pour le moment.</p>
              )}
            </article>
          </div>
        </>
      )}
    </PageContainer>
  );
}

export default SettingsPage;
