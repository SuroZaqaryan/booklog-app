"""Book ORM model."""

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from src.core.base import Base


class BookModel(Base):
    """Модель книги."""

    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    genre = Column(String, nullable=True)
    status = Column(String, nullable=True)
    author = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
