import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { achatsBiensColumns } from "../data/achatsBiensData.js";
import { getDataset } from "../services/api.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
}

function AchatsBiensPage() {
  const [apiRows, setApiRows] = useState(null);
  const [siteFilter, setSiteFilter] = useState("");
  const [familleFilter, setFamilleFilter] = useState("");

  useEffect(() => {
    getDataset("achats_biens").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows = apiRows ?? [];
  const sites    = useMemo(() => uniqueValues(rows, "site"),    [rows]);
  const familles = useMemo(() => uniqueValues(rows, "famille"), [rows]);

  const filtered = useMemo(() => {
    let d = rows;
    if (siteFilter)    d = d.filter((r) => r.site    === siteFilter);
    if (familleFilter) d = d.filter((r) => r.famille === familleFilter);
    return d;
  }, [rows, siteFilter, familleFilter]);

  const totalMontant = useMemo(
    () => filtered.reduce((s, r) => s + (r.montantEuro ?? 0), 0).toLocaleString("fr-FR"),
    [filtered],
  );

  return (
    <PageContainer
      title="Achats de biens"
      description="Matières premières et consommables achetés par les sites du groupe. Scope 3 amont — catégorie 1."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser les intrants et achats de biens." />
      ) : (
        <>

          <div className="filter-bar">
        <select
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les sites</option>
          {sites.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={familleFilter}
          onChange={(e) => setFamilleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les familles</option>
          {familles.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Achats</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Montant total</span>
          <strong>{totalMontant} EUR</strong>
        </article>
        <article className="stat-pill">
          <span>Sites</span>
          <strong>{uniqueValues(filtered, "site").length}</strong>
        </article>
      </div>

          <DataTable columns={achatsBiensColumns} rows={filtered} />
        </>
      )}
    </PageContainer>
  );
}

export default AchatsBiensPage;
