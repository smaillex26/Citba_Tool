import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer.jsx";
import UploadZone from "../components/import/UploadZone.jsx";
import Button from "../components/ui/Button.jsx";
import { uploadExcelFile, getUploadStatus } from "../services/api.js";

const DATASET_ROUTES = {
  energie:           { label: "Énergie et Process",           route: "/donnees/energie-process" },
  clim:              { label: "Clim",                         route: "/donnees/clim" },
  achats_biens:      { label: "Achats de biens",               route: "/donnees/achats-biens" },
  achats_services:   { label: "Achats de services",            route: "/donnees/achats-services" },
  biens_immobilises: { label: "Biens immobilisés",             route: "/donnees/biens-immobilises" },
  deplacements_pro:  { label: "Déplacements professionnels",   route: "/donnees/deplacements-pro" },
  dechets:           { label: "Déchets",                       route: "/donnees/dechets" },
  transport_aval:    { label: "Transport aval & Fin de vie",   route: "/donnees/transport-aval" },
  sous_traitance:    { label: "Sous-traitance",                route: "/donnees/sous-traitance" },
  deplacements_dt:   { label: "Déplacements domicile-travail", route: "/donnees/deplacements-dt" },
  actifs_leasing:    { label: "Actifs en leasing",             route: "/donnees/actifs-leasing" },
};

