from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Department
from schemas import DepartmentCreate, DepartmentResponse
from api.auth import get_current_admin

router = APIRouter(prefix="/departments", tags=["Departments"])

@router.post("/create", response_model=DepartmentResponse)
async def create_department(
    department_data: DepartmentCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Create new department (admin only)."""
    # Check if department already exists
    existing = db.query(Department).filter(Department.name == department_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department already exists"
        )
    
    # Create department
    new_department = Department(
        name=department_data.name,
        description=department_data.description
    )
    
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    
    return new_department

@router.get("/list", response_model=List[DepartmentResponse])
async def list_departments(db: Session = Depends(get_db)):
    """Get all departments (public endpoint for mobile registration)."""
    departments = db.query(Department).all()
    return departments

@router.get("/{department_id}", response_model=DepartmentResponse)
async def get_department(department_id: int, db: Session = Depends(get_db)):
    """Get department by ID."""
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    return department

@router.put("/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: int,
    department_data: DepartmentCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Update department (admin only)."""
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    
    department.name = department_data.name
    department.description = department_data.description
    
    db.commit()
    db.refresh(department)
    
    return department
