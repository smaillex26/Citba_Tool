export const sousTraitanceColumns = [
  { key: "site",           label: "Site"                              },
  { key: "societe",        label: "Société de sous-traitance"        },
  { key: "typePrestation", label: "Type de prestation réalisée"      },
  { key: "facteurEmission",label: "Facteur d'émission"               },
  { key: "montantEuro",    label: "Montant facturé (€)", align: "right" },
];

export const sousTraitanceRows = [
  { id: 1,  site: "Arthez",     societe: "Mecaprecis",           typePrestation: "Usinage de précision",    facteurEmission: "Machines et équipements",                  montantEuro: 42000 },
  { id: 2,  site: "Arthez",     societe: "Thermo Services",      typePrestation: "Traitement thermique",    facteurEmission: "Machines et équipements",                  montantEuro: 18500 },
  { id: 3,  site: "Arthez",     societe: "Peintures du Nord",    typePrestation: "Peinture industrielle",   facteurEmission: "Construction",                             montantEuro: 27300 },
  { id: 4,  site: "Palplast",   societe: "TransLog Express",     typePrestation: "Transport et logistique", facteurEmission: "Entreposage et services auxiliaires des transports", montantEuro: 63000 },
  { id: 5,  site: "Palplast",   societe: "Elec Pro",             typePrestation: "Câblage électrique",      facteurEmission: "Machines et équipements",                  montantEuro: 31500 },
  { id: 6,  site: "Palplast",   societe: "Mecaprecis",           typePrestation: "Tournage CNC",            facteurEmission: "Machines et équipements",                  montantEuro: 38000 },
  { id: 7,  site: "Pontonx",    societe: "Clean Indus",          typePrestation: "Nettoyage industriel",    facteurEmission: "Activités de nettoyage",                   montantEuro: 9800  },
  { id: 8,  site: "Pontonx",    societe: "Soudure Plus",         typePrestation: "Soudure TIG/MIG",         facteurEmission: "Métaux (aluminium, cuivre, acier, etc.)",  montantEuro: 22400 },
  { id: 9,  site: "Pontonx",    societe: "Control Qualite SAS",  typePrestation: "Contrôle non destructif", facteurEmission: "Activités pour la santé humaine",          montantEuro: 14200 },
  { id: 10, site: "Infautelec", societe: "TransLog Express",     typePrestation: "Livraison dernier km",    facteurEmission: "Entreposage et services auxiliaires des transports", montantEuro: 19800 },
  { id: 11, site: "Infautelec", societe: "Galva Nord",           typePrestation: "Galvanisation",           facteurEmission: "Métaux (aluminium, cuivre, acier, etc.)",  montantEuro: 16700 },
  { id: 12, site: "Infautelec", societe: "IT Solutions",         typePrestation: "Maintenance informatique",facteurEmission: "Assurance, services bancaires, conseil et honoraires", montantEuro: 28000 },
];

export const sousTraitanceStats = [
  { id: 1, label: "Prestations",    value: "12",          helper: "Lignes facturées",          accent: "blue"  },
  { id: 2, label: "Montant total",  value: "331 200 EUR", helper: "Total sous-traitants",       accent: "green" },
  { id: 3, label: "Sous-traitants", value: "10",          helper: "Sociétés distinctes",        accent: "amber" },
  { id: 4, label: "Sites couverts", value: "4",           helper: "Sites du groupe",            accent: "slate" },
];

export const chartBySociete = [
  { label: "TransLog Express",  value: 82800, display: "82 800 EUR", color: "#3b82f6" },
  { label: "Mecaprecis",        value: 80000, display: "80 000 EUR", color: "#8b5cf6" },
  { label: "Elec Pro",          value: 31500, display: "31 500 EUR", color: "#0ea5e9" },
  { label: "Peintures du Nord", value: 27300, display: "27 300 EUR", color: "#22c55e" },
  { label: "Autres",            value: 129600,display: "129 600 EUR",color: "#64748b" },
];

export const chartByPrestation = [
  { label: "Usinage / Tournage",     value: 80000, display: "80 000 EUR", color: "#3b82f6" },
  { label: "Transport / Logistique", value: 82800, display: "82 800 EUR", color: "#22c55e" },
  { label: "Peinture / Surface",     value: 27300, display: "27 300 EUR", color: "#f59e0b" },
  { label: "Câblage électrique",     value: 31500, display: "31 500 EUR", color: "#ef4444" },
  { label: "Contrôle / Qualité",     value: 14200, display: "14 200 EUR", color: "#8b5cf6" },
  { label: "Autres",                 value: 95400, display: "95 400 EUR", color: "#64748b" },
];
