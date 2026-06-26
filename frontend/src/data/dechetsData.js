export const dechetsColumns = [
  { key: "site",           label: "Site"                              },
  { key: "nomDechet",      label: "Nom du déchet"                    },
  { key: "codeDechet",     label: "Code déchet"                      },
  { key: "quantite",       label: "Quantité",          align: "right" },
  { key: "unite",          label: "Unité"                             },
  { key: "modeTraitement", label: "Mode de traitement"               },
];

export const dechetsRows = [
  { id: 1, site: "Arthez",     nomDechet: "Bois (15 01 03)",                        codeDechet: "15 01 03", quantite: 7.52,  unite: "t", modeTraitement: "Valorisation matière" },
  { id: 2, site: "Arthez",     nomDechet: "Carton, papier",                         codeDechet: null,       quantite: 5.00,  unite: "t", modeTraitement: "Valorisation matière" },
  { id: 3, site: "Arthez",     nomDechet: "Ferraille",                              codeDechet: null,       quantite: 73.4,  unite: "t", modeTraitement: "Recyclage"            },
  { id: 4, site: "Arthez",     nomDechet: "Emballages vides souillées (15 01 10*)", codeDechet: "15 01 10*",quantite: 0.335, unite: "t", modeTraitement: "R1"                   },
  { id: 5, site: "Arthez",     nomDechet: "Absorbants et matériaux souillés (15 02 02*)", codeDechet: "15 02 02*", quantite: 0.172, unite: "t", modeTraitement: "R1"            },
  { id: 6, site: "Arthez",     nomDechet: "Pile en mélange (20 01 33*)",            codeDechet: "20 01 33*",quantite: 0.015, unite: "t", modeTraitement: "R4"                   },
  { id: 7, site: "Arthez",     nomDechet: "Huiles & lubrifiants usagés (13 05 07*)",codeDechet: "13 05 07*",quantite: 2.239, unite: "t", modeTraitement: "D10"                  },
  { id: 8, site: "Palplast",   nomDechet: "Déchets plastiques production",          codeDechet: null,       quantite: 12.5,  unite: "t", modeTraitement: "Recyclage"            },
  { id: 9, site: "Palplast",   nomDechet: "Chutes bois atelier",                   codeDechet: null,       quantite: 4.2,   unite: "t", modeTraitement: "Valorisation matière" },
  { id: 10,site: "Pontonx",    nomDechet: "Ferraille chantier",                    codeDechet: null,       quantite: 18.0,  unite: "t", modeTraitement: "Recyclage"            },
  { id: 11,site: "Infautelec", nomDechet: "DEEE (câbles, cartes)",                 codeDechet: null,       quantite: 0.85,  unite: "t", modeTraitement: "R4"                   },
  { id: 12,site: "Infautelec", nomDechet: "Solvants usagés",                       codeDechet: null,       quantite: 0.6,   unite: "t", modeTraitement: "D10"                  },
];

export const dechetsStats = [
  { id: 1, label: "Flux déchets",   value: "12",       helper: "Lignes déclarées",              accent: "blue"  },
  { id: 2, label: "Masse totale",   value: "124.9 t",  helper: "Tonnage tous déchets confondus", accent: "amber" },
  { id: 3, label: "Taux recyclage", value: "75%",      helper: "Valorisation + recyclage",       accent: "green" },
  { id: 4, label: "Sites couverts", value: "4",        helper: "Sites du groupe",                accent: "slate" },
];

export const chartByMode = [
  { label: "Recyclage",            value: 103.9, display: "103.9 t", color: "#22c55e" },
  { label: "Valorisation matière", value: 16.72, display: "16.7 t",  color: "#3b82f6" },
  { label: "R1 – Valorisation",    value: 0.507, display: "0.5 t",   color: "#f59e0b" },
  { label: "R4 – Recyclage",       value: 0.865, display: "0.9 t",   color: "#8b5cf6" },
  { label: "D10 – Incinération",   value: 2.839, display: "2.8 t",   color: "#ef4444" },
];

export const chartBySite = [
  { label: "Arthez",     value: 88.68, display: "88.7 t",  color: "#059669" },
  { label: "Palplast",   value: 16.70, display: "16.7 t",  color: "#3b82f6" },
  { label: "Pontonx",    value: 18.00, display: "18.0 t",  color: "#f59e0b" },
  { label: "Infautelec", value: 1.45,  display: "1.5 t",   color: "#8b5cf6" },
];
