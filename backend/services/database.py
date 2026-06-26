import os
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
from typing import Iterator

from sqlalchemy import (
    Boolean,
    JSON,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
    delete,
    func,
    inspect as sqlalchemy_inspect,
    select,
    text,
    update,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker

from services.calculator import attach_calculation_metadata, source_values_snapshot

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

DEFAULT_DATABASE_URL = f"sqlite:///{(DATA_DIR / 'citba.db').as_posix()}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    future=True,
)


class Base(DeclarativeBase):
    pass


class ImportRun(Base):
    __tablename__ = "import_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="done")
    total_rows: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    dataset_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    summary: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    rows: Mapped[list["DatasetRow"]] = relationship(
        back_populates="import_run",
        cascade="all, delete-orphan",
    )


class DatasetRow(Base):
    __tablename__ = "dataset_rows"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    import_id: Mapped[int] = mapped_column(ForeignKey("import_runs.id", ondelete="CASCADE"), index=True)
    dataset: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    row_index: Mapped[int] = mapped_column(Integer, nullable=False)
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)

    import_run: Mapped[ImportRun] = relationship(back_populates="rows")


class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str | None] = mapped_column(String(255), nullable=True)
    unit: Mapped[str | None] = mapped_column(String(64), nullable=True)
    factor_kg_co2e: Mapped[float] = mapped_column(Float, nullable=False)
    scope: Mapped[str | None] = mapped_column(String(64), nullable=True)
    source: Mapped[str | None] = mapped_column(String(255), nullable=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    version: Mapped[str] = mapped_column(String(64), nullable=False, default="default")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )


class ExportRun(Base):
    __tablename__ = "export_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    import_id: Mapped[int | None] = mapped_column(ForeignKey("import_runs.id", ondelete="SET NULL"), nullable=True)
    export_type: Mapped[str] = mapped_column(String(32), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_emission_factor_columns()


def _ensure_emission_factor_columns() -> None:
    inspector = sqlalchemy_inspect(engine)
    if "emission_factors" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("emission_factors")}
    statements: list[str] = []
    if "version" not in columns:
        statements.append("ALTER TABLE emission_factors ADD COLUMN version VARCHAR(64) NOT NULL DEFAULT 'default'")
    if "is_active" not in columns:
        default = "TRUE" if engine.dialect.name != "sqlite" else "1"
        statements.append(f"ALTER TABLE emission_factors ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT {default}")

    if statements:
        with engine.begin() as connection:
            for statement in statements:
                connection.execute(text(statement))


@contextmanager
def get_session() -> Iterator[Session]:
    init_db()
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def replace_latest_import(filename: str, results: dict[str, list], summary: dict) -> ImportRun:
    """Enregistre un nouvel import et rend ses lignes disponibles comme dernier état."""
    with get_session() as session:
        import_run = ImportRun(
            filename=filename,
            status="done",
            total_rows=summary["total_rows"],
            dataset_count=summary["dataset_count"],
            summary=summary,
        )
        session.add(import_run)
        session.flush()

        for dataset, rows in results.items():
            for index, row in enumerate(rows, start=1):
                session.add(DatasetRow(
                    import_id=import_run.id,
                    dataset=dataset,
                    row_index=index,
                    payload=row,
                ))

        session.refresh(import_run)
        return import_run


def latest_import_id(session: Session) -> int | None:
    return session.scalar(select(ImportRun.id).order_by(ImportRun.created_at.desc(), ImportRun.id.desc()).limit(1))


def get_latest_dataset(dataset: str) -> list[dict] | None:
    with get_session() as session:
        import_id = latest_import_id(session)
        if import_id is None:
            return None

        rows = session.scalars(
            select(DatasetRow)
            .where(DatasetRow.import_id == import_id, DatasetRow.dataset == dataset)
            .order_by(DatasetRow.row_index)
        ).all()
        if not rows:
            return None
        return [row.payload for row in rows]


def list_latest_available_datasets(all_datasets: list[str]) -> list[str]:
    with get_session() as session:
        import_id = latest_import_id(session)
        if import_id is None:
            return []
        datasets = session.scalars(
            select(DatasetRow.dataset)
            .where(DatasetRow.import_id == import_id)
            .distinct()
        ).all()
        return [dataset for dataset in all_datasets if dataset in set(datasets)]


