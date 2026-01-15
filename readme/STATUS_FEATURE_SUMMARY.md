# Добавление функциональности статусов книг

## Проблема
Endpoint `GET /api/v1/book` возвращал ошибку 500:
```
sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such column: books.status
```

## Причина
Схема Pydantic и ORM модель были обновлены с добавлением поля `status`, но миграция базы данных не была выполнена.

## Решение

### 1. Backend изменения

#### ORM Модель (`models.py`)
```python
class BookModel(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    genre = Column(String, nullable=True)
    status = Column(String, nullable=True)  # ✅ Добавлено
    author = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
```

#### Pydantic Схема (`schemas.py`)
```python
from src.common.enums import BookStatus

class BookBase(BaseModel):
    name: str
    genre: Optional[str] = None
    author: Optional[str] = None
    status: Optional[BookStatus] = None  # ✅ Строгая валидация через enum
    image_url: Optional[str] = None
```

#### API Router (`router.py`)
```python
@router.post("", response_model=BookPublic, status_code=status.HTTP_201_CREATED)
async def create_book(
    name: str = Form(...),
    genre: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    book_status: Optional[str] = Form(None),  # ✅ Добавлено
    image: Optional[UploadFile] = File(None),
    service: BookService = Depends(get_book_service)
):
    book_data = BookCreate(
        name=name, 
        genre=genre, 
        author=author, 
        status=book_status,  # ✅ Добавлено
        image_url=image_url
    )
    return await service.create_book(book_data, image_url)
```

#### Enum (`common/enums.py`)
```python
class BookStatus(str, Enum):
    WANT_TO_READ = "want_to_read"
    READING = "reading"
    FINISHED = "finished"
    DROPPED = "dropped"
```

### 2. Миграция базы данных

Создана миграция Alembic:
```bash
.venv\Scripts\alembic.exe revision -m "add_status_column_to_books_table"
```

Файл миграции: `17dcc2b3196d_add_status_column_to_books_table.py`
```python
def upgrade() -> None:
    op.add_column('books', sa.Column('status', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('books', 'status')
```

Применение миграции:
```bash
.venv\Scripts\alembic.exe upgrade head
```

Результат:
```
INFO  [alembic.runtime.migration] Running upgrade 078d623a92bf -> 17dcc2b3196d, add_status_column_to_books_table
```

### 3. Frontend изменения

#### TypeScript типы (`types/book.ts`)
```typescript
export type BookStatusValue = 'want_to_read' | 'reading' | 'finished' | 'dropped';

export interface Book {
  id: number;
  name: string;
  genre: string | null;
  author: string | null;
  status: BookStatusValue | null;  // ✅ Добавлено
  image_url: string | null;
}

export interface BookCreate {
  name: string;
  genre?: string | null;
  author?: string | null;
  status?: BookStatusValue | null;  // ✅ Добавлено
  image?: File | null;
}
```

#### API Service (`bookService.ts`)
```typescript
async createBook(book: BookCreate): Promise<Book> {
  const formData = new FormData();
  formData.append('name', book.name);
  
  if (book.genre) formData.append('genre', book.genre);
  if (book.author) formData.append('author', book.author);
  if (book.status) formData.append('book_status', book.status);  // ✅ Добавлено
  if (book.image) formData.append('image', book.image);
  
  const response = await apiClient.post<Book>(BOOKS_ENDPOINT, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
```

#### Форма создания книги (`AddBookForm.tsx`)
- ✅ Добавлен Select для выбора статуса
- ✅ Загрузка списка статусов с сервера через `/api/v1/book/statuses`
- ✅ Отображение русских названий статусов

#### Карточка книги (`BookCard.tsx`)
- ✅ Отображение статуса книги с русским названием

## Результат

✅ Ошибка 500 исправлена  
✅ Колонка `status` добавлена в таблицу `books`  
✅ Валидация статусов работает на уровне Pydantic (только 4 допустимых значения)  
✅ Frontend отправляет статус при создании книги  
✅ Статус отображается на карточке книги  

## Проверка

1. Запустите backend:
   ```bash
   cd backend
   uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. Проверьте endpoint:
   - `GET http://localhost:8000/api/v1/book` - должен вернуть 200
   - `GET http://localhost:8000/api/v1/book/statuses` - список статусов

3. Создайте книгу через frontend с выбором статуса

## Файлы изменены

### Backend
- ✅ `src/books/models.py` - добавлена колонка status
- ✅ `src/books/schemas.py` - добавлена валидация через BookStatus enum
- ✅ `src/books/router.py` - добавлен параметр book_status
- ✅ `alembic/versions/17dcc2b3196d_add_status_column_to_books_table.py` - миграция

### Frontend
- ✅ `src/types/book.ts` - добавлен тип BookStatusValue и поле status
- ✅ `src/services/api/bookService.ts` - добавлена отправка статуса
- ✅ `src/components/AddBookForm.tsx` - добавлен выбор статуса
- ✅ `src/components/BookCard.tsx` - добавлено отображение статуса

### Документация
- ✅ `STATUS_VALIDATION.md` - подробная документация по валидации статусов
- ✅ `STATUS_FEATURE_SUMMARY.md` - этот файл (резюме изменений)
