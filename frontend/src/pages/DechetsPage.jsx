import PageContainer from "../components/layout/PageContainer.jsx";

function DechetsPage() {
  return (
    <PageContainer
      title="Déchets"
      description="Données relatives à la production et au traitement des déchets générés par l'activité. Cette section sera alimentée lors de l'import des données."
    >
      <div className="info-grid">
        <article className="info-card">
          <h3>En attente de données</h3>
          <p>
            Importez un fichier pour visualiser les flux de déchets et leur
            impact carbone associé (scope 3 — catégorie 5).
          </p>
        </article>
      </div>
    </PageContainer>
  );
}

export default DechetsPage;
