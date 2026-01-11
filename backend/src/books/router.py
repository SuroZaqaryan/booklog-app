"""Books API endpoints."""

import logging
from typing import List, Optional

from fastapi import APIRouter, Query, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.books.repository import BookRepository
from src.books.schemas import BookCreate, BookPublic, BookStatusPublic, BookUpdate
from src.books.service import BookService
from src.common.utils.image import save_image

router = APIRouter()
logger = logging.getLogger(__name__)


def get_book_service(db: AsyncSession = Depends(get_db)) -> BookService:
    """Dependency для получения BookService."""
    repository = BookRepository(db)
    return BookService(repository)


@router.get("/statuses", response_model=List[BookStatusPublic])
async def get_book_statuses():
    """
    Получить все возможные статусы книг.
    
    Returns:
        List[BookStatusPublic]: Список статусов с их метками.
    """
    return BookService.get_book_statuses()


@router.get("/genres", response_model=List[str])
async def get_genres(service: BookService = Depends(get_book_service)):
    """
    Получить список рекомендуемых жанров из базы данных.
    
    Returns:
        List[str]: Список жанров.
    """
    return await service.get_genres()


@router.get("", response_model=List[BookPublic])
async def get_books(
        name: Optional[str] = Query(None, min_length=1),
        service: BookService = Depends(get_book_service)
):
    """
    Получить список всех книг.
    
    Returns:
        List[BookPublic]: Список книг.
    """
    try:
        return await service.get_all_books(name)
    except Exception as e:
        logger.error(f"Error in get_books: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.put("/{book_id}", response_model=BookPublic)
async def update_book(
        book_update: BookUpdate,
        book_id: int,
        service: BookService = Depends(get_book_service)
):
    try:
        return await service.update_book(book_update, book_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("", response_model=BookPublic, status_code=status.HTTP_201_CREATED)
async def create_book(
        name: str = Form(...),
        genre: Optional[str] = Form(None),
        author: Optional[str] = Form(None),
        book_status: Optional[str] = Form(None),
        image: Optional[UploadFile] = File(None),
        service: BookService = Depends(get_book_service)
):
    """
    Создать новую книгу.
    
    Args:
        name: Название книги.
        genre: Жанр книги (опционально).
        author: Автор книги (опционально).
        book_status: Статус книги (опционально, один из: want_to_read, reading, finished, dropped).
        image: Файл изображения обложки (опционально).
        
    Returns:
        BookPublic: Созданная книга.
    """
    image_url = None
    if image:
        try:
            image_url = await save_image(image)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    book_data = BookCreate(name=name, genre=genre, author=author, status=book_status, image_url=image_url)
    return await service.create_book(book_data, image_url)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(
        book_id: int,
        service: BookService = Depends(get_book_service)
):
    """
    Удалить книгу по ID.
    
    Args:
        book_id: ID книги для удаления.
        
    Raises:
        HTTPException: Если книга не найдена.
    """
    try:
        await service.delete_book(book_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
