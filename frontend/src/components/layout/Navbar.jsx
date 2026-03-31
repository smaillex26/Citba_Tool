import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const mainLinks = [
  { to: "/", label: "Accueil", end: true },
  { to: "/import", label: "Import" },
];

const dataPages = [
  { to: "/donnees/collecte", label: "Collecte matieres" },
  { to: "/donnees/deplacements-dt", label: "Deplacements domicile-travail" },
  { to: "/donnees/actifs-leasing", label: "Actifs en leasing" },
  { to: "/donnees/sous-traitance", label: "Sous-traitance" },
  { to: "/donnees/energie-process", label: "Energie et Process" },
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
          <div className="site-header__logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8c.7-1 1-2.2 1-3.5C18 2.5 16.6 1 15 1c-1.3 0-2.4.8-2.8 2C11.8 1.3 10.3.5 8.7.8 7 1.1 5.8 2.6 6 4.3c.1 1 .6 1.9 1.2 2.7" />
              <path d="M12 22V10" />
              <path d="M7 14c-2 0-3.5-1-4.5-2.5 2-1 4-1 5.5.5" />
              <path d="M17 14c2 0 3.5-1 4.5-2.5-2-1-4-1-5.5.5" />
              <path d="M9 18c-1.5 1-3 1.5-5 1.5 1.5-1.5 2.5-3.5 3-5.5" />
              <path d="M15 18c1.5 1 3 1.5 5 1.5-1.5-1.5-2.5-3.5-3-5.5" />
            </svg>
          </div>
          <div>
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
              Donnees <span className="site-nav__caret">{open ? "\u25B2" : "\u25BC"}</span>
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
