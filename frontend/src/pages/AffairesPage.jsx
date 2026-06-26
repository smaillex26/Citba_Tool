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
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)} t CO2e`;
  return `${v.toFixed(0)} kg CO2e`;
}

function AffairesPage() {
  const [apiGroups, setApiGroups] = useState(null);

  useEffect(() => {
    loadDashboardEmissions().then((groups) => {
      if (Array.isArray(groups) && groups.length > 0) setApiGroups(groups);
    });
  }, []);

  const groups = apiGroups ?? [];
  const totalKgCO2e = useMemo(
    () => groups.reduce(
      (sum, group) => sum + group.values.reduce((groupSum, value) => groupSum + value, 0),
      0,
    ),
    [groups],
  );
  const sitesWithData = useMemo(
    () => groups.filter((group) => group.values.some((value) => value > 0)).length,
    [groups],
  );
  const categoriesWithData = useMemo(() => {
    const active = new Set();
    groups.forEach((group) => {
      group.values.forEach((value, index) => {
        if (value > 0) active.add(DASHBOARD_EMISSIONS_SERIES[index].key);
      });
    });
    return active.size;
  }, [groups]);

  return (
    <PageContainer
      title="Tableau de bord"
      description="Synthèse des émissions calculées à partir du dernier fichier Excel importé."
      actions={
        apiGroups
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
      }
    >
      {!apiGroups ? (
        <ImportRequiredState message="Importez le fichier Excel pour lancer l'analyse carbone." />
      ) : (
        <>
          <div className="summary-grid">
            <SummaryCard label="Total CO2e" value={fmtKg(totalKgCO2e)} helper="Toutes catégories importées" accent="green" />
            <SummaryCard label="Sites avec données" value={String(sitesWithData)} helper="Sur les 4 sites suivis" accent="blue" />
            <SummaryCard label="Catégories actives" value={String(categoriesWithData)} helper="Postes avec émissions calculées" accent="amber" />
          </div>

          <EmissionsBySiteChart
            title="Émissions CO2e par catégorie"
            series={DASHBOARD_EMISSIONS_SERIES}
            groups={groups}
            unit="kg CO2e"
          />
        </>
      )}
    </PageContainer>
  );
}

export default AffairesPage;
