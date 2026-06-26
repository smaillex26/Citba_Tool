export const achatsServicesColumns = [
  { key: "site",           label: "Site"                              },
  { key: "societe",        label: "Société prestataire"              },
  { key: "typePrestation", label: "Type de prestation réalisée"      },
  { key: "facteurEmission",label: "Facteur d'émission"               },
  { key: "montantEuro",    label: "Montant facturé (€)", align: "right" },
];

export const achatsServicesRows = [
  { id: 1,  site: "Arthez",     societe: "Cabinet Audit",         typePrestation: "Audit et conseil",             facteurEmission: "Assurance, services bancaires, conseil et honoraires",    montantEuro: 18000 },
  { id: 2,  site: "Arthez",     societe: "Nettoyage Pro",         typePrestation: "Nettoyage locaux",             facteurEmission: "Activités de nettoyage",                                    montantEuro: 9600  },
  { id: 3,  site: "Arthez",     societe: "Formation Industrie",   typePrestation: "Formation sécurité",           facteurEmission: "Enseignement",                                              montantEuro: 4200  },
  { id: 4,  site: "Palplast",   societe: "Sécurité Alarme",       typePrestation: "Surveillance et sécurité",    facteurEmission: "Administration publiques et défense, sécurité sociale obligatoire", montantEuro: 12000 },
  { id: 5,  site: "Palplast",   societe: "Web Agency",            typePrestation: "Développement web",           facteurEmission: "Activités créatives, artistiques, culturelles, bibliothèques, et organisation de jeux de hasard et d'argent", montantEuro: 8500  },
  { id: 6,  site: "Palplast",   societe: "Cabinet Comptable",     typePrestation: "Comptabilité",                facteurEmission: "Assurance, services bancaires, conseil et honoraires",    montantEuro: 15000 },
  { id: 7,  site: "Pontonx",    societe: "Traiteur Pro",          typePrestation: "Restauration d'entreprise",   facteurEmission: "Hébergement et restauration",                               montantEuro: 7200  },
  { id: 8,  site: "Pontonx",    societe: "Cabinet RH",            typePrestation: "Recrutement",                 facteurEmission: "Assurance, services bancaires, conseil et honoraires",    montantEuro: 11000 },
  { id: 9,  site: "Infautelec", societe: "IT Cloud Solutions",    typePrestation: "Hébergement cloud",           facteurEmission: "Assurance, services bancaires, conseil et honoraires",    montantEuro: 22000 },
  { id: 10, site: "Infautelec", societe: "Bureau d'études",       typePrestation: "Études techniques",           facteurEmission: "Assurance, services bancaires, conseil et honoraires",    montantEuro: 35000 },
];

export const achatsServicesStats = [
  { id: 1, label: "Prestations",    value: "10",          helper: "Lignes d'achats de services",      accent: "blue"  },
  { id: 2, label: "Montant total",  value: "142 500 EUR", helper: "Total facturé services externes",   accent: "green" },
  { id: 3, label: "Prestataires",   value: "10",          helper: "Sociétés prestataires distinctes",  accent: "amber" },
  { id: 4, label: "Sites couverts", value: "4",           helper: "Sites du groupe",                   accent: "slate" },
];

export const chartByPrestation = [
  { label: "Conseil / Audit",   value: 53000, display: "53 000 EUR", color: "#3b82f6" },
  { label: "Informatique",      value: 57000, display: "57 000 EUR", color: "#8b5cf6" },
  { label: "Formation / RH",    value: 15200, display: "15 200 EUR", color: "#22c55e" },
  { label: "Sécurité / Nettoy.",value: 21600, display: "21 600 EUR", color: "#f59e0b" },
  { label: "Restauration",      value: 7200,  display: "7 200 EUR",  color: "#64748b" },
];

export const chartBySite = [
  { label: "Arthez",     value: 31800, display: "31 800 EUR", color: "#059669" },
  { label: "Palplast",   value: 35500, display: "35 500 EUR", color: "#3b82f6" },
  { label: "Pontonx",    value: 18200, display: "18 200 EUR", color: "#f59e0b" },
  { label: "Infautelec", value: 57000, display: "57 000 EUR", color: "#8b5cf6" },
];
