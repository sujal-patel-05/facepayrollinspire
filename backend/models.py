from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employees = relationship("Employee", back_populates="department")
    attendances = relationship("Attendance", back_populates="department")

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    employee_id = Column(String, unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    face_embedding = Column(LargeBinary)  # Store 512-D embedding as BLOB
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    department = relationship("Department", back_populates="employees")
    attendances = relationship("Attendance", back_populates="employee")
    payrolls = relationship("Payroll", back_populates="employee")

class Attendance(Base):
    __tablename__ = "attendances"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    date = Column(Date, nullable=False)
    check_in_time = Column(DateTime, default=datetime.utcnow)
    check_out_time = Column(DateTime, nullable=True)  # Added for punch out
    confidence_score = Column(Float)  # Face recognition confidence
    
    # Relationships
    employee = relationship("Employee", back_populates="attendances")
    department = relationship("Department", back_populates="attendances")

class Payroll(Base):
    __tablename__ = "payrolls"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    total_days = Column(Integer, nullable=False)
    present_days = Column(Integer, nullable=False)
    per_day_salary = Column(Float, nullable=False)
    total_salary = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="payrolls")

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
