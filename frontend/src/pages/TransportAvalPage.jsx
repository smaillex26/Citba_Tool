import PageContainer from "../components/layout/PageContainer.jsx";

function TransportAvalPage() {
  return (
    <PageContainer
      title="Transport aval & Fin de vie des produits vendus"
      description="Données relatives au transport en aval de la chaîne logistique et à la fin de vie des produits vendus. Cette section sera alimentée lors de l'import des données."
    >
      <div className="info-grid">
        <article className="info-card">
          <h3>Transport aval — En attente de données</h3>
          <p>
            Importez un fichier pour visualiser les émissions liées au
            transport des produits vers les clients (scope 3 — catégorie 9).
          </p>
        </article>
        <article className="info-card">
          <h3>Fin de vie des produits — En attente de données</h3>
          <p>
            Importez un fichier pour visualiser les émissions liées au
            traitement en fin de vie des produits vendus (scope 3 — catégorie 12).
          </p>
        </article>
      </div>
    </PageContainer>
  );
}

export default TransportAvalPage;
