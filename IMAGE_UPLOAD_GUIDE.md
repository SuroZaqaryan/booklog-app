# Руководство по загрузке изображений

## Обзор изменений

В приложение BookLog добавлена функциональность загрузки и отображения обложек книг. Пользователи теперь могут загружать изображения при создании новой книги, и эти изображения отображаются в карточках книг.

## Backend изменения

### 1. Миграция базы данных

Добавлена новая миграция для добавления колонки `image_url` в таблицу `books`:

**Файл:** `backend/alembic/versions/078d623a92bf_add_image_url_column_to_books_table.py`

```python
def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('books', sa.Column('image_url', sa.String(), nullable=True))

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('books', 'image_url')
```

Для применения миграции:
```bash
cd backend
uv run alembic upgrade head
```

### 2. Модель BookModel

Обновлена модель книги для поддержки URL изображения:

**Файл:** `backend/app/models/book.py`

```python
class BookModel(Base):
    """Модель книги."""
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    genre = Column(String, nullable=True)
    author = Column(String, nullable=True)
    image_url = Column(String, nullable=True)  # Новое поле
```

### 3. Схемы (Schemas)

Обновлена базовая схема книги:

**Файл:** `backend/app/schemas/book.py`

```python
class BookBase(BaseModel):
    """Базовая схема книги."""
    name: str
    genre: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None  # Новое поле
```

### 4. Утилита для работы с изображениями

Создана новая утилита для сохранения и управления изображениями:

**Файл:** `backend/app/utils/image.py`

Основные функции:
- `save_image(file: UploadFile) -> str` - Сохраняет загруженное изображение
- `delete_image(image_url: Optional[str]) -> None` - Удаляет изображение

Особенности:
- Поддерживаемые форматы: JPG, JPEG, PNG, GIF, WEBP
- Максимальный размер файла: 5 MB
- Изображения сохраняются в директории `uploads/images/`
- Генерируются уникальные имена файлов с использованием UUID

### 5. Обновленный сервис BookService

**Файл:** `backend/app/services/book.py`

```python
async def create_book(self, book_data: BookCreate, image_url: Optional[str] = None) -> BookModel:
    """Создать новую книгу."""
    data = book_data.model_dump()
    if image_url:
        data["image_url"] = image_url
    return await self.repository.create(data)
```

### 6. Обновленный API endpoint

**Файл:** `backend/app/api/v1/endpoints/books.py`

POST endpoint теперь принимает multipart/form-data:

```python
@router.post("", response_model=BookPublic, status_code=status.HTTP_201_CREATED)
async def create_book(
    name: str = Form(...),
    genre: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),  # Новый параметр
    service: BookService = Depends(get_book_service)
):
    """Создать новую книгу с изображением."""
    image_url = None
    if image:
        try:
            image_url = await save_image(image)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
    
    book_data = BookCreate(name=name, genre=genre, author=author, image_url=image_url)
    return await service.create_book(book_data, image_url)
```

### 7. Статические файлы

**Файл:** `backend/app/main.py`

Добавлено монтирование статических файлов для доступа к загруженным изображениям:

```python
from fastapi.staticfiles import StaticFiles

# Монтируем статические файлы для изображений
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

Изображения доступны по URL: `http://localhost:8000/uploads/images/{filename}`

## Frontend изменения

### 1. Обновленные типы

**Файл:** `frontend/src/types/book.ts`

```typescript
export interface Book {
  id: number;
  name: string;
  genre: string | null;
  author: string | null;
  image_url: string | null;  // Новое поле
}

export interface BookCreate {
  name: string;
  genre?: string | null;
  author?: string | null;
  image?: File | null;  // Новое поле
}
```

### 2. Обновленный API сервис

**Файл:** `frontend/src/services/api/bookService.ts`

Метод createBook теперь отправляет FormData вместо JSON:

```typescript
async createBook(book: BookCreate): Promise<Book> {
  const formData = new FormData();
  formData.append('name', book.name);
  
  if (book.genre) {
    formData.append('genre', book.genre);
  }
  
  if (book.author) {
    formData.append('author', book.author);
  }
  
  if (book.image) {
    formData.append('image', book.image);
  }
  
  const response = await apiClient.post<Book>(BOOKS_ENDPOINT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
```

### 3. Обновленная форма добавления книги

**Файл:** `frontend/src/components/AddBookForm.tsx`

Добавлены:
- Поле для загрузки изображения
- Превью загруженного изображения
- Кнопка удаления изображения

Основные изменения:
```typescript
const [imagePreview, setImagePreview] = useState<string | null>(null);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormData({ ...formData, image: file });
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};
```

### 4. Обновленная карточка книги

**Файл:** `frontend/src/components/BookCard.tsx`

Карточка теперь отображает обложку книги, если она доступна:

```typescript
const imageUrl = book.image_url 
  ? `http://localhost:8000/${book.image_url.replace(/\\/g, '/')}`
  : null;

return (
  <Card className="relative">
    <CardHeader>
      <CardTitle>{book.name}</CardTitle>
      <CardDescription>Автор: {book.author ? book.author : ''}</CardDescription>
    </CardHeader>
    <CardContent>
      {imageUrl && (
        <div className="mb-4">
          <img
            src={imageUrl}
            alt={`Обложка книги ${book.name}`}
            className="w-full h-48 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      {/* ... остальной контент */}
    </CardContent>
  </Card>
);
```

## Как использовать

### Загрузка изображения при создании книги

1. Нажмите кнопку "Добавить книгу"
2. Заполните обязательные поля (название)
3. Нажмите на поле "Обложка книги"
4. Выберите изображение (JPG, PNG, GIF или WEBP, до 5 MB)
5. Появится превью выбранного изображения
6. При необходимости, можно удалить изображение кнопкой "✕ Удалить изображение"
7. Нажмите "Добавить книгу"

### Просмотр обложек книг

Обложки книг автоматически отображаются в карточках книг на главной странице.

## Технические детали

### Структура хранения

```
backend/
  uploads/
    images/
      {uuid}.jpg
      {uuid}.png
      ...
```

### Валидация

Backend проверяет:
- Расширение файла (только разрешенные форматы)
- Размер файла (максимум 5 MB)
- Наличие имени файла

### Обработка ошибок

- Если файл слишком большой или неподдерживаемого формата, возвращается HTTP 400 Bad Request
- Если изображение не загружается на фронтенде, оно автоматически скрывается

### CORS

Backend настроен на разрешение запросов от любых источников (`allow_origins=["*"]`), что позволяет фронтенду работать на другом порту во время разработки.

## Запуск приложения

### Backend
```bash
cd backend
uv run alembic upgrade head  # Применить миграции
uv run uvicorn app.main:app --reload
```

Backend будет доступен по адресу: http://localhost:8000

### Frontend
```bash
cd frontend
npm install  # Если необходимо
npm run dev
```

Frontend будет доступен по адресу: http://localhost:5173

## Будущие улучшения

Возможные улучшения функциональности:
1. Автоматическое изменение размера изображений на сервере
2. Поддержка нескольких изображений для книги
3. Интеграция с внешними API для автоматического получения обложек
4. Оптимизация изображений (сжатие, конвертация в WebP)
5. Удаление изображений при удалении книги
6. Drag & drop для загрузки изображений
7. Кадрирование изображений перед загрузкой
