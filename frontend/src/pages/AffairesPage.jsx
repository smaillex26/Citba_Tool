import { useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer.jsx";
import { INITIAL_AFFAIRES } from "../data/affairesData.js";

const STATUT_COLOR = {
  "En cours": { bg: "#dcfce7", text: "#15803d" },
  "Termine":  { bg: "#f1f5f9", text: "#64748b" },
};

function AffairesPage() {
  const [affaires, setAffaires] = useState(INITIAL_AFFAIRES);
  const [confirmId, setConfirmId] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState("");

  function handleDelete(id) {
    setAffaires((prev) => prev.filter((a) => a.id !== id));
    setConfirmId(null);
  }

  const filtered = filtreStatut
    ? affaires.filter((a) => a.statut === filtreStatut)
    : affaires;

  const enCours = affaires.filter((a) => a.statut === "En cours").length;
  const termines = affaires.filter((a) => a.statut === "Termine").length;

  return (
    <PageContainer
      title="Tableau de bord — Affaires"
      description="Retrouvez toutes vos affaires classees par numero. Supprimez une affaire une fois son traitement termine."
    >
      {/* Stats */}
      <div className="stats-row">
        <article className="stat-pill">
          <span>Total affaires</span>
          <strong>{affaires.length}</strong>
        </article>
        <article className="stat-pill">
          <span>En cours</span>
          <strong style={{ color: "#15803d" }}>{enCours}</strong>
        </article>
        <article className="stat-pill">
          <span>Terminees</span>
          <strong style={{ color: "#64748b" }}>{termines}</strong>
        </article>
      </div>

      {/* Filtres */}
      <div className="filter-bar">
        <select
          className="filter-select"
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="En cours">En cours</option>
          <option value="Termine">Termine</option>
        </select>
      </div>

      {/* Liste */}
      <div className="affaires-list">
        {filtered.length === 0 && (
          <p className="affaires-empty">Aucune affaire a afficher.</p>
        )}

        {filtered.map((affaire) => {
          const colors = STATUT_COLOR[affaire.statut] || STATUT_COLOR["En cours"];
          return (
            <article key={affaire.id} className="affaire-card">
              <div className="affaire-card__left">
                <div className="affaire-card__id">{affaire.id}</div>
                <div className="affaire-card__body">
                  <h3>{affaire.titre}</h3>
                  <p>{affaire.description}</p>
                  <div className="affaire-card__tags">
                    {affaire.categories.map((c) => (
                      <span key={c} className="affaire-tag">{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="affaire-card__right">
                <div className="affaire-card__meta">
                  <div className="affaire-meta-item">
                    <span>Fichier</span>
                    <strong>{affaire.fichierSource}</strong>
                  </div>
                  <div className="affaire-meta-item">
                    <span>Lignes</span>
                    <strong>{affaire.lignes.toLocaleString("fr-FR")}</strong>
                  </div>
                  {affaire.tonnageTotal > 0 && (
                    <div className="affaire-meta-item">
                      <span>Tonnage</span>
                      <strong>{affaire.tonnageTotal} t</strong>
                    </div>
                  )}
                  <div className="affaire-meta-item">
                    <span>Cree le</span>
                    <strong>
                      {new Date(affaire.dateCreation).toLocaleDateString("fr-FR")}
                    </strong>
                  </div>
                </div>

                <div className="affaire-card__actions">
                  <span
                    className="affaire-statut"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    {affaire.statut}
                  </span>

                  <Link
                    to={`/dashboard/${affaire.id}`}
                    className="affaire-btn affaire-btn--view"
                  >
                    Voir le detail
                  </Link>

                  {confirmId === affaire.id ? (
                    <div className="affaire-confirm">
                      <span>Confirmer la suppression ?</span>
                      <button
                        className="affaire-btn affaire-btn--danger"
                        onClick={() => handleDelete(affaire.id)}
                      >
                        Supprimer
                      </button>
                      <button
                        className="affaire-btn affaire-btn--cancel"
                        onClick={() => setConfirmId(null)}
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      className="affaire-btn affaire-btn--delete"
                      onClick={() => setConfirmId(affaire.id)}
                      title="Supprimer cette affaire"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </PageContainer>
  );
}

export default AffairesPage;
