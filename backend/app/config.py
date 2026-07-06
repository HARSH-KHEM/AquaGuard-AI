from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    port: int = int(os.getenv("PORT", 8080))
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8')

settings = Settings()
