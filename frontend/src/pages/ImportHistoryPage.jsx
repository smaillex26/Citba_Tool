import { useEffect, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { deleteImport, listImports } from "../services/api.js";

function ImportHistoryPage() {
  const [imports, setImports] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState("");

  function loadImports() {
    return listImports().then((data) => {
      if (Array.isArray(data?.imports)) {
        setImports(data.imports.map((item) => ({
          ...item,
          createdAt: new Date(item.created_at).toLocaleString("fr-FR"),
        })));
      }
    });
  }

  useEffect(() => {
    loadImports();
  }, []);

  async function handleDelete(importId) {
    setMessage("");
    const result = await deleteImport(importId);
    if (result?.success === false) {
      setMessage(result.message);
      return;
    }
    setConfirmId(null);
    setImports((current) => current?.filter((item) => item.id !== importId) ?? []);
  }

  return (
    <PageContainer
      title="Historique des imports"
      description="Consultez les fichiers Excel traités et les volumes importés."
    >
      {message && <p className="import-status-msg import-status-msg--error">{message}</p>}

      {!imports || imports.length === 0 ? (
        <ImportRequiredState message="Aucun import enregistré pour le moment." />
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fichier</th>
                  <th>Date</th>
                  <th className="col-right">Pages</th>
                  <th className="col-right">Lignes</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {imports.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.filename}</td>
                    <td>{item.createdAt}</td>
                    <td className="col-right">{item.dataset_count}</td>
                    <td className="col-right">{item.total_rows.toLocaleString("fr-FR")}</td>
                    <td>{item.status}</td>
                    <td>
                      {confirmId === item.id ? (
                        <div className="inline-actions">
                          <button className="affaire-btn affaire-btn--danger" onClick={() => handleDelete(item.id)}>
                            Confirmer
                          </button>
                          <button className="affaire-btn affaire-btn--cancel" onClick={() => setConfirmId(null)}>
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button className="affaire-btn affaire-btn--delete" onClick={() => setConfirmId(item.id)}>
                          Supprimer
                        </button>
                      )}
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

export default ImportHistoryPage;
