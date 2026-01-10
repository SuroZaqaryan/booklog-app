"""Main FastAPI application."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles

from src.core.config import settings
from src.core.database import engine
from src.core.base import Base
from src.books.router import router as books_router

# Импортируем модели для инициализации Base.metadata
from src.books.models import BookModel  # noqa: F401
from src.genres.models import GenreModel  # noqa: F401


# Создать директорию для загрузок, если её нет
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "images").mkdir(exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan для инициализации приложения.
    
    ВАЖНО: Этот метод используется ТОЛЬКО для создания таблиц в dev-окружении.
    Любые изменения схемы БД (добавление/изменение колонок, таблиц и т.д.)
    должны выполняться через Alembic миграции, а не напрямую здесь.
    
    Для применения миграций используйте:
        alembic upgrade head
    
    Для создания новой миграции:
        alembic revision --autogenerate -m "описание изменений"
    """
    # Создаем все таблицы (только для dev, не изменяет существующие таблицы)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield


# Создание приложения FastAPI
app = FastAPI(
    title=settings.project_name,
    lifespan=lifespan,
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтируем статические файлы для изображений (до подключения роутеров)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR.absolute())), name="uploads")

# Подключение роутеров модулей
app.include_router(books_router, prefix="/api/v1/book", tags=["book"])


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Обработчик ошибок валидации.
    Возвращает стандартный 422 для ошибок валидации.
    
    Args:
        request: HTTP запрос.
        exc: Исключение валидации.
        
    Returns:
        JSONResponse: Ответ с деталями ошибки.
    """
    errors = exc.errors()
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors}
    )


@app.get("/")
async def root():
    """
    Корневой endpoint - редирект на документацию.
    
    Returns:
        RedirectResponse: Редирект на документацию API.
    """
    return RedirectResponse(url="/api/docs")
