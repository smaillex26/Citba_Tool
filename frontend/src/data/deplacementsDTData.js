export const deplacementsDTColumns = [
  { key: "codePersonne",     label: "Code personne"          },
  { key: "vehiculePro",      label: "Véhicule professionnel" },
  { key: "adresseDomicile",  label: "Adresse domicile"       },
  { key: "site",             label: "Site"                   },
  { key: "distanceKm",       label: "Distance (km)",    align: "right" },
  { key: "trajetsJour",      label: "Trajets / jour",   align: "right" },
  { key: "moyenDeplacement", label: "Moyen de déplacement"  },
  { key: "joursAn",          label: "Jours travaillés / an", align: "right" },
  { key: "secondMoyen",      label: "Second moyen"           },
  { key: "secondProportion", label: "Proportion 2e moyen",   align: "right" },
  { key: "teletravail",      label: "Télétravail"            },
];

export const deplacementsDTRows = [
  { id: 1, codePersonne: "P001", vehiculePro: "Non", adresseDomicile: "12 rue des Lilas, 59000 Lille", site: "Arthez", distanceKm: 15, trajetsJour: 2, moyenDeplacement: "Voiture thermique", joursAn: 218, secondMoyen: "Non", secondProportion: "-", teletravail: "Non" },
  { id: 2, codePersonne: "P002", vehiculePro: "Non", adresseDomicile: "8 av. Foch, 59100 Roubaix", site: "Pontonx", distanceKm: 22, trajetsJour: 2, moyenDeplacement: "Voiture électrique", joursAn: 218, secondMoyen: "Non", secondProportion: "-", teletravail: "1 jour/semaine" },
  { id: 3, codePersonne: "P003", vehiculePro: "Oui", adresseDomicile: "45 bd Vauban, 59800 Lille", site: "Infautelec", distanceKm: 5, trajetsJour: 2, moyenDeplacement: "Vélo", joursAn: 210, secondMoyen: "Oui - Bus", secondProportion: "30%", teletravail: "2 jours/semaine" },
  { id: 4, codePersonne: "P004", vehiculePro: "Non", adresseDomicile: "3 rue Pasteur, 59300 Valenciennes", site: "Usine Nord", distanceKm: 48, trajetsJour: 2, moyenDeplacement: "Voiture thermique", joursAn: 218, secondMoyen: "Oui - Covoiturage", secondProportion: "40%", teletravail: "Non" },
  { id: 5, codePersonne: "P005", vehiculePro: "Non", adresseDomicile: "27 rue de la Gare, 59200 Tourcoing", site: "Bureau Central", distanceKm: 12, trajetsJour: 2, moyenDeplacement: "Tramway", joursAn: 218, secondMoyen: "Non", secondProportion: "-", teletravail: "1 jour/semaine" },
  { id: 6, codePersonne: "P006", vehiculePro: "Non", adresseDomicile: "9 place Rihour, 59000 Lille", site: "Bureau Central", distanceKm: 3, trajetsJour: 2, moyenDeplacement: "À pied", joursAn: 218, secondMoyen: "Non", secondProportion: "-", teletravail: "Non" },
  { id: 7, codePersonne: "P007", vehiculePro: "Oui", adresseDomicile: "18 rue du Maréchal, 62000 Arras", site: "Usine Nord", distanceKm: 55, trajetsJour: 2, moyenDeplacement: "Voiture thermique", joursAn: 225, secondMoyen: "Non", secondProportion: "-", teletravail: "Non" },
  { id: 8, codePersonne: "P008", vehiculePro: "Non", adresseDomicile: "6 rue des Arts, 59000 Lille", site: "Bureau Central", distanceKm: 4, trajetsJour: 2, moyenDeplacement: "Vélo électrique", joursAn: 210, secondMoyen: "Oui - Métro", secondProportion: "20%", teletravail: "2 jours/semaine" },
  { id: 9, codePersonne: "P009", vehiculePro: "Non", adresseDomicile: "31 rue Nationale, 59100 Roubaix", site: "Usine Nord", distanceKm: 20, trajetsJour: 2, moyenDeplacement: "Voiture hybride", joursAn: 218, secondMoyen: "Non", secondProportion: "-", teletravail: "Non" },
  { id: 10, codePersonne: "P010", vehiculePro: "Non", adresseDomicile: "14 rue de Béthune, 59000 Lille", site: "Bureau Central", distanceKm: 2, trajetsJour: 2, moyenDeplacement: "À pied", joursAn: 218, secondMoyen: "Oui - Trottinette", secondProportion: "50%", teletravail: "3 jours/semaine" },
  { id: 11, codePersonne: "P011", vehiculePro: "Non", adresseDomicile: "22 av. de la République, 59650 Villeneuve", site: "Usine Nord", distanceKm: 18, trajetsJour: 2, moyenDeplacement: "Bus", joursAn: 218, secondMoyen: "Non", secondProportion: "-", teletravail: "Non" },
  { id: 12, codePersonne: "P012", vehiculePro: "Oui", adresseDomicile: "7 rue Colbert, 59500 Douai", site: "Usine Nord", distanceKm: 35, trajetsJour: 2, moyenDeplacement: "Voiture thermique", joursAn: 225, secondMoyen: "Non", secondProportion: "-", teletravail: "Non" },
  { id: 13, codePersonne: "P013", vehiculePro: "Non", adresseDomicile: "11 rue Solferino, 59000 Lille", site: "Bureau Central", distanceKm: 6, trajetsJour: 2, moyenDeplacement: "Métro", joursAn: 210, secondMoyen: "Oui - Vélo", secondProportion: "25%", teletravail: "1 jour/semaine" },
  { id: 14, codePersonne: "P014", vehiculePro: "Non", adresseDomicile: "40 rue Jean Jaurès, 59170 Croix", site: "Usine Nord", distanceKm: 14, trajetsJour: 2, moyenDeplacement: "Voiture thermique", joursAn: 218, secondMoyen: "Non", secondProportion: "-", teletravail: "Non" },
  { id: 15, codePersonne: "P015", vehiculePro: "Non", adresseDomicile: "5 rue de Paris, 59800 Lille", site: "Bureau Central", distanceKm: 8, trajetsJour: 2, moyenDeplacement: "Vélo", joursAn: 218, secondMoyen: "Oui - Bus", secondProportion: "40%", teletravail: "Non" },
];

