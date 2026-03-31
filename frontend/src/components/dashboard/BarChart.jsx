function BarChart({ title, items = [] }) {
  const maxVal = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="bar-chart">
      {title && <h3 className="bar-chart__title">{title}</h3>}
      <div className="bar-chart__list">
        {items.map((item) => (
          <div key={item.label} className="bar-chart__row">
            <span className="bar-chart__label">{item.label}</span>
            <div className="bar-chart__track">
              <div
                className="bar-chart__fill"
                style={{
                  width: `${(item.value / maxVal) * 100}%`,
                  backgroundColor: item.color || "#3b82f6",
                }}
              />
            </div>
            <span className="bar-chart__value">{item.display ?? item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarChart;
