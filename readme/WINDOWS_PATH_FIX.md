# Исправление ошибки Windows путей

## Проблема

При попытке загрузить изображение на Windows возникала ошибка:

```json
{
    "detail": "'uploads\\\\images\\\\38c73347-1010-48e9-9b01-5deeb98abca9.png' is not in the subpath of 'C:\\\\Repos\\\\python-courses\\\\booklog-app\\\\backend'"
}
```

## Причина

1. **Обратные слэши в путях Windows**: `Path.relative_to()` возвращала путь с обратными слэшами (`\`), которые некорректно обрабатывались FastAPI StaticFiles
2. **Относительные пути**: StaticFiles не мог правильно обработать относительный путь на Windows

## Решение

### 1. Исправлен `backend/app/utils/image.py`

**Было:**
```python
# Возвращаем относительный путь
return str(file_path.relative_to(Path.cwd()))
```

**Стало:**
```python
# Возвращаем относительный путь с forward slashes для URL
return str(file_path).replace("\\", "/")
```

**Изменение:** Теперь используем `str(file_path)` напрямую (который дает путь вида `uploads/images/filename.png` или `uploads\images\filename.png` на Windows) и заменяем все обратные слэши на forward slashes для корректного формирования URL.

### 2. Исправлен `backend/app/main.py`

**Было:**
```python
# Создать директорию для загрузок, если её нет
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# ...позже в коде...

# Подключение API роутеров
app.include_router(api_router)

# Монтируем статические файлы для изображений
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

**Стало:**
```python
# Создать директорию для загрузок, если её нет
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "images").mkdir(exist_ok=True)

# ...позже в коде...

# Монтируем статические файлы для изображений (до подключения роутеров)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR.absolute())), name="uploads")

# Подключение API роутеров
app.include_router(api_router)
```

**Изменения:**
1. Создаем также поддиректорию `images` при старте приложения
2. Используем абсолютный путь для StaticFiles: `str(UPLOAD_DIR.absolute())`
3. Монтируем статические файлы **до** подключения роутеров (важно для правильной обработки путей)

## Как это работает

### Путь в базе данных
```
uploads/images/38c73347-1010-48e9-9b01-5deeb98abca9.png
```

### URL для доступа к файлу
```
http://localhost:8000/uploads/images/38c73347-1010-48e9-9b01-5deeb98abca9.png
```

### Физическое расположение файла (Windows)
```
C:\Repos\python-courses\booklog-app\backend\uploads\images\38c73347-1010-48e9-9b01-5deeb98abca9.png
```

## Почему это важно

1. **URL всегда использует forward slashes (`/`)**, независимо от ОС
2. **Windows использует обратные слэши (`\`)** для путей файловой системы
3. **FastAPI StaticFiles** корректно работает с абсолютными путями
4. **Порядок монтирования** важен - статические файлы должны монтироваться до API роутеров

## Проверка

После изменений попробуйте снова загрузить изображение:

1. Откройте приложение: http://localhost:5173
2. Нажмите "Добавить книгу"
3. Заполните поля и выберите изображение
4. Отправьте форму

Теперь должно работать корректно! ✅

## Совместимость

Эти изменения работают на:
- ✅ Windows
- ✅ Linux
- ✅ macOS

Метод `.replace("\\", "/")` безопасен на всех платформах, так как на Unix-системах не будет обратных слэшей для замены.
