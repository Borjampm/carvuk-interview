from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    CALLBACK_URL: str
    SII_API_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()