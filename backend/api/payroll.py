from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import List
from datetime import date
import calendar
import logging

from database import get_db
from models import Payroll, Employee, Attendance
from schemas import PayrollCreate, PayrollResponse, PayrollWithEmployee
from api.auth import get_current_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payroll", tags=["Payroll"])

@router.post("/calculate", response_model=PayrollResponse)
async def calculate_payroll(
    payroll_data: PayrollCreate,
    db: Session = Depends(get_db)
    # Removed authentication for public access
    # Removed authentication for public access
):
    """
    Calculate and save payroll for an employee (admin only).
    Formula: Salary = (Total Days - Absent Days) × Per-Day Salary
    """
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.id == payroll_data.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Check if payroll already exists for this month
    existing_payroll = db.query(Payroll).filter(
        and_(
            Payroll.employee_id == payroll_data.employee_id,
            Payroll.month == payroll_data.month,
            Payroll.year == payroll_data.year
        )
    ).first()
    
    if existing_payroll:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payroll already calculated for {calendar.month_name[payroll_data.month]} {payroll_data.year}"
        )
    
    # Calculate total salary
    # Payable Days = Total Days - Absent Days = Present Days
    payable_days = payroll_data.present_days
    total_salary = payable_days * payroll_data.per_day_salary
    
    # Create payroll record
    new_payroll = Payroll(
        employee_id=payroll_data.employee_id,
        month=payroll_data.month,
        year=payroll_data.year,
        total_days=payroll_data.total_days,
        present_days=payroll_data.present_days,
        per_day_salary=payroll_data.per_day_salary,
        total_salary=total_salary
    )
    
    db.add(new_payroll)
    db.commit()
    db.refresh(new_payroll)
    
    logger.info(f"Payroll calculated for {employee.name}: ${total_salary:.2f}")
    
    return new_payroll

@router.post("/calculate-monthly/{month}/{year}")
async def calculate_monthly_payroll(
    month: int,
    year: int,
    per_day_salary: float = 100.0,
    db: Session = Depends(get_db)
    # Removed authentication for public access
):
    """
    Calculate payroll for all employees for a specific month (admin only).
    """
    if month < 1 or month > 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid month. Must be between 1 and 12."
        )
    
    # Get total days in month
    total_days = calendar.monthrange(year, month)[1]
    
    # Get all employees
    employees = db.query(Employee).all()
    
    results = []
    
    for employee in employees:
        # Check if payroll already exists
        existing_payroll = db.query(Payroll).filter(
            and_(
                Payroll.employee_id == employee.id,
                Payroll.month == month,
                Payroll.year == year
            )
        ).first()
        
        if existing_payroll:
            results.append({
                "employee_id": employee.id,
                "employee_name": employee.name,
                "status": "already_calculated",
                "total_salary": existing_payroll.total_salary
            })
            continue
        
        # Count present days
        start_date = date(year, month, 1)
        end_date = date(year, month, total_days)
        
        present_days = db.query(func.count(Attendance.id)).filter(
            and_(
                Attendance.employee_id == employee.id,
                Attendance.date >= start_date,
                Attendance.date <= end_date
            )
        ).scalar()
        
        # Calculate salary
        total_salary = present_days * per_day_salary
        
        # Create payroll record
        new_payroll = Payroll(
            employee_id=employee.id,
            month=month,
            year=year,
            total_days=total_days,
            present_days=present_days,
            per_day_salary=per_day_salary,
            total_salary=total_salary
        )
        
        db.add(new_payroll)
        
        results.append({
            "employee_id": employee.id,
            "employee_name": employee.name,
            "status": "calculated",
            "present_days": present_days,
            "total_salary": total_salary
        })
    
    db.commit()
    
    return {
        "month": calendar.month_name[month],
        "year": year,
        "total_employees": len(employees),
        "results": results
    }

@router.get("/summary", response_model=List[PayrollWithEmployee])
async def get_payroll_summary(
    month: int = None,
    year: int = None,
    db: Session = Depends(get_db)
    # Removed authentication for public access
):
    """Get payroll summary with filters (admin only)."""
    query = db.query(Payroll)
    
    if month:
        query = query.filter(Payroll.month == month)
    if year:
        query = query.filter(Payroll.year == year)
    
    payrolls = query.all()
    
    result = []
    for payroll in payrolls:
        result.append({
            "id": payroll.id,
            "employee_id": payroll.employee_id,
            "month": payroll.month,
            "year": payroll.year,
            "total_days": payroll.total_days,
            "present_days": payroll.present_days,
            "per_day_salary": payroll.per_day_salary,
            "total_salary": payroll.total_salary,
            "created_at": payroll.created_at,
            "employee": {
                "id": payroll.employee.id,
                "name": payroll.employee.name,
                "email": payroll.employee.email,
                "employee_id": payroll.employee.employee_id,
                "department_id": payroll.employee.department_id,
                "created_at": payroll.employee.created_at,
                "has_face_registered": payroll.employee.face_embedding is not None
            }
        })
    
    return result

@router.get("/employee/{employee_id}", response_model=List[PayrollResponse])
async def get_employee_payroll(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """Get payroll history for specific employee (public for employee dashboard)."""
    payrolls = db.query(Payroll).filter(
        Payroll.employee_id == employee_id
    ).order_by(Payroll.year.desc(), Payroll.month.desc()).all()
    
    return payrolls
