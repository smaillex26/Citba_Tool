import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import BarChart from "../components/dashboard/BarChart.jsx";
import {
  deplacementsDTColumns,
  deplacementsDTRows,
  deplacementsDTStats,
  chartByMoyen,
  chartByDistance,
} from "../data/deplacementsDTData.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]))].sort();
}

function DeplacementsDTPage() {
  const [siteFilter, setSiteFilter] = useState("");
  const [moyenFilter, setMoyenFilter] = useState("");
  const [teletravailFilter, setTeletravailFilter] = useState("");

  const sites = useMemo(() => uniqueValues(deplacementsDTRows, "site"), []);
  const moyens = useMemo(() => uniqueValues(deplacementsDTRows, "moyenDeplacement"), []);
  const teletravailOptions = useMemo(() => uniqueValues(deplacementsDTRows, "teletravail"), []);

  const filtered = useMemo(() => {
    let data = deplacementsDTRows;
    if (siteFilter) data = data.filter((r) => r.site === siteFilter);
    if (moyenFilter) data = data.filter((r) => r.moyenDeplacement === moyenFilter);
    if (teletravailFilter) data = data.filter((r) => r.teletravail === teletravailFilter);
    return data;
  }, [siteFilter, moyenFilter, teletravailFilter]);

  const avgDistance = useMemo(() => {
    if (filtered.length === 0) return "0";
    return (filtered.reduce((s, r) => s + r.distanceKm, 0) / filtered.length).toFixed(1);
  }, [filtered]);

  return (
    <PageContainer
      title="Déplacements domicile-travail"
      description="Données de test sur les trajets quotidiens des collaborateurs. Ces informations alimenteront le calcul carbone (scope 3)."
    >
      <div className="summary-grid">
        {deplacementsDTStats.map((card) => (
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
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les sites</option>
          {sites.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={moyenFilter}
          onChange={(e) => setMoyenFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les moyens</option>
          {moyens.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={teletravailFilter}
          onChange={(e) => setTeletravailFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Télétravail (tous)</option>
          {teletravailOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Personnes</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Distance moy.</span>
          <strong>{avgDistance} km</strong>
        </article>
        <article className="stat-pill">
          <span>Sites</span>
          <strong>{uniqueValues(filtered, "site").length}</strong>
        </article>
      </div>

      <DataTable columns={deplacementsDTColumns} rows={filtered} />

      <div className="charts-grid">
        <BarChart title="Répartition par moyen de déplacement" items={chartByMoyen} />
        <BarChart title="Répartition par tranche de distance" items={chartByDistance} />
      </div>
    </PageContainer>
  );
}

export default DeplacementsDTPage;
