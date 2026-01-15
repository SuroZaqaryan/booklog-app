# Валидация статусов книг

## Описание

Реализована строгая валидация статусов книг для обеспечения целостности данных.

## Миграция базы данных

Для добавления поля `status` в таблицу `books` была создана и применена миграция:

```bash
# Создание миграции
cd backend
.venv\Scripts\alembic.exe revision -m "add_status_column_to_books_table"

# Применение миграции
.venv\Scripts\alembic.exe upgrade head
```

**Файл миграции**: `backend/alembic/versions/17dcc2b3196d_add_status_column_to_books_table.py`

Миграция добавляет колонку:
```sql
ALTER TABLE books ADD COLUMN status VARCHAR NULL;
```

## Допустимые значения статусов

Статус книги может принимать **только** следующие значения:

| Значение | Русское название |
|----------|-----------------|
| `want_to_read` | Хочу прочитать |
| `reading` | Читаю |
| `finished` | Прочитал |
| `dropped` | Бросил |

## Реализация

### Backend

#### Enum BookStatus (`src/common/enums.py`)
```python
class BookStatus(str, Enum):
    WANT_TO_READ = "want_to_read"
    READING = "reading"
    FINISHED = "finished"
    DROPPED = "dropped"
```

#### Pydantic схема (`src/books/schemas.py`)
```python
class BookBase(BaseModel):
    name: str
    genre: Optional[str] = None
    author: Optional[str] = None
    status: Optional[BookStatus] = None  # Строгая валидация через enum
    image_url: Optional[str] = None
```

**Важно**: Использование `Optional[BookStatus]` вместо `Optional[str]` обеспечивает автоматическую валидацию Pydantic. Любое значение, отличное от допустимых, будет отклонено с ошибкой 422 (Unprocessable Entity).

#### API endpoint (`src/books/router.py`)
```python
@router.post("", response_model=BookPublic, status_code=status.HTTP_201_CREATED)
async def create_book(
    name: str = Form(...),
    genre: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    book_status: Optional[str] = Form(None),  # Валидируется через BookCreate схему
    image: Optional[UploadFile] = File(None),
    service: BookService = Depends(get_book_service)
):
```

### Frontend

#### TypeScript типы (`types/book.ts`)
```typescript
export type BookStatusValue = 'want_to_read' | 'reading' | 'finished' | 'dropped';

export interface Book {
  id: number;
  name: string;
  genre: string | null;
  author: string | null;
  status: BookStatusValue | null;  // Строгая типизация
  image_url: string | null;
}
```

#### Маппинг статусов (`components/BookCard.tsx`)
```typescript
const STATUS_LABELS: Record<BookStatusValue, string> = {
  want_to_read: 'Хочу прочитать',
  reading: 'Читаю',
  finished: 'Прочитал',
  dropped: 'Бросил',
};
```

## Валидация

### На уровне Backend
- **Pydantic** автоматически проверяет, что значение `status` соответствует одному из значений `BookStatus` enum
- Если передано недопустимое значение, API вернет ошибку `422 Unprocessable Entity` с подробным описанием

### На уровне Frontend
- **TypeScript** обеспечивает типобезопасность на этапе разработки
- **Select компонент** ограничивает выбор только допустимыми значениями из списка

## Примеры использования

### Получение списка статусов
```bash
GET /api/book/statuses
```

Ответ:
```json
[
  {
    "label": "Хочу прочитать",
    "value": "want_to_read"
  },
  {
    "label": "Читаю",
    "value": "reading"
  },
  {
    "label": "Прочитал",
    "value": "finished"
  },
  {
    "label": "Бросил",
    "value": "dropped"
  }
]
```

### Создание книги с статусом
```bash
POST /api/book
Content-Type: multipart/form-data

name: "Война и мир"
author: "Лев Толстой"
book_status: "reading"  # Допустимое значение
```

### Ошибка при недопустимом статусе
```bash
POST /api/book
book_status: "invalid_status"  # Недопустимое значение
```

Ответ (422):
```json
{
  "detail": [
    {
      "type": "enum",
      "loc": ["body", "status"],
      "msg": "Input should be 'want_to_read', 'reading', 'finished' or 'dropped'",
      "input": "invalid_status"
    }
  ]
}
```

## Преимущества

1. **Целостность данных** - невозможно создать книгу с недопустимым статусом
2. **Типобезопасность** - TypeScript предотвращает ошибки на этапе разработки
3. **Автодокументация** - enum четко определяет допустимые значения
4. **Легкость поддержки** - изменение списка статусов требует обновления только в одном месте (enum)
5. **Понятные ошибки** - при передаче недопустимого значения пользователь получает информативное сообщение об ошибке
