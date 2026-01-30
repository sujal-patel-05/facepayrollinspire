from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional

# Department Schemas
class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Employee Schemas
class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    employee_id: str
    department_id: int

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    has_face_registered: bool = False
    
    class Config:
        from_attributes = True

class EmployeeWithDepartment(EmployeeResponse):
    department: Optional[DepartmentResponse] = None

# Attendance Schemas
class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    check_out_time: Optional[datetime] = None  # ADDED THIS FIELD!

class AttendanceCreate(AttendanceBase):
    confidence_score: float

class AttendanceResponse(AttendanceBase):
    id: int
    check_in_time: datetime
    confidence_score: Optional[float] = None
    
    class Config:
        from_attributes = True

class AttendanceWithEmployee(AttendanceResponse):
    employee: Optional[EmployeeResponse] = None

# Payroll Schemas
class PayrollBase(BaseModel):
    employee_id: int
    month: int
    year: int
    total_days: int
    present_days: int
    per_day_salary: float

class PayrollCreate(PayrollBase):
    pass

class PayrollResponse(PayrollBase):
    id: int
    total_salary: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class PayrollWithEmployee(PayrollResponse):
    employee: Optional[EmployeeResponse] = None

# Auth Schemas
class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Face Recognition Schemas
class FaceRegistrationRequest(BaseModel):
    name: str
    email: EmailStr
    employee_id: str
    department_id: int
    face_image: str  # Base64 encoded image

class FaceRecognitionRequest(BaseModel):
    face_image: str  # Base64 encoded image

class FaceRecognitionResponse(BaseModel):
    recognized: bool
    employee_id: Optional[int] = None
    employee_name: Optional[str] = None
    confidence_score: Optional[float] = None
    message: str
