export const achatsBiensColumns = [
  { key: "site",                 label: "Site"                         },
  { key: "matiereConsommable",   label: "Matière première / Consommable" },
  { key: "facteurEmission",      label: "Facteur d'émission"           },
  { key: "famille",              label: "Famille"                      },
  { key: "distanceFournisseur",  label: "Distance fournisseur (km)", align: "right" },
  { key: "moyenTransport",       label: "Moyen de transport"           },
  { key: "quantite",             label: "Quantité",          align: "right" },
  { key: "unite",                label: "Unité"                        },
  { key: "montantEuro",          label: "Montant (€)",       align: "right" },
];

export const achatsBiensRows = [
  { id: 1,  site: "Arthez",     matiereConsommable: "Acier S235",         facteurEmission: "Métaux – Acier ou fer blanc",    famille: "Métaux",    distanceFournisseur: 120, moyenTransport: "Camion",   quantite: 45.0,  unite: "t",  montantEuro: 28000 },
  { id: 2,  site: "Arthez",     matiereConsommable: "Profilé aluminium",  facteurEmission: "Métaux – Aluminium",             famille: "Métaux",    distanceFournisseur: 250, moyenTransport: "Camion",   quantite: 12.5,  unite: "t",  montantEuro: 42000 },
  { id: 3,  site: "Arthez",     matiereConsommable: "Câble électrique",   facteurEmission: "Électronique – câbles",          famille: "Électrique", distanceFournisseur: 80,  moyenTransport: "Camion",   quantite: 2.1,   unite: "t",  montantEuro: 9500  },
  { id: 4,  site: "Palplast",   matiereConsommable: "Granulés PVC",       facteurEmission: "Plastique – PVC",                famille: "Plastiques", distanceFournisseur: 350, moyenTransport: "Camion",   quantite: 80.0,  unite: "t",  montantEuro: 64000 },
  { id: 5,  site: "Palplast",   matiereConsommable: "Granulés PEHD",      facteurEmission: "Plastique – PEHD",               famille: "Plastiques", distanceFournisseur: 320, moyenTransport: "Camion",   quantite: 35.0,  unite: "t",  montantEuro: 27000 },
  { id: 6,  site: "Palplast",   matiereConsommable: "Colorants pigments", facteurEmission: "Chimie – colorants",             famille: "Chimique",  distanceFournisseur: 180, moyenTransport: "Camion",   quantite: 1.8,   unite: "t",  montantEuro: 5400  },
  { id: 7,  site: "Pontonx",    matiereConsommable: "Bois massif douglas",facteurEmission: "Bois et articles en bois",       famille: "Bois",      distanceFournisseur: 60,  moyenTransport: "Camion",   quantite: 120.0, unite: "m3", montantEuro: 36000 },
  { id: 8,  site: "Pontonx",    matiereConsommable: "Contreplaqué",       facteurEmission: "Bois et articles en bois",       famille: "Bois",      distanceFournisseur: 90,  moyenTransport: "Camion",   quantite: 40.0,  unite: "m3", montantEuro: 18000 },
  { id: 9,  site: "Infautelec", matiereConsommable: "Carte électronique", facteurEmission: "Électronique – PCB",             famille: "Électrique", distanceFournisseur: 500, moyenTransport: "Avion",    quantite: 0.5,   unite: "t",  montantEuro: 85000 },
  { id: 10, site: "Infautelec", matiereConsommable: "Cuivre nu",          facteurEmission: "Métaux – Cuivre",                famille: "Métaux",    distanceFournisseur: 400, moyenTransport: "Camion",   quantite: 3.2,   unite: "t",  montantEuro: 22000 },
];

export const achatsBiensStats = [
  { id: 1, label: "Achats",         value: "10",          helper: "Lignes d'achats",          accent: "blue"  },
  { id: 2, label: "Montant total",  value: "337 000 EUR", helper: "Total des achats de biens", accent: "green" },
  { id: 3, label: "Sites couverts", value: "4",           helper: "Sites du groupe",           accent: "amber" },
  { id: 4, label: "Familles",       value: "5",           helper: "Catégories de matières",    accent: "slate" },
];

export const chartByFamille = [
  { label: "Métaux",     value: 77000,  display: "77 000 EUR", color: "#3b82f6" },
  { label: "Plastiques", value: 91000,  display: "91 000 EUR", color: "#f59e0b" },
  { label: "Bois",       value: 54000,  display: "54 000 EUR", color: "#22c55e" },
  { label: "Électrique", value: 94500,  display: "94 500 EUR", color: "#8b5cf6" },
  { label: "Chimique",   value: 5400,   display: "5 400 EUR",  color: "#64748b" },
];

export const chartBySite = [
  { label: "Arthez",     value: 79500,  display: "79 500 EUR", color: "#059669" },
  { label: "Palplast",   value: 96400,  display: "96 400 EUR", color: "#3b82f6" },
  { label: "Pontonx",    value: 54000,  display: "54 000 EUR", color: "#f59e0b" },
  { label: "Infautelec", value: 107000, display: "107 000 EUR",color: "#8b5cf6" },
];
