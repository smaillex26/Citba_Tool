export const biensImmobilisesColumns = [
  { key: "site",              label: "Nom du site"                       },
  { key: "surfaceTerre",      label: "Surface convertie", align: "right" },
  { key: "unite",             label: "Unité"                             },
  { key: "dureeAmortissement",label: "Durée d'amortissement",align: "right" },
];

export const biensImmobilisesRows = [
  { id: 1, site: "Arthez",     surfaceTerre: 0, unite: "ha", dureeAmortissement: 40 },
  { id: 2, site: "Palplast",   surfaceTerre: 0, unite: "ha", dureeAmortissement: 40 },
  { id: 3, site: "Pontonx",    surfaceTerre: 0, unite: "ha", dureeAmortissement: 40 },
  { id: 4, site: "Infautelec", surfaceTerre: 0, unite: "ha", dureeAmortissement: 40 },
];

export const biensImmobilisesStats = [
  { id: 1, label: "Sites déclarés",     value: "4",    helper: "Sites du groupe CITBA",      accent: "blue"  },
  { id: 2, label: "Surface convertie",  value: "0 ha", helper: "Changement affectation sols", accent: "green" },
  { id: 3, label: "Durée amort. moy.",  value: "40 ans",helper: "Durée d'amortissement",     accent: "amber" },
];
