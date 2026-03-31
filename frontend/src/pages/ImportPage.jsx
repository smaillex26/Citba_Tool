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
      description="Deposez un fichier issu de Wavesoft puis lancez le traitement pour alimenter le tableau de collecte."
      actions={
        status === "success" ? (
          <Button onClick={() => navigate("/collecte")}>
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
          <h3>Etape 1</h3>
          <p>Choisir le fichier Excel exporte depuis l'ERP.</p>
        </article>
        <article className="info-card">
          <h3>Etape 2</h3>
          <p>Lancer le traitement pour nettoyer et convertir les donnees.</p>
        </article>
        <article className="info-card">
          <h3>Etape 3</h3>
          <p>Consulter le tableau de collecte avec les donnees traitees.</p>
        </article>
      </div>
    </PageContainer>
  );
}

export default ImportPage;
