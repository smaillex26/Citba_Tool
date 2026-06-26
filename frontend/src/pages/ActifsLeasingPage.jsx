import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { actifsLeasingColumns } from "../data/actifsLeasingData.js";
import { getDataset } from "../services/api.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort((a, b) => a - b);
}

function ActifsLeasingPage() {
  const [apiRows, setApiRows] = useState(null);
  const [dureeFilter, setDureeFilter] = useState("");

  useEffect(() => {
    getDataset("actifs_leasing").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows  = apiRows ?? [];
  const durees = useMemo(() => uniqueValues(rows, "dureeLLD"), [rows]);

  const filtered = useMemo(() => {
    if (!dureeFilter) return rows;
    return rows.filter((r) => String(r.dureeLLD) === dureeFilter);
  }, [rows, dureeFilter]);

  const totalMontant = useMemo(
    () => filtered.reduce((s, r) => s + (r.montantEuro ?? 0), 0).toLocaleString("fr-FR"),
    [filtered],
  );

  return (
    <PageContainer
      title="Actifs en leasing"
      description="Matériels et équipements en location longue durée (LLD). Scope 3 amont — catégorie 8."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser les actifs en leasing." />
      ) : (
        <>

      <div className="filter-bar">
        <select
          value={dureeFilter}
          onChange={(e) => setDureeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les durées</option>
          {durees.map((d) => (
            <option key={d} value={d}>{d} mois</option>
          ))}
        </select>
      </div>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Actifs</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Montant total</span>
          <strong>{totalMontant} EUR</strong>
        </article>
      </div>

      <DataTable columns={actifsLeasingColumns} rows={filtered} />

        </>
      )}
    </PageContainer>
  );
}

export default ActifsLeasingPage;
