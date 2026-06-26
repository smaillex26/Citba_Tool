import { useMemo, useState } from "react";

function EmissionsBySiteChart({ title, series = [], groups = [], unit = "kg CO2e" }) {
  const [selectedSite, setSelectedSite] = useState(groups[0]?.label ?? "");

  const selectedGroup = useMemo(
    () => groups.find((group) => group.label === selectedSite) ?? groups[0],
    [groups, selectedSite],
  );

  const items = useMemo(
    () =>
      series.map((serie, index) => ({
        ...serie,
        value: selectedGroup?.values[index] ?? 0,
      })),
    [series, selectedGroup],
  );

  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="emissions-site-chart">
      <div className="emissions-site-chart__header">
        <div>
          {title && <h3 className="emissions-site-chart__title">{title}</h3>}
          <p className="emissions-site-chart__subtitle">
            Site sélectionné : <strong>{selectedGroup?.label}</strong> · Total {fmtCO2(total)}
          </p>
        </div>

        <select
          className="filter-select emissions-site-chart__select"
          value={selectedGroup?.label ?? ""}
          onChange={(e) => setSelectedSite(e.target.value)}
        >
          {groups.map((group) => (
            <option key={group.label} value={group.label}>
              {group.label}
            </option>
          ))}
        </select>
      </div>

      <div className="emissions-site-chart__plot">
        {items.map((item) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div key={item.label} className="emissions-site-chart__bar-col">
              <span className="emissions-site-chart__value">{fmtCO2(item.value)}</span>
              <div className="emissions-site-chart__bar-track">
                <div
                  className="emissions-site-chart__bar"
                  style={{
                    height: `${height}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.label} — ${selectedGroup?.label}: ${fmtCO2(item.value)}`}
                />
              </div>
              <span className="emissions-site-chart__label">{item.label}</span>
            </div>
          );
        })}
      </div>

      <p className="emissions-site-chart__unit">Unité : {unit}</p>
    </section>
  );
}

function fmtCO2(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} Mt CO2e`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)} t CO2e`;
  return `${v.toFixed(0)} kg CO2e`;
}

export default EmissionsBySiteChart;
