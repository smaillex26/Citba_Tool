import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import Button from "../components/ui/Button.jsx";
import { listEmissionFactors, saveEmissionFactor } from "../services/api.js";

const EMPTY_FACTOR = {
  name: "",
  category: "",
  unit: "",
  factor_kg_co2e: "",
  scope: "",
  source: "",
  year: "",
  comment: "",
};

function EmissionFactorsPage() {
  const [factors, setFactors] = useState(null);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  function loadFactors() {
    return listEmissionFactors().then((data) => {
      if (Array.isArray(data?.factors)) {
        setFactors(data.factors);
      }
    });
  }

  useEffect(() => {
    loadFactors();
  }, []);

  function handleEdit(factor) {
    setMessage("");
    setEditing({
      ...factor,
      factor_kg_co2e: String(factor.factor_kg_co2e ?? ""),
      year: factor.year ? String(factor.year) : "",
    });
  }

  function handleNew() {
    setMessage("");
    setEditing(EMPTY_FACTOR);
  }

  function updateField(key, value) {
    setEditing((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!editing?.name?.trim()) {
      setMessage("Le nom du facteur est obligatoire.");
      return;
    }

    if (!Number.isFinite(Number(editing.factor_kg_co2e))) {
      setMessage("Le facteur kg CO2e doit être un nombre.");
      return;
    }

    const result = await saveEmissionFactor(editing);
    if (result?.success === false) {
      setMessage(result.message);
      return;
    }

    setEditing(null);
    await loadFactors();
  }

  return (
    <PageContainer
      title="Facteurs d'émission"
      description="Référentiel local utilisé pour compléter les calculs lorsque le fichier Excel ne fournit pas de facteur."
      actions={<Button onClick={handleNew}>Ajouter un facteur</Button>}
    >
      {message && <p className="import-status-msg import-status-msg--error">{message}</p>}

      {editing && (
        <form className="factor-form" onSubmit={handleSubmit}>
          <div className="factor-form__grid">
            <label>
              Nom
              <input value={editing.name} onChange={(e) => updateField("name", e.target.value)} />
            </label>
            <label>
              kg CO2e / unité
              <input value={editing.factor_kg_co2e} onChange={(e) => updateField("factor_kg_co2e", e.target.value)} />
            </label>
            <label>
              Unité
              <input value={editing.unit ?? ""} onChange={(e) => updateField("unit", e.target.value)} />
            </label>
            <label>
              Scope
              <input value={editing.scope ?? ""} onChange={(e) => updateField("scope", e.target.value)} />
            </label>
            <label>
              Catégorie
              <input value={editing.category ?? ""} onChange={(e) => updateField("category", e.target.value)} />
            </label>
            <label>
              Année
              <input value={editing.year ?? ""} onChange={(e) => updateField("year", e.target.value)} />
            </label>
            <label className="factor-form__wide">
              Source
              <input value={editing.source ?? ""} onChange={(e) => updateField("source", e.target.value)} />
            </label>
            <label className="factor-form__wide">
              Commentaire
              <textarea value={editing.comment ?? ""} onChange={(e) => updateField("comment", e.target.value)} />
            </label>
          </div>
          <div className="inline-actions">
            <Button type="submit">{editing.id ? "Enregistrer" : "Créer"}</Button>
            <Button variant="secondary" onClick={() => setEditing(null)}>Annuler</Button>
          </div>
        </form>
      )}

      {!factors || factors.length === 0 ? (
        <ImportRequiredState message="Aucun facteur d'émission disponible." />
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Unité</th>
                  <th className="col-right">kg CO2e / unité</th>
                  <th>Scope</th>
                  <th>Source</th>
                  <th className="col-right">Année</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {factors.map((factor) => (
                  <tr key={factor.id}>
                    <td>{factor.name}</td>
                    <td>{factor.category}</td>
                    <td>{factor.unit}</td>
                    <td className="col-right">{factor.factor_kg_co2e}</td>
                    <td>{factor.scope}</td>
                    <td>{factor.source}</td>
                    <td className="col-right">{factor.year}</td>
                    <td>
                      <button className="affaire-btn affaire-btn--view" onClick={() => handleEdit(factor)}>
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default EmissionFactorsPage;
