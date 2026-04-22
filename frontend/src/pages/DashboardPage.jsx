import PageContainer from "../components/layout/PageContainer.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import BarChart from "../components/dashboard/BarChart.jsx";
import { summaryCards, chartByFamily, chartByCountry } from "../data/mockData.js";

function DashboardPage() {
  return (
    <PageContainer
      title="Tableau de bord — Statistiques"
      description="Vue synthétique des données importées. Les graphiques et cartes seront alimentés par le backend."
    >
      <div className="summary-grid">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.id}
            label={card.label}
            value={card.value}
            helper={card.helper}
            accent={card.accent}
          />
        ))}
      </div>

      <div className="charts-grid">
        <BarChart title="Répartition par famille (tonnes)" items={chartByFamily} />
        <BarChart title="Répartition par pays (tonnes)" items={chartByCountry} />
      </div>
    </PageContainer>
  );
}

export default DashboardPage;
