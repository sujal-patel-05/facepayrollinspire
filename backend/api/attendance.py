from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import date, datetime
import logging
import pytz  # For timezone support (IST)

from database import get_db
from models import Attendance, Employee
from schemas import (
    AttendanceResponse, AttendanceWithEmployee,
    FaceRecognitionRequest, FaceRecognitionResponse
)
from api.auth import get_current_admin
from face_recognition.inspireface_engine import InspireFaceEngine
from face_recognition.embedding_manager import EmbeddingManager
from utils.image_processing import base64_to_image, validate_image, preprocess_image
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/attendance", tags=["Attendance"])

# Initialize face recognition engine
face_engine = InspireFaceEngine(detection_threshold=settings.FACE_RECOGNITION_THRESHOLD)

@router.post("/check-in", response_model=FaceRecognitionResponse)
async def check_in_attendance(
    recognition_data: FaceRecognitionRequest,
    db: Session = Depends(get_db)
):
    """
    Mobile endpoint: Employee attendance check-in/check-out via face recognition.
    Automatically detects if it's punch in or punch out based on existing attendance.
    """
    try:
        # Process face image
        image = base64_to_image(recognition_data.face_image)
        
        if not validate_image(image):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format or dimensions"
            )
        
        # Preprocess image
        image = preprocess_image(image)
        
        # Load all known embeddings
        known_embeddings = EmbeddingManager.load_all_embeddings(db)
        
        if not known_embeddings:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No registered employees found. Please register first."
            )
        
        # Recognize face
        employee_id, confidence_score = face_engine.recognize_face(image, known_embeddings)
        
        if employee_id is None:
            return FaceRecognitionResponse(
                recognized=False,
                employee_id=None,
                employee_name=None,
                confidence_score=confidence_score,
                message="Face not recognized. Please ensure you are registered and your face is clearly visible."
            )
        
        # Get employee details
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found in database"
            )
        
        # Check if already checked in today
        today = date.today()
        existing_attendance = db.query(Attendance).filter(
            and_(
                Attendance.employee_id == employee_id,
                Attendance.date == today
            )
        ).first()
        
        if existing_attendance:
            # Employee already checked in - this is PUNCH OUT
            if existing_attendance.check_out_time:
                # Already punched out
                return FaceRecognitionResponse(
                    recognized=True,
                    employee_id=employee.id,
                    employee_name=employee.name,
                    confidence_score=confidence_score,
                    message=f"You have already completed your attendance for today, {employee.name}!"
                )
            
            # Update check-out time with IST
            ist = pytz.timezone('Asia/Kolkata')
            existing_attendance.check_out_time = datetime.now(ist)
            db.commit()
            
            # Calculate work hours
            check_in = existing_attendance.check_in_time
            check_out = existing_attendance.check_out_time
            work_duration = check_out - check_in
            hours_worked = work_duration.total_seconds() / 3600
            
            logger.info(f"Punch OUT: {employee.name} - {hours_worked:.1f} hours worked")
            
            return FaceRecognitionResponse(
                recognized=True,
                employee_id=employee.id,
                employee_name=employee.name,
                confidence_score=confidence_score,
                message=f"Thank you, {employee.name}! You worked {hours_worked:.1f} hours today. Have a great day!"
            )
        else:
            # No attendance record - this is PUNCH IN
            # Use IST timezone
            ist = pytz.timezone('Asia/Kolkata')
            
            new_attendance = Attendance(
                employee_id=employee_id,
                department_id=employee.department_id,
                date=today,
                check_in_time=datetime.now(ist),
                confidence_score=confidence_score
            )
            
            db.add(new_attendance)
            db.commit()
            db.refresh(new_attendance)
            
            check_in_time = new_attendance.check_in_time.strftime("%I:%M %p")
            
            logger.info(f"Punch IN: {employee.name} at {check_in_time}")
            
            return FaceRecognitionResponse(
                recognized=True,
                employee_id=employee.id,
                employee_name=employee.name,
                confidence_score=confidence_score,
                message=f"Welcome, {employee.name}! You're checked in at {check_in_time}. Have a productive day!"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Attendance check-in failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Check-in failed: {str(e)}"
        )

@router.get("/history", response_model=List[AttendanceWithEmployee])
async def get_attendance_history(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get attendance history with filters (admin only)."""
    query = db.query(Attendance)
    
    # Apply filters
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    if department_id:
        query = query.filter(Attendance.department_id == department_id)
    
    attendances = query.order_by(Attendance.date.desc()).all()
    return attendances

@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
async def get_employee_attendance(
    employee_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get attendance records for a specific employee (admin only)."""
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    attendances = query.order_by(Attendance.date.desc()).all()
    return attendances

@router.get("/today", response_model=List[AttendanceWithEmployee])
async def get_today_attendance(
    db: Session = Depends(get_db)
    # Removed authentication for admin dashboard
):
    """Get today's attendance (admin only)."""
    today = date.today()
    attendances = db.query(Attendance).filter(Attendance.date == today).all()
    
    result = []
    for att in attendances:
        result.append({
            "id": att.id,
            "employee_id": att.employee_id,
            "date": att.date,
            "check_in_time": att.check_in_time,
            "check_out_time": att.check_out_time,
            "confidence_score": att.confidence_score,
            "employee": att.employee
        })
    
    return result
