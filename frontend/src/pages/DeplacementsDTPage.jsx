import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { deplacementsDTColumns } from "../data/deplacementsDTData.js";
import { getDataset } from "../services/api.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
}

function DeplacementsDTPage() {
  const [apiRows, setApiRows] = useState(null);
  const [siteFilter, setSiteFilter] = useState("");
  const [moyenFilter, setMoyenFilter] = useState("");

  useEffect(() => {
    getDataset("deplacements_dt").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows   = apiRows ?? [];
  const sites  = useMemo(() => uniqueValues(rows, "site"),             [rows]);
  const moyens = useMemo(() => uniqueValues(rows, "moyenDeplacement"), [rows]);

  const filtered = useMemo(() => {
    let d = rows;
    if (siteFilter)  d = d.filter((r) => r.site             === siteFilter);
    if (moyenFilter) d = d.filter((r) => r.moyenDeplacement === moyenFilter);
    return d;
  }, [rows, siteFilter, moyenFilter]);

  const avgDistance = useMemo(() => {
    if (filtered.length === 0) return "0";
    return (
      filtered.reduce((s, r) => s + (r.distanceDomTravail ?? 0), 0) / filtered.length
    ).toFixed(1);
  }, [filtered]);

  return (
    <PageContainer
      title="Déplacements domicile-travail"
      description="Trajets quotidiens des collaborateurs entre leur domicile et leur lieu de travail. Scope 3 amont — catégorie 7."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser les déplacements domicile-travail." />
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
          value={moyenFilter}
          onChange={(e) => setMoyenFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les moyens</option>
          {moyens.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Personnes</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Distance moy.</span>
          <strong>{avgDistance} km</strong>
        </article>
        <article className="stat-pill">
          <span>Sites</span>
          <strong>{uniqueValues(filtered, "site").length}</strong>
        </article>
      </div>

      <DataTable columns={deplacementsDTColumns} rows={filtered} />

        </>
      )}
    </PageContainer>
  );
}

export default DeplacementsDTPage;
