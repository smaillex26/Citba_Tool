import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { backupDownloadUrl, getSettings, restoreBackup } from "../services/api.js";

function formatDate(value) {
  if (!value) return "Aucun import";
  return new Date(value).toLocaleString("fr-FR");
}

function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  async function handleRestore(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("");
    setMessageType("success");
    const result = await restoreBackup(file);
    if (result?.success === false) {
      setMessageType("error");
      setMessage(result.message);
      return;
    }
    setMessage("Sauvegarde restaurée. Redémarrez l'application si les données affichées ne changent pas immédiatement.");
    getSettings().then(setSettings);
  }

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
          {message && (
            <p className={`import-status-msg import-status-msg--${messageType}`}>
              {message}
            </p>
          )}
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
              {settings.database.type === "sqlite" ? (
                <div className="inline-actions">
                  <a className="button button--secondary" href={backupDownloadUrl()}>Télécharger sauvegarde</a>
                  <label className="button button--primary">
                    Restaurer
                    <input type="file" accept=".db,.sqlite,.sqlite3" hidden onChange={handleRestore} />
                  </label>
                </div>
              ) : (
                <p>Pour PostgreSQL, utilisez `pg_dump` et `pg_restore` côté serveur.</p>
              )}
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
