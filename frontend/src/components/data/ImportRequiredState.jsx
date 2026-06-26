import { useNavigate } from "react-router-dom";
import Button from "../ui/Button.jsx";

function ImportRequiredState({
  title = "Aucune donnée importée",
  message = "Importez un fichier Excel pour lancer l'analyse et alimenter cette page.",
}) {
  const navigate = useNavigate();

  return (
    <div className="info-grid">
      <article className="info-card">
        <h3>{title}</h3>
        <p>{message}</p>
        <Button onClick={() => navigate("/import")}>Importer un fichier</Button>
      </article>
    </div>
  );
}

export default ImportRequiredState;
