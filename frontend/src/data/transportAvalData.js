export const transportAvalColumns = [
  { key: "site",           label: "Site"                               },
  { key: "nomTransporteur",label: "Transporteur"                      },
  { key: "typeTransport",  label: "Type"                               },
  { key: "quantite",       label: "Quantité",           align: "right" },
  { key: "unite",          label: "Unité"                              },
  { key: "lieuDepart",     label: "Lieu de départ"                    },
  { key: "lieuArrivee",    label: "Lieu d'arrivée"                    },
  { key: "distanceKm",     label: "Distance (km)",      align: "right" },
  { key: "moyenTransport", label: "Moyen de transport"                 },
];

export const transportAvalRows = [
  { id: 1,  site: "Arthez",     nomTransporteur: "Geodis",        typeTransport: "Aval",      quantite: 12.5,  unite: "t",  lieuDepart: "Arthez",     lieuArrivee: "Bordeaux",    distanceKm: 180,  moyenTransport: "Camion" },
  { id: 2,  site: "Arthez",     nomTransporteur: "Chronopost",    typeTransport: "Aval",      quantite: 0.8,   unite: "t",  lieuDepart: "Arthez",     lieuArrivee: "Paris",       distanceKm: 750,  moyenTransport: "Camion" },
  { id: 3,  site: "Arthez",     nomTransporteur: "DB Schenker",   typeTransport: "Intersite", quantite: 5.2,   unite: "t",  lieuDepart: "Arthez",     lieuArrivee: "Pontonx",     distanceKm: 90,   moyenTransport: "Camion" },
  { id: 4,  site: "Palplast",   nomTransporteur: "Geodis",        typeTransport: "Aval",      quantite: 28.0,  unite: "t",  lieuDepart: "Palplast",   lieuArrivee: "Lyon",        distanceKm: 600,  moyenTransport: "Camion" },
  { id: 5,  site: "Palplast",   nomTransporteur: "TNT",           typeTransport: "Aval",      quantite: 2.1,   unite: "t",  lieuDepart: "Palplast",   lieuArrivee: "Strasbourg",  distanceKm: 850,  moyenTransport: "Camion" },
  { id: 6,  site: "Palplast",   nomTransporteur: "DB Schenker",   typeTransport: "Intersite", quantite: 8.4,   unite: "t",  lieuDepart: "Palplast",   lieuArrivee: "Arthez",      distanceKm: 120,  moyenTransport: "Camion" },
  { id: 7,  site: "Pontonx",    nomTransporteur: "XPO Logistics", typeTransport: "Aval",      quantite: 15.0,  unite: "t",  lieuDepart: "Pontonx",    lieuArrivee: "Toulouse",    distanceKm: 120,  moyenTransport: "Camion" },
  { id: 8,  site: "Pontonx",    nomTransporteur: "Geodis",        typeTransport: "Aval",      quantite: 6.3,   unite: "t",  lieuDepart: "Pontonx",    lieuArrivee: "Marseille",   distanceKm: 500,  moyenTransport: "Camion" },
  { id: 9,  site: "Infautelec", nomTransporteur: "DHL",           typeTransport: "Aval",      quantite: 0.4,   unite: "t",  lieuDepart: "Infautelec", lieuArrivee: "Francfort",   distanceKm: 1200, moyenTransport: "Avion"  },
  { id: 10, site: "Infautelec", nomTransporteur: "Geodis",        typeTransport: "Intersite", quantite: 3.0,   unite: "t",  lieuDepart: "Infautelec", lieuArrivee: "Palplast",    distanceKm: 200,  moyenTransport: "Camion" },
];

export const transportAvalStats = [
  { id: 1, label: "Flux transport",  value: "10",       helper: "Lignes de transport déclarées",  accent: "blue"  },
  { id: 2, label: "Tonnage total",   value: "81.7 t",   helper: "Masse transportée cumulée",       accent: "amber" },
  { id: 3, label: "Distance moy.",   value: "461 km",   helper: "Distance moyenne par flux",        accent: "green" },
  { id: 4, label: "Transporteurs",   value: "6",        helper: "Prestataires transport distincts", accent: "slate" },
];

export const chartByType = [
  { label: "Aval",      value: 7, display: "7 flux",  color: "#3b82f6" },
  { label: "Intersite", value: 3, display: "3 flux",  color: "#f59e0b" },
];

export const chartByMoyen = [
  { label: "Camion", value: 9, display: "9 flux",  color: "#64748b" },
  { label: "Avion",  value: 1, display: "1 flux",  color: "#8b5cf6" },
];
