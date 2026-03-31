function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) {
  const base =
    variant === "secondary"
      ? "button button--secondary"
      : variant === "ghost"
        ? "button button--ghost"
        : "button button--primary";

  return (
    <button
      type={type}
      className={`${base} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
