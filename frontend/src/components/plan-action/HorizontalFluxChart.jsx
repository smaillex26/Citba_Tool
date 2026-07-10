import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function HorizontalFluxChart({ title, items = [] }) {
  if (!items.length) return null;

  const chartData = [...items].reverse();

  return (
    <section className="plan-card plan-flux-chart">
      <h3 className="plan-card__title">{title}</h3>
      <div className="plan-flux-chart__body">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.35)" />
            <XAxis type="number" tickFormatter={(v) => `${v.toLocaleString("fr-FR")} t`} />
            <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} tCO₂e`, "Émissions"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--green-200)",
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={22}>
              {chartData.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default HorizontalFluxChart;
