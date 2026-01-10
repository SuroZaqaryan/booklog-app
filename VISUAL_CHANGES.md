# Визуальное представление изменений API

## Изменение POST запроса

### ❌ РАНЬШЕ (JSON)

```javascript
// Frontend
const response = await apiClient.post('/api/v1/book', {
  name: "Война и мир",
  genre: "Классика",
  author: "Лев Толстой"
});
```

```python
# Backend
@router.post("")
async def create_book(
    book: BookCreate,  # JSON body
    service: BookService = Depends(get_book_service)
):
    return await service.create_book(book)
```

### ✅ СЕЙЧАС (FormData с файлом)

```javascript
// Frontend
const formData = new FormData();
formData.append('name', 'Война и мир');
formData.append('genre', 'Классика');
formData.append('author', 'Лев Толстой');
formData.append('image', imageFile);  // ← НОВОЕ!

const response = await apiClient.post('/api/v1/book', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

```python
# Backend
@router.post("")
async def create_book(
    name: str = Form(...),           # Form field
    genre: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),  # ← НОВОЕ!
    service: BookService = Depends(get_book_service)
):
    # Сохраняем изображение
    image_url = None
    if image:
        image_url = await save_image(image)
    
    book_data = BookCreate(name=name, genre=genre, author=author, image_url=image_url)
    return await service.create_book(book_data, image_url)
```

## Изменение GET ответа

### ❌ РАНЬШЕ

```json
{
  "id": 1,
  "name": "Война и мир",
  "genre": "Классика",
  "author": "Лев Толстой"
}
```

### ✅ СЕЙЧАС

```json
{
  "id": 1,
  "name": "Война и мир",
  "genre": "Классика",
  "author": "Лев Толстой",
  "image_url": "uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

## Модель базы данных

### ❌ РАНЬШЕ

```sql
CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    genre VARCHAR,
    author VARCHAR
);
```

### ✅ СЕЙЧАС

```sql
CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    genre VARCHAR,
    author VARCHAR,
    image_url VARCHAR  -- ← НОВОЕ!
);
```

## TypeScript типы

### ❌ РАНЬШЕ

```typescript
export interface Book {
  id: number;
  name: string;
  genre: string | null;
  author: string | null;
}

export interface BookCreate {
  name: string;
  genre?: string | null;
  author?: string | null;
}
```

### ✅ СЕЙЧАС

```typescript
export interface Book {
  id: number;
  name: string;
  genre: string | null;
  author: string | null;
  image_url: string | null;  // ← НОВОЕ!
}

export interface BookCreate {
  name: string;
  genre?: string | null;
  author?: string | null;
  image?: File | null;  // ← НОВОЕ!
}
```

## React компонент (AddBookForm)

### ❌ РАНЬШЕ

```tsx
<form onSubmit={handleSubmit}>
  <Input name="name" />
  <Input name="author" />
  <Select name="genre" />
  <Button type="submit">Добавить книгу</Button>
</form>
```

### ✅ СЕЙЧАС

```tsx
<form onSubmit={handleSubmit}>
  <Input name="name" />
  <Input name="author" />
  <Select name="genre" />
  
  {/* ← НОВОЕ! */}
  <Input 
    type="file" 
    accept="image/*"
    onChange={handleImageChange}
  />
  
  {/* ← НОВОЕ! Превью */}
  {imagePreview && (
    <div>
      <img src={imagePreview} alt="Preview" />
      <Button onClick={handleRemoveImage}>Удалить</Button>
    </div>
  )}
  
  <Button type="submit">Добавить книгу</Button>
</form>
```

## React компонент (BookCard)

### ❌ РАНЬШЕ

```tsx
<Card>
  <CardHeader>
    <CardTitle>{book.name}</CardTitle>
    <CardDescription>Автор: {book.author}</CardDescription>
  </CardHeader>
  <CardContent>
    {book.genre && <p>Жанр: {book.genre}</p>}
    <Button onClick={onDelete}>Удалить</Button>
  </CardContent>
</Card>
```

### ✅ СЕЙЧАС

```tsx
<Card>
  <CardHeader>
    <CardTitle>{book.name}</CardTitle>
    <CardDescription>Автор: {book.author}</CardDescription>
  </CardHeader>
  <CardContent>
    {/* ← НОВОЕ! Обложка */}
    {book.image_url && (
      <img 
        src={`http://localhost:8000/${book.image_url}`}
        alt={book.name}
        className="w-full h-48 object-cover rounded-md"
      />
    )}
    
    {book.genre && <p>Жанр: {book.genre}</p>}
    <Button onClick={onDelete}>Удалить</Button>
  </CardContent>
</Card>
```

## Структура файлов

### ❌ РАНЬШЕ

```
backend/
  app/
    api/
    models/
    schemas/
    services/
    utils/
      enums.py
  books.db
```

### ✅ СЕЙЧАС

```
backend/
  app/
    api/
    models/
    schemas/
    services/
    utils/
      enums.py
      image.py          ← НОВОЕ!
  books.db
  uploads/              ← НОВОЕ!
    images/
      {uuid}.jpg
      {uuid}.png
```

## HTTP запросы

### POST запрос (создание книги с изображением)

```http
POST /api/v1/book HTTP/1.1
Host: localhost:8000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="name"

Война и мир
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="author"

Лев Толстой
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="genre"

Классика
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="image"; filename="cover.jpg"
Content-Type: image/jpeg

[binary image data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### Ответ

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "name": "Война и мир",
  "genre": "Классика",
  "author": "Лев Толстой",
  "image_url": "uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

### GET запрос (получение изображения)

```http
GET /uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg HTTP/1.1
Host: localhost:8000

HTTP/1.1 200 OK
Content-Type: image/jpeg

[binary image data]
```

## Диаграмма потока данных

```
Frontend                  Backend                    Filesystem
   |                        |                            |
   |  1. Пользователь       |                            |
   |     выбирает файл      |                            |
   |                        |                            |
   |  2. POST /api/v1/book  |                            |
   |  (FormData с image)    |                            |
   | ---------------------> |                            |
   |                        |  3. Валидация файла        |
   |                        |     (формат, размер)       |
   |                        |                            |
   |                        |  4. Генерация UUID         |
   |                        |     имени файла            |
   |                        |                            |
   |                        |  5. Сохранение файла       |
   |                        | -------------------------> |
   |                        |                            |
   |                        |  6. Сохранение пути        |
   |                        |     в БД                   |
   |                        |                            |
   |  7. Ответ с image_url  |                            |
   | <--------------------- |                            |
   |                        |                            |
   |  8. GET изображения    |                            |
   | ---------------------> |                            |
   |                        |  9. Чтение файла           |
   |                        | -------------------------> |
   |                        | <------------------------- |
   | <--------------------- |                            |
   |  10. Отображение       |                            |
   |      изображения       |                            |
```

## Итого

**Что изменилось:**
1. ✅ POST запрос принимает `multipart/form-data` вместо `application/json`
2. ✅ Добавлен параметр `image` для загрузки файла
3. ✅ GET запрос возвращает поле `image_url`
4. ✅ Изображения сохраняются на диске в `backend/uploads/images/`
5. ✅ Frontend отправляет FormData вместо JSON
6. ✅ BookCard отображает обложку книги
7. ✅ AddBookForm позволяет выбрать и загрузить изображение
