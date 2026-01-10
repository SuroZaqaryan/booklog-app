"""Application configuration."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Настройки приложения."""
    
    database_url: str = "sqlite+aiosqlite:///./books.db"
    project_name: str = "Books Manager"

    class Config:
        env_file = ".env"


settings = Settings()
