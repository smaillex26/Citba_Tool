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
