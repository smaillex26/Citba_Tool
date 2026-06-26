import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { deplacementsProColumns } from "../data/deplacementsProData.js";
import { getDataset } from "../services/api.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
}

function DeplacementsProPage() {
  const [apiRows, setApiRows] = useState(null);
  const [siteFilter, setSiteFilter] = useState("");
  const [moyenFilter, setMoyenFilter] = useState("");

  useEffect(() => {
    getDataset("deplacements_pro").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows   = useMemo(() => apiRows ?? [], [apiRows]);
  const sites  = useMemo(() => uniqueValues(rows, "site"),             [rows]);
  const moyens = useMemo(() => uniqueValues(rows, "moyenDeplacement"), [rows]);

  const filtered = useMemo(() => {
    let d = rows;
    if (siteFilter)  d = d.filter((r) => r.site             === siteFilter);
    if (moyenFilter) d = d.filter((r) => r.moyenDeplacement === moyenFilter);
    return d;
  }, [rows, siteFilter, moyenFilter]);

  const totalKm = useMemo(
    () => filtered.reduce((s, r) => s + (r.kmParAn ?? 0), 0).toLocaleString("fr-FR"),
    [filtered],
  );

  return (
    <PageContainer
      title="Déplacements professionnels"
      description="Missions, visites clients et trajets professionnels des collaborateurs. Scope 3 amont — catégorie 6."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser les déplacements professionnels." />
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
          <span>Déplacements</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Total km / an</span>
          <strong>{totalKm} km</strong>
        </article>
        <article className="stat-pill">
          <span>Sites</span>
          <strong>{uniqueValues(filtered, "site").length}</strong>
        </article>
      </div>

      <DataTable columns={deplacementsProColumns} rows={filtered} />

        </>
      )}
    </PageContainer>
  );
}

export default DeplacementsProPage;
