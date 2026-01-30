import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./hrms.db"
    
    # JWT Authentication
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # InspireFace
    FACE_RECOGNITION_THRESHOLD: float = 0.6
    INSPIREFACE_MODEL_PATH: str = "./models"
    
    # Timezone - IST (Indian Standard Time)
    TIMEZONE: str = "Asia/Kolkata"
    
    # ngrok URL (update this after starting ngrok)
    NGROK_URL: str = os.getenv("NGROK_URL", "http://localhost:8000")
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()
