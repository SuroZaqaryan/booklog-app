"""Core module - базовые компоненты приложения."""

from src.core.config import settings
from src.core.database import engine, AsyncSessionLocal, get_db

__all__ = ["settings", "engine", "AsyncSessionLocal", "get_db"]
