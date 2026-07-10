import DataTable from "../table/DataTable.jsx";
import SummaryCard from "../dashboard/SummaryCard.jsx";
import { formatTCO2e } from "../../utils/planActionData.js";

const BREAKDOWN_COLUMNS = [
  { key: "label", label: "Catégorie" },
  { key: "rows", label: "Lignes", align: "right" },
  { key: "tCO2eDisplay", label: "Émissions", align: "right" },
  { key: "percentDisplay", label: "Part", align: "right" },
];

const TOP_ITEMS_COLUMNS = [
  { key: "label", label: "Libellé" },
  { key: "dataset", label: "Source" },
  { key: "tCO2eDisplay", label: "Émissions", align: "right" },
];

function PlanActionDetailView({ importMeta, breakdown, topItems }) {
  if (!importMeta) {
    return <p className="plan-empty">Aucun détail d'import disponible.</p>;
  }

  const breakdownRows = breakdown.map((row, index) => ({
    id: index + 1,
    ...row,
    tCO2eDisplay: formatTCO2e(row.tCO2e),
    percentDisplay: `${row.percent} %`,
  }));

  const topRows = topItems.map((row, index) => ({
    id: index + 1,
    ...row,
    tCO2eDisplay: formatTCO2e(row.tCO2e),
  }));

  return (
    <>
      <section className="plan-card plan-import-card">
        <h3 className="plan-card__title">Fichier importé</h3>
        <div className="plan-import-card__grid">
          <div>
            <p className="plan-import-card__label">Nom du fichier</p>
            <strong>{importMeta.filename}</strong>
          </div>
          <div>
            <p className="plan-import-card__label">Date d'import</p>
            <strong>{importMeta.createdAtDisplay}</strong>
          </div>
          <div>
            <p className="plan-import-card__label">Lignes traitées</p>
            <strong>{importMeta.totalRows.toLocaleString("fr-FR")}</strong>
          </div>
          <div>
            <p className="plan-import-card__label">Jeux de données</p>
            <strong>{importMeta.datasetCount}</strong>
          </div>
        </div>
      </section>

      <div className="summary-grid">
        <SummaryCard
          label="Émissions totales"
          value={formatTCO2e(importMeta.totalTCO2e)}
          helper="Dernier fichier importé"
          accent="green"
        />
        <SummaryCard
          label="Catégories actives"
          value={String(breakdown.length)}
          helper="Postes avec données"
          accent="blue"
        />
        <SummaryCard
          label="Sites couverts"
          value={String(importMeta.sitesCount)}
          helper="Sites du groupe"
          accent="amber"
        />
      </div>

      <section className="plan-section">
        <div className="plan-section__header">
          <h3>Répartition par catégorie</h3>
          <p>Détail des émissions calculées pour chaque jeu de données du fichier.</p>
        </div>
        <DataTable columns={BREAKDOWN_COLUMNS} rows={breakdownRows} />
      </section>

      <section className="plan-section">
        <div className="plan-section__header">
          <h3>Principaux postes du fichier</h3>
          <p>Familles, prestations et flux les plus émetteurs détectés dans l'import.</p>
        </div>
        <DataTable columns={TOP_ITEMS_COLUMNS} rows={topRows} />
      </section>
    </>
  );
}

export default PlanActionDetailView;
