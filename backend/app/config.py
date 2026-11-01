from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Настройки приложения. Читаются из файла .env или из переменных окружения."""

    model_config = SettingsConfigDict(env_file=".env")

    database_url: str
    jwt_secret: str = Field(min_length=32)
    access_minutes: int = Field(default=15, gt=0)
    refresh_days: int = Field(default=7, gt=0)
    cookie_secure: bool = False

    # Помощник. Без ключа приложение работает, но советы будут только по правилам.
    polza_api_key: str | None = None
    polza_model: str = "z-ai/glm-5.3-flash"
    polza_url: str = "https://polza.ai/api/v1/chat/completions"


settings = Settings()
