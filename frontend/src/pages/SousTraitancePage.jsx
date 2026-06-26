import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { sousTraitanceColumns } from "../data/sousTraitanceData.js";
import { getDataset } from "../services/api.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
}

function SousTraitancePage() {
  const [apiRows, setApiRows] = useState(null);
  const [siteFilter, setSiteFilter] = useState("");
  const [societeFilter, setSocieteFilter] = useState("");

  useEffect(() => {
    getDataset("sous_traitance").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows    = apiRows ?? [];
  const sites   = useMemo(() => uniqueValues(rows, "site"),    [rows]);
  const societes= useMemo(() => uniqueValues(rows, "societe"), [rows]);

  const filtered = useMemo(() => {
    let d = rows;
    if (siteFilter)    d = d.filter((r) => r.site    === siteFilter);
    if (societeFilter) d = d.filter((r) => r.societe === societeFilter);
    return d;
  }, [rows, siteFilter, societeFilter]);

  const totalMontant = useMemo(
    () => filtered.reduce((s, r) => s + (r.montantEuro ?? 0), 0).toLocaleString("fr-FR"),
    [filtered],
  );

  return (
    <PageContainer
      title="Sous-traitance"
      description="Prestations réalisées par des sous-traitants externes. Scope 3 amont — catégorie 1."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser la sous-traitance." />
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
          value={societeFilter}
          onChange={(e) => setSocieteFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les sociétés</option>
          {societes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Prestations</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Montant total</span>
          <strong>{totalMontant} EUR</strong>
        </article>
        <article className="stat-pill">
          <span>Sous-traitants</span>
          <strong>{uniqueValues(filtered, "societe").length}</strong>
        </article>
      </div>

      <DataTable columns={sousTraitanceColumns} rows={filtered} />

        </>
      )}
    </PageContainer>
  );
}

export default SousTraitancePage;
