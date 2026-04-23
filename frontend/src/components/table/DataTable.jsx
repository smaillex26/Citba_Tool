import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

function DataTable({ columns, rows }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
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

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      if (typeof va === "number" && typeof vb === "number")
        return sortAsc ? va - vb : vb - va;
      return sortAsc
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [filtered, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  function handleSort(key) {
    if (sortKey === key) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(0);
  }

  const arrow = (key) => {
    if (sortKey !== key) return "";
    return sortAsc ? " \u25B2" : " \u25BC";
  };

  return (
    <div className="table-card">
      <div className="table-card__toolbar">
        <input
          type="text"
          className="table-card__search"
          placeholder="Rechercher..."
          value={search}
          onChange={handleSearch}
        />
        <p className="table-card__count">
          {sorted.length} ligne{sorted.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    "data-table__sortable",
                    col.align === "right" ? "col-right" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {arrow(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  Aucun résultat
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td
                      key={`${row.id}-${col.key}`}
                      className={col.align === "right" ? "col-right" : undefined}
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-card__pagination">
          <button
            disabled={safePage === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </button>
          <span>
            Page {safePage + 1} / {totalPages}
          </span>
          <button
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
