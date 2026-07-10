import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import { clearAuthToken, getCurrentUser } from "./services/api.js";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ImportPage from "./pages/ImportPage.jsx";
import ImportHistoryPage from "./pages/ImportHistoryPage.jsx";
import DeplacementsDTPage from "./pages/DeplacementsDTPage.jsx";
import SousTraitancePage from "./pages/SousTraitancePage.jsx";
import EnergieProcessPage from "./pages/EnergieProcessPage.jsx";
import ClimPage from "./pages/ClimPage.jsx";
import AffairesPage from "./pages/AffairesPage.jsx";
import AchatsBiensPage from "./pages/AchatsBiensPage.jsx";
import AchatsServicesPage from "./pages/AchatsServicesPage.jsx";
import BiensImmobilisesPage from "./pages/BiensImmobilisesPage.jsx";
import DeplacementsProPage from "./pages/DeplacementsProPage.jsx";
import DechetsPage from "./pages/DechetsPage.jsx";
import TransportAvalPage from "./pages/TransportAvalPage.jsx";
import EmissionFactorsPage from "./pages/EmissionFactorsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import PlanActionPage from "./pages/PlanActionPage.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((result) => {
      setUser(result?.user ?? null);
      setLoading(false);
    });
  }, []);

  function handleLogout() {
    clearAuthToken();
    setUser(null);
  }

  if (loading) {
    return <div className="app-loading">Chargement...</div>;
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/imports" element={<ImportHistoryPage />} />
            <Route path="/donnees/deplacements-dt" element={<DeplacementsDTPage />} />
            <Route path="/donnees/sous-traitance" element={<SousTraitancePage />} />
            <Route path="/donnees/energie-process" element={<EnergieProcessPage />} />
            <Route path="/donnees/clim" element={<ClimPage />} />
            <Route path="/donnees/achats-biens" element={<AchatsBiensPage />} />
            <Route path="/donnees/achats-services" element={<AchatsServicesPage />} />
            <Route path="/donnees/biens-immobilises" element={<BiensImmobilisesPage />} />
            <Route path="/donnees/deplacements-pro" element={<DeplacementsProPage />} />
            <Route path="/donnees/dechets" element={<DechetsPage />} />
            <Route path="/donnees/transport-aval" element={<TransportAvalPage />} />
            <Route path="/dashboard" element={<AffairesPage />} />
            <Route path="/plan-action" element={<PlanActionPage />} />
            <Route path="/facteurs-emission" element={<EmissionFactorsPage />} />
            <Route path="/parametres" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
