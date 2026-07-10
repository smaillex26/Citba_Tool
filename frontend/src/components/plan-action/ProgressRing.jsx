function ProgressRing({ value, label, size = 160 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.abs(value), 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="plan-progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="plan-progress-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="12"
        />
        <circle
          className="plan-progress-ring__fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="plan-progress-ring__content">
        <strong>{value > 0 ? `+${value}` : value} %</strong>
        {label && <span>{label}</span>}
      </div>
    </div>
  );
}

export default ProgressRing;
