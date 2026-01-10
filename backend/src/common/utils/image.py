"""Image handling utilities."""

import os
import uuid
from pathlib import Path
from typing import Optional

from fastapi import UploadFile


UPLOAD_DIR = Path("uploads/images")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


async def save_image(file: UploadFile) -> str:
    """
    Сохранить загруженное изображение.
    
    Args:
        file: Загруженный файл изображения.
        
    Returns:
        str: Относительный путь к сохранённому изображению.
        
    Raises:
        ValueError: Если тип файла не поддерживается или файл слишком большой.
    """
    # Проверяем расширение файла
    if file.filename:
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise ValueError(
                f"Неподдерживаемый тип файла. Разрешены: {', '.join(ALLOWED_EXTENSIONS)}"
            )
    else:
        raise ValueError("Имя файла отсутствует")
    
    # Создаем директорию, если её нет
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    # Генерируем уникальное имя файла
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Сохраняем файл
    contents = await file.read()
    
    # Проверяем размер файла
    if len(contents) > MAX_FILE_SIZE:
        raise ValueError(f"Файл слишком большой. Максимальный размер: {MAX_FILE_SIZE // (1024 * 1024)}MB")
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Возвращаем относительный путь с forward slashes для URL
    return str(file_path).replace("\\", "/")


def delete_image(image_url: Optional[str]) -> None:
    """
    Удалить изображение по URL.
    
    Args:
        image_url: URL изображения для удаления.
    """
    if not image_url:
        return
    
    try:
        file_path = Path(image_url)
        if file_path.exists() and file_path.is_file():
            file_path.unlink()
    except Exception:
        # Игнорируем ошибки удаления файлов
        pass
