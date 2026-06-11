from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Server
    environment: str = "development"
    app_version: str = "1.0.0"

    # Database
    database_url: str

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Auth
    secret_key: str
    access_token_expire_minutes: int = 60

    # Image processing
    max_file_size_mb: int = 10
    rate_limit_per_hour: int = 100

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()  # type: ignore[call-arg]
