export const deplacementsProColumns = [
  { key: "site",              label: "Site"                              },
  { key: "moyenDeplacement",  label: "Moyen de déplacement"             },
  { key: "infoComplementaire",label: "Info complémentaire"              },
  { key: "kmParAn",           label: "Km réalisés / an", align: "right" },
  { key: "fraisRestauration", label: "Frais restauration (€)", align: "right" },
  { key: "fraisHebergement",  label: "Frais hébergement (€)", align: "right"  },
  { key: "consomCarburant",   label: "Conso. carburant (L)", align: "right"   },
];

export const deplacementsProRows = [
  { id: 1,  site: "Arthez",     moyenDeplacement: "Voiture",  infoComplementaire: "Voiture électrique",    kmParAn: 8500,  fraisRestauration: 1200, fraisHebergement: 2400, consomCarburant: null },
  { id: 2,  site: "Arthez",     moyenDeplacement: "Voiture",  infoComplementaire: "Thermique diesel",       kmParAn: 12000, fraisRestauration: 1800, fraisHebergement: 3600, consomCarburant: 1080 },
  { id: 3,  site: "Palplast",   moyenDeplacement: "Fourgon",  infoComplementaire: "Thermique",              kmParAn: 15000, fraisRestauration: 900,  fraisHebergement: 0,    consomCarburant: 1875 },
  { id: 4,  site: "Palplast",   moyenDeplacement: "Train",    infoComplementaire: "TGV grandes lignes",     kmParAn: 22000, fraisRestauration: 2100, fraisHebergement: 4200, consomCarburant: null },
  { id: 5,  site: "Pontonx",    moyenDeplacement: "Avion",    infoComplementaire: null,                     kmParAn: 18000, fraisRestauration: 2800, fraisHebergement: 5600, consomCarburant: null },
  { id: 6,  site: "Pontonx",    moyenDeplacement: "Voiture",  infoComplementaire: "Thermique essence",      kmParAn: 9000,  fraisRestauration: 600,  fraisHebergement: 1200, consomCarburant: 720  },
  { id: 7,  site: "Infautelec", moyenDeplacement: "Voiture",  infoComplementaire: "Hybride rechargeable",   kmParAn: 11000, fraisRestauration: 1500, fraisHebergement: 3000, consomCarburant: 440  },
  { id: 8,  site: "Infautelec", moyenDeplacement: "Train",    infoComplementaire: "Intercités",             kmParAn: 6000,  fraisRestauration: 800,  fraisHebergement: 1600, consomCarburant: null },
];

export const deplacementsProStats = [
  { id: 1, label: "Déplacements",    value: "8",          helper: "Lignes déclarées",           accent: "blue"  },
  { id: 2, label: "Total km / an",   value: "101 500 km", helper: "Distance cumulée tous modes", accent: "amber" },
  { id: 3, label: "Frais totaux",    value: "34 900 EUR", helper: "Restauration + hébergement",  accent: "green" },
  { id: 4, label: "Sites couverts",  value: "4",          helper: "Sites du groupe",             accent: "slate" },
];

export const chartByMoyen = [
  { label: "Voiture",  value: 40500,  display: "40 500 km", color: "#ef4444" },
  { label: "Fourgon",  value: 15000,  display: "15 000 km", color: "#f97316" },
  { label: "Train",    value: 28000,  display: "28 000 km", color: "#3b82f6" },
  { label: "Avion",    value: 18000,  display: "18 000 km", color: "#8b5cf6" },
];

export const chartBySite = [
  { label: "Arthez",     value: 20500, display: "20 500 km", color: "#059669" },
  { label: "Palplast",   value: 37000, display: "37 000 km", color: "#3b82f6" },
  { label: "Pontonx",    value: 27000, display: "27 000 km", color: "#f59e0b" },
  { label: "Infautelec", value: 17000, display: "17 000 km", color: "#8b5cf6" },
];
