export const collectColumns = [
  { key: "reference", label: "Reference" },
  { key: "designation", label: "Designation" },
  { key: "famille", label: "Famille" },
  { key: "sousFamille", label: "Sous-famille" },
  { key: "fournisseur", label: "Fournisseur" },
  { key: "quantite", label: "Quantite" },
  { key: "unite", label: "Unite" },
  { key: "poidsKg", label: "Poids (kg)" },
  { key: "poidsTonne", label: "Poids (t)" },
  { key: "ville", label: "Ville" },
  { key: "pays", label: "Pays" },
];

export const collectRows = [
  { id: 1, reference: "MAT-001", designation: "Bobine acier galva", famille: "Acier", sousFamille: "Galvanise", fournisseur: "Metal Nord", quantite: 120, unite: "kg", poidsKg: 120, poidsTonne: 0.12, ville: "Lille", pays: "France" },
  { id: 2, reference: "MAT-002", designation: "Profil aluminium T6", famille: "Aluminium", sousFamille: "Extrude", fournisseur: "Alu Tech", quantite: 85, unite: "kg", poidsKg: 85, poidsTonne: 0.085, ville: "Lyon", pays: "France" },
  { id: 3, reference: "MAT-003", designation: "Granules PP naturel", famille: "Plastique", sousFamille: "Polypropylene", fournisseur: "Polymix", quantite: 320, unite: "kg", poidsKg: 320, poidsTonne: 0.32, ville: "Bruxelles", pays: "Belgique" },
  { id: 4, reference: "MAT-004", designation: "Plaques carton ondule", famille: "Emballage", sousFamille: "Carton", fournisseur: "EcoPack", quantite: 540, unite: "kg", poidsKg: 540, poidsTonne: 0.54, ville: "Nantes", pays: "France" },
  { id: 5, reference: "MAT-005", designation: "Fil de cuivre 2.5mm", famille: "Cuivre", sousFamille: "Fil", fournisseur: "Copper Line", quantite: 42, unite: "kg", poidsKg: 42, poidsTonne: 0.042, ville: "Turin", pays: "Italie" },
  { id: 6, reference: "MAT-006", designation: "Tole inox 304", famille: "Acier", sousFamille: "Inoxydable", fournisseur: "Metal Nord", quantite: 200, unite: "kg", poidsKg: 200, poidsTonne: 0.2, ville: "Lille", pays: "France" },
  { id: 7, reference: "MAT-007", designation: "Tube PVC rigide", famille: "Plastique", sousFamille: "PVC", fournisseur: "Polymix", quantite: 150, unite: "m", poidsKg: 75, poidsTonne: 0.075, ville: "Bruxelles", pays: "Belgique" },
  { id: 8, reference: "MAT-008", designation: "Barre laiton ronde", famille: "Cuivre", sousFamille: "Laiton", fournisseur: "Copper Line", quantite: 60, unite: "kg", poidsKg: 60, poidsTonne: 0.06, ville: "Turin", pays: "Italie" },
  { id: 9, reference: "MAT-009", designation: "Mousse PE expansion", famille: "Emballage", sousFamille: "Mousse", fournisseur: "EcoPack", quantite: 80, unite: "kg", poidsKg: 80, poidsTonne: 0.08, ville: "Nantes", pays: "France" },
  { id: 10, reference: "MAT-010", designation: "Peinture epoxy RAL", famille: "Peinture", sousFamille: "Epoxy", fournisseur: "ColorPro", quantite: 35, unite: "kg", poidsKg: 35, poidsTonne: 0.035, ville: "Stuttgart", pays: "Allemagne" },
  { id: 11, reference: "MAT-011", designation: "Vis CHC M8x30", famille: "Visserie", sousFamille: "Inox", fournisseur: "FixAll", quantite: 5000, unite: "pieces", poidsKg: 25, poidsTonne: 0.025, ville: "Milan", pays: "Italie" },
  { id: 12, reference: "MAT-012", designation: "Joints EPDM", famille: "Caoutchouc", sousFamille: "EPDM", fournisseur: "SealPlus", quantite: 300, unite: "pieces", poidsKg: 6, poidsTonne: 0.006, ville: "Barcelone", pays: "Espagne" },
  { id: 13, reference: "MAT-013", designation: "Roulement 6205", famille: "Mecanique", sousFamille: "Roulement", fournisseur: "BearTech", quantite: 100, unite: "pieces", poidsKg: 12, poidsTonne: 0.012, ville: "Goteborg", pays: "Suede" },
  { id: 14, reference: "MAT-014", designation: "Soudure MIG fil", famille: "Consommable", sousFamille: "Soudure", fournisseur: "WeldMax", quantite: 20, unite: "kg", poidsKg: 20, poidsTonne: 0.02, ville: "Cologne", pays: "Allemagne" },
  { id: 15, reference: "MAT-015", designation: "Film etirable palette", famille: "Emballage", sousFamille: "Film", fournisseur: "EcoPack", quantite: 45, unite: "kg", poidsKg: 45, poidsTonne: 0.045, ville: "Nantes", pays: "France" },
  { id: 16, reference: "MAT-016", designation: "Plaque alu 5052", famille: "Aluminium", sousFamille: "Plaque", fournisseur: "Alu Tech", quantite: 110, unite: "kg", poidsKg: 110, poidsTonne: 0.11, ville: "Lyon", pays: "France" },
  { id: 17, reference: "MAT-017", designation: "Cable souple 3G1.5", famille: "Electricite", sousFamille: "Cable", fournisseur: "ElecLine", quantite: 500, unite: "m", poidsKg: 45, poidsTonne: 0.045, ville: "Paris", pays: "France" },
  { id: 18, reference: "MAT-018", designation: "Huile hydraulique ISO", famille: "Consommable", sousFamille: "Huile", fournisseur: "LubriMax", quantite: 200, unite: "L", poidsKg: 180, poidsTonne: 0.18, ville: "Rotterdam", pays: "Pays-Bas" },
];

export const summaryCards = [
  { id: 1, label: "Tonnage total", value: "2.05 t", helper: "Somme des poids convertis", accent: "blue" },
  { id: 2, label: "Fournisseurs", value: "12", helper: "Nombre de fournisseurs uniques", accent: "green" },
  { id: 3, label: "Familles", value: "11", helper: "Nombre de familles de matieres", accent: "amber" },
  { id: 4, label: "Lignes importees", value: "18", helper: "Nombre de lignes de donnees", accent: "slate" },
];

export const chartByFamily = [
  { label: "Emballage", value: 0.665, display: "0.665 t", color: "#3b82f6" },
  { label: "Plastique", value: 0.395, display: "0.395 t", color: "#8b5cf6" },
  { label: "Acier", value: 0.320, display: "0.320 t", color: "#0ea5e9" },
  { label: "Aluminium", value: 0.195, display: "0.195 t", color: "#22c55e" },
  { label: "Consommable", value: 0.200, display: "0.200 t", color: "#f59e0b" },
  { label: "Cuivre", value: 0.102, display: "0.102 t", color: "#ef4444" },
  { label: "Autres", value: 0.173, display: "0.173 t", color: "#64748b" },
];

export const chartByCountry = [
  { label: "France", value: 1.175, display: "1.175 t", color: "#3b82f6" },
  { label: "Belgique", value: 0.395, display: "0.395 t", color: "#22c55e" },
  { label: "Italie", value: 0.127, display: "0.127 t", color: "#f59e0b" },
  { label: "Allemagne", value: 0.055, display: "0.055 t", color: "#ef4444" },
  { label: "Autres", value: 0.298, display: "0.298 t", color: "#64748b" },
];
