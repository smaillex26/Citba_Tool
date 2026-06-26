import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { biensImmobilisesColumns } from "../data/biensImmobilisesData.js";
import { getDataset } from "../services/api.js";

function BiensImmobilisesPage() {
  const [apiRows, setApiRows] = useState(null);

  useEffect(() => {
    getDataset("biens_immobilises").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows = apiRows ?? [];

  const totalSurface = useMemo(
    () => rows.reduce((s, r) => s + (r.surfaceTerre ?? 0), 0),
    [rows],
  );

  return (
    <PageContainer
      title="Biens immobilisés — UTCF"
      description="Changement d'affectation des sols (UTCF) des sites du groupe CITBA. Scope 3 amont — catégorie 2."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser les biens immobilisés." />
      ) : (
        <>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Sites déclarés</span>
          <strong>{rows.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Surface totale</span>
          <strong>{totalSurface} ha</strong>
        </article>
      </div>

          <DataTable columns={biensImmobilisesColumns} rows={rows} />
        </>
      )}
    </PageContainer>
  );
}

export default BiensImmobilisesPage;
