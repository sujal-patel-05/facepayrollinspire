from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# Get the effective database URL (handles postgres:// → postgresql:// fix)
DATABASE_URL = settings.effective_database_url

# Create engine with appropriate args based on database type
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False  # Needed for SQLite only

engine = create_engine(DATABASE_URL, connect_args=connect_args)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