export const deplacementsDTStats = [
  { id: 1, label: "Effectif", value: "15", helper: "Nombre de personnes", accent: "blue" },
  { id: 2, label: "Distance moyenne", value: "17.8 km", helper: "Moyenne domicile-travail", accent: "amber" },
  { id: 3, label: "Télétravail", value: "40%", helper: "Personnes avec télétravail", accent: "green" },
  { id: 4, label: "Second moyen", value: "40%", helper: "Personnes avec 2e moyen", accent: "slate" },
];

export const chartByMoyen = [
  { label: "Voiture thermique", value: 5, display: "5", color: "#ef4444" },
  { label: "Vélo / vélo élec.", value: 3, display: "3", color: "#22c55e" },
  { label: "À pied", value: 2, display: "2", color: "#10b981" },
  { label: "Transports en commun", value: 3, display: "3", color: "#3b82f6" },
  { label: "Voiture élec. / hybride", value: 2, display: "2", color: "#f59e0b" },
];

export const chartByDistance = [
  { label: "< 5 km", value: 3, display: "3 pers.", color: "#22c55e" },
  { label: "5 - 15 km", value: 5, display: "5 pers.", color: "#3b82f6" },
  { label: "15 - 30 km", value: 4, display: "4 pers.", color: "#f59e0b" },
  { label: "30 - 50 km", value: 2, display: "2 pers.", color: "#ef4444" },
  { label: "> 50 km", value: 1, display: "1 pers.", color: "#7c3aed" },
];
