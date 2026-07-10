import { formatTCO2e } from "../../utils/planActionData.js";

function TopPosteCard({ title, percent, tCO2e, flux = [], accent = "blue" }) {
  return (
    <article className={`plan-top-card plan-top-card--${accent}`}>
      <header className="plan-top-card__header">
        <h3>{title}</h3>
        <span className="plan-top-card__percent">{percent} %</span>
      </header>
      <p className="plan-top-card__value">{formatTCO2e(tCO2e)}</p>
      <div className="plan-top-card__flux">
        <p>Flux</p>
        <ul>
          {flux.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default TopPosteCard;
