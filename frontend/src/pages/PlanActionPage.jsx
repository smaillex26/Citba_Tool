import { useEffect, useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import ImportRequiredState from "../components/data/ImportRequiredState.jsx";
import PlanActionDashboard from "../components/plan-action/PlanActionDashboard.jsx";
import PlanActionDetailView from "../components/plan-action/PlanActionDetailView.jsx";
import {
  buildPlanActionView,
  buildPlanDetailView,
  loadPlanActionRawData,
  REPORT_FALLBACK,
} from "../utils/planActionData.js";

const TABS = [
  { id: "global", label: "Vue globale" },
  { id: "detail", label: "Détail import" },
  { id: "site", label: "Par année & site" },
];

function PlanActionPage() {
  const [raw, setRaw] = useState(null);
  const [activeTab, setActiveTab] = useState("global");
  const [siteFilter, setSiteFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    loadPlanActionRawData().then(setRaw);
  }, []);

  const globalView = useMemo(() => {
    if (!raw) return null;
    if (!raw.hasData) return buildPlanActionView(raw);
    return buildPlanActionView(raw);
  }, [raw]);

  const detailView = useMemo(() => {
    if (!raw?.hasData) return null;
    return buildPlanDetailView(raw);
  }, [raw]);

  const filteredView = useMemo(() => {
    if (!raw?.hasData) return null;
    return buildPlanActionView(raw, { site: siteFilter, year: yearFilter });
  }, [raw, siteFilter, yearFilter]);

  const period = useMemo(() => {
    if (!raw) return REPORT_FALLBACK.period;
    if (yearFilter === "2022-2023") return REPORT_FALLBACK.period;
    if (yearFilter && raw.latestImport?.created_at) {
      return `Exercice ${yearFilter}`;
    }
    return raw.period;
  }, [raw, yearFilter]);

  if (!raw || !globalView) {
    return (
      <PageContainer title="Plan d'action" description="Chargement du diagnostic décarbonation...">
        <div className="plan-loading">Analyse des données importées...</div>
      </PageContainer>
    );
  }

  const isLive = raw.hasData;

  return (
    <div className="plan-action-page">
      <section className="plan-hero">
        <div className="plan-hero__content">
          <p className="plan-hero__eyebrow">Rapport stratégique</p>
          <h1>Diagnostic Décarbonation</h1>
          <p className="plan-hero__subtitle">Bilan des émissions de gaz à effet de serre</p>
          <p className="plan-hero__period">Période : {period}</p>
        </div>
        <div className="plan-hero__badge">
          {isLive ? "Données importées" : "Modèle de référence"}
        </div>
      </section>

      <PageContainer
        title="Plan d'action"
        description="Synthèse globale, détail du fichier importé et analyse par exercice et par site."
        actions={
          isLive
            ? <span className="data-source-badge data-source-badge--live">Basé sur le dernier import</span>
            : <span className="data-source-badge data-source-badge--mock">En attente d'import</span>
        }
      >
        {!isLive && (
          <ImportRequiredState message="Importez le fichier Excel pour personnaliser ce diagnostic avec vos données réelles." />
        )}

        <nav className="plan-tabs" aria-label="Vues du plan d'action">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`plan-tabs__btn ${activeTab === tab.id ? "plan-tabs__btn--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "global" && (
          <PlanActionDashboard view={globalView} showActions extendedActionColumns />
        )}

        {activeTab === "detail" && (
          isLive && detailView
            ? <PlanActionDetailView {...detailView} />
            : <p className="plan-empty">Importez un fichier Excel pour afficher le détail par catégorie.</p>
        )}

        {activeTab === "site" && (
          <>
            <div className="filter-bar plan-filters">
              <select
                className="filter-select"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                aria-label="Filtrer par année"
              >
                <option value="">Toutes les années</option>
                {raw.years.filter(Boolean).map((year) => (
                  <option key={year} value={year}>
                    {year === "2022-2023" ? "2022-2023 (exercice comptable)" : year}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                aria-label="Filtrer par site"
              >
                <option value="">Tous les sites</option>
                {raw.sites.filter(Boolean).map((site) => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>

            {filteredView?.isEmpty ? (
              <p className="plan-empty">
                Aucune donnée pour ce filtre. Essayez un autre site ou élargissez la période.
              </p>
            ) : (
              <PlanActionDashboard
                view={filteredView ?? globalView}
                showActions
                extendedActionColumns
              />
            )}
          </>
        )}
      </PageContainer>
    </div>
  );
}

export default PlanActionPage;
