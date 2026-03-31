import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import BarChart from "../components/dashboard/BarChart.jsx";
import { INITIAL_AFFAIRES } from "../data/affairesData.js";
import { chartByFamily, chartByCountry } from "../data/mockData.js";

function AffaireDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  const affaire = INITIAL_AFFAIRES.find((a) => a.id === id);

  if (!affaire) {
    return (
      <PageContainer title="Affaire introuvable">
        <p>L'affaire <strong>{id}</strong> n'existe pas ou a deja ete supprimee.</p>
        <Link to="/dashboard" className="affaire-btn affaire-btn--view" style={{ display: "inline-flex", marginTop: 16 }}>
          Retour au tableau de bord
        </Link>
      </PageContainer>
    );
  }

  const STATUT_COLOR = {
    "En cours": { bg: "#dcfce7", text: "#15803d" },
    "Termine":  { bg: "#f1f5f9", text: "#64748b" },
  };
  const colors = STATUT_COLOR[affaire.statut] || STATUT_COLOR["En cours"];

  const cards = [
    { id: 1, label: "Lignes importees", value: affaire.lignes.toLocaleString("fr-FR"), helper: "Total des lignes traitees", accent: "blue" },
    { id: 2, label: "Tonnage total", value: affaire.tonnageTotal > 0 ? `${affaire.tonnageTotal} t` : "—", helper: "Poids converti en tonnes", accent: "green" },
    { id: 3, label: "Fournisseurs", value: affaire.fournisseurs > 0 ? String(affaire.fournisseurs) : "—", helper: "Fournisseurs distincts", accent: "amber" },
    { id: 4, label: "Categories", value: String(affaire.categories.length), helper: "Tableaux de donnees couverts", accent: "slate" },
  ];

  return (
    <PageContainer
      title={affaire.titre}
      description={affaire.description}
      actions={
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span
            className="affaire-statut"
            style={{ background: colors.bg, color: colors.text }}
          >
            {affaire.statut}
          </span>
          <Link to="/dashboard" className="affaire-btn affaire-btn--cancel">
            Retour
          </Link>
        </div>
      }
    >
      {/* Infos affaire */}
      <div className="affaire-detail-meta">
        <div className="affaire-detail-meta__item">
          <span>Numero</span>
          <strong>{affaire.id}</strong>
        </div>
        <div className="affaire-detail-meta__item">
          <span>Fichier source</span>
          <strong>{affaire.fichierSource}</strong>
        </div>
        <div className="affaire-detail-meta__item">
          <span>Date de creation</span>
          <strong>{new Date(affaire.dateCreation).toLocaleDateString("fr-FR")}</strong>
        </div>
        <div className="affaire-detail-meta__item">
          <span>Categories</span>
          <div className="affaire-card__tags" style={{ marginTop: 4 }}>
            {affaire.categories.map((c) => (
              <span key={c} className="affaire-tag">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Cards resume */}
      <div className="summary-grid">
        {cards.map((card) => (
          <SummaryCard
            key={card.id}
            label={card.label}
            value={card.value}
            helper={card.helper}
            accent={card.accent}
          />
        ))}
      </div>

      {/* Graphiques (donnees de test) */}
      <div className="charts-grid">
        <BarChart title="Repartition par famille (tonnes)" items={chartByFamily} />
        <BarChart title="Repartition par pays (tonnes)" items={chartByCountry} />
      </div>

      {/* Zone suppression */}
      <div className="affaire-danger-zone">
        <div>
          <h3>Supprimer cette affaire</h3>
          <p>Cette action est irreversible. Toutes les donnees associees seront effacees.</p>
        </div>
        {confirm ? (
          <div className="affaire-confirm">
            <span>Confirmer la suppression ?</span>
            <button
              className="affaire-btn affaire-btn--danger"
              onClick={() => navigate("/dashboard")}
            >
              Supprimer definitivement
            </button>
            <button
              className="affaire-btn affaire-btn--cancel"
              onClick={() => setConfirm(false)}
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            className="affaire-btn affaire-btn--delete"
            onClick={() => setConfirm(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Supprimer l'affaire
          </button>
        )}
      </div>
    </PageContainer>
  );
}

export default AffaireDetailPage;
