import PageContainer from "../components/layout/PageContainer.jsx";

function BiensImmobilisesPage() {
  return (
    <PageContainer
      title="Biens immobilisés"
      description="Données relatives aux immobilisations (équipements, machines, véhicules…). Cette section sera alimentée lors de l'import des données."
    >
      <div className="info-grid">
        <article className="info-card">
          <h3>En attente de données</h3>
          <p>
            Importez un fichier pour visualiser les biens immobilisés et leur
            impact carbone associé (scope 3 — catégorie 2).
          </p>
        </article>
      </div>
    </PageContainer>
  );
}

export default BiensImmobilisesPage;
