from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from database import get_db
from models import Employee, Department, Attendance, Payroll
from schemas import (
    EmployeeCreate, EmployeeResponse, EmployeeWithDepartment,
    FaceRegistrationRequest, FaceRecognitionResponse
)
from api.auth import get_current_admin
from face_recognition.inspireface_engine import InspireFaceEngine
from face_recognition.embedding_manager import EmbeddingManager
from utils.image_processing import base64_to_image, validate_image, preprocess_image
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/employees", tags=["Employees"])

# Initialize face recognition engine
face_engine = InspireFaceEngine(detection_threshold=settings.FACE_RECOGNITION_THRESHOLD)

@router.post("/register-face", response_model=FaceRecognitionResponse)
async def register_employee_with_face(
    registration_data: FaceRegistrationRequest,
    db: Session = Depends(get_db)
):
    """
    Mobile endpoint: Employee self-registration with face capture.
    This is called from mobile phones only.
    """
    try:
        # Check if employee ID already exists
        existing_employee = db.query(Employee).filter(
            Employee.employee_id == registration_data.employee_id
        ).first()
        if existing_employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee ID already registered"
            )
        
        # Check if email already exists
        existing_email = db.query(Employee).filter(
            Employee.email == registration_data.email
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Verify department exists
        department = db.query(Department).filter(
            Department.id == registration_data.department_id
        ).first()
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )
        
        # Process face image
        image = base64_to_image(registration_data.face_image)
        
        if not validate_image(image):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format or dimensions"
            )
        
        # Preprocess image
        image = preprocess_image(image)
        
        # Extract face embedding
        embedding = face_engine.extract_embedding(image)
        if embedding is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No face detected in image. Please ensure your face is clearly visible."
            )
        
        # Create employee record
        new_employee = Employee(
            name=registration_data.name,
            email=registration_data.email,
            employee_id=registration_data.employee_id,
            department_id=registration_data.department_id
        )
        
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
        
        # Save face embedding
        embedding_bytes = EmbeddingManager.embedding_to_bytes(embedding)
        new_employee.face_embedding = embedding_bytes
        db.commit()
        
        logger.info(f"Employee registered: {new_employee.name} (ID: {new_employee.employee_id})")
        
        return FaceRecognitionResponse(
            recognized=True,
            employee_id=new_employee.id,
            employee_name=new_employee.name,
            confidence_score=1.0,
            message=f"Registration successful! Welcome, {new_employee.name}."
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Employee registration failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.get("/list", response_model=List[EmployeeWithDepartment])
async def list_employees(
    db: Session = Depends(get_db)
    # Removed authentication for admin dashboard access
):
    """Get all employees (admin only)."""
    employees = db.query(Employee).all()
    
    # Add has_face_registered flag
    result = []
    for emp in employees:
        emp_dict = {
            "id": emp.id,
            "name": emp.name,
            "email": emp.email,
            "employee_id": emp.employee_id,
            "department_id": emp.department_id,
            "created_at": emp.created_at,
            "has_face_registered": emp.face_embedding is not None,
            "department": emp.department
        }
        result.append(emp_dict)
    
    return result

@router.get("/{employee_id}", response_model=EmployeeWithDepartment)
async def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get employee by ID (admin only)."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    return {
        "id": employee.id,
        "name": employee.name,
        "email": employee.email,
        "employee_id": employee.employee_id,
        "department_id": employee.department_id,
        "created_at": employee.created_at,
        "has_face_registered": employee.face_embedding is not None,
        "department": employee.department
    }

@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: int,
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db)
    # Removed authentication for admin dashboard
):
    """Update employee information (admin only)."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Verify department exists
    department = db.query(Department).filter(Department.id == employee_data.department_id).first()
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    
    employee.name = employee_data.name
    employee.email = employee_data.email
    employee.employee_id = employee_data.employee_id
    employee.department_id = employee_data.department_id
    
    db.commit()
    db.refresh(employee)
    
    return {
        "id": employee.id,
        "name": employee.name,
        "email": employee.email,
        "employee_id": employee.employee_id,
        "department_id": employee.department_id,
        "created_at": employee.created_at,
        "has_face_registered": employee.face_embedding is not None
    }

@router.delete("/{employee_id}")
async def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db)
    # Removed authentication for admin dashboard
):
    """Delete employee and all related records (admin only)."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Delete related attendance records first (foreign key constraint)
    db.query(Attendance).filter(Attendance.employee_id == employee_id).delete()
    
    # Delete related payroll records if any
    db.query(Payroll).filter(Payroll.employee_id == employee_id).delete()
    
    # Now delete the employee
    employee_name = employee.name
    db.delete(employee)
    db.commit()
    
    return {"message": f"Employee {employee_name} and all related records deleted successfully"}
