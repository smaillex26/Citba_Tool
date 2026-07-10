import SummaryCard from "../dashboard/SummaryCard.jsx";
import DataTable from "../table/DataTable.jsx";
import EmissionsPieChart from "./EmissionsPieChart.jsx";
import HorizontalFluxChart from "./HorizontalFluxChart.jsx";
import ProgressRing from "./ProgressRing.jsx";
import TopPosteCard from "./TopPosteCard.jsx";
import EquivalenceCard from "./EquivalenceCard.jsx";
import { formatNumber, formatTCO2e } from "../../utils/planActionData.js";

const ACTION_COLUMNS = [
  { key: "domaine", label: "Domaine" },
  { key: "action", label: "Action" },
  { key: "gainDisplay", label: "Gain annuel", align: "right" },
];

const ACTION_COLUMNS_SITE = [
  ...ACTION_COLUMNS,
  { key: "budget", label: "Budget" },
  { key: "responsable", label: "Responsable(s)" },
  { key: "etatAvancement", label: "État d'avancement" },
];

const TOP_ACCENTS = ["blue", "green", "amber"];

function normalizeFlux(items = []) {
  const colors = ["#3b82f6", "#0ea5e9", "#22c55e", "#f59e0b", "#94a3b8"];
  return items.map((item, index) => ({
    ...item,
    color: item.color ?? colors[index % colors.length],
  }));
}

function PlanActionDashboard({ view, showActions = true, extendedActionColumns = false }) {
  if (!view) return null;

  const actionsSection = showActions ? (
    <section className="plan-section" id="plan-actions-table">
      <div className="plan-section__header">
        <h3>Tableau des actions</h3>
        <p>
          {extendedActionColumns
            ? "Suivi des actions : budget, responsables et avancement (à compléter dans l'import Excel)."
            : "Plan d'actions priorisées pour réduire l'empreinte carbone."}
        </p>
      </div>
      <DataTable
        columns={extendedActionColumns ? ACTION_COLUMNS_SITE : ACTION_COLUMNS}
        rows={view.actions}
      />
    </section>
  ) : null;

  return (
    <>
      <div className="summary-grid plan-kpi-grid">
        <SummaryCard
          label="Émissions totales"
          value={formatTCO2e(view.totalTCO2e)}
          helper={view.kpiHelper ?? "Toutes catégories confondues"}
          accent="green"
        />
        <SummaryCard
          label="kgCO₂e / k€ CA"
          value={formatNumber(view.kgPerKeur)}
          helper="Intensité carbone économique"
          accent="blue"
        />
        <SummaryCard
          label="tCO₂e / employé"
          value={formatNumber(view.tPerEmployee)}
          helper="Hypothèse : 76 collaborateurs"
          accent="amber"
        />
        <SummaryCard
          label="kgCO₂e / heure"
          value={formatNumber(view.kgPerHour)}
          helper="Base annuelle 1 607 h"
          accent="slate"
        />
      </div>

      <div className="plan-equiv-grid">
        <EquivalenceCard
          icon="flight"
          value={view.equivalences.worldFlights.toLocaleString("fr-FR")}
          label="tours du monde en avion"
        />
        <EquivalenceCard
          icon="fuel"
          value={view.equivalences.dieselLiters.toLocaleString("fr-FR")}
          label="litres de gasoil"
        />
        <EquivalenceCard
          icon="people"
          value={view.equivalences.frenchAnnual.toLocaleString("fr-FR")}
          label="émissions annuelles de Français"
        />
      </div>

      {extendedActionColumns && actionsSection}

      <div className="plan-main-grid">
        <EmissionsPieChart title="Répartition des émissions" data={view.pie} />
        <section className="plan-card plan-target-card">
          <h3 className="plan-card__title">Objectif 2030</h3>
          <div className="plan-target-card__body">
            <ProgressRing value={view.target2030} label="Objectif de réduction des émissions." />
            <p>Trajectoire de réduction visant une baisse significative des émissions opérationnelles d'ici 2030.</p>
          </div>
        </section>
      </div>

      <section className="plan-section">
        <div className="plan-section__header">
          <h3>Top 3 postes d'émissions</h3>
          <p>Les principaux leviers identifiés dans le bilan carbone.</p>
        </div>
        <div className="plan-top-grid">
          {view.topPostes.map((poste, index) => (
            <TopPosteCard
              key={poste.title}
              title={poste.title}
              percent={poste.percent}
              tCO2e={poste.tCO2e}
              flux={poste.flux}
              accent={TOP_ACCENTS[index]}
            />
          ))}
        </div>
      </section>

      <section className="plan-section">
        <div className="plan-section__header">
          <h3>Détail des flux prioritaires</h3>
          <p>Répartition des émissions au sein des trois postes dominants.</p>
        </div>
        <div className="charts-grid">
          <HorizontalFluxChart
            title={view.topPostes[0]?.title ?? "Achats de biens"}
            items={normalizeFlux(view.fluxCharts.achats)}
          />
          <HorizontalFluxChart
            title={view.topPostes[1]?.title ?? "Sous-traitance"}
            items={normalizeFlux(view.fluxCharts.sousTraitance)}
          />
          <HorizontalFluxChart
            title={view.topPostes[2]?.title ?? "Transport amont"}
            items={normalizeFlux(view.fluxCharts.transportAmont)}
          />
        </div>
      </section>

      {!extendedActionColumns && actionsSection}
    </>
  );
}

export default PlanActionDashboard;
