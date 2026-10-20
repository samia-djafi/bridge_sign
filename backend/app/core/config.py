"""
Application Configuration for ConnectSign AI Backend.
"""

from typing import List
import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ConnectSign AI Recognition API"
    VERSION: str = "0.2.0"
    API_V1_STR: str = "/v1"
    ENVIRONMENT: str = "development"

    # Explicit allowed CORS origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://bridge-sign.vercel.app",
    ]

    # Model configuration
    MODEL_DIR: str = os.getenv(
        "MODEL_DIR",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "models"),
    )
    UNCERTAINTY_THRESHOLD: float = float(os.getenv("UNCERTAINTY_THRESHOLD", "0.12"))
    MAX_FRAMES: int = 48
    MIN_FRAMES: int = 1
    DEVICE: str = "cpu"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
