import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const mainLinks = [
  { to: "/", label: "Accueil", end: true },
  { to: "/import", label: "Import" },
];

const dataPages = [
  { to: "/donnees/collecte", label: "Collecte matières" },
  { to: "/donnees/deplacements-dt", label: "Déplacements domicile-travail" },
  { to: "/donnees/actifs-leasing", label: "Actifs en leasing" },
  { to: "/donnees/sous-traitance", label: "Sous-traitance" },
  { to: "/donnees/energie-process", label: "Énergie et Process" },
  { to: "/donnees/achats-biens", label: "Achats de biens" },
  { to: "/donnees/achats-services", label: "Achats de services" },
  { to: "/donnees/biens-immobilises", label: "Biens immobilisés" },
  { to: "/donnees/deplacements-pro", label: "Déplacements professionnels" },
  { to: "/donnees/dechets", label: "Déchets" },
  { to: "/donnees/transport-aval", label: "Transport aval & Fin de vie" },
];

const endLinks = [
  { to: "/dashboard", label: "Tableau de bord" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-header__brand">
          <img src="/logo-citba.png" alt="CITBA" className="site-header__logo-img" />
          <div className="site-header__brand-text">
            <p className="site-header__eyebrow">Outil interne</p>
            <h1 className="site-header__title">Empreinte Carbone</h1>
          </div>
        </NavLink>

        <nav className="site-nav" aria-label="Navigation principale">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? "site-nav__link site-nav__link--active" : "site-nav__link"
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="site-nav__dropdown" ref={dropdownRef}>
            <button
              className={`site-nav__link site-nav__dropdown-trigger ${open ? "site-nav__link--active" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              Données <span className="site-nav__caret">{open ? "\u25B2" : "\u25BC"}</span>
            </button>

            {open && (
              <div className="site-nav__dropdown-menu">
                {dataPages.map((page) => (
                  <NavLink
                    key={page.to}
                    to={page.to}
                    className={({ isActive }) =>
                      isActive
                        ? "site-nav__dropdown-item site-nav__dropdown-item--active"
                        : "site-nav__dropdown-item"
                    }
                    onClick={() => setOpen(false)}
                  >
                    {page.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {endLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "site-nav__link site-nav__link--active" : "site-nav__link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
