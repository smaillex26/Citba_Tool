import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer.jsx";
import DataTable from "../components/table/DataTable.jsx";
import { collectColumns, collectRows } from "../data/mockData.js";

function uniqueValues(rows, key) {
  return [...new Set(rows.map((r) => r[key]))].sort();
}

function CollectPage() {
  const [familyFilter, setFamilyFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const families = useMemo(() => uniqueValues(collectRows, "famille"), []);
  const countries = useMemo(() => uniqueValues(collectRows, "pays"), []);

  const filtered = useMemo(() => {
    let data = collectRows;
    if (familyFilter) data = data.filter((r) => r.famille === familyFilter);
    if (countryFilter) data = data.filter((r) => r.pays === countryFilter);
    return data;
  }, [familyFilter, countryFilter]);

  const totalTonnes = useMemo(
    () => filtered.reduce((sum, r) => sum + (r.poidsTonne || 0), 0).toFixed(3),
    [filtered],
  );

  return (
    <PageContainer
      title="Tableau de collecte"
      description="Données de test pour préparer l'affichage des données métier. La recherche, le tri et la pagination sont fonctionnels."
    >
      <div className="filter-bar">
        <select
          value={familyFilter}
          onChange={(e) => setFamilyFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les familles</option>
          {families.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les pays</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="stats-row">
        <article className="stat-pill">
          <span>Lignes</span>
          <strong>{filtered.length}</strong>
        </article>
        <article className="stat-pill">
          <span>Fournisseurs</span>
          <strong>{uniqueValues(filtered, "fournisseur").length}</strong>
        </article>
        <article className="stat-pill">
          <span>Pays</span>
          <strong>{uniqueValues(filtered, "pays").length}</strong>
        </article>
        <article className="stat-pill">
          <span>Tonnage</span>
          <strong>{totalTonnes} t</strong>
        </article>
      </div>

      <DataTable columns={collectColumns} rows={filtered} />
    </PageContainer>
  );
}

export default CollectPage;
