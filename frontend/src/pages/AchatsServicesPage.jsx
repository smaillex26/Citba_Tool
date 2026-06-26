import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { achatsServicesColumns } from "../data/achatsServicesData.js";
import { getDataset } from "../services/api.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
}

function AchatsServicesPage() {
  const [apiRows, setApiRows] = useState(null);
  const [siteFilter, setSiteFilter] = useState("");
  const [prestationFilter, setPrestationFilter] = useState("");

  useEffect(() => {
    getDataset("achats_services").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows       = useMemo(() => apiRows ?? [], [apiRows]);
  const sites      = useMemo(() => uniqueValues(rows, "site"),           [rows]);
  const prestations= useMemo(() => uniqueValues(rows, "typePrestation"), [rows]);

  const filtered = useMemo(() => {
    let d = rows;
    if (siteFilter)       d = d.filter((r) => r.site           === siteFilter);
    if (prestationFilter) d = d.filter((r) => r.typePrestation === prestationFilter);
    return d;
  }, [rows, siteFilter, prestationFilter]);

  const totalMontant = useMemo(
    () => filtered.reduce((s, r) => s + (r.montantEuro ?? 0), 0).toLocaleString("fr-FR"),
    [filtered],
  );

  return (
    <PageContainer
      title="Achats de services"
      description="Services externes achetés par les sites du groupe (conseil, IT, nettoyage…). Scope 3 amont — catégorie 1."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser les achats de services." />
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
          value={prestationFilter}
          onChange={(e) => setPrestationFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les prestations</option>
          {prestations.map((p) => <option key={p} value={p}>{p}</option>)}
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
          <span>Sites</span>
          <strong>{uniqueValues(filtered, "site").length}</strong>
        </article>
      </div>

      <DataTable columns={achatsServicesColumns} rows={filtered} />

        </>
      )}
    </PageContainer>
  );
}

export default AchatsServicesPage;
