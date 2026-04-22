import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import BarChart from "../components/dashboard/BarChart.jsx";
import {
  energieProcessRows,
  energieProcessColumns,
  SITES,
  SCOPES,
  CATEGORIES,
} from "../data/energieProcessData.js";

const SCOPE_COLORS = { "1": "#ef4444", "2": "#3b82f6", "3 amont": "#f59e0b" };
const SITE_COLORS  = { Arthez: "#059669", Palplast: "#3b82f6", Pontonx: "#f59e0b", Infautelec: "#8b5cf6" };

function fmtKg(v) {
  if (v >= 1000) return `${(v / 1000).toFixed(2)} t CO2e`;
  return `${v.toFixed(0)} kg CO2e`;
}

function EnergieProcessPage() {
  const [siteFilter,      setSiteFilter]      = useState("");
  const [scopeFilter,     setScopeFilter]     = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");

  /* Données filtrées */
  const filtered = useMemo(() => {
    let d = energieProcessRows;
    if (siteFilter)      d = d.filter((r) => r.site              === siteFilter);
    if (scopeFilter)     d = d.filter((r) => r.scope             === scopeFilter);
    if (categorieFilter) d = d.filter((r) => r.categorieEmission === categorieFilter);
    return d;
  }, [siteFilter, scopeFilter, categorieFilter]);

  /* Totaux */
  const totalKgCO2e   = useMemo(() => filtered.reduce((s, r) => s + r.kgCO2e, 0), [filtered]);
  const totalScope1   = useMemo(() => filtered.filter((r) => r.scope === "1").reduce((s, r) => s + r.kgCO2e, 0), [filtered]);
  const totalScope2   = useMemo(() => filtered.filter((r) => r.scope === "2").reduce((s, r) => s + r.kgCO2e, 0), [filtered]);
  const totalScope3   = useMemo(() => filtered.filter((r) => r.scope === "3 amont").reduce((s, r) => s + r.kgCO2e, 0), [filtered]);

  /* Graphiques */
  const chartBySite = useMemo(() =>
    SITES.map((s) => {
      const v = filtered.filter((r) => r.site === s).reduce((acc, r) => acc + r.kgCO2e, 0);
      return { label: s, value: v, display: fmtKg(v), color: SITE_COLORS[s] };
    }).filter((i) => i.value > 0),
  [filtered]);

  const chartByScope = useMemo(() =>
    SCOPES.map((sc) => {
      const v = filtered.filter((r) => r.scope === sc).reduce((acc, r) => acc + r.kgCO2e, 0);
      return { label: `Scope ${sc}`, value: v, display: fmtKg(v), color: SCOPE_COLORS[sc] };
    }).filter((i) => i.value > 0),
  [filtered]);

  const chartByEnergie = useMemo(() => {
    const map = {};
    filtered.forEach((r) => {
      map[r.energie] = (map[r.energie] || 0) + r.kgCO2e;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([label, value], i) => ({
        label,
        value,
        display: fmtKg(value),
        color: ["#059669","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#0ea5e9","#10b981","#f97316","#ec4899","#64748b"][i % 10],
      }));
  }, [filtered]);

  /* Tableau : ajouter colonne % recalculée sur le filtre */
  const tableRows = useMemo(() =>
    filtered.map((r) => ({
      ...r,
      kgCO2e:     r.kgCO2e.toLocaleString("fr-FR", { maximumFractionDigits: 2 }),
      pourcentage: totalKgCO2e > 0
        ? `${((r.kgCO2e / totalKgCO2e) * 100).toFixed(2)} %`
        : "—",
      quantite:    r.quantite.toLocaleString("fr-FR"),
      feKgCO2eUnite: r.feKgCO2eUnite,
    })),
  [filtered, totalKgCO2e]);

  return (
    <PageContainer
      title="Énergie et Process"
      description="Consommations énergétiques et procédés des 4 sites. Calcul des émissions (kg CO2e) par type de fluide, scope et catégorie — source Base Carbone ADEME."
    >
      {/* Cartes résumé */}
      <div className="summary-grid">
        <SummaryCard label="Total kg CO2e"  value={fmtKg(totalKgCO2e)} helper="Toutes énergies confondues" accent="green"  />
        <SummaryCard label="Scope 1"        value={fmtKg(totalScope1)}  helper="Combustion + frigorigènes"  accent="red"    />
        <SummaryCard label="Scope 2"        value={fmtKg(totalScope2)}  helper="Électricité réseau"         accent="blue"   />
        <SummaryCard label="Scope 3 amont"  value={fmtKg(totalScope3)}  helper="Produits et services achetés"  accent="amber"  />
      </div>

      {/* Scopes visuels */}
      <div className="scope-bar-row">
        {[
          { label: "Scope 1", val: totalScope1, color: "#ef4444" },
          { label: "Scope 2", val: totalScope2, color: "#3b82f6" },
          { label: "Scope 3 amont", val: totalScope3, color: "#f59e0b" },
        ].map(({ label, val, color }) => {
          const pct = totalKgCO2e > 0 ? (val / totalKgCO2e) * 100 : 0;
          return (
            <div key={label} className="scope-bar-item">
              <div className="scope-bar-item__top">
                <span className="scope-bar-item__dot" style={{ background: color }} />
                <span className="scope-bar-item__label">{label}</span>
                <strong className="scope-bar-item__pct">{pct.toFixed(1)} %</strong>
              </div>
              <div className="scope-bar-item__track">
                <div className="scope-bar-item__fill" style={{ width: `${pct}%`, background: color }} />
              </div>
              <span className="scope-bar-item__val">{fmtKg(val)}</span>
            </div>
          );
        })}
      </div>

      {/* Filtres */}
      <div className="filter-bar">
        <select className="filter-select" value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}>
          <option value="">Tous les sites</option>
          {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select className="filter-select" value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value)}>
          <option value="">Tous les scopes</option>
          {SCOPES.map((s) => <option key={s} value={s}>Scope {s}</option>)}
        </select>

        <select className="filter-select" value={categorieFilter} onChange={(e) => setCategorieFilter(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Indicateurs rapides */}
      <div className="stats-row">
        <article className="stat-pill">
          <span>Lignes</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Sites</span>
          <strong>{[...new Set(filtered.map((r) => r.site))].length}</strong>
        </article>
        <article className="stat-pill">
          <span>Types de fluide</span>
          <strong>{[...new Set(filtered.map((r) => r.energie))].length}</strong>
        </article>
        <article className="stat-pill">
          <span>Total CO2e</span>
          <strong>{fmtKg(totalKgCO2e)}</strong>
        </article>
      </div>

      {/* Tableau */}
      <DataTable columns={energieProcessColumns} rows={tableRows} />

      {/* Graphiques */}
      <div className="charts-grid">
        <BarChart title="Émissions par site (kg CO2e)"          items={chartBySite}    />
        <BarChart title="Émissions par scope (kg CO2e)"         items={chartByScope}   />
      </div>
      <BarChart title="Top 10 — Émissions par type d'énergie (kg CO2e)" items={chartByEnergie} />
    </PageContainer>
  );
}

export default EnergieProcessPage;
