from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging

from database import engine, Base
from config import settings
from api import auth, departments, employees, attendance, payroll, analytics

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AI-Powered HRMS System",
    description="Employee Management, Attendance & Payroll System using Mobile-Based Face Recognition (InspireFace)",
    version="1.0.0"
)

# CORS configuration - include Vercel frontend URL in production
cors_origins = ["*"]  # Allow all for development
if settings.FRONTEND_URL:
    cors_origins = [
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:8000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(departments.router)
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(payroll.router)
app.include_router(analytics.router)

# Mount static files for mobile client
import os
mobile_client_path = os.path.join(os.path.dirname(__file__), "..", "mobile-client")
if os.path.exists(mobile_client_path):
    app.mount("/mobile-client", StaticFiles(directory=mobile_client_path, html=True), name="mobile-client")
    logger.info(f"Mounted mobile client at /mobile-client from {mobile_client_path}")

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "AI-Powered HRMS System API",
        "version": "1.0.0",
        "description": "Employee Management, Attendance & Payroll System using Mobile-Based Face Recognition",
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "mobile_registration": "/employees/register-face",
            "mobile_attendance": "/attendance/check-in"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("Starting AI-Powered HRMS System...")
    logger.info(f"Database: {settings.DATABASE_URL}")
    logger.info(f"Face Recognition Threshold: {settings.FACE_RECOGNITION_THRESHOLD}")
    
    # Create sample departments if database is empty
    from database import SessionLocal
    from models import Department
    
    db = SessionLocal()
    try:
        dept_count = db.query(Department).count()
        if dept_count == 0:
            logger.info("Creating sample departments...")
            sample_departments = [
                Department(name="Engineering", description="Software Development Team"),
                Department(name="Human Resources", description="HR and Recruitment"),
                Department(name="Finance", description="Finance and Accounting"),
                Department(name="Marketing", description="Marketing and Sales"),
                Department(name="Operations", description="Operations and Support")
            ]
            db.add_all(sample_departments)
            db.commit()
            logger.info("Sample departments created successfully")
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
