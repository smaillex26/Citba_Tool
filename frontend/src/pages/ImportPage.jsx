import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer.jsx";
import UploadZone from "../components/import/UploadZone.jsx";
import Button from "../components/ui/Button.jsx";

function ImportPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  function handleProcess() {
    if (!file) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  }

  return (
    <PageContainer
      title="Import du fichier Excel"
      description="Déposez un fichier issu de Wavesoft puis lancez le traitement pour alimenter le tableau de collecte."
      actions={
        status === "success" ? (
          <Button onClick={() => navigate("/donnees/collecte")}>
            Voir le tableau
          </Button>
        ) : null
      }
    >
      <UploadZone onFileSelected={setFile} status={status} />

      {file && status === "idle" && (
        <div className="import-actions">
          <Button onClick={handleProcess}>Lancer le traitement</Button>
        </div>
      )}

      <div className="info-grid">
        <article className="info-card">
          <h3>Étape 1</h3>
          <p>Choisir le fichier Excel exporté depuis l'ERP.</p>
        </article>
        <article className="info-card">
          <h3>Étape 2</h3>
          <p>Lancer le traitement pour nettoyer et convertir les données.</p>
        </article>
        <article className="info-card">
          <h3>Étape 3</h3>
          <p>Consulter le tableau de collecte avec les données traitées.</p>
        </article>
      </div>
    </PageContainer>
  );
}

export default ImportPage;
