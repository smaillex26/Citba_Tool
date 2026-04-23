export const sousTraitanceColumns = [
  { key: "societe",        label: "Société de sous-traitance" },
  { key: "typePrestation", label: "Type de prestation"        },
  { key: "montantEuro",    label: "Montant facture (EUR)", align: "right" },
];

export const sousTraitanceRows = [
  { id: 1, societe: "Mecaprecis", typePrestation: "Usinage de précision", montantEuro: 42000 },
  { id: 2, societe: "Thermo Services", typePrestation: "Traitement thermique", montantEuro: 18500 },
  { id: 3, societe: "Peintures du Nord", typePrestation: "Peinture industrielle", montantEuro: 27300 },
  { id: 4, societe: "TransLog Express", typePrestation: "Transport et logistique", montantEuro: 63000 },
  { id: 5, societe: "Elec Pro", typePrestation: "Câblage électrique", montantEuro: 31500 },
  { id: 6, societe: "Mecaprecis", typePrestation: "Tournage CNC", montantEuro: 38000 },
  { id: 7, societe: "Clean Indus", typePrestation: "Nettoyage industriel", montantEuro: 9800 },
  { id: 8, societe: "Soudure Plus", typePrestation: "Soudure TIG/MIG", montantEuro: 22400 },
  { id: 9, societe: "Control Qualite SAS", typePrestation: "Contrôle non destructif", montantEuro: 14200 },
  { id: 10, societe: "TransLog Express", typePrestation: "Livraison dernier km", montantEuro: 19800 },
  { id: 11, societe: "Galva Nord", typePrestation: "Galvanisation", montantEuro: 16700 },
  { id: 12, societe: "IT Solutions", typePrestation: "Maintenance informatique", montantEuro: 28000 },
  { id: 13, societe: "Peintures du Nord", typePrestation: "Traitement de surface", montantEuro: 21500 },
  { id: 14, societe: "Secu Expert", typePrestation: "Audit sécurité", montantEuro: 8500 },
  { id: 15, societe: "Emboutissage Pro", typePrestation: "Emboutissage tôle", montantEuro: 35600 },
  { id: 16, societe: "Clean Indus", typePrestation: "Dégraissage pièces", montantEuro: 11200 },
  { id: 17, societe: "Elec Pro", typePrestation: "Installation electrique", montantEuro: 45000 },
  { id: 18, societe: "Control Qualite SAS", typePrestation: "Métrologie", montantEuro: 12300 },
];

export const sousTraitanceStats = [
  { id: 1, label: "Prestations", value: "18", helper: "Nombre de lignes facturées", accent: "blue" },
  { id: 2, label: "Montant total", value: "465 300 EUR", helper: "Total facture sous-traitants", accent: "green" },
  { id: 3, label: "Sous-traitants", value: "10", helper: "Sociétés distinctes", accent: "amber" },
  { id: 4, label: "Montant moyen", value: "25 850 EUR", helper: "Par prestation", accent: "slate" },
];

export const chartBySociete = [
  { label: "TransLog Express", value: 82800, display: "82 800 EUR", color: "#3b82f6" },
  { label: "Mecaprecis", value: 80000, display: "80 000 EUR", color: "#8b5cf6" },
  { label: "Elec Pro", value: 76500, display: "76 500 EUR", color: "#0ea5e9" },
  { label: "Peintures du Nord", value: 48800, display: "48 800 EUR", color: "#22c55e" },
  { label: "Emboutissage Pro", value: 35600, display: "35 600 EUR", color: "#f59e0b" },
  { label: "Autres", value: 141600, display: "141 600 EUR", color: "#64748b" },
];

export const chartByPrestation = [
  { label: "Usinage / Tournage", value: 80000, display: "80 000 EUR", color: "#3b82f6" },
  { label: "Transport / Logistique", value: 82800, display: "82 800 EUR", color: "#22c55e" },
  { label: "Peinture / Surface", value: 48800, display: "48 800 EUR", color: "#f59e0b" },
  { label: "Électricité", value: 76500, display: "76 500 EUR", color: "#ef4444" },
  { label: "Contrôle / qualité", value: 26500, display: "26 500 EUR", color: "#8b5cf6" },
  { label: "Autres", value: 150700, display: "150 700 EUR", color: "#64748b" },
];
