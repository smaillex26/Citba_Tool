import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import BarChart from "../components/dashboard/BarChart.jsx";
import {
  energieProcessRows  as mockRows,
  energieProcessColumns,
} from "../data/energieProcessData.js";
import { getDataset } from "../services/api.js";

const SCOPE_COLORS = { "1": "#ef4444", "2": "#3b82f6", "3 amont": "#f59e0b" };
const SITE_COLORS  = { Arthez: "#059669", Palplast: "#3b82f6", Pontonx: "#f59e0b", Infautelec: "#8b5cf6" };
const PALETTE = ["#059669","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#0ea5e9","#10b981","#f97316","#ec4899","#64748b"];

function fmtKg(v) {
  if (v >= 1000) return `${(v / 1000).toFixed(2)} t CO2e`;
  return `${v.toFixed(0)} kg CO2e`;
}

function unique(rows, key) {
  return [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
}

function EnergieProcessPage() {
  const [apiRows,  setApiRows]  = useState(null);
  const [dataSource, setDataSource] = useState("mock");

  const [siteFilter,      setSiteFilter]      = useState("");
  const [scopeFilter,     setScopeFilter]     = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");

  /* Tentative de chargement depuis l'API au montage */
  useEffect(() => {
    getDataset("energie").then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setApiRows(data);
        setDataSource("api");
      }
    });
  }, []);

  const rows = apiRows ?? mockRows;

  /* Listes de filtres dérivées dynamiquement */
  const SITES      = useMemo(() => unique(rows, "site"),              [rows]);
  const SCOPES     = useMemo(() => unique(rows, "scope"),             [rows]);
  const CATEGORIES = useMemo(() => unique(rows, "categorieEmission"), [rows]);

  /* Filtrage */
  const filtered = useMemo(() => {
    let d = rows;
    if (siteFilter)      d = d.filter((r) => r.site              === siteFilter);
    if (scopeFilter)     d = d.filter((r) => r.scope             === scopeFilter);
    if (categorieFilter) d = d.filter((r) => r.categorieEmission === categorieFilter);
    return d;
  }, [rows, siteFilter, scopeFilter, categorieFilter]);

  /* Totaux */
  const totalKgCO2e = useMemo(() => filtered.reduce((s, r) => s + (r.kgCO2e ?? 0), 0), [filtered]);
  const totalScope1 = useMemo(() => filtered.filter((r) => r.scope === "1"      ).reduce((s, r) => s + (r.kgCO2e ?? 0), 0), [filtered]);
  const totalScope2 = useMemo(() => filtered.filter((r) => r.scope === "2"      ).reduce((s, r) => s + (r.kgCO2e ?? 0), 0), [filtered]);
  const totalScope3 = useMemo(() => filtered.filter((r) => r.scope === "3 amont").reduce((s, r) => s + (r.kgCO2e ?? 0), 0), [filtered]);

  /* Graphiques */
  const chartBySite = useMemo(() =>
    SITES.map((s) => {
      const v = filtered.filter((r) => r.site === s).reduce((a, r) => a + (r.kgCO2e ?? 0), 0);
      return { label: s, value: v, display: fmtKg(v), color: SITE_COLORS[s] ?? "#64748b" };
    }).filter((i) => i.value > 0),
  [filtered, SITES]);

  const chartByScope = useMemo(() =>
    SCOPES.map((sc) => {
      const v = filtered.filter((r) => r.scope === sc).reduce((a, r) => a + (r.kgCO2e ?? 0), 0);
      return { label: `Scope ${sc}`, value: v, display: fmtKg(v), color: SCOPE_COLORS[sc] ?? "#64748b" };
    }).filter((i) => i.value > 0),
  [filtered, SCOPES]);

  const chartByEnergie = useMemo(() => {
    const map = {};
    filtered.forEach((r) => { map[r.energie] = (map[r.energie] || 0) + (r.kgCO2e ?? 0); });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([label, value], i) => ({ label, value, display: fmtKg(value), color: PALETTE[i % 10] }));
  }, [filtered]);

  /* Lignes tableau : formatage d'affichage */
  const tableRows = useMemo(() =>
    filtered.map((r) => ({
      ...r,
      kgCO2e:        (r.kgCO2e ?? 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 }),
      pourcentage:   totalKgCO2e > 0 ? `${(((r.kgCO2e ?? 0) / totalKgCO2e) * 100).toFixed(2)} %` : "—",
      quantite:      (r.quantite ?? 0).toLocaleString("fr-FR"),
      feKgCO2eUnite: r.feKgCO2eUnite,
    })),
  [filtered, totalKgCO2e]);

  return (
    <PageContainer
      title="Énergie et Process"
      description="Consommations énergétiques et procédés des 4 sites. Calcul des émissions (kg CO2e) par type de fluide, scope et catégorie — source Base Carbone ADEME."
      actions={
        dataSource === "api"
          ? <span className="data-source-badge data-source-badge--live">Données importées</span>
          : <span className="data-source-badge data-source-badge--mock">Données de démonstration</span>
      }
    >
      {/* Cartes résumé */}
      <div className="summary-grid">
        <SummaryCard label="Total kg CO2e"  value={fmtKg(totalKgCO2e)} helper="Toutes énergies confondues"    accent="green" />
        <SummaryCard label="Scope 1"        value={fmtKg(totalScope1)}  helper="Combustion + frigorigènes"     accent="red"   />
        <SummaryCard label="Scope 2"        value={fmtKg(totalScope2)}  helper="Électricité réseau"            accent="blue"  />
        <SummaryCard label="Scope 3 amont"  value={fmtKg(totalScope3)}  helper="Produits et services achetés"  accent="amber" />
      </div>

      {/* Barres scope */}
      <div className="scope-bar-row">
        {[
          { label: "Scope 1",      val: totalScope1, color: "#ef4444" },
          { label: "Scope 2",      val: totalScope2, color: "#3b82f6" },
          { label: "Scope 3 amont", val: totalScope3, color: "#f59e0b" },
        ].map(({ label, val, color }) => {
          const pct = totalKgCO2e > 0 ? (val / totalKgCO2e) * 100 : 0;
          return (
            <div key={label} className="scope-bar-item">
              <div className="scope-bar-item__top">
                <span className="scope-bar-item__dot"   style={{ background: color }} />
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
        <article className="stat-pill"><span>Lignes</span><strong>{filtered.length}</strong></article>
        <article className="stat-pill"><span>Sites</span><strong>{unique(filtered, "site").length}</strong></article>
        <article className="stat-pill"><span>Types de fluide</span><strong>{unique(filtered, "energie").length}</strong></article>
        <article className="stat-pill"><span>Total CO2e</span><strong>{fmtKg(totalKgCO2e)}</strong></article>
      </div>

      {/* Tableau */}
      <DataTable columns={energieProcessColumns} rows={tableRows} />

      {/* Graphiques */}
      <div className="charts-grid">
        <BarChart title="Émissions par site (kg CO2e)"  items={chartBySite}  />
        <BarChart title="Émissions par scope (kg CO2e)" items={chartByScope} />
      </div>
      <BarChart title="Top 10 — Émissions par type d'énergie (kg CO2e)" items={chartByEnergie} />
    </PageContainer>
  );
}

export default EnergieProcessPage;
