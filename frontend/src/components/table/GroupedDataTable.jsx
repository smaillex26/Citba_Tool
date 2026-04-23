import { Fragment, useMemo, useState } from "react";

/**
 * Tableau groupé avec sous-totaux par groupe et grand total final.
 *
 * Props :
 *  - columns   : mêmes définitions que DataTable (+ prop optionnelle `format`)
 *  - rows      : données brutes avec valeurs numériques pour sumKey
 *  - groupKey  : clé de regroupement (ex: "site")
 *  - sumKey    : clé numérique à sommer (ex: "kgCO2e")
 *  - pctKey    : clé % calculée par le composant (ex: "pourcentage")
 *
 * Comportement du % :
 *  - Chaque ligne   : pctKey = (row[sumKey] / total_du_groupe) × 100
 *  - Ligne sous-total : % du groupe sur le grand total
 *  - Ligne grand total : 100,00 %
 */
function GroupedDataTable({ columns, rows, groupKey, sumKey, pctKey }) {
  const [search, setSearch] = useState("");

  /* ---- Filtrage recherche ---- */
  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) =>
        String(row[col.key] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rows, columns, search]);

  /* ---- Grand total ---- */
  const grandTotal = useMemo(
    () => filteredRows.reduce((s, r) => s + (r[sumKey] ?? 0), 0),
    [filteredRows, sumKey],
  );

  /* ---- Groupes (ordre d'apparition conservé) ---- */
  const groups = useMemo(() => {
    const map = new Map();
    filteredRows.forEach((r) => {
      const key = r[groupKey] ?? "—";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    });
    return map;
  }, [filteredRows, groupKey]);

  /* ---- Helpers ---- */
  function fmtSum(v) {
    return (v ?? 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  }

  function cellValue(col, row, groupTotal) {
    if (col.key === sumKey) return fmtSum(row[col.key]);
    if (col.key === pctKey) {
      const pct = groupTotal > 0 ? ((row[sumKey] ?? 0) / groupTotal) * 100 : 0;
      return `${pct.toFixed(2)} %`;
    }
    if (col.format) return col.format(row[col.key]);
    return row[col.key] ?? "";
  }

  return (
    <div className="table-card">
      <div className="table-card__toolbar">
        <input
          type="text"
          className="table-card__search"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="table-card__count">
          {filteredRows.length} ligne{filteredRows.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.align === "right" ? "col-right" : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[...groups.entries()].map(([groupName, groupRows]) => {
              const groupTotal = groupRows.reduce(
                (s, r) => s + (r[sumKey] ?? 0),
                0,
              );
              const groupPct =
                grandTotal > 0 ? (groupTotal / grandTotal) * 100 : 0;

              return (
                <Fragment key={groupName}>
                  {/* Lignes de données du groupe */}
                  {groupRows.map((row) => (
                    <tr key={row.id}>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={
                            col.align === "right" ? "col-right" : undefined
                          }
                        >
                          {cellValue(col, row, groupTotal)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Ligne sous-total du groupe */}
                  <tr className="data-table__subtotal">
                    {columns.map((col, i) => {
                      let value = "";
                      if (i === 0) value = `Sous-total — ${groupName}`;
                      if (col.key === sumKey) value = fmtSum(groupTotal);
                      if (col.key === pctKey)
                        value = `${groupPct.toFixed(2)} %`;
                      return (
                        <td
                          key={col.key}
                          className={
                            col.align === "right" ? "col-right" : undefined
                          }
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}

            {/* Ligne grand total */}
            <tr className="data-table__grand-total">
              {columns.map((col, i) => {
                let value = "";
                if (i === 0) value = "TOTAL GÉNÉRAL";
                if (col.key === sumKey) value = fmtSum(grandTotal);
                if (col.key === pctKey) value = "100,00 %";
                return (
                  <td
                    key={col.key}
                    className={
                      col.align === "right" ? "col-right" : undefined
                    }
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GroupedDataTable;
