import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import EmissionsBySiteChart from "../components/dashboard/EmissionsBySiteChart.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import {
  DASHBOARD_EMISSIONS_SERIES,
  loadDashboardEmissions,
} from "../utils/dashboardEmissions.js";

function fmtKg(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} Mt CO2e`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)} t CO2e`;
  return `${v.toFixed(0)} kg CO2e`;
}

function DashboardPage() {
  const [apiGroups, setApiGroups] = useState(null);

  useEffect(() => {
    loadDashboardEmissions().then((groups) => {
      if (Array.isArray(groups) && groups.length > 0) setApiGroups(groups);
    });
  }, []);

  const groups = apiGroups ?? [];
  const totalKgCO2e = useMemo(
    () => groups.reduce((s, g) => s + g.values.reduce((a, v) => a + v, 0), 0),
    [groups],
  );

  return (
    <PageContainer
      title="Tableau de bord — Statistiques"
      description="Vue synthétique des émissions CO2e par catégorie et par site. Les données seront mises à jour à chaque import."
      actions={
        apiGroups
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiGroups ? (
        <ImportRequiredState message="Importez le fichier Excel pour lancer l'analyse et alimenter le tableau de bord." />
      ) : (
        <>
          <div className="summary-grid">
            <SummaryCard label="Total CO2e" value={fmtKg(totalKgCO2e)} helper="Toutes catégories importées" accent="green" />
            <SummaryCard label="Sites" value={String(groups.length)} helper="Sites détectés dans le fichier" accent="blue" />
            <SummaryCard label="Catégories" value={String(DASHBOARD_EMISSIONS_SERIES.length)} helper="Postes suivis" accent="amber" />
          </div>

      {/* Graphique émissions : choix du site + une barre par catégorie */}
      <EmissionsBySiteChart
        title="Émissions CO2e par catégorie"
        series={DASHBOARD_EMISSIONS_SERIES}
        groups={groups}
        unit="kg CO2e"
      />

      {/* Total rapide */}
      <div className="stats-row" style={{ marginTop: 0 }}>
        <article className="stat-pill">
          <span>Total toutes catégories</span>
          <strong>{fmtKg(totalKgCO2e)}</strong>
        </article>
        <article className="stat-pill">
          <span>Sites</span>
          <strong>{groups.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Catégories</span>
          <strong>{DASHBOARD_EMISSIONS_SERIES.length}</strong>
        </article>
      </div>
        </>
      )}
    </PageContainer>
  );
}

export default DashboardPage;