def list_import_history(limit: int = 20) -> list[dict]:
    with get_session() as session:
        rows = session.scalars(
            select(ImportRun)
            .order_by(ImportRun.created_at.desc(), ImportRun.id.desc())
            .limit(limit)
        ).all()
        return [
            {
                "id": row.id,
                "filename": row.filename,
                "status": row.status,
                "total_rows": row.total_rows,
                "dataset_count": row.dataset_count,
                "summary": row.summary,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ]


def _mask_database_url(url: str) -> str:
    if url.startswith("sqlite"):
        return url

    parsed = urlsplit(url)
    if not parsed.password:
        return url

    username = parsed.username or ""
    hostname = parsed.hostname or ""
    port = f":{parsed.port}" if parsed.port else ""
    netloc = f"{username}:***@{hostname}{port}"
    return urlunsplit((parsed.scheme, netloc, parsed.path, parsed.query, parsed.fragment))


def get_system_status() -> dict:
    with get_session() as session:
        latest = session.scalar(
            select(ImportRun).order_by(ImportRun.created_at.desc(), ImportRun.id.desc()).limit(1)
        )
        factor_count = session.scalar(select(func.count()).select_from(EmissionFactor))
        import_count = session.scalar(select(func.count()).select_from(ImportRun))

        return {
            "database": {
                "type": "postgresql" if DATABASE_URL.startswith("postgresql") else "sqlite",
                "url": _mask_database_url(DATABASE_URL),
                "is_default_sqlite": DATABASE_URL == DEFAULT_DATABASE_URL,
            },
            "imports": {
                "count": import_count,
                "latest": None if latest is None else {
                    "id": latest.id,
                    "filename": latest.filename,
                    "created_at": latest.created_at.isoformat(),
                    "total_rows": latest.total_rows,
                    "dataset_count": latest.dataset_count,
                },
            },
            "emission_factors": {
                "count": factor_count,
            },
        }


def delete_import(import_id: int) -> bool:
    with get_session() as session:
        import_run = session.get(ImportRun, import_id)
        if import_run is None:
            return False

        session.execute(update(ExportRun).where(ExportRun.import_id == import_id).values(import_id=None))
        session.execute(delete(DatasetRow).where(DatasetRow.import_id == import_id))
        session.delete(import_run)
        return True


def get_latest_import_payload() -> dict | None:
    with get_session() as session:
        import_id = latest_import_id(session)
        if import_id is None:
            return None

        return _get_import_payload(session, import_id)


def get_import_payload(import_id: int) -> dict | None:
    with get_session() as session:
        return _get_import_payload(session, import_id)


def _get_import_payload(session: Session, import_id: int) -> dict | None:
    import_run = session.get(ImportRun, import_id)
    if import_run is None:
        return None

    rows = session.scalars(
        select(DatasetRow)
        .where(DatasetRow.import_id == import_id)
        .order_by(DatasetRow.dataset, DatasetRow.row_index)
    ).all()

    datasets: dict[str, list[dict]] = {}
    for row in rows:
        datasets.setdefault(row.dataset, []).append(row.payload)

    return {
        "id": import_run.id,
        "filename": import_run.filename,
        "created_at": import_run.created_at,
        "summary": import_run.summary,
        "datasets": datasets,
    }


def record_export(import_id: int | None, export_type: str, filename: str) -> None:
    with get_session() as session:
        session.add(ExportRun(import_id=import_id, export_type=export_type, filename=filename))


def seed_emission_factors(factors: list[dict]) -> int:
    with get_session() as session:
        existing = session.scalar(select(func.count()).select_from(EmissionFactor))
        if existing:
            return 0

        for factor in factors:
            session.add(EmissionFactor(**factor))
        return len(factors)


def _emission_factor_to_dict(row: EmissionFactor) -> dict:
    return {
        "id": row.id,
        "name": row.name,
        "category": row.category,
        "unit": row.unit,
        "factor_kg_co2e": row.factor_kg_co2e,
        "scope": row.scope,
        "source": row.source,
        "year": row.year,
        "comment": row.comment,
        "version": row.version,
        "is_active": row.is_active,
    }


def list_emission_factors() -> list[dict]:
    with get_session() as session:
        rows = session.scalars(select(EmissionFactor).order_by(EmissionFactor.name)).all()
        return [_emission_factor_to_dict(row) for row in rows]


def get_emission_factor(factor_id: int) -> dict | None:
    with get_session() as session:
        row = session.get(EmissionFactor, factor_id)
        if row is None:
            return None
        return _emission_factor_to_dict(row)


def create_emission_factor(payload: dict) -> dict:
    with get_session() as session:
        row = EmissionFactor(**payload)
        session.add(row)
        session.flush()
        session.refresh(row)
        return _emission_factor_to_dict(row)


def update_emission_factor(factor_id: int, payload: dict) -> dict | None:
    with get_session() as session:
        row = session.get(EmissionFactor, factor_id)
        if row is None:
            return None

        for key, value in payload.items():
            setattr(row, key, value)
        session.flush()
        session.refresh(row)
        return _emission_factor_to_dict(row)


RECALCULABLE_DATASETS = ["energie", "clim", "dechets", "deplacements_pro", "deplacements_dt"]


def _to_float(value) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def _match_factor(payload: dict, dataset: str, factors: dict[str, EmissionFactor]) -> EmissionFactor | None:
    if dataset in ("energie", "clim"):
        candidates = [payload.get("energie")]
    elif dataset == "dechets":
        candidates = [payload.get("nomDechet"), payload.get("modeTraitement")]
    elif dataset in ("deplacements_pro", "deplacements_dt"):
        candidates = [payload.get("moyenDeplacement"), payload.get("infoComplementaire")]
    else:
        candidates = []

    normalized_candidates = [
        str(candidate).strip().lower()
        for candidate in candidates
        if candidate
    ]
    for candidate in normalized_candidates:
        if candidate in factors:
            return factors[candidate]
        match = next(
            (
                factor
                for key, factor in factors.items()
                if key and (key in candidate or candidate in key)
            ),
            None,
        )
        if match is not None:
            return match
    return None


def _calculation_quantity(payload: dict, dataset: str) -> float:
    if dataset in ("energie", "clim", "dechets"):
        return _to_float(payload.get("quantite"))
    if dataset == "deplacements_pro":
        return _to_float(payload.get("kmParAn"))
    if dataset == "deplacements_dt":
        distance = _to_float(payload.get("distanceDomTravail"))
        trips = _to_float(payload.get("nbAllerRetour") or 1)
        days = _to_float(payload.get("nbJoursTravailles"))
        return distance * trips * days
    return 0.0


def recalculate_latest_import_with_factors() -> dict | None:
    """Recalcule les lignes éligibles du dernier import avec les FE en base."""
    with get_session() as session:
        import_id = latest_import_id(session)
        if import_id is None:
            return None

        factors = {
            row.name.lower(): row
            for row in session.scalars(select(EmissionFactor).where(EmissionFactor.is_active.is_(True))).all()
        }
        rows = session.scalars(
            select(DatasetRow)
            .where(DatasetRow.import_id == import_id, DatasetRow.dataset.in_(RECALCULABLE_DATASETS))
            .order_by(DatasetRow.row_index)
        ).all()

        updated = 0
        skipped = 0
        datasets = {
            dataset: {"updated_rows": 0, "skipped_rows": 0}
            for dataset in RECALCULABLE_DATASETS
        }
        for row in rows:
            payload = dict(row.payload)
            source_values = payload.get("sourceValues") or source_values_snapshot(payload)
            factor = _match_factor(payload, row.dataset, factors)
            quantity = _calculation_quantity(payload, row.dataset)

            if factor is None or quantity <= 0:
                skipped += 1
                datasets[row.dataset]["skipped_rows"] += 1
                continue

            payload["feKgCO2eUnite"] = factor.factor_kg_co2e
            payload["kgCO2e"] = round(quantity * factor.factor_kg_co2e, 2)
            payload["facteurEmission"] = factor.source
            payload["categorieEmission"] = factor.category
            payload["scope"] = factor.scope
            payload["unite"] = payload.get("unite") or factor.unit
            attach_calculation_metadata(
                payload,
                source_values=source_values,
                kg_co2e=payload["kgCO2e"],
                fe_kg_co2e_unite=payload["feKgCO2eUnite"],
                factor_name=factor.name,
                factor_source=factor.source,
                factor_category=factor.category,
                factor_scope=factor.scope,
                factor_unit=factor.unit,
                method="current_factor",
                calculated_by="recalculate_latest_import",
            )
            row.payload = payload
            updated += 1
            datasets[row.dataset]["updated_rows"] += 1

        return {
            "import_id": import_id,
            "updated_rows": updated,
            "skipped_rows": skipped,
            "datasets": datasets,
        }


def replace_emission_factors(factors: list[dict]) -> int:
    with get_session() as session:
        session.execute(delete(EmissionFactor))
        for factor in factors:
            session.add(EmissionFactor(**factor))
        return len(factors)
