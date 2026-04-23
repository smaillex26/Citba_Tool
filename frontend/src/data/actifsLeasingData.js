export const actifsLeasingColumns = [
  { key: "materiel",    label: "Matériel / équipement"  },
  { key: "montantEuro", label: "Montant (EUR)",  align: "right" },
  { key: "dureeLLD",    label: "Durée LLD (mois)", align: "right" },
];

export const actifsLeasingRows = [
  { id: 1, materiel: "Chariot élévateur électrique", montantEuro: 18500, dureeLLD: 48 },
  { id: 2, materiel: "Véhicule utilitaire Renault Master", montantEuro: 32000, dureeLLD: 36 },
  { id: 3, materiel: "Imprimante multifonction A3", montantEuro: 4200, dureeLLD: 60 },
  { id: 4, materiel: "Serveur informatique rack", montantEuro: 12800, dureeLLD: 48 },
  { id: 5, materiel: "Compresseur d'air industriel", montantEuro: 9500, dureeLLD: 60 },
  { id: 6, materiel: "Véhicule berline Peugeot 308", montantEuro: 28000, dureeLLD: 36 },
  { id: 7, materiel: "Photocopieur couleur", montantEuro: 3600, dureeLLD: 48 },
  { id: 8, materiel: "Pont élévateur atelier", montantEuro: 7200, dureeLLD: 60 },
  { id: 9, materiel: "Ordinateurs portables (lot 20)", montantEuro: 22000, dureeLLD: 36 },
  { id: 10, materiel: "Machine CNC fraiseuse", montantEuro: 85000, dureeLLD: 60 },
  { id: 11, materiel: "Véhicule utilitaire Citroën Berlingo", montantEuro: 24500, dureeLLD: 36 },
  { id: 12, materiel: "Climatisation industrielle", montantEuro: 15000, dureeLLD: 48 },
  { id: 13, materiel: "Transpalette electrique", montantEuro: 6800, dureeLLD: 48 },
  { id: 14, materiel: "Écrans moniteurs (lot 15)", montantEuro: 7500, dureeLLD: 36 },
  { id: 15, materiel: "Groupe électrogène", montantEuro: 11000, dureeLLD: 60 },
];

export const actifsLeasingStats = [
  { id: 1, label: "Actifs en leasing", value: "15", helper: "Nombre de contrats actifs", accent: "blue" },
  { id: 2, label: "Montant total", value: "287 600 EUR", helper: "Somme des montants LLD", accent: "green" },
  { id: 3, label: "Durée moyenne", value: "46.4 mois", helper: "Durée moyenne des contrats", accent: "amber" },
];

export const chartByDuree = [
  { label: "36 mois", value: 5, display: "5 actifs", color: "#3b82f6" },
  { label: "48 mois", value: 5, display: "5 actifs", color: "#f59e0b" },
  { label: "60 mois", value: 5, display: "5 actifs", color: "#22c55e" },
];

export const chartByMontant = [
  { label: "< 5 000 EUR", value: 2, display: "2 actifs", color: "#22c55e" },
  { label: "5 000 - 10 000 EUR", value: 3, display: "3 actifs", color: "#3b82f6" },
  { label: "10 000 - 25 000 EUR", value: 5, display: "5 actifs", color: "#f59e0b" },
  { label: "25 000 - 50 000 EUR", value: 3, display: "3 actifs", color: "#ef4444" },
  { label: "> 50 000 EUR", value: 2, display: "2 actifs", color: "#7c3aed" },
];
