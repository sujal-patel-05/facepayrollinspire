import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database - defaults to SQLite for local dev, use DATABASE_URL env var for Supabase PostgreSQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./hrms.db")
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # InspireFace
    FACE_RECOGNITION_THRESHOLD: float = 0.6
    INSPIREFACE_MODEL_PATH: str = "./models"
    
    # Timezone - IST (Indian Standard Time)
    TIMEZONE: str = "Asia/Kolkata"
    
    # ngrok URL (update this after starting ngrok)
    NGROK_URL: str = os.getenv("NGROK_URL", "http://localhost:8000")
    
    # Frontend URL for CORS (set in production to your Vercel URL)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:8000",
    ]
    
    @property
    def effective_database_url(self) -> str:
        """Fix Supabase/Render postgres:// URLs to postgresql://"""
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url
    
    class Config:
        env_file = ".env"

settings = Settings()
