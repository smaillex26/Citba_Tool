import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home">
      {/* ---- Hero ---- */}
      <section className="home-hero">
        <div className="home-hero__text">
          <h1>
            Collectez vos données.<br />
            Préparez votre<br />
            <span className="home-hero__highlight">bilan carbone.</span>
          </h1>
          <p>
            Un outil interne simple et autonome pour importer vos fichiers ERP,
            organiser vos données et faciliter le calcul de votre empreinte carbone.
          </p>
          <div className="home-hero__actions">
            <Link to="/import" className="home-btn home-btn--fill">
              Importer un fichier
            </Link>
            <Link to="/donnees/collecte" className="home-btn home-btn--outline">
              Consulter les donnees
            </Link>
          </div>
        </div>
        <div className="home-hero__visual">
          <div className="home-hero__card">
            <div className="home-hero__card-row">
              <span className="home-hero__dot home-hero__dot--green" />
              <span>Fichier importe</span>
              <strong>export_wavesoft.xlsx</strong>
            </div>
            <div className="home-hero__card-row">
              <span className="home-hero__dot home-hero__dot--blue" />
              <span>Lignes traitees</span>
              <strong>1 247</strong>
            </div>
            <div className="home-hero__card-row">
              <span className="home-hero__dot home-hero__dot--amber" />
              <span>Tonnage total</span>
              <strong>84.3 t</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Stats bar ---- */}
      <section className="home-bar">
        <div className="home-bar__item">
          <strong>4</strong>
          <span>Tableaux de collecte</span>
        </div>
        <div className="home-bar__sep" />
        <div className="home-bar__item">
          <strong>11+</strong>
          <span>Colonnes analysees</span>
        </div>
        <div className="home-bar__sep" />
        <div className="home-bar__item">
          <strong>100%</strong>
          <span>Local et autonome</span>
        </div>
        <div className="home-bar__sep" />
        <div className="home-bar__item">
          <strong>0</strong>
          <span>Dépendance cloud</span>
        </div>
      </section>

      {/* ---- Services ---- */}
      <section className="home-services">
        <div className="home-services__header">
          <p className="home-label">Fonctionnalités</p>
          <h2>Tout ce dont vous avez besoin</h2>
          <p>De l'import à l'analyse, chaque étape est pensée pour des utilisateurs non techniques.</p>
        </div>

        <div className="home-services__grid">
          <article className="home-svc">
            <div className="home-svc__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <h3>Import de fichiers</h3>
            <p>Déposez un fichier Excel exporté depuis Wavesoft. L'outil le lit et extrait les donnees utiles.</p>
          </article>

          <article className="home-svc">
            <div className="home-svc__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </div>
            <h3>Tableaux de collecte</h3>
            <p>Recherchez, triez et filtrez vos données par famille, fournisseur, pays ou unité.</p>
          </article>

          <article className="home-svc">
            <div className="home-svc__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <h3>Dashboard visuel</h3>
            <p>Consultez la répartition par matière, fournisseur et zone géographique d'un seul coup d'oeil.</p>
          </article>

          <article className="home-svc">
            <div className="home-svc__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h3>Conversions</h3>
            <p>Les unités sont harmonisées automatiquement : pièces, mètres, litres vers kilogrammes et tonnes.</p>
          </article>

          <article className="home-svc">
            <div className="home-svc__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3>Multi-donnees</h3>
            <p>Matières, déplacements, sous-traitance, leasing : chaque catégorie a son propre tableau.</p>
          </article>

          <article className="home-svc">
            <div className="home-svc__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Bilan carbone</h3>
            <p>Les données sont préparees pour être exploitées avec les facteurs d'émission ADEME.</p>
          </article>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="home-how">
        <p className="home-label">Comment ca marche</p>
        <h2>Trois étapes simples</h2>

        <div className="home-how__steps">
          <div className="home-how__step">
            <div className="home-how__num">01</div>
            <h3>Déposez votre fichier</h3>
            <p>Glissez un export Excel dans la zone d'import ou selectionnez-le manuellement.</p>
          </div>
          <div className="home-how__step">
            <div className="home-how__num">02</div>
            <h3>Traitement automatique</h3>
            <p>Les colonnes sont détectées, les unités converties et les données regroupées.</p>
          </div>
          <div className="home-how__step">
            <div className="home-how__num">03</div>
            <h3>Consultez les résultats</h3>
            <p>Naviguez dans les tableaux, appliquez vos filtres et exportez si besoin.</p>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="home-cta">
        <div className="home-cta__inner">
          <h2>Prêt à commencer ?</h2>
          <p>Importez votre premier fichier et consultez vos données en quelques secondes.</p>
          <Link to="/import" className="home-btn home-btn--fill">
            Commencer maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
