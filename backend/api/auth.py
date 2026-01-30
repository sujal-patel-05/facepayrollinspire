from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
from models import Admin
from schemas import AdminCreate, AdminLogin, Token, TokenData
from config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Admin:
    """Get current authenticated admin."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    admin = db.query(Admin).filter(Admin.username == token_data.username).first()
    if admin is None:
        raise credentials_exception
    
    return admin

@router.post("/register", response_model=Token)
async def register_admin(admin_data: AdminCreate, db: Session = Depends(get_db)):
    """Register new admin user."""
    # Check if username already exists
    existing_admin = db.query(Admin).filter(Admin.username == admin_data.username).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = db.query(Admin).filter(Admin.email == admin_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new admin
    hashed_password = get_password_hash(admin_data.password)
    new_admin = Admin(
        username=admin_data.username,
        email=admin_data.email,
        hashed_password=hashed_password
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    # Create access token
    access_token = create_access_token(data={"sub": new_admin.username})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login_admin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login admin user."""
    # Find admin by username
    admin = db.query(Admin).filter(Admin.username == form_data.username).first()
    
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": admin.username})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_current_admin_info(current_admin: Admin = Depends(get_current_admin)):
    """Get current admin information."""
    return {
        "id": current_admin.id,
        "username": current_admin.username,
        "email": current_admin.email
    }
