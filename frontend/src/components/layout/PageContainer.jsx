function PageContainer({ title, description, actions, children }) {
  return (
    <section className="page-section">
      <div className="page-section__header">
        <div>
          <h2>{title}</h2>
          {description ? <p className="page-section__description">{description}</p> : null}
        </div>
        {actions ? <div className="page-section__actions">{actions}</div> : null}
      </div>

      <div className="page-section__content">{children}</div>
    </section>
  );
}

export default PageContainer;
