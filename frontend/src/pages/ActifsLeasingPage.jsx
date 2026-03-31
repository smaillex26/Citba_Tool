import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import BarChart from "../components/dashboard/BarChart.jsx";
import {
  actifsLeasingColumns,
  actifsLeasingRows,
  actifsLeasingStats,
  chartByDuree,
  chartByMontant,
} from "../data/actifsLeasingData.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]))].sort((a, b) => a - b);
}

function ActifsLeasingPage() {
  const [dureeFilter, setDureeFilter] = useState("");

  const durees = useMemo(() => uniqueValues(actifsLeasingRows, "dureeLLD"), []);

  const filtered = useMemo(() => {
    if (!dureeFilter) return actifsLeasingRows;
    return actifsLeasingRows.filter((r) => String(r.dureeLLD) === dureeFilter);
  }, [dureeFilter]);

  const totalMontant = useMemo(
    () => filtered.reduce((s, r) => s + r.montantEuro, 0).toLocaleString("fr-FR"),
    [filtered],
  );

  return (
    <PageContainer
      title="Actifs en leasing"
      description="Inventaire des materiels et equipements en location longue duree (LLD). Ces donnees alimenteront le calcul des immobilisations (scope 3)."
    >
      <div className="summary-grid">
        {actifsLeasingStats.map((card) => (
          <SummaryCard
            key={card.id}
            label={card.label}
            value={card.value}
            helper={card.helper}
            accent={card.accent}
          />
        ))}
      </div>

      <div className="filter-bar">
        <select
          value={dureeFilter}
          onChange={(e) => setDureeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les durees</option>
          {durees.map((d) => (
            <option key={d} value={d}>{d} mois</option>
          ))}
        </select>
      </div>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Actifs</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Montant total</span>
          <strong>{totalMontant} EUR</strong>
        </article>
      </div>

      <DataTable columns={actifsLeasingColumns} rows={filtered} />

      <div className="charts-grid">
        <BarChart title="Repartition par duree de contrat" items={chartByDuree} />
        <BarChart title="Repartition par tranche de montant" items={chartByMontant} />
      </div>
    </PageContainer>
  );
}

export default ActifsLeasingPage;
