import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { transportAvalColumns } from "../data/transportAvalData.js";
import { getDataset } from "../services/api.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
}

function TransportAvalPage() {
  const [apiRows, setApiRows] = useState(null);
  const [siteFilter, setSiteFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    getDataset("transport_aval").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows  = useMemo(() => apiRows ?? [], [apiRows]);
  const sites = useMemo(() => uniqueValues(rows, "site"),          [rows]);
  const types = useMemo(() => uniqueValues(rows, "typeTransport"), [rows]);

  const filtered = useMemo(() => {
    let d = rows;
    if (siteFilter) d = d.filter((r) => r.site          === siteFilter);
    if (typeFilter) d = d.filter((r) => r.typeTransport === typeFilter);
    return d;
  }, [rows, siteFilter, typeFilter]);

  const totalTonnage = useMemo(
    () => filtered.reduce((s, r) => s + (r.quantite ?? 0), 0).toFixed(1),
    [filtered],
  );

  return (
    <PageContainer
      title="Transport aval & Intersite"
      description="Flux de transport des produits vers les clients et entre les sites. Scope 3 aval — catégorie 9."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser le transport aval." />
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Flux</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Tonnage total</span>
          <strong>{totalTonnage} t</strong>
        </article>
        <article className="stat-pill">
          <span>Sites</span>
          <strong>{uniqueValues(filtered, "site").length}</strong>
        </article>
      </div>

      <DataTable columns={transportAvalColumns} rows={filtered} />

        </>
      )}
    </PageContainer>
  );
}

export default TransportAvalPage;
