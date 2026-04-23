import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer.jsx";
import UploadZone from "../components/import/UploadZone.jsx";
import Button from "../components/ui/Button.jsx";
import { uploadExcelFile, getUploadStatus } from "../services/api.js";

const DATASET_ROUTES = {
  energie:           { label: "Énergie et Process",           route: "/donnees/energie-process" },
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
  const jobIdRef = useRef(null);
  const pollRef  = useRef(null);
  const navigate = useNavigate();

  /* Nettoyage du polling à la destruction */
  useEffect(() => () => clearInterval(pollRef.current), []);

  async function handleProcess() {
    if (!file) return;
    setStatus("uploading");
    setMessage("");

    const result = await uploadExcelFile(file);

    /* Backend non disponible → mode démo */
    if (!result?.job_id) {
      setMessage(result?.message ?? "Backend non connecté. Mode démonstration.");
      setStatus("demo");
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
        const pages = Object.keys(DATASET_ROUTES).filter(
          (k) => state.datasets?.includes(k)
        );
        setUpdatedPages(pages);
        setStatus("success");
      } else if (state.status === "error") {
        clearInterval(pollRef.current);
        setMessage(state.detail ?? "Erreur lors du traitement.");
        setStatus("error");
      }
    }, 1000);
  }

  const isLoading = status === "uploading" || status === "processing";

  return (
    <PageContainer
      title="Import du fichier Excel"
      description="Déposez un fichier Excel puis lancez le traitement pour alimenter les tableaux de données."
    >
      <UploadZone onFileSelected={setFile} status={isLoading ? "loading" : status} />

      {/* Bouton lancement */}
      {file && status === "idle" && (
        <div className="import-actions">
          <Button onClick={handleProcess}>Lancer le traitement</Button>
        </div>
      )}

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

      {/* Mode démo (backend off) */}
      {status === "demo" && (
        <div className="import-actions">
          <p className="import-status-msg">{message}</p>
          <Button onClick={() => navigate("/donnees/energie-process")}>
            Voir les données de démonstration
          </Button>
        </div>
      )}

      {/* Succès */}
      {status === "success" && (
        <div className="import-success">
          <p className="import-success__title">Traitement terminé ✓</p>
          {updatedPages.length > 0 ? (
            <>
              <p className="import-success__sub">Pages mises à jour :</p>
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
              Aucun onglet reconnu dans ce fichier.
            </p>
          )}
          <button className="import-reset-btn" onClick={() => { setFile(null); setStatus("idle"); setUpdatedPages([]); }}>
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
            <p>Lancer le traitement — chaque onglet reconnu alimente une page de données.</p>
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
