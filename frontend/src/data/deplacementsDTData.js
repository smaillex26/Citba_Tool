export const deplacementsDTColumns = [
  { key: "site",                 label: "Site"                                   },
  { key: "moyenDeplacement",     label: "Moyen de déplacement"                  },
  { key: "distanceDomTravail",   label: "Distance dom.-travail (km)", align: "right" },
  { key: "nbAllerRetour",        label: "Trajets / jour",             align: "right" },
  { key: "nbJoursTravailles",    label: "Jours travaillés / an",      align: "right" },
  { key: "secondMoyenType",      label: "Second moyen"                           },
  { key: "proportionSecondMoyen",label: "Proportion 2e moyen",        align: "right" },
  { key: "teletravail",          label: "Télétravail"                            },
];

export const deplacementsDTRows = [
  { id: 1,  site: "Arthez",     moyenDeplacement: "Voiture Diesel",    distanceDomTravail: 40.5, nbAllerRetour: 2, nbJoursTravailles: 217, secondMoyenType: "Moto",      proportionSecondMoyen: "10%", teletravail: null       },
  { id: 2,  site: "Arthez",     moyenDeplacement: "Voiture électrique",distanceDomTravail: 15.0, nbAllerRetour: 2, nbJoursTravailles: 218, secondMoyenType: null,        proportionSecondMoyen: null,  teletravail: null       },
  { id: 3,  site: "Arthez",     moyenDeplacement: "Vélo",              distanceDomTravail: 6.0,  nbAllerRetour: 2, nbJoursTravailles: 210, secondMoyenType: "Bus",       proportionSecondMoyen: "30%", teletravail: "1 j/sem"  },
  { id: 4,  site: "Palplast",   moyenDeplacement: "Voiture Diesel",    distanceDomTravail: 28.0, nbAllerRetour: 2, nbJoursTravailles: 218, secondMoyenType: null,        proportionSecondMoyen: null,  teletravail: null       },
  { id: 5,  site: "Palplast",   moyenDeplacement: "Covoiturage",       distanceDomTravail: 32.0, nbAllerRetour: 2, nbJoursTravailles: 218, secondMoyenType: null,        proportionSecondMoyen: null,  teletravail: null       },
  { id: 6,  site: "Palplast",   moyenDeplacement: "Transports en commun",distanceDomTravail: 12.0,nbAllerRetour: 2,nbJoursTravailles: 218, secondMoyenType: null,        proportionSecondMoyen: null,  teletravail: "2 j/sem"  },
  { id: 7,  site: "Pontonx",    moyenDeplacement: "Voiture essence",   distanceDomTravail: 18.0, nbAllerRetour: 2, nbJoursTravailles: 218, secondMoyenType: null,        proportionSecondMoyen: null,  teletravail: null       },
  { id: 8,  site: "Pontonx",    moyenDeplacement: "Vélo",              distanceDomTravail: 4.5,  nbAllerRetour: 2, nbJoursTravailles: 218, secondMoyenType: null,        proportionSecondMoyen: null,  teletravail: null       },
  { id: 9,  site: "Infautelec", moyenDeplacement: "Voiture hybride",   distanceDomTravail: 22.0, nbAllerRetour: 2, nbJoursTravailles: 218, secondMoyenType: "Moto",      proportionSecondMoyen: "20%", teletravail: null       },
  { id: 10, site: "Infautelec", moyenDeplacement: "Voiture Diesel",    distanceDomTravail: 50.0, nbAllerRetour: 2, nbJoursTravailles: 225, secondMoyenType: null,        proportionSecondMoyen: null,  teletravail: null       },
  { id: 11, site: "Infautelec", moyenDeplacement: "À pied",            distanceDomTravail: 2.0,  nbAllerRetour: 2, nbJoursTravailles: 210, secondMoyenType: null,        proportionSecondMoyen: null,  teletravail: "3 j/sem"  },
];

export const deplacementsDTStats = [
  { id: 1, label: "Effectif",        value: "11",      helper: "Nombre de personnes déclarées",    accent: "blue"  },
  { id: 2, label: "Distance moy.",   value: "21.0 km", helper: "Domicile-travail (moyenne)",        accent: "amber" },
  { id: 3, label: "Télétravail",     value: "27%",     helper: "Personnes avec télétravail",        accent: "green" },
  { id: 4, label: "Second moyen",    value: "27%",     helper: "Personnes avec 2ème moyen",         accent: "slate" },
];

export const chartByMoyen = [
  { label: "Voiture thermique",     value: 4, display: "4 pers.", color: "#ef4444" },
  { label: "Voiture élec./hybride", value: 2, display: "2 pers.", color: "#22c55e" },
  { label: "Vélo",                  value: 2, display: "2 pers.", color: "#10b981" },
  { label: "Transports en commun",  value: 1, display: "1 pers.", color: "#3b82f6" },
  { label: "Covoiturage / autre",   value: 2, display: "2 pers.", color: "#f59e0b" },
];

export const chartByDistance = [
  { label: "< 5 km",     value: 2, display: "2 pers.", color: "#22c55e" },
  { label: "5 – 20 km",  value: 4, display: "4 pers.", color: "#3b82f6" },
  { label: "20 – 35 km", value: 3, display: "3 pers.", color: "#f59e0b" },
  { label: "> 35 km",    value: 2, display: "2 pers.", color: "#ef4444" },
];
