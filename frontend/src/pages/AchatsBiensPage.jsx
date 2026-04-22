import PageContainer from "../components/layout/PageContainer.jsx";

function AchatsBiensPage() {
  return (
    <PageContainer
      title="Achats de biens"
      description="Données relatives aux achats de biens matériels. Cette section sera alimentée lors de l'import des données."
    >
      <div className="info-grid">
        <article className="info-card">
          <h3>En attente de données</h3>
          <p>
            Importez un fichier pour visualiser les achats de biens et leur
            impact carbone associé (scope 3 — catégorie 1).
          </p>
        </article>
      </div>
    </PageContainer>
  );
}

export default AchatsBiensPage;
