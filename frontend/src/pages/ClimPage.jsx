import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import BarChart from "../components/dashboard/BarChart.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import { climColumns } from "../data/climData.js";
import { getDataset } from "../services/api.js";

const SITE_COLORS = {
  Arthez: "#059669",
  Palplast: "#3b82f6",
  Pontonx: "#f59e0b",
  Infautelec: "#8b5cf6",
};

function fmtKg(v) {
  if (v >= 1000) return `${(v / 1000).toFixed(2)} t CO2e`;
  return `${v.toFixed(0)} kg CO2e`;
}

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
}

function ClimPage() {
  const [apiRows, setApiRows] = useState(null);
  const [siteFilter, setSiteFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  useEffect(() => {
    getDataset("clim").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
      }
    });
  }, []);

  const rows = apiRows ?? [];
  const sites = useMemo(() => uniqueValues(rows, "site"), [rows]);
  const sections = useMemo(() => uniqueValues(rows, "commentaire"), [rows]);

  const filtered = useMemo(() => {
    let data = rows;
    if (siteFilter) data = data.filter((r) => r.site === siteFilter);
    if (sectionFilter) data = data.filter((r) => r.commentaire === sectionFilter);
    return data;
  }, [rows, siteFilter, sectionFilter]);

  const totalKgCO2e = useMemo(
    () => filtered.reduce((sum, row) => sum + Number(row.kgCO2e ?? 0), 0),
    [filtered],
  );

  const chartBySite = useMemo(
    () =>
      sites
        .map((site) => {
          const value = filtered
            .filter((row) => row.site === site)
            .reduce((sum, row) => sum + Number(row.kgCO2e ?? 0), 0);
          return {
            label: site,
            value,
            display: fmtKg(value),
            color: SITE_COLORS[site] ?? "#64748b",
          };
        })
        .filter((item) => item.value > 0),
    [filtered, sites],
  );

  return (
    <PageContainer
      title="Clim"
      description="Émissions fugitives liées aux climatiseurs et à leur fin de vie, issues de l'onglet Clim du fichier Excel."
      actions={
        apiRows
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiRows ? (
        <ImportRequiredState message="Importez le fichier Excel pour analyser l'onglet Clim." />
      ) : (
        <>
          <div className="summary-grid">
            <SummaryCard label="Total CO2e" value={fmtKg(totalKgCO2e)} helper="Émissions fugitives clim" accent="green" />
            <SummaryCard label="Lignes" value={String(filtered.length)} helper="Équipements analysés" accent="blue" />
            <SummaryCard label="Sites" value={String(uniqueValues(filtered, "site").length)} helper="Sites concernés" accent="amber" />
          </div>

          <div className="filter-bar">
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Tous les sites</option>
              {sites.map((site) => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>

            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Toutes les sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>

          <DataTable columns={climColumns} rows={filtered} />

          <BarChart title="Émissions Clim par site" items={chartBySite} />
        </>
      )}
    </PageContainer>
  );
}

export default ClimPage;
