import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function EmissionsPieChart({ title, data = [] }) {
  if (!data.length) return null;

  return (
    <section className="plan-card plan-pie-chart">
      <h3 className="plan-card__title">{title}</h3>
      <div className="plan-pie-chart__body">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={118}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} %`, name]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--green-200)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: "0.85rem", paddingTop: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default EmissionsPieChart;
