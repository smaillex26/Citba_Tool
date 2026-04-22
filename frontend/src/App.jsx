import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import ImportPage from "./pages/ImportPage.jsx";
import CollectPage from "./pages/CollectPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DeplacementsDTPage from "./pages/DeplacementsDTPage.jsx";
import ActifsLeasingPage from "./pages/ActifsLeasingPage.jsx";
import SousTraitancePage from "./pages/SousTraitancePage.jsx";
import EnergieProcessPage from "./pages/EnergieProcessPage.jsx";
import AffairesPage from "./pages/AffairesPage.jsx";
import AffaireDetailPage from "./pages/AffaireDetailPage.jsx";
import AchatsBiensPage from "./pages/AchatsBiensPage.jsx";
import AchatsServicesPage from "./pages/AchatsServicesPage.jsx";
import BiensImmobilisesPage from "./pages/BiensImmobilisesPage.jsx";
import DeplacementsProPage from "./pages/DeplacementsProPage.jsx";
import DechetsPage from "./pages/DechetsPage.jsx";
import TransportAvalPage from "./pages/TransportAvalPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/donnees/collecte" element={<CollectPage />} />
            <Route path="/donnees/deplacements-dt" element={<DeplacementsDTPage />} />
            <Route path="/donnees/actifs-leasing" element={<ActifsLeasingPage />} />
            <Route path="/donnees/sous-traitance" element={<SousTraitancePage />} />
            <Route path="/donnees/energie-process" element={<EnergieProcessPage />} />
            <Route path="/donnees/achats-biens" element={<AchatsBiensPage />} />
            <Route path="/donnees/achats-services" element={<AchatsServicesPage />} />
            <Route path="/donnees/biens-immobilises" element={<BiensImmobilisesPage />} />
            <Route path="/donnees/deplacements-pro" element={<DeplacementsProPage />} />
            <Route path="/donnees/dechets" element={<DechetsPage />} />
            <Route path="/donnees/transport-aval" element={<TransportAvalPage />} />
            <Route path="/dashboard" element={<AffairesPage />} />
            <Route path="/dashboard/:id" element={<AffaireDetailPage />} />
            <Route path="/stats" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
