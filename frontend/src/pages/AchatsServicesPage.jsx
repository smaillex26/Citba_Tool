import PageContainer from "../components/layout/PageContainer.jsx";

function AchatsServicesPage() {
  return (
    <PageContainer
      title="Achats de services"
      description="Données relatives aux achats de services externes. Cette section sera alimentée lors de l'import des données."
    >
      <div className="info-grid">
        <article className="info-card">
          <h3>En attente de données</h3>
          <p>
            Importez un fichier pour visualiser les achats de services et leur
            impact carbone associé (scope 3 — catégorie 1).
          </p>
        </article>
      </div>
    </PageContainer>
  );
}

export default AchatsServicesPage;
