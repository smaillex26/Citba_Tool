import PageContainer from "../components/layout/PageContainer.jsx";

function DeplacementsProPage() {
  return (
    <PageContainer
      title="Déplacements professionnels"
      description="Données relatives aux déplacements effectués dans le cadre de l'activité professionnelle (missions, visites clients…). Cette section sera alimentée lors de l'import des données."
    >
      <div className="info-grid">
        <article className="info-card">
          <h3>En attente de données</h3>
          <p>
            Importez un fichier pour visualiser les déplacements professionnels
            et leur impact carbone associé (scope 3 — catégorie 6).
          </p>
        </article>
      </div>
    </PageContainer>
  );
}

export default DeplacementsProPage;
