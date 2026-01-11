"""Book Service - бизнес-логика работы с книгами."""

from typing import List, Optional

from sqlalchemy import select
from src.books.models import BookModel
from src.books.repository import BookRepository
from src.books.schemas import BookCreate, BookStatusPublic, BookUpdate
from src.common.enums import BookStatus


class BookService:
    """Сервис для работы с книгами."""

    def __init__(self, repository: BookRepository):
        self.repository = repository

    async def get_all_books(self, name: Optional[str] = None) -> List[BookModel]:
        """Получить все книги с опциональным поиском по названию."""
        stmt = select(BookModel)

        if name:
            stmt = stmt.where(BookModel.name.ilike(f"%{name}%"))

        return await self.repository.get_all(stmt)

    async def create_book(self, book_data: BookCreate, image_url: Optional[str] = None) -> BookModel:
        """Создать новую книгу."""
        data = book_data.model_dump()
        if image_url:
            data["image_url"] = image_url
        return await self.repository.create(data)

    async def update_book(self, book_updated_data: BookUpdate, book_id: int) -> Optional[BookModel]:
        """Обновляет книгу."""
        data = book_updated_data.model_dump(exclude_unset=True)
        book = await self.repository.update(data, book_id)

        if not book:
            raise ValueError(f"Book with id {book_id} not found")

        return book


    async def delete_book(self, book_id: int) -> None:
        """Удалить книгу по ID."""
        book = await self.repository.get_by_id(book_id)
        if book is None:
            raise ValueError(f"Book with id {book_id} not found")
        await self.repository.delete(book)

    async def get_genres(self) -> List[str]:
        """Получить список рекомендуемых жанров."""
        return await self.repository.get_all_genres()

    @staticmethod
    def get_book_statuses() -> List[BookStatusPublic]:
        """Получить все возможные статусы книг."""
        return [
            BookStatusPublic(
                value=book_status.value,
                label=BookService._get_status_label(book_status)
            )
            for book_status in BookStatus
        ]

    @staticmethod
    def _get_status_label(book_status: BookStatus) -> str:
        """Получить русское название статуса."""
        labels = {
            BookStatus.WANT_TO_READ: "Хочу прочитать",
            BookStatus.READING: "Читаю",
            BookStatus.FINISHED: "Прочитал",
            BookStatus.DROPPED: "Бросил",
        }
        return labels[book_status]
