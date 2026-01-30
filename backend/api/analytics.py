from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from typing import List, Dict
from datetime import date, timedelta
import calendar

from database import get_db
from models import Employee, Attendance, Department, Payroll
from api.auth import get_current_admin

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
async def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get overview analytics for admin dashboard."""
    
    # Total employees
    total_employees = db.query(func.count(Employee.id)).scalar()
    
    # Total departments
    total_departments = db.query(func.count(Department.id)).scalar()
    
    # Today's attendance
    today = date.today()
    today_attendance = db.query(func.count(Attendance.id)).filter(
        Attendance.date == today
    ).scalar()
    
    # Attendance percentage for today
    attendance_percentage = (today_attendance / total_employees * 100) if total_employees > 0 else 0
    
    # This month's total payroll cost
    current_month = today.month
    current_year = today.year
    
    monthly_payroll = db.query(func.sum(Payroll.total_salary)).filter(
        and_(
            Payroll.month == current_month,
            Payroll.year == current_year
        )
    ).scalar() or 0
    
    # Recent attendance (last 7 days)
    seven_days_ago = today - timedelta(days=7)
    recent_attendance = db.query(Attendance).filter(
        Attendance.date >= seven_days_ago
    ).order_by(Attendance.date.desc()).limit(10).all()
    
    recent_attendance_data = []
    for att in recent_attendance:
        recent_attendance_data.append({
            "employee_name": att.employee.name,
            "department": att.department.name if att.department else "N/A",
            "date": att.date.isoformat(),
            "check_in_time": att.check_in_time.strftime("%I:%M %p")
        })
    
    return {
        "total_employees": total_employees,
        "total_departments": total_departments,
        "today_attendance": today_attendance,
        "attendance_percentage": round(attendance_percentage, 2),
        "monthly_payroll_cost": round(monthly_payroll, 2),
        "recent_attendance": recent_attendance_data
    }

@router.get("/department-wise")
async def get_department_wise_analytics(
    month: int = None,
    year: int = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get department-wise attendance and payroll analytics."""
    
    # Use current month/year if not provided
    today = date.today()
    if not month:
        month = today.month
    if not year:
        year = today.year
    
    departments = db.query(Department).all()
    
    result = []
    
    for dept in departments:
        # Count employees in department
        employee_count = db.query(func.count(Employee.id)).filter(
            Employee.department_id == dept.id
        ).scalar()
        
        # Get attendance for the month
        total_days = calendar.monthrange(year, month)[1]
        start_date = date(year, month, 1)
        end_date = date(year, month, total_days)
        
        attendance_count = db.query(func.count(Attendance.id)).filter(
            and_(
                Attendance.department_id == dept.id,
                Attendance.date >= start_date,
                Attendance.date <= end_date
            )
        ).scalar()
        
        # Calculate attendance percentage
        max_possible = employee_count * total_days
        attendance_percentage = (attendance_count / max_possible * 100) if max_possible > 0 else 0
        
        # Get payroll cost for department
        payroll_cost = db.query(func.sum(Payroll.total_salary)).join(
            Employee, Payroll.employee_id == Employee.id
        ).filter(
            and_(
                Employee.department_id == dept.id,
                Payroll.month == month,
                Payroll.year == year
            )
        ).scalar() or 0
        
        result.append({
            "department_id": dept.id,
            "department_name": dept.name,
            "employee_count": employee_count,
            "attendance_count": attendance_count,
            "attendance_percentage": round(attendance_percentage, 2),
            "payroll_cost": round(payroll_cost, 2)
        })
    
    return {
        "month": calendar.month_name[month],
        "year": year,
        "departments": result
    }

@router.get("/monthly-trends")
async def get_monthly_trends(
    months: int = 6,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get monthly attendance trends for the last N months."""
    
    today = date.today()
    result = []
    
    for i in range(months - 1, -1, -1):
        # Calculate month and year
        target_date = today - timedelta(days=30 * i)
        month = target_date.month
        year = target_date.year
        
        # Get total employees
        total_employees = db.query(func.count(Employee.id)).scalar()
        
        # Get attendance count for the month
        total_days = calendar.monthrange(year, month)[1]
        start_date = date(year, month, 1)
        end_date = date(year, month, total_days)
        
        attendance_count = db.query(func.count(Attendance.id)).filter(
            and_(
                Attendance.date >= start_date,
                Attendance.date <= end_date
            )
        ).scalar()
        
        # Calculate percentage
        max_possible = total_employees * total_days
        attendance_percentage = (attendance_count / max_possible * 100) if max_possible > 0 else 0
        
        result.append({
            "month": calendar.month_name[month],
            "year": year,
            "attendance_count": attendance_count,
            "attendance_percentage": round(attendance_percentage, 2)
        })
    
    return result

@router.get("/absenteeism")
async def get_absenteeism_analysis(
    month: int = None,
    year: int = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Analyze absenteeism patterns."""
    
    today = date.today()
    if not month:
        month = today.month
    if not year:
        year = today.year
    
    total_days = calendar.monthrange(year, month)[1]
    start_date = date(year, month, 1)
    end_date = date(year, month, total_days)
    
    employees = db.query(Employee).all()
    
    result = []
    
    for employee in employees:
        # Count present days
        present_days = db.query(func.count(Attendance.id)).filter(
            and_(
                Attendance.employee_id == employee.id,
                Attendance.date >= start_date,
                Attendance.date <= end_date
            )
        ).scalar()
        
        absent_days = total_days - present_days
        absenteeism_rate = (absent_days / total_days * 100) if total_days > 0 else 0
        
        result.append({
            "employee_id": employee.id,
            "employee_name": employee.name,
            "department": employee.department.name if employee.department else "N/A",
            "present_days": present_days,
            "absent_days": absent_days,
            "absenteeism_rate": round(absenteeism_rate, 2)
        })
    
    # Sort by absenteeism rate (highest first)
    result.sort(key=lambda x: x["absenteeism_rate"], reverse=True)
    
    return {
        "month": calendar.month_name[month],
        "year": year,
        "total_days": total_days,
        "employees": result
    }

@router.get("/top-performers")
async def get_top_performers(
    month: int = None,
    year: int = None,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get top performing employees based on attendance."""
    
    today = date.today()
    if not month:
        month = today.month
    if not year:
        year = today.year
    
    total_days = calendar.monthrange(year, month)[1]
    start_date = date(year, month, 1)
    end_date = date(year, month, total_days)
    
    # Get employees with attendance count
    employees = db.query(
        Employee,
        func.count(Attendance.id).label('attendance_count')
    ).outerjoin(
        Attendance,
        and_(
            Attendance.employee_id == Employee.id,
            Attendance.date >= start_date,
            Attendance.date <= end_date
        )
    ).group_by(Employee.id).order_by(
        func.count(Attendance.id).desc()
    ).limit(limit).all()
    
    result = []
    
    for employee, attendance_count in employees:
        attendance_percentage = (attendance_count / total_days * 100) if total_days > 0 else 0
        
        result.append({
            "employee_id": employee.id,
            "employee_name": employee.name,
            "department": employee.department.name if employee.department else "N/A",
            "attendance_count": attendance_count,
            "attendance_percentage": round(attendance_percentage, 2)
        })
    
    return {
        "month": calendar.month_name[month],
        "year": year,
        "top_performers": result
    }
