"""Book Pydantic schemas."""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from src.common.enums import BookStatus


class BookBase(BaseModel):
    """Базовая схема книги."""

    name: str
    genre: Optional[str] = None
    author: Optional[str] = None
    status: Optional[BookStatus] = None
    image_url: Optional[str] = None

class BookUpdate(BaseModel):
    name: Optional[str] = Field(None, example="1984")
    genre: Optional[str] = Field(None, example="Антиутопия")
    author: Optional[str] = Field(None, example="Джордж Оруэлл")
    status: Optional[str] = Field(None, example="reading")

class BookCreate(BookBase):
    """Схема для создания книги. Жанр может быть любым строковым значением."""

    pass


class BookPublic(BookBase):
    """Схема книги для публичного API."""

    id: int

    model_config = ConfigDict(from_attributes=True)


class BookStatusPublic(BaseModel):
    """Схема статуса книги для публичного API."""

    label: str
    value: str