function ImportPage() {
  const [file,        setFile]        = useState(null);
  const [status,      setStatus]      = useState("idle");
  const [message,     setMessage]     = useState("");
  const [updatedPages, setUpdatedPages] = useState([]);
  const [importSummary, setImportSummary] = useState(null);
  const jobIdRef = useRef(null);
  const pollRef  = useRef(null);
  const navigate = useNavigate();

  /* Nettoyage du polling à la destruction */
  useEffect(() => () => clearInterval(pollRef.current), []);

  const handleProcess = useCallback(async () => {
    if (!file) return;
    setStatus("uploading");
    setMessage("");
    setImportSummary(null);
    setUpdatedPages([]);

    const result = await uploadExcelFile(file);

    if (!result?.job_id) {
      setMessage(result?.message ?? "Backend non connecté. Lancez le serveur puis relancez l'import.");
      setStatus("error");
      return;
    }

    jobIdRef.current = result.job_id;
    setStatus("processing");

    /* Polling toutes les secondes */
    pollRef.current = setInterval(async () => {
      const state = await getUploadStatus(jobIdRef.current);
      if (!state) return;

      if (state.status === "done") {
        clearInterval(pollRef.current);
        const importedDatasets = state.summary?.datasets?.map((item) => item.key) ?? state.datasets ?? [];
        const pages = Object.keys(DATASET_ROUTES).filter((k) => importedDatasets.includes(k));
        setUpdatedPages(pages);
        setImportSummary({
          filename: state.filename,
          datasetCount: state.summary?.dataset_count ?? pages.length,
          totalRows: state.summary?.total_rows ?? 0,
          datasets: state.summary?.datasets ?? pages.map((key) => ({
            key,
            label: DATASET_ROUTES[key].label,
            rows: null,
          })),
          recognizedSheets: state.summary?.recognized_sheets ?? [],
          ignoredSheets: state.summary?.ignored_sheets ?? [],
        });
        setStatus("success");
      } else if (state.status === "error") {
        clearInterval(pollRef.current);
        setMessage(state.detail ?? "Erreur lors du traitement.");
        setStatus("error");
      }
    }, 1000);
  }, [file]);

  /* Dès qu'un fichier est déposé/sélectionné, on lance l'analyse backend. */
  useEffect(() => {
    if (file && status === "idle") {
      const timer = window.setTimeout(() => {
        handleProcess();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [file, status, handleProcess]);

  const isLoading = status === "uploading" || status === "processing";

  return (
    <PageContainer
      title="Import du fichier Excel"
      description="Déposez un fichier Excel puis lancez le traitement pour alimenter les tableaux de données."
    >
      <UploadZone onFileSelected={setFile} status={isLoading ? "loading" : status} />

      {/* État en cours */}
      {isLoading && (
        <div className="import-actions">
          <p className="import-status-msg">
            {status === "uploading" ? "Envoi du fichier…" : "Traitement en cours…"}
          </p>
        </div>
      )}

      {/* Erreur */}
      {status === "error" && (
        <div className="import-actions">
          <p className="import-status-msg import-status-msg--error">{message}</p>
          <Button onClick={() => setStatus("idle")}>Réessayer</Button>
        </div>
      )}

      {/* Succès */}
      {status === "success" && (
        <div className="import-success">
          <p className="import-success__title">Import terminé</p>
          <div className="import-summary-grid">
            <article className="import-summary-card">
              <span>Fichier analysé</span>
              <strong>{importSummary?.filename ?? file?.name ?? "Fichier Excel"}</strong>
            </article>
            <article className="import-summary-card">
              <span>Pages alimentées</span>
              <strong>{importSummary?.datasetCount ?? updatedPages.length}</strong>
            </article>
            <article className="import-summary-card">
              <span>Lignes importées</span>
              <strong>{(importSummary?.totalRows ?? 0).toLocaleString("fr-FR")}</strong>
            </article>
          </div>
          {updatedPages.length > 0 ? (
            <>
              {(importSummary?.recognizedSheets?.length > 0 || importSummary?.ignoredSheets?.length > 0) && (
                <div className="import-validation-grid">
                  <article className="import-validation-card">
                    <span>Onglets reconnus</span>
                    <strong>{importSummary?.recognizedSheets?.length ?? 0}</strong>
                    <p>
                      {importSummary?.recognizedSheets
                        ?.map((item) => `${item.sheet} → ${item.label}`)
                        .join(", ") || "Aucun onglet reconnu"}
                    </p>
                  </article>
                  <article className="import-validation-card">
                    <span>Onglets ignorés</span>
                    <strong>{importSummary?.ignoredSheets?.length ?? 0}</strong>
                    <p>
                      {importSummary?.ignoredSheets
                        ?.map((item) => item.sheet)
                        .join(", ") || "Aucun onglet ignoré"}
                    </p>
                  </article>
                </div>
              )}
              <p className="import-success__sub">Résumé des pages mises à jour :</p>
              <div className="import-summary-list">
                {importSummary?.datasets
                  ?.filter((item) => DATASET_ROUTES[item.key])
                  .map((item) => (
                    <button
                      key={item.key}
                      className="import-summary-row"
                      type="button"
                      onClick={() => navigate(DATASET_ROUTES[item.key].route)}
                    >
                      <span>{item.label ?? DATASET_ROUTES[item.key].label}</span>
                      <strong>
                        {item.rows === null || item.rows === undefined
                          ? "Voir"
                          : `${item.rows.toLocaleString("fr-FR")} lignes`}
                      </strong>
                    </button>
                  ))}
              </div>
              <div className="import-success__links">
                {updatedPages.map((key) => (
                  <Button key={key} onClick={() => navigate(DATASET_ROUTES[key].route)}>
                    {DATASET_ROUTES[key].label}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <p className="import-success__sub">
              Aucun onglet reconnu dans ce fichier. Vérifiez que le fichier correspond au modèle CITBA attendu.
            </p>
          )}
          <button className="import-reset-btn" onClick={() => { setFile(null); setStatus("idle"); setUpdatedPages([]); setImportSummary(null); }}>
            Importer un autre fichier
          </button>
        </div>
      )}

      {/* Guide */}
      {status === "idle" && (
        <div className="info-grid">
          <article className="info-card">
            <h3>Étape 1</h3>
            <p>Choisir le fichier Excel exporté depuis l'ERP.</p>
          </article>
          <article className="info-card">
            <h3>Étape 2</h3>
            <p>Le traitement se lance automatiquement dès que le fichier est déposé.</p>
          </article>
          <article className="info-card">
            <h3>Étape 3</h3>
            <p>Consulter directement les pages mises à jour via les boutons affichés.</p>
          </article>
        </div>
      )}
    </PageContainer>
  );
}

export default ImportPage;
