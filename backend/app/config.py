from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Настройки приложения. Читаются из файла .env или из переменных окружения."""

    model_config = SettingsConfigDict(env_file=".env")

    database_url: str


settings = Settings()
