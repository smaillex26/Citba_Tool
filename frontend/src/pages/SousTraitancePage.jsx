import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import BarChart from "../components/dashboard/BarChart.jsx";
import {
  sousTraitanceColumns,
  sousTraitanceRows,
  sousTraitanceStats,
  chartBySociete,
  chartByPrestation,
} from "../data/sousTraitanceData.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]))].sort();
}

function SousTraitancePage() {
  const [societeFilter, setSocieteFilter] = useState("");
  const [prestationFilter, setPrestationFilter] = useState("");

  const societes = useMemo(() => uniqueValues(sousTraitanceRows, "societe"), []);
  const prestations = useMemo(() => uniqueValues(sousTraitanceRows, "typePrestation"), []);

  const filtered = useMemo(() => {
    let data = sousTraitanceRows;
    if (societeFilter) data = data.filter((r) => r.societe === societeFilter);
    if (prestationFilter) data = data.filter((r) => r.typePrestation === prestationFilter);
    return data;
  }, [societeFilter, prestationFilter]);

  const totalMontant = useMemo(
    () => filtered.reduce((s, r) => s + r.montantEuro, 0).toLocaleString("fr-FR"),
    [filtered],
  );

  return (
    <PageContainer
      title="Sous-traitance"
      description="Prestations realisees par des sous-traitants externes. Ces donnees alimenteront le calcul des achats de services (scope 3)."
    >
      <div className="summary-grid">
        {sousTraitanceStats.map((card) => (
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
          value={societeFilter}
          onChange={(e) => setSocieteFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les societes</option>
          {societes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={prestationFilter}
          onChange={(e) => setPrestationFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les prestations</option>
          {prestations.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
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
          <span>Sous-traitants</span>
          <strong>{uniqueValues(filtered, "societe").length}</strong>
        </article>
      </div>

      <DataTable columns={sousTraitanceColumns} rows={filtered} />

      <div className="charts-grid">
        <BarChart title="Montant par sous-traitant" items={chartBySociete} />
        <BarChart title="Montant par type de prestation" items={chartByPrestation} />
      </div>
    </PageContainer>
  );
}

export default SousTraitancePage;
