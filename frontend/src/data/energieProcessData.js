/* ---------------------------------------------------------
   Facteurs d'émission source : Base Carbone ADEME / Fournisseurs
   kgCO2e calculé = quantité * feKgCO2eUnite
   --------------------------------------------------------- */

const RAW = [
  /* ===== ARTHEZ ===== */
  { id:  1, site:"Arthez",     energie:"Électricité",   quantite:285000, unite:"kWh", facteurEmission:"Énergie - Électricité réseau",      feKgCO2eUnite:0.0599, categorieEmission:"Électricité achetée",        scope:"2",       commentaire:"" },
  { id:  2, site:"Arthez",     energie:"Gaz naturel",   quantite:12400,  unite:"m3",  facteurEmission:"Énergie - Gaz naturel",              feKgCO2eUnite:2.202,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id:  3, site:"Arthez",     energie:"Propane",       quantite:3200,   unite:"L",   facteurEmission:"Énergie - Propane",                  feKgCO2eUnite:1.613,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id:  4, site:"Arthez",     energie:"Butane",        quantite:800,    unite:"L",   facteurEmission:"Énergie - Butane",                   feKgCO2eUnite:1.634,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id:  5, site:"Arthez",     energie:"Gasoil",        quantite:6800,   unite:"L",   facteurEmission:"Énergie - Gasoil",                   feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id:  6, site:"Arthez",     energie:"GNR",           quantite:2100,   unite:"L",   facteurEmission:"Énergie - GNR",                      feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id:  7, site:"Arthez",     energie:"Essence",       quantite:1400,   unite:"L",   facteurEmission:"Énergie - Essence",                  feKgCO2eUnite:2.289,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id:  8, site:"Arthez",     energie:"Oxygène",       quantite:950,    unite:"m3",  facteurEmission:"Gaz industriel - Oxygène",           feKgCO2eUnite:0.315,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id:  9, site:"Arthez",     energie:"Argon",         quantite:420,    unite:"m3",  facteurEmission:"Gaz industriel - Argon",             feKgCO2eUnite:0.440,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 10, site:"Arthez",     energie:"Acétylène",     quantite:180,    unite:"m3",  facteurEmission:"Gaz industriel - Acétylène",         feKgCO2eUnite:3.800,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 11, site:"Arthez",     energie:"Azote",         quantite:640,    unite:"m3",  facteurEmission:"Gaz industriel - Azote",             feKgCO2eUnite:0.560,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 12, site:"Arthez",     energie:"Ferromaxx 7",   quantite:310,    unite:"m3",  facteurEmission:"Gaz de mélange - Ferromaxx 7",       feKgCO2eUnite:0.412,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 13, site:"Arthez",     energie:"Mison 2",       quantite:95,     unite:"m3",  facteurEmission:"Gaz de mélange - Mison 2",           feKgCO2eUnite:0.445,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 14, site:"Arthez",     energie:"Corgon 18",     quantite:220,    unite:"m3",  facteurEmission:"Gaz de mélange - Corgon 18",         feKgCO2eUnite:0.520,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 15, site:"Arthez",     energie:"Eau",           quantite:4200,   unite:"m3",  facteurEmission:"Énergie - Eau de réseau",            feKgCO2eUnite:0.13,   categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 16, site:"Arthez",     energie:"Climatiseur",   quantite:12,     unite:"kg",  facteurEmission:"Frigorigène - R410A",                feKgCO2eUnite:1630,   categorieEmission:"Fuites frigorigènes",         scope:"1",       commentaire:"" },

  /* ===== PALPLAST ===== */
  { id: 17, site:"Palplast",   energie:"Électricité",   quantite:420000, unite:"kWh", facteurEmission:"Énergie - Électricité réseau",      feKgCO2eUnite:0.0599, categorieEmission:"Électricité achetée",        scope:"2",       commentaire:"" },
  { id: 18, site:"Palplast",   energie:"Gaz naturel",   quantite:18600,  unite:"m3",  facteurEmission:"Énergie - Gaz naturel",              feKgCO2eUnite:2.202,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 19, site:"Palplast",   energie:"Fioul",         quantite:4500,   unite:"L",   facteurEmission:"Énergie - Fioul domestique",         feKgCO2eUnite:2.764,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 20, site:"Palplast",   energie:"Gasoil",        quantite:9200,   unite:"L",   facteurEmission:"Énergie - Gasoil",                   feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 21, site:"Palplast",   energie:"GNR",           quantite:3800,   unite:"L",   facteurEmission:"Énergie - GNR",                      feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 22, site:"Palplast",   energie:"Essence",       quantite:2100,   unite:"L",   facteurEmission:"Énergie - Essence",                  feKgCO2eUnite:2.289,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 23, site:"Palplast",   energie:"Propane",       quantite:1800,   unite:"kg",  facteurEmission:"Énergie - Propane",                  feKgCO2eUnite:2.942,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 24, site:"Palplast",   energie:"Oxygène",       quantite:1400,   unite:"m3",  facteurEmission:"Gaz industriel - Oxygène",           feKgCO2eUnite:0.315,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 25, site:"Palplast",   energie:"Argon",         quantite:680,    unite:"m3",  facteurEmission:"Gaz industriel - Argon",             feKgCO2eUnite:0.440,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 26, site:"Palplast",   energie:"Acétylène",     quantite:240,    unite:"m3",  facteurEmission:"Gaz industriel - Acétylène",         feKgCO2eUnite:3.800,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 27, site:"Palplast",   energie:"Azote",         quantite:920,    unite:"m3",  facteurEmission:"Gaz industriel - Azote",             feKgCO2eUnite:0.560,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 28, site:"Palplast",   energie:"Ferromaxx 7",   quantite:480,    unite:"m3",  facteurEmission:"Gaz de mélange - Ferromaxx 7",       feKgCO2eUnite:0.412,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 29, site:"Palplast",   energie:"Corgon 18",     quantite:350,    unite:"m3",  facteurEmission:"Gaz de mélange - Corgon 18",         feKgCO2eUnite:0.520,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 30, site:"Palplast",   energie:"Eau",           quantite:6800,   unite:"m3",  facteurEmission:"Énergie - Eau de réseau",            feKgCO2eUnite:0.13,   categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 31, site:"Palplast",   energie:"Climatiseur",   quantite:18,     unite:"kg",  facteurEmission:"Frigorigène - R410A",                feKgCO2eUnite:1630,   categorieEmission:"Fuites frigorigènes",         scope:"1",       commentaire:"" },

  /* ===== PONTONX ===== */
  { id: 32, site:"Pontonx",    energie:"Électricité",   quantite:195000, unite:"kWh", facteurEmission:"Énergie - Électricité réseau",      feKgCO2eUnite:0.0599, categorieEmission:"Électricité achetée",        scope:"2",       commentaire:"" },
  { id: 33, site:"Pontonx",    energie:"Gaz naturel",   quantite:8700,   unite:"m3",  facteurEmission:"Énergie - Gaz naturel",              feKgCO2eUnite:2.202,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 34, site:"Pontonx",    energie:"Propane",       quantite:2400,   unite:"L",   facteurEmission:"Énergie - Propane",                  feKgCO2eUnite:1.613,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 35, site:"Pontonx",    energie:"Gasoil",        quantite:5100,   unite:"L",   facteurEmission:"Énergie - Gasoil",                   feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 36, site:"Pontonx",    energie:"Essence",       quantite:980,    unite:"L",   facteurEmission:"Énergie - Essence",                  feKgCO2eUnite:2.289,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 37, site:"Pontonx",    energie:"Fioul",         quantite:2200,   unite:"L",   facteurEmission:"Énergie - Fioul domestique",         feKgCO2eUnite:2.764,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 38, site:"Pontonx",    energie:"Oxygène",       quantite:720,    unite:"m3",  facteurEmission:"Gaz industriel - Oxygène",           feKgCO2eUnite:0.315,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 39, site:"Pontonx",    energie:"Argon",         quantite:290,    unite:"m3",  facteurEmission:"Gaz industriel - Argon",             feKgCO2eUnite:0.440,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 40, site:"Pontonx",    energie:"Acétylène",     quantite:110,    unite:"m3",  facteurEmission:"Gaz industriel - Acétylène",         feKgCO2eUnite:3.800,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 41, site:"Pontonx",    energie:"Azote",         quantite:380,    unite:"m3",  facteurEmission:"Gaz industriel - Azote",             feKgCO2eUnite:0.560,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 42, site:"Pontonx",    energie:"Mison 2",       quantite:140,    unite:"m3",  facteurEmission:"Gaz de mélange - Mison 2",           feKgCO2eUnite:0.445,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 43, site:"Pontonx",    energie:"Ferromaxx 7",   quantite:260,    unite:"m3",  facteurEmission:"Gaz de mélange - Ferromaxx 7",       feKgCO2eUnite:0.412,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 44, site:"Pontonx",    energie:"Eau",           quantite:3100,   unite:"m3",  facteurEmission:"Énergie - Eau de réseau",            feKgCO2eUnite:0.13,   categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 45, site:"Pontonx",    energie:"GNR",           quantite:1600,   unite:"L",   facteurEmission:"Énergie - GNR",                      feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 46, site:"Pontonx",    energie:"Climatiseur",   quantite:8,      unite:"kg",  facteurEmission:"Frigorigène - R410A",                feKgCO2eUnite:1630,   categorieEmission:"Fuites frigorigènes",         scope:"1",       commentaire:"" },

  /* ===== INFAUTELEC ===== */
  { id: 47, site:"Infautelec", energie:"Électricité",   quantite:340000, unite:"kWh", facteurEmission:"Énergie - Électricité réseau",      feKgCO2eUnite:0.0599, categorieEmission:"Électricité achetée",        scope:"2",       commentaire:"" },
  { id: 48, site:"Infautelec", energie:"Gaz naturel",   quantite:15200,  unite:"m3",  facteurEmission:"Énergie - Gaz naturel",              feKgCO2eUnite:2.202,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 49, site:"Infautelec", energie:"Propane",       quantite:2800,   unite:"L",   facteurEmission:"Énergie - Propane",                  feKgCO2eUnite:1.613,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 50, site:"Infautelec", energie:"Butane",        quantite:1200,   unite:"L",   facteurEmission:"Énergie - Butane",                   feKgCO2eUnite:1.634,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 51, site:"Infautelec", energie:"Gasoil",        quantite:7400,   unite:"L",   facteurEmission:"Énergie - Gasoil",                   feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 52, site:"Infautelec", energie:"GNR",           quantite:2900,   unite:"L",   facteurEmission:"Énergie - GNR",                      feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 53, site:"Infautelec", energie:"Essence",       quantite:1650,   unite:"L",   facteurEmission:"Énergie - Essence",                  feKgCO2eUnite:2.289,  categorieEmission:"Combustion stationnaire",    scope:"1",       commentaire:"" },
  { id: 54, site:"Infautelec", energie:"Oxygène",       quantite:1100,   unite:"m3",  facteurEmission:"Gaz industriel - Oxygène",           feKgCO2eUnite:0.315,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 55, site:"Infautelec", energie:"Argon",         quantite:510,    unite:"m3",  facteurEmission:"Gaz industriel - Argon",             feKgCO2eUnite:0.440,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 56, site:"Infautelec", energie:"Acétylène",     quantite:195,    unite:"m3",  facteurEmission:"Gaz industriel - Acétylène",         feKgCO2eUnite:3.800,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 57, site:"Infautelec", energie:"Azote",         quantite:720,    unite:"m3",  facteurEmission:"Gaz industriel - Azote",             feKgCO2eUnite:0.560,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 58, site:"Infautelec", energie:"Ferromaxx 7",   quantite:390,    unite:"m3",  facteurEmission:"Gaz de mélange - Ferromaxx 7",       feKgCO2eUnite:0.412,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 59, site:"Infautelec", energie:"Mison 2",       quantite:115,    unite:"m3",  facteurEmission:"Gaz de mélange - Mison 2",           feKgCO2eUnite:0.445,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 60, site:"Infautelec", energie:"Corgon 18",     quantite:280,    unite:"m3",  facteurEmission:"Gaz de mélange - Corgon 18",         feKgCO2eUnite:0.520,  categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"Fournisseur Linde" },
  { id: 61, site:"Infautelec", energie:"Eau",           quantite:5400,   unite:"m3",  facteurEmission:"Énergie - Eau de réseau",            feKgCO2eUnite:0.13,   categorieEmission:"Produits et services achetés", scope:"3 amont", commentaire:"" },
  { id: 62, site:"Infautelec", energie:"Climatiseur",   quantite:15,     unite:"kg",  facteurEmission:"Frigorigène - R410A",                feKgCO2eUnite:1630,   categorieEmission:"Fuites frigorigènes",         scope:"1",       commentaire:"" },
];

