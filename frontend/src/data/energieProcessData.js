/* ---------------------------------------------------------
   Facteurs d'emission source : Base Carbone ADEME
   kgCO2e calcule = quantite * feKgCO2eUnite
   --------------------------------------------------------- */

const RAW = [
  /* ===== ARTHEZ ===== */
  { id:  1, site:"Arthez",     energie:"Electricite",   quantite:285000, unite:"kWh",   facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.0599, categorieEmission:"Electricite",             scope:"2"       },
  { id:  2, site:"Arthez",     energie:"Gaz naturel",   quantite:12400,  unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.202,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id:  3, site:"Arthez",     energie:"Propane",       quantite:3200,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:1.613,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id:  4, site:"Arthez",     energie:"Butane",        quantite:800,    unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:1.634,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id:  5, site:"Arthez",     energie:"Gasoil",        quantite:6800,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id:  6, site:"Arthez",     energie:"GNR",           quantite:2100,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id:  7, site:"Arthez",     energie:"Essence",       quantite:1400,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.289,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id:  8, site:"Arthez",     energie:"Oxygene",       quantite:950,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.315,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id:  9, site:"Arthez",     energie:"Argon",         quantite:420,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.440,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 10, site:"Arthez",     energie:"Acetylene",     quantite:180,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:3.800,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 11, site:"Arthez",     energie:"Azote",         quantite:640,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.560,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 12, site:"Arthez",     energie:"Ferromaxx 7",   quantite:310,    unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.412,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 13, site:"Arthez",     energie:"Mison 2",       quantite:95,     unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.445,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 14, site:"Arthez",     energie:"Corgon 18",     quantite:220,    unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.520,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 15, site:"Arthez",     energie:"Eau",           quantite:4200,   unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.344,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 16, site:"Arthez",     energie:"Climatiseur",   quantite:12,     unite:"kg",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:1630,   categorieEmission:"Fuites frigorigenes",     scope:"1"       },

  /* ===== PALPLAST ===== */
  { id: 17, site:"Palplast",   energie:"Electricite",   quantite:420000, unite:"kWh",   facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.0599, categorieEmission:"Electricite",             scope:"2"       },
  { id: 18, site:"Palplast",   energie:"Gaz naturel",   quantite:18600,  unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.202,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 19, site:"Palplast",   energie:"Fioul",         quantite:4500,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.764,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 20, site:"Palplast",   energie:"Gasoil",        quantite:9200,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 21, site:"Palplast",   energie:"GNR",           quantite:3800,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 22, site:"Palplast",   energie:"Essence",       quantite:2100,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.289,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 23, site:"Palplast",   energie:"Propane",       quantite:1800,   unite:"kg",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.942,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 24, site:"Palplast",   energie:"Oxygene",       quantite:1400,   unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.315,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 25, site:"Palplast",   energie:"Argon",         quantite:680,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.440,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 26, site:"Palplast",   energie:"Acetylene",     quantite:240,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:3.800,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 27, site:"Palplast",   energie:"Azote",         quantite:920,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.560,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 28, site:"Palplast",   energie:"Ferromaxx 7",   quantite:480,    unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.412,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 29, site:"Palplast",   energie:"Corgon 18",     quantite:350,    unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.520,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 30, site:"Palplast",   energie:"Eau",           quantite:6800,   unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.344,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 31, site:"Palplast",   energie:"Climatiseur",   quantite:18,     unite:"kg",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:1630,   categorieEmission:"Fuites frigorigenes",     scope:"1"       },

  /* ===== PONTONX ===== */
  { id: 32, site:"Pontonx",    energie:"Electricite",   quantite:195000, unite:"kWh",   facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.0599, categorieEmission:"Electricite",             scope:"2"       },
  { id: 33, site:"Pontonx",    energie:"Gaz naturel",   quantite:8700,   unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.202,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 34, site:"Pontonx",    energie:"Propane",       quantite:2400,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:1.613,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 35, site:"Pontonx",    energie:"Gasoil",        quantite:5100,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 36, site:"Pontonx",    energie:"Essence",       quantite:980,    unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.289,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 37, site:"Pontonx",    energie:"Fioul",         quantite:2200,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.764,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 38, site:"Pontonx",    energie:"Oxygene",       quantite:720,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.315,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 39, site:"Pontonx",    energie:"Argon",         quantite:290,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.440,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 40, site:"Pontonx",    energie:"Acetylene",     quantite:110,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:3.800,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 41, site:"Pontonx",    energie:"Azote",         quantite:380,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.560,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 42, site:"Pontonx",    energie:"Mison 2",       quantite:140,    unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.445,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 43, site:"Pontonx",    energie:"Ferromaxx 7",   quantite:260,    unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.412,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 44, site:"Pontonx",    energie:"Eau",           quantite:3100,   unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.344,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 45, site:"Pontonx",    energie:"GNR",           quantite:1600,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 46, site:"Pontonx",    energie:"Climatiseur",   quantite:8,      unite:"kg",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:1630,   categorieEmission:"Fuites frigorigenes",     scope:"1"       },

  /* ===== INFAUTELEC ===== */
  { id: 47, site:"Infautelec", energie:"Electricite",   quantite:340000, unite:"kWh",   facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.0599, categorieEmission:"Electricite",             scope:"2"       },
  { id: 48, site:"Infautelec", energie:"Gaz naturel",   quantite:15200,  unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.202,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 49, site:"Infautelec", energie:"Propane",       quantite:2800,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:1.613,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 50, site:"Infautelec", energie:"Butane",        quantite:1200,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:1.634,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 51, site:"Infautelec", energie:"Gasoil",        quantite:7400,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 52, site:"Infautelec", energie:"GNR",           quantite:2900,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.663,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 53, site:"Infautelec", energie:"Essence",       quantite:1650,   unite:"L",     facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:2.289,  categorieEmission:"Combustion stationnaire", scope:"1"       },
  { id: 54, site:"Infautelec", energie:"Oxygene",       quantite:1100,   unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.315,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 55, site:"Infautelec", energie:"Argon",         quantite:510,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.440,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 56, site:"Infautelec", energie:"Acetylene",     quantite:195,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:3.800,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 57, site:"Infautelec", energie:"Azote",         quantite:720,    unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.560,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 58, site:"Infautelec", energie:"Ferromaxx 7",   quantite:390,    unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.412,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 59, site:"Infautelec", energie:"Mison 2",       quantite:115,    unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.445,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 60, site:"Infautelec", energie:"Corgon 18",     quantite:280,    unite:"m3",    facteurEmission:"Fournisseur Linde",  feKgCO2eUnite:0.520,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 61, site:"Infautelec", energie:"Eau",           quantite:5400,   unite:"m3",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:0.344,  categorieEmission:"Achats de produits",      scope:"3 amont" },
  { id: 62, site:"Infautelec", energie:"Climatiseur",   quantite:15,     unite:"kg",    facteurEmission:"Base Carbone ADEME", feKgCO2eUnite:1630,   categorieEmission:"Fuites frigorigenes",     scope:"1"       },
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
  { key: "site",               label: "Site"               },
  { key: "energie",            label: "Energie / Fluide"   },
  { key: "quantite",           label: "Quantite"           },
  { key: "unite",              label: "Unite"              },
  { key: "facteurEmission",    label: "Source FE"          },
  { key: "feKgCO2eUnite",      label: "FE (kgCO2e/unite)"  },
  { key: "categorieEmission",  label: "Categorie"          },
  { key: "scope",              label: "Scope"              },
  { key: "kgCO2e",             label: "kg CO2e"            },
  { key: "pourcentage",        label: "% total"            },
];

export const SITES = ["Arthez", "Palplast", "Pontonx", "Infautelec"];
export const SCOPES = ["1", "2", "3 amont"];
export const CATEGORIES = [
  "Combustion stationnaire",
  "Electricite",
  "Achats de produits",
  "Fuites frigorigenes",
];
