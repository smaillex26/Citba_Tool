import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { dechetsColumns } from "../data/dechetsData.js";
import { getDataset } from "../services/api.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
}

function DechetsPage() {
  const [apiRows, setApiRows] = useState(null);
  const [siteFilter, setSiteFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");

  useEffect(() => {
    getDataset("dechets").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows  = useMemo(() => apiRows ?? [], [apiRows]);
  const sites = useMemo(() => uniqueValues(rows, "site"),           [rows]);
  const modes = useMemo(() => uniqueValues(rows, "modeTraitement"), [rows]);

  const filtered = useMemo(() => {
    let d = rows;
    if (siteFilter) d = d.filter((r) => r.site           === siteFilter);
    if (modeFilter) d = d.filter((r) => r.modeTraitement === modeFilter);
    return d;
  }, [rows, siteFilter, modeFilter]);

  const totalTonnage = useMemo(
    () => filtered.reduce((s, r) => s + (r.quantite ?? 0), 0).toFixed(2),
    [filtered],
  );

  return (
    <PageContainer
      title="Déchets"
      description="Flux de déchets générés par l'activité des sites du groupe CITBA. Scope 3 amont — catégorie 5."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser les déchets." />
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
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les modes</option>
          {modes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Flux</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Masse totale</span>
          <strong>{totalTonnage} t</strong>
        </article>
        <article className="stat-pill">
          <span>Sites</span>
          <strong>{uniqueValues(filtered, "site").length}</strong>
        </article>
      </div>

      <DataTable columns={dechetsColumns} rows={filtered} />

        </>
      )}
    </PageContainer>
  );
}

export default DechetsPage;
