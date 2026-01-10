# 🏗️ Архитектура Frontend - Визуальная схема

## Слои приложения

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
│                         (UI Components)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  HomePage    │  │   Header     │  │  BookList    │      │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘      │
│         │                                     │              │
│         │          ┌──────────────┐          │              │
│         └─────────►│ AddBookDialog│◄─────────┘              │
│                    └──────┬───────┘                          │
│                           │                                  │
│                    ┌──────▼───────┐                          │
│                    │ AddBookForm  │                          │
│                    └──────────────┘                          │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  BookCard    │  │ErrorMessage  │  │LoadingSpinner│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  RetroUI Components:                                         │
│  ┌────┐ ┌────┐ ┌─────┐ ┌──────┐ ┌──────┐ ┌─────┐ ┌────┐  │
│  │Card│ │Text│ │Input│ │Select│ │Dialog│ │Label│ │Btn │  │
│  └────┘ └────┘ └─────┘ └──────┘ └──────┘ └─────┘ └────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                   │
│                         (React Hooks)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                    ┌──────────────────┐                      │
│                    │   useBooks()     │                      │
│                    ├──────────────────┤                      │
│                    │ • books: Book[]  │                      │
│                    │ • genres: []     │                      │
│                    │ • loading        │                      │
│                    │ • error          │                      │
│                    │ • addBook()      │                      │
│                    │ • deleteBook()   │                      │
│                    │ • refetch()      │                      │
│                    └────────┬─────────┘                      │
│                             │                                │
└─────────────────────────────┼─────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                         │
│                      (API Integration)                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│              ┌────────────────────────────┐                  │
│              │     bookService            │                  │
│              ├────────────────────────────┤                  │
│              │ • getAllBooks()            │                  │
│              │ • createBook(book)         │                  │
│              │ • deleteBook(id)           │                  │
│              │ • getGenres()              │                  │
│              │ • getStatuses()            │                  │
│              └────────────┬───────────────┘                  │
│                           │                                  │
│                           │                                  │
│              ┌────────────▼───────────────┐                  │
│              │      Axios Client          │                  │
│              ├────────────────────────────┤                  │
│              │ • HTTP клиент              │                  │
│              │ • Interceptors             │                  │
│              │ • Error handling           │                  │
│              │ • Base URL config          │                  │
│              └────────────┬───────────────┘                  │
│                           │                                  │
└───────────────────────────┼───────────────────────────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │  Backend API    │
                  │  localhost:8000 │
                  └─────────────────┘
```

## Поток данных

### 1. Загрузка книг (GET)
```
HomePage
  └─► useBooks.fetchBooks()
       └─► bookService.getAllBooks()
            └─► axios.get('/book')
                 └─► Backend API
                      └─► Response: Book[]
                           └─► setBooks(data)
                                └─► UI Update
```

### 2. Добавление книги (POST)
```
AddBookForm (onSubmit)
  └─► AddBookDialog.handleSubmit()
       └─► useBooks.addBook(bookData)
            └─► bookService.createBook(book)
                 └─► axios.post('/book', book)
                      └─► Backend API
                           └─► Response: Book
                                └─► setBooks([...prev, newBook])
                                     └─► UI Update + Close Dialog
```

### 3. Удаление книги (DELETE)
```
BookCard (onClick Delete)
  └─► Confirm Dialog
       └─► BookList.onDeleteBook(id)
            └─► useBooks.deleteBook(id)
                 └─► bookService.deleteBook(id)
                      └─► axios.delete('/book/{id}')
                           └─► Backend API
                                └─► Response: 204
                                     └─► setBooks(prev.filter(...))
                                          └─► UI Update
```

## Типы данных

```
┌────────────────────────┐
│    types/book.ts       │
├────────────────────────┤
│                        │
│  Book {                │
│    id: number          │
│    name: string        │
│    genre: string|null  │
│    author: string|null │
│  }                     │
│                        │
│  BookCreate {          │
│    name: string        │
│    genre?: string      │
│    author?: string     │
│  }                     │
│                        │
│  BookStatus {          │
│    label: string       │
│    value: string       │
│  }                     │
└────────────────────────┘
```

## Состояние приложения

```
┌──────────────────────────────────┐
│       Application State          │
├──────────────────────────────────┤
│                                  │
│  useBooks Hook:                  │
│  ┌────────────────────────────┐ │
│  │ books: Book[]              │ │
│  │ genres: string[]           │ │
│  │ loading: boolean           │ │
│  │ error: string | null       │ │
│  └────────────────────────────┘ │
│                                  │
│  Component Local State:          │
│  ┌────────────────────────────┐ │
│  │ formData (AddBookForm)     │ │
│  │ open (AddBookDialog)       │ │
│  │ actionError (HomePage)     │ │
│  └────────────────────────────┘ │
└──────────────────────────────────┘
```

## Обработка ошибок

```
┌─────────────────────────────────────┐
│        Error Handling Flow          │
├─────────────────────────────────────┤
│                                     │
│  API Error                          │
│    ↓                                │
│  Axios Interceptor                  │
│    ↓                                │
│  console.error()                    │
│    ↓                                │
│  Promise.reject(error)              │
│    ↓                                │
│  try/catch in Service               │
│    ↓                                │
│  throw new Error(message)           │
│    ↓                                │
│  try/catch in useBooks              │
│    ↓                                │
│  setError(message)                  │
│    ↓                                │
│  ErrorMessage Component             │
│    ↓                                │
│  User sees error                    │
│                                     │
└─────────────────────────────────────┘
```

## Жизненный цикл компонента

```
HomePage Mount
  │
  ├─► useBooks()
  │     │
  │     ├─► useEffect(() => {
  │     │     fetchBooks()
  │     │     fetchGenres()
  │     │   }, [])
  │     │
  │     └─► Returns: {books, genres, loading, error, ...}
  │
  ├─► Render:
  │     │
  │     ├─► loading? → LoadingSpinner
  │     ├─► error? → ErrorMessage
  │     └─► else → BookList
  │
  └─► User Actions:
        │
        ├─► Add Book → AddBookDialog → API → UI Update
        └─► Delete Book → Confirm → API → UI Update
```

## Преимущества архитектуры

✅ **Разделение ответственности**: каждый слой решает свою задачу
✅ **Тестируемость**: каждый слой можно тестировать независимо
✅ **Масштабируемость**: легко добавлять новые функции
✅ **Переиспользуемость**: компоненты и хуки независимы
✅ **Типобезопасность**: TypeScript на всех уровнях
✅ **Читаемость**: понятная структура и именование