/* Calcul kgCO2e et pourcentage */
const totalKgCO2e = RAW.reduce((s, r) => s + r.quantite * r.feKgCO2eUnite, 0);

export const energieProcessRows = RAW.map((r) => {
  const kgCO2e = r.quantite * r.feKgCO2eUnite;
  return {
    ...r,
    kgCO2e: Math.round(kgCO2e * 100) / 100,
    pourcentage: Math.round((kgCO2e / totalKgCO2e) * 10000) / 100,
  };
});

export const energieProcessColumns = [
  { key: "site",               label: "Site"                    },
  { key: "energie",            label: "Énergie"                 },
  { key: "quantite",           label: "Quantité"                },
  { key: "unite",              label: "Unité"                   },
  { key: "facteurEmission",    label: "Facteurs d'émissions"    },
  { key: "feKgCO2eUnite",      label: "FE kg CO2e"              },
  { key: "categorieEmission",  label: "Catégorie d'émission"    },
  { key: "scope",              label: "Scope"                   },
  { key: "commentaire",        label: "Commentaire"             },
  { key: "kgCO2e",             label: "kg CO2e"                 },
  { key: "pourcentage",        label: "%"                       },
];

export const SITES = ["Arthez", "Palplast", "Pontonx", "Infautelec"];
export const SCOPES = ["1", "2", "3 amont"];
export const CATEGORIES = [
  "Combustion stationnaire",
  "Électricité achetée",
  "Produits et services achetés",
  "Fuites frigorigènes",
];
