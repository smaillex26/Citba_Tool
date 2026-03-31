const ACCENTS = {
  blue: "#3b82f6",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
  slate: "#64748b",
};

function SummaryCard({ label, value, helper, accent = "blue" }) {
  const color = ACCENTS[accent] || ACCENTS.blue;

  return (
    <article className="summary-card" style={{ borderTopColor: color }}>
      <p className="summary-card__label">{label}</p>
      <strong className="summary-card__value" style={{ color }}>
        {value}
      </strong>
      {helper && <p className="summary-card__helper">{helper}</p>}
    </article>
  );
}

export default SummaryCard;
