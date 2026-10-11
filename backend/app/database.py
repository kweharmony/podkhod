from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

# Engine — пул соединений с базой, создаётся один раз на всё приложение
engine = create_engine(settings.database_url)

# Фабрика сессий
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    """Общий родитель всех моделей."""


def get_db() -> Generator[Session]:
    """Выдаёт сессию на время одного запроса и закрывает её после ответа."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
